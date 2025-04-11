import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    name: '',
    length: '',
    quantity: '',
    supplier: '',
    location: '',
  });

  const [dropdownData, setDropdownData] = useState({
    types: [],
    names: [],
    suppliers: [],
  });

  const sheetUrl = 'https://sheetdb.io/api/v1/eaeyw4vt8tm8p';

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await axios.get(`${sheetUrl}/search?sheet=Inventory`);
        const data = res.data;
        setDropdownData({
          types: [...new Set(data.map(row => row.type))],
          names: [...new Set(data.map(row => row.name))],
          suppliers: [...new Set(data.map(row => row.supplier))],
        });
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(sheetUrl, {
        data: formData,
        sheet: 'Inventory',
      });
      alert('Inventory submitted successfully!');
      setFormData({
        date: '',
        type: '',
        name: '',
        length: '',
        quantity: '',
        supplier: '',
        location: '',
      });
    } catch (error) {
      alert('Failed to submit inventory');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Date:</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />

      <label>Type:</label>
      <input list="types" name="type" value={formData.type} onChange={handleChange} required />
      <datalist id="types">
        {dropdownData.types.map((type, i) => <option key={i} value={type} />)}
      </datalist>

      <label>Name:</label>
      <input list="names" name="name" value={formData.name} onChange={handleChange} required />
      <datalist id="names">
        {dropdownData.names.map((name, i) => <option key={i} value={name} />)}
      </datalist>

      <label>Length:</label>
      <input type="number" name="length" value={formData.length} onChange={handleChange} required />

      <label>Quantity:</label>
      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

      <label>Supplier:</label>
      <input list="suppliers" name="supplier" value={formData.supplier} onChange={handleChange} required />
      <datalist id="suppliers">
        {dropdownData.suppliers.map((supplier, i) => <option key={i} value={supplier} />)}
      </datalist>

      <label>Location:</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} required />

      <button type="submit">Submit</button>
    </form>
  );
};

export default InventoryForm;
