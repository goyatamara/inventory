import React, { useState, useEffect } from 'react';

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
        const res = await fetch(`${sheetUrl}/search?sheet=Usage`);
        const data = await res.json();
        setDropdownData({
          types: [...new Set(data.map(row => row.type).filter(Boolean))],
          names: [...new Set(data.map(row => row.name).filter(Boolean))],
          projects: [...new Set(data.map(row => row.project).filter(Boolean))],
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
      const response = await fetch(sheetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [formData],
          sheet: 'Usage',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Usage submitted successfully!');
        setFormData({
          date: '',
          type: '',
          name: '',
          length: '',
          quantity: '',
          project: '',
        });
      } else {
        console.error('Submit error:', result);
        alert('❌ Failed to submit usage.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('❌ Error submitting usage.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
