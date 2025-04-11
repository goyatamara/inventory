import React, { useState, useEffect } from "react";

const InventoryForm = ({ fetchInventory }) => {
  const [formData, setFormData] = useState({
    date: "",
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

  // Fetch existing data to populate dropdowns
  useEffect(() => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        const types = [...new Set(data.map((item) => item.type).filter(Boolean))];
        const names = [...new Set(data.map((item) => item.name).filter(Boolean))];
        const suppliers = [...new Set(data.map((item) => item.supplier).filter(Boolean))];
        const locations = [...new Set(data.map((item) => item.location).filter(Boolean))];

        setDropdownData({ types, names, suppliers, locations });
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

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Inventory added!");
        setFormData({
          type: "",
          name: "",
          length: "",
          quantity: "",
          supplier: "",
          location: "",
        });
        fetchInventory && fetchInventory(); // Refresh the inventory list if passed from App
      } else {
        console.error("❌ Submit failed:", result);
        alert("Failed to submit inventory.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("Error submitting form.");
    }
  };

  return (
    <div>
      <h2>Add Inventory</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          list="type-options"
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleChange}
          required
        />
        <datalist id="type-options">
          {dropdownData.types.map((val, i) => <option key={i} value={val} />)}
        </datalist>

        <input
          list="name-options"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <datalist id="name-options">
          {dropdownData.names.map((val, i) => <option key={i} value={val} />)}
        </datalist>

        <input
          name="length"
          type="number"
          placeholder="Length"
          value={formData.length}
          onChange={handleChange}
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <input
          list="supplier-options"
          name="supplier"
          placeholder="Supplier"
          value={formData.supplier}
          onChange={handleChange}
        />
        <datalist id="supplier-options">
          {dropdownData.suppliers.map((val, i) => <option key={i} value={val} />)}
        </datalist>

        <input
          list="location-options"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <datalist id="location-options">
          {dropdownData.locations.map((val, i) => <option key={i} value={val} />)}
        </datalist>

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default InventoryForm;
