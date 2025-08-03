// src/components/ProductManager.jsx
import React, { useState } from 'react';

export default function ProductManager({ products, setProducts }) {
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    emi: '',
    discount: '',
    description: '',
    image: null,
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleProductChange = (field, value) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      emi: '',
      discount: '',
      description: '',
      image: null,
    });
    setEditingIndex(null);
  };

  const saveProduct = () => {
    if (!productForm.name || !productForm.price) {
      alert('Please provide name and price.');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = productForm;
      setProducts(updated);
    } else {
      setProducts([...products, productForm]);
    }

    resetForm();
  };

  const editProduct = (index) => {
    setProductForm(products[index]);
    setEditingIndex(index);
  };

  const deleteProduct = (index) => {
    if (window.confirm('Delete this product?')) {
      const updated = products.filter((_, i) => i !== index);
      setProducts(updated);
      resetForm();
    }
  };

  const exportToCSV = () => {
    if (!products.length) return;
    const headers = Object.keys(products[0]);
    const csv = [
      headers.join(','),
      ...products.map((row) =>
        headers.map((field) => `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  return (
    <div>
      <h3 className="mb-4">Product Manager</h3>
      <form onSubmit={(e) => { e.preventDefault(); saveProduct(); }} className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Product Name</label>
            <input className="form-control" value={productForm.name} onChange={(e) => handleProductChange('name', e.target.value)} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Price</label>
            <input className="form-control" type="number" value={productForm.price} onChange={(e) => handleProductChange('price', e.target.value)} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">EMI</label>
            <input className="form-control" value={productForm.emi} onChange={(e) => handleProductChange('emi', e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Discount (%)</label>
            <input className="form-control" type="number" value={productForm.discount} onChange={(e) => handleProductChange('discount', e.target.value)} />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" value={productForm.description} onChange={(e) => handleProductChange('description', e.target.value)} />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Image</label>
            <input className="form-control" type="file" accept="image/*" onChange={handleProductImageChange} />
            {productForm.image && <div className="text-success mt-2">Image uploaded ✓</div>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {editingIndex !== null ? 'Update' : 'Add'} Product
        </button>
        {editingIndex !== null && (
          <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle product-table">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>EMI</th>
              <th>Discount</th>
              <th>Description</th>
              <th style={{ minWidth: '140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted">No products added</td></tr>
            ) : (
              products.map((p, i) => (
                <tr key={i} className="product-row">
                  <td>
                    {p.image ? (
                      <img
                        src={p.image}
                        alt="product"
                        width="70"
                        height="50"
                        style={{ objectFit: 'cover', borderRadius: '6px' }}
                      />
                    ) : 'No Image'}
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.emi}</td>
                  <td>{p.discount}%</td>
                  <td>{p.description}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editProduct(i)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(i)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button className="btn btn-success mt-3" onClick={exportToCSV}>
        Export to CSV
      </button>

      {/* Internal CSS */}
      <style jsx>{`
        .product-table {
          min-width: 900px;
        }

        .product-row:hover {
          background-color: #f5f9ff;
          transition: background-color 0.2s ease-in-out;
        }

        .btn-sm {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
