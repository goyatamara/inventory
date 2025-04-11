import React, { useState, useEffect } from "react";

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    length: "",
    quantity: "",
    supplier: "",
    location: "",
  });

  const [dropdownData, setDropdownData] = useState({
    types: [],
    names: [],
    suppliers: [],
    locations: [],
  });

  const api = "https://sheetdb.io/api/v1/eaeyw4vt8tm8p";

  useEffect(() => {
    fetch(`${api}/search?sheet=Inventory`)
      .then((res) => res.json())
      .then((data) => {
        const types = [...new Set(data.map((i) => i.type))];
        const names = [...new Set(data.map((i) => i.name))];
        const suppliers = [...new Set(data.map((i) => i.supplier))];
        const locations = [...new Set(data.map((i) => i.location))];
        setDropdownData({ types, names, suppliers, locations });
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const finalPayload = {
      data: [
        {
          date: new Date().toLocaleDateString("en-CA"),
          type: formData.type,
          name: formData.name,
          length: formData.length,
          quantity: formData.quantity,
          supplier: formData.supplier,
          location: formData.location,
        },
      ],
    };
  
    console.log("📤 Submitting payload:", finalPayload);
  
    try {
      const res = await fetch("https://sheetdb.io/api/v1/eaeyw4vt8tm8p?sheet=Inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });
  
      const responseText = await res.text();
      console.log("📦 Response Status:", res.status);
      console.log("📬 Response Body:", responseText);
  
      if (res.ok) {
        alert("✅ Inventory added!");
        setFormData({
          type: "",
          name: "",
          length: "",
          quantity: "",
          supplier: "",
          location: "",
        });
      } else {
        alert(`❌ Failed to submit inventory. Status: ${res.status}, Response: ${responseText}`);
      }
    } catch (error) {
      console.error("🚨 Submit error:", error);
      alert("Something went wrong while submitting.");
    }
  };
  

  return (
    <div>
      <h2>Add Inventory</h2>
      <form onSubmit={handleSubmit} className="form">
        <input name="type" list="types" value={formData.type} onChange={handleChange} placeholder="Type" required />
        <datalist id="types">{dropdownData.types.map((v, i) => <option key={i} value={v} />)}</datalist>

        <input name="name" list="names" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <datalist id="names">{dropdownData.names.map((v, i) => <option key={i} value={v} />)}</datalist>

        <input name="length" value={formData.length} onChange={handleChange} placeholder="Length" required />
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required />

        <input name="supplier" list="suppliers" value={formData.supplier} onChange={handleChange} placeholder="Supplier" />
        <datalist id="suppliers">{dropdownData.suppliers.map((v, i) => <option key={i} value={v} />)}</datalist>

        <input name="location" list="locations" value={formData.location} onChange={handleChange} placeholder="Location" />
        <datalist id="locations">{dropdownData.locations.map((v, i) => <option key={i} value={v} />)}</datalist>

        <button type="submit">Add Inventory</button>
      </form>
    </div>
  );
};

export default InventoryForm;
