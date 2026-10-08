const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

// Generates PDF receipt as a Buffer
const generatePDFReceipt = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(22).font('Helvetica-Bold').text('The Saturation Point', { align: 'center' });
      doc.fontSize(12).font('Helvetica').text('Official Order Receipt', { align: 'center' });
      doc.moveDown(2);

      // Order Info
      doc.fontSize(10).font('Helvetica-Bold').text('Order Information');
      doc.font('Helvetica').text(`Order ID: ${order._id}`);
      doc.text(`Status: ${order.status.toUpperCase()}`);
      doc.text(`Date: ${new Date(order.updatedAt || order.createdAt).toLocaleDateString()}`);
      doc.text(`Payment Method: ${order.paymentMethod}`);
      doc.moveDown(2);

      // Customer Info
      doc.font('Helvetica-Bold').text('Customer Information');
      doc.font('Helvetica').text(`Name: ${order.user.displayName || 'Customer'}`);
      doc.text(`Email: ${order.user.email}`);
      doc.moveDown(2);

      // Items Table Header
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, doc.y, { continued: true });
      doc.text('Qty', 350, doc.y, { continued: true });
      doc.text('Price', 400, doc.y, { continued: true });
      doc.text('Subtotal', 480, doc.y);
      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
      doc.moveDown(1);

      // Items
      doc.font('Helvetica');
      let currentY = doc.y;
      order.orderItems.forEach(item => {
        doc.text(item.name, 50, currentY, { width: 280 });
        doc.text(item.quantity.toString(), 350, currentY);
        doc.text(`PHP ${item.price.toFixed(2)}`, 400, currentY);
        doc.text(`PHP ${(item.price * item.quantity).toFixed(2)}`, 480, currentY);
        currentY = doc.y + 10;
      });

      doc.y = currentY + 10;
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      // Totals
      const subtotal = order.totalAmount - 150; // assuming 150 is flat shipping fee based on controller logic
      doc.font('Helvetica-Bold');
      doc.text(`Subtotal:`, 350, doc.y, { continued: true });
      doc.font('Helvetica').text(`PHP ${subtotal.toFixed(2)}`, 480, doc.y);
      
      doc.font('Helvetica-Bold').text(`Shipping Fee:`, 350, doc.y + 15, { continued: true });
      doc.font('Helvetica').text(`PHP 150.00`, 480, doc.y + 15);
      
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica-Bold').text(`Grand Total:`, 350, doc.y + 25, { continued: true });
      doc.text(`PHP ${order.totalAmount.toFixed(2)}`, 460, doc.y + 25);

      // Footer
      doc.moveDown(5);
      doc.fontSize(10).font('Helvetica-Oblique').text('Thank you for shopping at The Saturation Point!', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const sendOrderStatusEmail = async (order) => {
  try {
    // We use environment variables for Mailtrap. 
    // The user needs to supply SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Check if SMTP credentials exist, otherwise log warning and return early so the app doesn't crash
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('WARNING: EMAIL_USER or EMAIL_PASS is missing in .env. Email will not be sent.');
      return false;
    }

    const pdfBuffer = await generatePDFReceipt(order);

    const subtotal = order.totalAmount - 150;
    
    // HTML Email Body
    let itemsHtml = order.orderItems.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">PHP ${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">PHP ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1C1917;">Order Status Update</h2>
        <p>Dear ${order.user.displayName || 'Customer'},</p>
        <p>The status of your order <strong>#${order._id}</strong> has been updated to: <strong><span style="color: #CA8A04;">${order.status.toUpperCase()}</span></strong>.</p>
        
        <h3 style="border-bottom: 2px solid #E7E5E4; padding-bottom: 5px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #FAFAFA;">
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 8px; text-align: right;">PHP ${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Shipping:</td>
              <td style="padding: 8px; text-align: right;">PHP 150.00</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold; font-size: 1.1em;">Grand Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 1.1em; color: #9f1239;">PHP ${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <p>A PDF receipt has been attached to this email for your records.</p>
        <p>Thank you for shopping at The Saturation Point!</p>
      </div>
    `;

    const mailOptions = {
      from: '"The Saturation Point" <noreply@saturationpoint.com>',
      to: order.user.email,
      subject: `Order Update: #${order._id} - ${order.status.toUpperCase()}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Receipt-${order._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Order status email sent to ${order.user.email} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error('Error sending order status email:', error);
    return false;
  }
};

module.exports = {
  sendOrderStatusEmail
};
