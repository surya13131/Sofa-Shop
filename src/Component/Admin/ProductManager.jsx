import React, { useState, useEffect } from 'react';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    emi: '',
    discount: '',
    description: '',
    image: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/sofas')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const handleProductChange = (field, value) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      emi: '',
      discount: '',
      description: '',
      image: '',
    });
    setEditingId(null);
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      alert('Please enter both name and price');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:8080/api/sofas/${editingId}`
      : 'http://localhost:8080/api/sofas';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });

      if (!res.ok) throw new Error('Failed to save product');

      const updated = await fetch('http://localhost:8080/api/sofas').then((r) => r.json());
      setProducts(updated);
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const editProduct = (product) => {
    setProductForm(product);
    setEditingId(product._id);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await fetch(`http://localhost:8080/api/sofas/${id}`, { method: 'DELETE' });
      const updated = await fetch('http://localhost:8080/api/sofas').then((r) => r.json());
      setProducts(updated);
    } catch (err) {
      alert('Failed to delete product');
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
    <div className="container mt-5">
      <h3>Product Manager</h3>
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
          {editingId ? 'Update' : 'Add'} Product
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>EMI</th>
              <th>Discount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted">No products</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>{p.image ? <img src={p.image} alt="" width="70" height="50" /> : 'No image'}</td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.emi}</td>
                  <td>{p.discount}%</td>
                  <td>{p.description}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editProduct(p)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button className="btn btn-success mt-3" onClick={exportToCSV}>Export to CSV</button>
    </div>
  );
}
