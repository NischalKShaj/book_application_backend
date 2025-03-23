// <============================= file to create the invoice ====================>

// importing the required modules
import { Address } from "../../../core/entities/address/address";
import { Order } from "../../../core/entities/order/order";
import { User } from "../../../core/entities/user/user";
import PDFDocument from "pdfkit";
import { Writable } from "stream";
import puppeteer from "puppeteer";
import { toWords } from "number-to-words";

export const generateInvoicePDF = async (
  address: Address,
  order: Order,
  user: User
): Promise<any> => {
  console.log("🔹 Starting PDF generation with Puppeteer...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const htmlContent = `
  <html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      margin: 40px;
      padding: 20px;
      line-height: 1.6;
      background-color: #f8f9fa;
      color: #333;
    }
    .container {
      max-width: 800px;
      background: #fff;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      margin: auto;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }
    .header h1 {
      color: #007bff;
      margin: 0;
    }
    .address, .order-details {
      margin-bottom: 20px;
    }
    .order-info {
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #007bff;
      color: white;
      text-transform: uppercase;
      font-weight: bold;
    }
    .total {
      text-align: right;
      font-weight: bold;
      font-size: 16px;
      margin-top: 15px;
    }
    .amount-words {
      font-style: italic;
      text-align: right;
      color: #555;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Book Application</h1>
    </div>
    
    <div class="address">
      <p><strong>Billing Address:</strong></p>
      <p>${address.addresseeName}<br>
         ${address.fullAddress}<br>
         ${address.locality}, ${address.city}, ${address.state} - ${
    address.pincode
  }</p>
    </div>
    
    <div class="order-details">
      <p class="order-info">Order ID: ${order._id}</p>
      <p class="order-info">Order Date: ${order.createdAt.toLocaleDateString()}</p>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Sl.No</th>
          <th>Product Name</th>
          <th>Unit Price</th>
          <th>Qty</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${order.products
          .map(
            (product, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${product.bookName}</td>
            <td>${(product.amount / product.quantity).toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${product.amount.toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="total">Total: ${order.totalAmount.toFixed(2)}</div>
    <div class="amount-words">Amount in Words: ${toWords(
      order.totalAmount
    )} only</div>

    <div class="footer">Downloaded By: ${user.username}</div>
  </div>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  console.log("✅ PDF generated with Puppeteer!");
  return pdfBuffer;
};
