const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

// Generates PDF receipt as a Buffer
const generatePDFReceipt = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Premium Brand Header
      doc.rect(0, 0, doc.page.width, 120).fill('#1C1917');
      
      doc.fillColor('#CA8A04').fontSize(28).font('Helvetica-Bold').text('THE SATURATION POINT', 50, 45, { align: 'center', characterSpacing: 2 });
      doc.fillColor('#A8A29E').fontSize(10).font('Helvetica').text('PREMIUM STREETWEAR', 50, 80, { align: 'center', characterSpacing: 4 });
      
      doc.moveDown(4);

      // Receipt Title & Meta
      doc.fillColor('#1C1917').fontSize(20).font('Helvetica-Bold').text('OFFICIAL RECEIPT', 50, 150);
      
      doc.fontSize(10).font('Helvetica');
      doc.text(`Receipt No: #${order._id.toString().substring(0, 8).toUpperCase()}`, 50, 185);
      doc.text(`Date: ${new Date(order.updatedAt || order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 200);
      doc.text(`Status: ${order.status.toUpperCase()}`, 50, 215);

      // Customer Info aligned to right
      doc.font('Helvetica-Bold').text('BILLED TO:', 350, 185);
      doc.font('Helvetica').text(order.user.displayName || 'Valued Customer', 350, 200);
      doc.text(order.user.email, 350, 215);
      doc.text(`Payment: ${order.paymentMethod}`, 350, 230);

      doc.moveDown(3);
      const tableTop = 280;

      // Table Header Background
      doc.rect(50, tableTop - 10, doc.page.width - 100, 30).fill('#FAFAFA');
      
      // Items Table Header
      doc.fillColor('#78716C').font('Helvetica-Bold').fontSize(10);
      doc.text('ITEM DESCRIPTION', 70, tableTop);
      doc.text('QTY', 350, tableTop, { width: 50, align: 'center' });
      doc.text('PRICE', 420, tableTop, { width: 60, align: 'right' });
      doc.text('TOTAL', 500, tableTop, { width: 60, align: 'right' });
      
      // Bottom border for header
      doc.moveTo(50, tableTop + 20).lineTo(doc.page.width - 50, tableTop + 20).lineWidth(1).stroke('#E7E5E4');

      // Items
      doc.fillColor('#1C1917').font('Helvetica').fontSize(11);
      let currentY = tableTop + 35;
      
      order.orderItems.forEach((item, index) => {
        // Striped background for even rows
        if (index % 2 === 1) {
          doc.rect(50, currentY - 10, doc.page.width - 100, 30).fill('#FAFAFA');
          doc.fillColor('#1C1917');
        }
        
        doc.text(item.name, 70, currentY, { width: 260 });
        doc.text(item.quantity.toString(), 350, currentY, { width: 50, align: 'center' });
        doc.text(`P${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 420, currentY, { width: 60, align: 'right' });
        doc.font('Helvetica-Bold').text(`P${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}`, 500, currentY, { width: 60, align: 'right' });
        doc.font('Helvetica');
        
        currentY += 35;
      });

      doc.moveTo(50, currentY).lineTo(doc.page.width - 50, currentY).lineWidth(1).stroke('#E7E5E4');
      currentY += 20;

      // Totals
      const subtotal = order.totalAmount - 150; 
      
      doc.font('Helvetica').fontSize(10).fillColor('#78716C');
      doc.text('Subtotal:', 380, currentY, { width: 80, align: 'right' });
      doc.fillColor('#1C1917').text(`P${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 480, currentY, { width: 80, align: 'right' });
      
      currentY += 20;
      doc.fillColor('#78716C').text('Shipping Fee:', 380, currentY, { width: 80, align: 'right' });
      doc.fillColor('#1C1917').text(`P150.00`, 480, currentY, { width: 80, align: 'right' });
      
      currentY += 20;
      // Grand Total Box
      doc.rect(360, currentY, 200, 40).fill('#1C1917');
      doc.fillColor('#CA8A04').font('Helvetica-Bold').fontSize(12);
      doc.text('GRAND TOTAL:', 380, currentY + 14, { width: 90, align: 'right' });
      doc.fillColor('#FFFFFF').fontSize(14).text(`P${order.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 480, currentY + 13, { width: 60, align: 'right' });

      // Footer
      doc.rect(0, doc.page.height - 80, doc.page.width, 80).fill('#FAFAFA');
      doc.fillColor('#A8A29E').fontSize(9).font('Helvetica').text('Thank you for shopping at The Saturation Point.', 0, doc.page.height - 50, { align: 'center' });
      doc.text('This is a system generated receipt.', 0, doc.page.height - 35, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
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

    // Only attach PDF if the order is delivered (official receipt) 
    // or if you want it on checkout (invoice). The user requested to only attach when appropriate.
    // Standard practice: Attach Receipt on "delivered" status.
    const shouldAttachReceipt = order.status === 'delivered';
    
    let attachments = [];
    if (shouldAttachReceipt) {
      const pdfBuffer = await generatePDFReceipt(order);
      attachments.push({
        filename: `Official-Receipt-${order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }

    const subtotal = order.totalAmount - 150;
    
    let itemsHtml = order.orderItems.map(item => 
      `<tr>
        <td style="padding: 16px 8px; border-bottom: 1px solid #E7E5E4; color: #1C1917; font-weight: 500;">${item.name}</td>
        <td style="padding: 16px 8px; border-bottom: 1px solid #E7E5E4; text-align: center; color: #78716C;">${item.quantity}</td>
        <td style="padding: 16px 8px; border-bottom: 1px solid #E7E5E4; text-align: right; color: #78716C;">₱${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
        <td style="padding: 16px 8px; border-bottom: 1px solid #E7E5E4; text-align: right; color: #1C1917; font-weight: bold;">₱${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
      </tr>`
    ).join('');

    const emailSubject = isCheckout 
      ? `Order Confirmation: #${order._id}` 
      : `Order Update: #${order._id} - ${order.status.toUpperCase()}`;

    const titleText = isCheckout ? 'ORDER CONFIRMATION' : 'STATUS UPDATE';
    const messageText = isCheckout 
      ? `Thank you for your purchase! Your order <strong>#${order._id}</strong> has been successfully placed and is currently <strong>PENDING</strong>.`
      : `The status of your order <strong>#${order._id}</strong> has been updated to <strong>${order.status.toUpperCase()}</strong>.`;

    const receiptMessage = shouldAttachReceipt 
      ? `<div style="margin-top: 30px; padding: 15px; background-color: #FEFCE8; border-left: 4px solid #CA8A04; color: #854D0E; font-size: 14px;">
           <strong style="display: block; margin-bottom: 5px;">Your Official Receipt is Attached</strong>
           Please find the PDF receipt attached to this email for your records.
         </div>` 
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; background-color: #F5F5F4; font-family: 'Montserrat', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #1C1917; padding: 40px 0; text-align: center;">
                    <h1 style="color: #CA8A04; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">The Saturation Point</h1>
                    <p style="color: #A8A29E; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 4px;">PREMIUM STREETWEAR</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #1C1917; margin: 0 0 20px 0; font-size: 18px; letter-spacing: 1px;">${titleText}</h2>
                    <p style="color: #57534E; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                      Hi ${order.user.displayName || 'Customer'},<br><br>
                      ${messageText}
                    </p>
                    
                    <h3 style="color: #1C1917; border-bottom: 2px solid #F5F5F4; padding-bottom: 10px; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <thead>
                        <tr>
                          <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #E7E5E4; color: #A8A29E; font-size: 12px; font-weight: 600;">ITEM</th>
                          <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #E7E5E4; color: #A8A29E; font-size: 12px; font-weight: 600;">QTY</th>
                          <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #E7E5E4; color: #A8A29E; font-size: 12px; font-weight: 600;">PRICE</th>
                          <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #E7E5E4; color: #A8A29E; font-size: 12px; font-weight: 600;">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="3" style="padding: 16px 8px 8px; text-align: right; color: #78716C; font-size: 14px;">Subtotal:</td>
                          <td style="padding: 16px 8px 8px; text-align: right; color: #1C1917; font-weight: 500;">₱${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="padding: 8px; text-align: right; color: #78716C; font-size: 14px;">Shipping:</td>
                          <td style="padding: 8px; text-align: right; color: #1C1917; font-weight: 500;">₱150.00</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="padding: 16px 8px; text-align: right; color: #1C1917; font-weight: 700; font-size: 16px;">GRAND TOTAL:</td>
                          <td style="padding: 16px 8px; text-align: right; color: #CA8A04; font-weight: 700; font-size: 18px;">₱${order.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        </tr>
                      </tfoot>
                    </table>
                    
                    ${receiptMessage}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #FAFAFA; padding: 30px; text-align: center; border-top: 1px solid #F5F5F4;">
                    <p style="color: #A8A29E; font-size: 12px; margin: 0;">Thank you for shopping at The Saturation Point.</p>
                    <p style="color: #D6D3D1; font-size: 11px; margin: 10px 0 0 0;">© ${new Date().getFullYear()} The Saturation Point. All rights reserved.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"The Saturation Point" <noreply@saturationpoint.com>',
      to: order.user.email,
      subject: emailSubject,
      html: htmlContent,
      attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Order email sent to ${order.user.email} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error('Error sending order email:', error);
    return false;
  }
};

module.exports = {
  sendOrderStatusEmail
};
