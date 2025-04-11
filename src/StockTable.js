import React, { useEffect, useState } from "react";

const StockTable = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiInventory = "https://sheetdb.io/api/v1/eaeyw4vt8tm8p"; // Inventory Sheet
  const apiUsage = "https://sheetdb.io/api/v1/eaeyw4vt8tm8p?sheet=Usage"; // Usage Sheet

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, usageRes] = await Promise.all([
          fetch(apiInventory),
          fetch(apiUsage),
        ]);

        const [inventoryData, usageData] = await Promise.all([
          inventoryRes.json(),
          usageRes.json(),
        ]);

        // Group by type + name, and calculate volume (length * quantity)
        const calculateVolume = (data) => {
          const map = {};
          data.forEach((item) => {
            const key = `${item.type}|${item.name}`;
            const volume = parseFloat(item.length || 0) * parseFloat(item.quantity || 0);
            map[key] = (map[key] || 0) + volume;
          });
          return map;
        };

        const inventoryMap = calculateVolume(inventoryData);
        const usageMap = calculateVolume(usageData);

        const allKeys = new Set([...Object.keys(inventoryMap), ...Object.keys(usageMap)]);
        const summaryData = Array.from(allKeys).map((key) => {
          const [type, name] = key.split("|");
          const inventoryVol = inventoryMap[key] || 0;
          const usageVol = usageMap[key] || 0;
          const remainingVol = inventoryVol - usageVol;
          return {
            type,
            name,
            inventoryVol,
            usageVol,
            remainingVol,
          };
        });

        setSummary(summaryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching summary:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>📊 Stock Summary (by Volume)</h2>
      {loading ? (
        <p>Loading summary...</p>
      ) : (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Inventory Volume</th>
              <th>Used Volume</th>
              <th>Remaining Volume</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.name}</td>
                <td>{item.inventoryVol.toFixed(2)}</td>
                <td>{item.usageVol.toFixed(2)}</td>
                <td>{item.remainingVol.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockTable;
