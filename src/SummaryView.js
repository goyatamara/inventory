import React, { useEffect, useState } from "react";

export default function SummaryView({ refresh }) {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("https://sheetdb.io/api/v1/eaeyw4vt8tm8p").then(r => r.json()),
      fetch("https://sheetdb.io/api/v1/eaeyw4vt8tm8p").then(r => r.json()),
    ]).then(([inv, usage]) => {
      const map = {};

      inv.forEach(row => {
        const key = row.type + "|" + row.name;
        map[key] = (map[key] || 0) + parseFloat(row.quantity || 0);
      });

      usage.forEach(row => {
        const key = row.type + "|" + row.name;
        map[key] = (map[key] || 0) - parseFloat(row.quantity || 0);
      });

      const summary = Object.entries(map).map(([key, qty]) => {
        const [type, name] = key.split("|");
        return { type, name, quantity: qty };
      });

      setStock(summary);
    });
  }, [refresh]);

  return (
    <>
      <h2>📊 Stock Summary</h2>
      <div className="inventory-list">
        {stock.map((item, i) => (
          <div key={i} className="item-card" style={{ backgroundColor: item.quantity > 0 ? "#d4f7dc" : "#ffd1d1" }}>
            <strong>{item.name}</strong> ({item.type}) — Remaining: {item.quantity}
          </div>
        ))}
      </div>
    </>
  );
}
