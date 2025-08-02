import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Cart = () => {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const billRef = useRef();

  const total = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[₹,]/g, ''));
    return sum + price;
  }, 0);

  const generatePDF = async () => {
    const element = billRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Goodwill_Invoice.pdf');
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="fw-bold mb-4 text-center">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-warning text-center">Your cart is empty.</div>
      ) : (
        <>
          {/* BILL PREVIEW AREA */}
          <div ref={billRef} className="card p-4 shadow-sm">
            <h4 className="mb-3">🧾 Order Summary</h4>

            <ul className="list-group mb-4">
              {cart.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted">{item.price}</small>
                  </div>
                  <img
                    src={item.img || item.image}
                    alt={item.name}
                    width={80}
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: '6px' }}
                  />
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between border-top pt-3">
              <strong>Total:</strong>
              <strong>₹{total.toLocaleString()}</strong>
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={generatePDF}>
              🧾 Download Invoice (PDF)
            </button>
            <button
              className="btn btn-success"
              onClick={() => alert('Proceeding to payment...')}
            >
              💳 Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
