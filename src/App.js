import React from "react";
import InventoryForm from "./InventoryForm";
import UsageForm from "./UsageForm";
import StockTable from "./StockTable";

function App() {
  return (
    <div className="App">
      <h1>📦 Inventory App</h1>
      <InventoryForm />
      <UsageForm />
      <StockTable />
    </div>
  );
}

export default App;
