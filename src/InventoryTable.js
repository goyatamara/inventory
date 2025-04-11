import React from "react";

function getColor(type) {
  switch (type.toLowerCase()) {
    case "aluminum":
      return "#a3cef1";
    case "sealant":
      return "#f9dcc4";
    case "screw":
      return "#d9f0c1";
    default:
      return "#e0e0e0";
  }
}

const InventoryTable = ({ inventory }) => {
  return (
    <div className="inventory-list">
      {inventory.map((item, i) => (
        <div
          key={i}
          className="item-card"
          style={{ backgroundColor: getColor(item.type) }}
        >
          <div><strong>{item.name}</strong></div>
          <div>Type: {item.type}</div>
          <div>Length: {item.length}</div>
          <div>Qty: {item.quantity}</div>
        </div>
      ))}
    </div>
  );
};

export default InventoryTable;
