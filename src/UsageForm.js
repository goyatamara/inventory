import React, { useState, useEffect } from "react";

const UsageForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    length: "",
    quantity: "",
    project: "",
  });

  const [dropdownData, setDropdownData] = useState({
    types: [],
    names: [],
  });

  const api = "https://sheetdb.io/api/v1/eaeyw4vt8tm8p";

  useEffect(() => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        const types = [...new Set(data.map((item) => item.type).filter(Boolean))];
        const names = [...new Set(data.map((item) => item.name).filter(Boolean))];
        setDropdownData({ types, names });
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      data: [
        {
          date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD
          ...formData,
        },
      ],
    };

    try {
      const response = await fetch(api + "?sheet=Usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resText = await response.text();
      if (response.ok) {
        alert("Usage logged!");
        setFormData({
          type: "",
          name: "",
          length: "",
          quantity: "",
          project: "",
        });
      } else {
        alert("❌ Failed to log usage. Status: " + response.status + ", Response: " + resText);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong while submitting.");
    }
  };

  return (
    <>
      <h2>Log Material Usage</h2>
      <form onSubmit={handleSubmit}>
        <input list="type-options" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
        <datalist id="type-options">
          {dropdownData.types.map((val, i) => <option key={i} value={val} />)}
        </datalist>

        <input list="name-options" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <datalist id="name-options">
          {dropdownData.names.map((val, i) => <option key={i} value={val} />)}
        </datalist>

        <input name="length" placeholder="Length" value={formData.length} onChange={handleChange} required />

        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />

        <input name="project" placeholder="Project" value={formData.project} onChange={handleChange} required />

        <button type="submit">Log Usage</button>
      </form>
    </>
  );
};

export default UsageForm;
