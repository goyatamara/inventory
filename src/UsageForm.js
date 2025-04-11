import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsageForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    name: '',
    length: '',
    quantity: '',
    project: '',
  });

  const [dropdownData, setDropdownData] = useState({
    types: [],
    names: [],
    projects: [],
  });

  const sheetUrl = 'https://sheetdb.io/api/v1/eaeyw4vt8tm8p';

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await axios.get(`${sheetUrl}/search?sheet=Usage`);
        const data = res.data;
        setDropdownData({
          types: [...new Set(data.map(row => row.type))],
          names: [...new Set(data.map(row => row.name))],
          projects: [...new Set(data.map(row => row.project))],
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
        sheet: 'Usage',
      });
      alert('Usage submitted successfully!');
      setFormData({
        date: '',
        type: '',
        name: '',
        length: '',
        quantity: '',
        project: '',
      });
    } catch (error) {
      alert('Failed to submit usage');
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

      <label>Project:</label>
      <input list="projects" name="project" value={formData.project} onChange={handleChange} required />
      <datalist id="projects">
        {dropdownData.projects.map((project, i) => <option key={i} value={project} />)}
      </datalist>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UsageForm;
