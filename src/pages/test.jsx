import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import instance from '../../../frontend/src/axios';

function ProductList({ onSelect }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await instance.get('/api/products/');
    console.log(res)
    setProducts(res.data);

  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      await instance.delete(`/api/products/${id}/`);
      fetchProducts();
    }
  };

  const HandleSelect = (product) => {
    navigate('/product-detail/${product.id}');
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <button onClick={() => HandleSelect(p)}>View</button>
          <button onClick={() => deleteProduct(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;