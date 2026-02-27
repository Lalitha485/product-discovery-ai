import React, { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleAsk = async () => {
    setLoading(true);
    setSummary("");

    try {
      const res = await fetch("http://localhost:8000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const data = await res.json();
      setSummary(data.summary);

      const matched = products.filter(p =>
        data.productIds.includes(p.id)
      );

      setFilteredProducts(matched);
    } catch {
      alert("Error contacting AI service");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Product Discovery with AI</h1>

      <h2>All Products</h2>
      {products.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>₹{p.price}</p>
        </div>
      ))}

      <hr />

      <h2>Ask AI</h2>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Ask about products..."
      />
      <button onClick={handleAsk}>Ask</button>

      {loading && <p>Loading...</p>}

      {summary && (
        <>
          <h3>AI Summary</h3>
          <p>{summary}</p>
        </>
      )}

      {filteredProducts.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
