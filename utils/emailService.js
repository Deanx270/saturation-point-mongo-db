const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

// Generates PDF receipt exactly matching old-system style
const generatePDFReceipt = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.font('Times-Roman')
         .fontSize(28)
         .fillColor('#1B263B')
         .text('THE SATURATION POINT', { align: 'center', characterSpacing: 2 })
         .moveDown(0.5);

      doc.font('Helvetica')
         .fontSize(10)
         .fillColor('#D4AF37')
         .text('OFFICIAL RECEIPT', { align: 'center', characterSpacing: 4 })
         .moveDown(3);

      doc.fillColor('#2D3436');
      doc.fontSize(10)
         .text(`ORDER ID:`, { continued: true }).font('Helvetica-Bold').text(` ${order._id}`)
         .font('Helvetica').text(`DATE:`, { continued: true }).font('Helvetica-Bold').text(` ${new Date(order.updatedAt || order.createdAt).toLocaleString()}`)
         .font('Helvetica').text(`PAYMENT:`, { continued: true }).font('Helvetica-Bold').text(` ${order.paymentMethod}`)
         .moveDown();

      const userName = order.user && order.user.displayName ? order.user.displayName : 'Customer';
      const userEmail = order.user ? order.user.email : 'N/A';

      doc.font('Helvetica').text(`CUSTOMER:`, { continued: true }).font('Helvetica-Bold').text(` ${userName}`)
         .font('Helvetica').text(`EMAIL:`, { continued: true }).font('Helvetica-Bold').text(` ${userEmail}`)
         .moveDown(3);

      const tableTop = doc.y;
      doc.font('Times-Bold')
         .fontSize(10)
         .fillColor('#636E72')
         .text('ITEM DESCRIPTION', 50, tableTop)
         .text('UNIT PRICE', 300, tableTop, { width: 80, align: 'right' })
         .text('QTY', 400, tableTop, { width: 40, align: 'center' })
         .text('SUBTOTAL', 460, tableTop, { width: 90, align: 'right' });

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#E2E8F0').stroke();

      let yPosition = tableTop + 30;
      doc.font('Helvetica').fillColor('#2D3436');

      if (order.orderItems && order.orderItems.length > 0) {
         order.orderItems.forEach(item => {
            const name = item.name || 'Unknown Product';
            const price = parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 });
            const qty = item.quantity;
            const subtotal = parseFloat(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 });

            doc.text(name, 50, yPosition, { width: 240 })
               .text(`PHP ${price}`, 300, yPosition, { width: 80, align: 'right' })
               .text(qty.toString(), 400, yPosition, { width: 40, align: 'center' })
               .text(`PHP ${subtotal}`, 460, yPosition, { width: 90, align: 'right' });

            yPosition += 25;
         });
      }

      doc.moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).strokeColor('#E2E8F0').stroke();

      const subtotalVal = parseFloat(order.totalAmount) - 150;
      yPosition += 30;

      doc.font('Helvetica')
         .text('Subtotal:', 360, yPosition, { width: 80, align: 'right' })
         .text(`PHP ${subtotalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 460, yPosition, { width: 90, align: 'right' })
         .moveDown();

      yPosition += 20;
      doc.text('Shipping Fee:', 360, yPosition, { width: 80, align: 'right' })
         .text('PHP 150.00', 460, yPosition, { width: 90, align: 'right' })
         .moveDown();

      yPosition += 30;
      doc.font('Times-Bold')
         .fontSize(12)
         .fillColor('#D4AF37')
         .text('GRAND TOTAL:', 340, yPosition, { width: 100, align: 'right' })
         .text(`PHP ${parseFloat(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 460, yPosition, { width: 90, align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const getStatusMessage = (status) => {
  let color = '#1B263B';
  if (status === 'delivered') color = '#166534';
  if (status === 'cancelled') color = '#991b1b';

  const statusEmphasis = `<strong style="color: ${color}; font-size: 18px; letter-spacing: 0.5px; text-transform: uppercase;">${status}</strong>`;

  if (status === 'shipped') return `Your order has been ${statusEmphasis} and is on its way.`;
  if (status === 'delivered') return `Your order has been successfully ${statusEmphasis}.`;
  if (status === 'cancelled') return `Your order has been ${statusEmphasis}.`;
  return `Your order is now ${statusEmphasis}.`;
};

const sendOrderStatusEmail = async (order, isCheckout = false) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('WARNING: EMAIL_USER or EMAIL_PASS is missing in .env. Email will not be sent.');
      return false;
    }

    // Attach PDF only when delivered based on old-system logic and new request to not attach everytime
    const shouldAttachReceipt = order.status === 'delivered';
    
    let attachments = [];
    if (shouldAttachReceipt) {
      const pdfBuffer = await generatePDFReceipt(order);
      attachments.push({
        filename: `Receipt-${order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }

    const subtotal = order.totalAmount - 150;
    const userName = order.user && order.user.displayName ? order.user.displayName : 'Customer';
    
    // Create the items table to satisfy the new project rubric requirements 
    // "the email contains the list of products/services, their subtotal and grand total"
    let itemsHtml = order.orderItems.map(item => 
      `<tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #2D3436; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; text-align: center; color: #2D3436; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; text-align: right; color: #2D3436; font-size: 14px;">PHP ${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
      </tr>`
    ).join('');

    const message = isCheckout 
      ? `Thank you for your purchase. Your order is now <strong style="color: #1B263B; font-size: 18px; letter-spacing: 0.5px; text-transform: uppercase;">PENDING</strong>.`
      : getStatusMessage(order.status);

    const htmlContent = `
      <div style="background-color: #FAF9F6; padding: 40px; font-family: 'Inter', Helvetica, sans-serif; color: #2D3436;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-top: 4px solid #D4AF37; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); padding: 40px;">
          <h2 style="font-family: 'Times New Roman', serif; color: #1B263B; font-size: 28px; font-weight: normal; margin-top: 0; text-align: center; letter-spacing: 1px;">THE SATURATION POINT</h2>
          
          <hr style="border: none; border-bottom: 1px solid #E2E8F0; margin: 30px 0;">
          
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${userName},</p>
          <p style="font-size: 16px; line-height: 1.6;">${message}</p>
          
          <h3 style="font-size: 14px; color: #636E72; text-transform: uppercase; margin-top: 30px; letter-spacing: 1px;">Order Details (ID: #${order._id.toString().substring(0, 8)})</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="padding: 10px 0; text-align: left; border-bottom: 2px solid #E2E8F0; color: #636E72; font-size: 12px;">ITEM</th>
                <th style="padding: 10px 0; text-align: center; border-bottom: 2px solid #E2E8F0; color: #636E72; font-size: 12px;">QTY</th>
                <th style="padding: 10px 0; text-align: right; border-bottom: 2px solid #E2E8F0; color: #636E72; font-size: 12px;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 15px 0 5px;"></td>
                <td style="padding: 15px 15px 5px 0; text-align: right; color: #636E72; font-size: 14px;">Subtotal:</td>
                <td style="padding: 15px 0 5px; text-align: right; color: #2D3436;">PHP ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"></td>
                <td style="padding: 5px 15px 5px 0; text-align: right; color: #636E72; font-size: 14px;">Shipping:</td>
                <td style="padding: 5px 0; text-align: right; color: #2D3436;">PHP 150.00</td>
              </tr>
              <tr>
                <td style="padding: 15px 0;"></td>
                <td style="padding: 15px 15px 15px 0; text-align: right; color: #D4AF37; font-weight: bold; font-size: 14px;">GRAND TOTAL:</td>
                <td style="padding: 15px 0; text-align: right; color: #1B263B; font-weight: bold; font-size: 16px;">PHP ${order.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              </tr>
            </tfoot>
          </table>

          ${shouldAttachReceipt ? '<p style="font-size: 16px; line-height: 1.6; margin-top: 20px; text-align: center;">Your official order documentation is attached to this email for your records.</p>' : ''}
          
          <div style="margin: 40px 0; text-align: center;">
            <a href="http://localhost:5173" style="display: inline-block; background-color: #1B263B; color: #FFFFFF; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-size: 14px; letter-spacing: 1px;">VISIT STORE</a>
          </div>
          
          <hr style="border: none; border-bottom: 1px solid #E2E8F0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #636E72; text-align: center; margin-bottom: 5px;">Thank you for choosing The Saturation Point.</p>
          <p style="font-size: 12px; color: #a8a29e; text-align: center; margin-top: 0;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: '"The Saturation Point" <no-reply@thesaturationpoint.com>',
      to: order.user.email,
      subject: `Update on your Order #${order._id.toString().substring(0, 8)}`,
      html: htmlContent,
      attachments: attachments
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
