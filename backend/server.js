const express = require("express");
const cors = require("cors");
const { searchProducts } = require("./search");
const { rankProducts } = require("./matcher");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// API endpoint for product search and comparison
app.post("/search", async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Product title is required" });
    }

    // Fetch similar products from search module
    const results = await searchProducts(title);

    // Rank products by similarity
    const ranked = rankProducts(title, results);

    res.json(ranked);
  } catch (error) {
    console.error("Error in /search endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Product Matcher Backend is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Smart Product Matcher Backend running on http://localhost:${PORT}`);
  console.log(`📝 POST http://localhost:${PORT}/search - Search and compare products`);
  console.log(`❤️  GET http://localhost:${PORT}/health - Check server status`);
});
