
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/Bill.css';
import 'bootstrap/dist/css/bootstrap.css';


const Invoice = () => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4000/invoice')
      .then(response => {
        setInvoice(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the invoice data!", error);
      });
  }, []);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  const calculateTotalAmount = () => {
    return invoice.items.reduce((total, item) => total + item.taxableValue + (item.taxableValue * item.igst / 100), 0).toFixed(2);
  };

  return (
    <div className="invoice">
      <div className="head">
        <h1>AFUCENT TECHNOLOGIES</h1>
      </div>
      <div className="invoice-logo">
        <img src="logo.png" alt="Invoice logo" />
      </div>
      <div className="invoice-address">
        <p>4th Floor, New Janpath Complex<br />
          9 Ashok Marg, Hazratganj, LUCKNOW<br />
          Uttar Pradesh - 226001</p>
      </div>
      <div className="invoice-header">
        <h2 style={{textAlign:'center'}}>Tax Invoice</h2>
        <div className="invoice-details">
          <div style={{width:'60%'}}>
            <div>Invoice No.: {invoice.invoiceNo}</div>
            <div>Invoice Date: {invoice.invoiceDate}</div>
            <div>Due Date: {invoice.dueDate}</div>
            <div>State: {invoice.state}</div>
          </div>
          <div style={{width:'40%'}}>
            <div>GSTIN/UIN: {invoice.gstin}</div>
            <div>Ref. No. & Date: {invoice.refNo}</div>
            <div>Buyer Order No. & Date: {invoice.buyerOrderNo}</div>
            <div>Delivery Note: {invoice.deliveryNote}</div>
            <div>Destination: {invoice.destination}</div>
          </div>
        </div>
      </div>

      <div className="invoice-buyer">
        <h2 style={{textAlign:'center'}}>Buyer (Bill to Party)</h2>
        <div className="buyer-details">
          <div style={{width:'60%'}}>
            <div>Name: {invoice.buyer.name}</div>
            <div>Address: {invoice.buyer.address}</div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div>City: {invoice.buyer.city}</div>
              <div>PIN: {invoice.buyer.pin}</div>
              <div>State: {invoice.buyer.state}</div>
            </div>
          </div>
          <div style={{width:'40%'}}>
            <div>GSTIN/UIN: {invoice.buyer.gstin}</div>
          </div>
        </div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Product Description</th>
            <th>Qty</th>
            <th>Rate Rs</th>
            <th>Taxable Value</th>
            <th>%</th>
            <th>IGST</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.rate}</td>
              <td>{item.taxableValue}</td>
              <td>{item.igst}</td>
              <td>{(item.taxableValue * item.igst / 100).toFixed(2)}</td>
              <td>{(item.taxableValue + (item.taxableValue * item.igst / 100)).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold' }}>Total</td>
            <td colSpan="2" style={{ fontWeight: 'bold' }}>{invoice.totalQuantity}</td>
            <td colSpan="2" style={{ fontWeight: 'bold' }}>{invoice.totalTaxableValue}</td>
            <td style={{ fontWeight: 'bold' }}>{invoice.totalIGST}</td>
            <td style={{ fontWeight: 'bold' }}>Rs {calculateTotalAmount()}</td>
          </tr>
        </tbody>
      </table>
      <div className="total-words">
        <p>Total Rounded off Invoice Amount in Words (Rupees)</p>
        <p>{invoice.amountInWords}</p>
      </div>
      <div className="amount-summary">
        {/* <div><u>Total Amount Before Tax:</u> {invoice.totalAmountBeforeTax}</div>
        <div><u>IGST:</u> {invoice.totalIGST}</div>
        <div><u>Total Tax:</u> {invoice.totalTax}</div>
        <div><u>Total Amount with Tax:</u> {invoice.totalAmountWithTax}</div>
        <div><u>Net Amount Payable in Rs.:</u> {invoice.netAmountPayable}</div>
        <div><u>Advance Amount Paid Rs.:</u> {invoice.advanceAmountPaid}</div>
        <div><u>Balance Amount Payable Rs.:</u> {invoice.balanceAmountPayable}</div> */}
       <table className='invoice-table-amount'>
        <tbody>
          <tr>
            <td>Total Amount Before Tax: {invoice.totalAmountBeforeTax}</td>
          </tr>
          <tr>
            <td>IGST: {invoice.totalIGST}</td>
          </tr>
          <tr>
            <td>Total Tax: {invoice.totalTax}</td>
          </tr>
          <tr>
            <td>Total Amount with Tax: {invoice.totalAmountWithTax}</td>
          </tr>
          <tr>
            <td>Net Amount Payable in Tax: {invoice.netAmountPayable}</td>
          </tr>
          <tr>
            <td>Advance Amount Paid Rs.: {invoice.advanceAmountPaid}</td>
          </tr>
          <tr>
            <td>Balance Amount Payable Rs.: {invoice.balanceAmountPayable}</td>
          </tr>
        </tbody>
       </table>
      </div>

      <div className="bank-details">
        <h5 style={{textAlign: 'center', fontWeight: 'bold'}}><u>Bank Details</u></h5>
        <div><u>Name:</u> {invoice.bankDetails.name}</div>
        <div><u>A/c No.:</u> {invoice.bankDetails.accountNo}</div>
        <div><u>Bank & IFSC:</u> {invoice.bankDetails.bankName} - {invoice.bankDetails.ifsc}</div>
        <div><u>Branch:</u> {invoice.bankDetails.branch}</div>
      </div>
      <div className="declaration">
        <h5 style={{textAlign:'center'}}><b><u>Declaration</u></b></h5>
        <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
      </div>
      <div className="signature">
        <h5 style={{textAlign:'center'}}><b>FOR</b></h5>
        <img src="signature.png" alt="Signature" />
        <p>Authorized Signatory</p>
      </div>
    </div>
  );
};

export default Invoice;