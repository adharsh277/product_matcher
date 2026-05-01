# 🛠️ Developer Guide - Extend & Customize

This guide explains how to modify and extend the Smart Product Matcher.

---

## 🎯 Common Modifications

### 1. Add Support for New Websites

Edit `extension/content.js`:

```javascript
function getProductData() {
  let title = "";
  let price = "";

  // EXISTING CODE
  if (document.querySelector("#productTitle")) {
    // Amazon
    ...
  }
  else if (document.querySelector("span.B_NuCI")) {
    // Flipkart
    ...
  }
  // ADD NEW SITE HERE
  else if (document.querySelector("your-site-selector")) {
    title = document.querySelector("your-site-selector")?.innerText;
    price = document.querySelector("your-price-selector")?.innerText;
  }

  return {
    title: title.trim(),
    price: parseFloat(price) || 0,
    url: window.location.href,
    source: "Your Site Name"
  };
}
```

**How to find selectors:**
1. Right-click on product title → Inspect
2. Find the element selector (e.g., `.product-title`)
3. Add it to the code above
4. Test with `getProductData()` in console

---

### 2. Change the Matching Algorithm

Edit `backend/matcher.js`:

#### Option A: Case-Insensitive Full Text Match
```javascript
function similarity(original, candidate) {
  const a = original.toLowerCase();
  const b = candidate.toLowerCase();
  
  // Check if one contains the other
  if (a.includes(b) || b.includes(a)) {
    return 1.0; // Perfect match
  }
  
  // Otherwise exact score
  return 0;
}
```

#### Option B: Levenshtein Distance (Better)
```javascript
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  const maxLen = Math.max(a.length, b.length);
  return 1 - (matrix[b.length][a.length] / maxLen);
}

function similarity(original, candidate) {
  return levenshteinDistance(original.toLowerCase(), candidate.toLowerCase());
}
```

---

### 3. Integrate Real Product Database

Edit `backend/search.js`:

#### Option A: Use SerpAPI
```bash
npm install serpapi
```

```javascript
const SerpApi = require('serpapi');

async function searchProducts(query) {
  const client = new SerpApi.GoogleSearch({
    api_key: process.env.SERPAPI_KEY
  });
  
  const results = await client.json({
    q: query,
    tbm: "shop"
  });
  
  return results.shopping_results.map(item => ({
    title: item.title,
    price: item.price || 0,
    source: item.source,
    url: item.link
  }));
}
```

#### Option B: Use RapidAPI
```bash
npm install axios
```

```javascript
const axios = require('axios');

async function searchProducts(query) {
  const options = {
    method: 'GET',
    url: 'https://amazon-price-monitor.p.rapidapi.com/search',
    params: { q: query },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'amazon-price-monitor.p.rapidapi.com'
    }
  };

  const response = await axios.request(options);
  return response.data.products.map(item => ({
    title: item.title,
    price: item.price,
    source: "Amazon",
    url: item.url
  }));
}
```

---

### 4. Change UI Styling

Edit `extension/styles.css`:

```css
/* Change primary color */
h1, .btn-primary, .rank {
  background: #your-color;
  color: #your-text-color;
}

/* Change popup size */
body {
  width: 600px; /* was 500px */
}

/* Add more results per page */
.product-card {
  padding: 16px; /* was 12px */
  margin-bottom: 12px; /* was 10px */
}
```

---

### 5. Show More Results

Edit `extension/popup.js`:

```javascript
function displayResults(rankedProducts) {
  // Change 5 to 10 to show more results
  const topResults = rankedProducts.slice(0, 10); // was 5
  
  // Rest of code stays same
}
```

---

### 6. Change Backend Port

Edit `backend/server.js`:

```javascript
const PORT = 5000; // Change to 8000, 3000, etc.
```

Also update `extension/popup.js`:

```javascript
const response = await fetch("http://localhost:8000/search", { // was 5000
  // ...
});
```

---

## 🔌 Add New API Endpoints

### Add Price Comparison
```javascript
// backend/server.js

app.post("/compare-prices", async (req, res) => {
  const { product_id } = req.body;
  
  // Fetch from multiple sellers
  const prices = await fetchFromMultipleSellers(product_id);
  
  res.json({
    cheapest: prices.sort((a, b) => a.price - b.price)[0],
    all_prices: prices
  });
});
```

### Add History Tracking
```javascript
// backend/server.js

const priceHistory = {};

app.post("/track", async (req, res) => {
  const { title, price } = req.body;
  
  if (!priceHistory[title]) {
    priceHistory[title] = [];
  }
  
  priceHistory[title].push({
    price,
    timestamp: new Date()
  });
  
  res.json({ tracked: true });
});

app.get("/history/:product", (req, res) => {
  const history = priceHistory[req.params.product] || [];
  res.json(history);
});
```

---

## 🧪 Testing Your Changes

### Test Extension Changes
1. Make code change
2. Go to chrome://extensions/
3. Find "Smart Product Matcher"
4. Click refresh icon ⟲
5. Test on product page

### Test Backend Changes
1. Make code change
2. Restart: `npm start`
3. Test with curl:
```bash
curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{"title":"test","price":0}'
```

### Test Matching Algorithm
```python
# Create test.py
from matcher import similarity

test_cases = [
  ("iPhone 13", "iPhone 13 128GB", 0.8),
  ("Apple Phone", "Samsung Phone", 0),
]

for original, candidate, expected in test_cases:
  score = similarity(original, candidate)
  print(f"{original} vs {candidate}: {score} (expected ~{expected})")
```

---

## 📦 Dependencies to Add

### For Real APIs:
```bash
npm install serpapi axios
```

### For Database:
```bash
npm install sqlite3 # or mongoose for MongoDB
```

### For Authentication:
```bash
npm install jsonwebtoken bcryptjs
```

### For Logging:
```bash
npm install winston
```

---

## 🐛 Debugging Tips

### Enable Verbose Logging

Edit `backend/server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Body:', JSON.stringify(req.body));
  next();
});
```

### Test Extension Scripts

In Chrome DevTools console:
```javascript
// Test data extraction
console.log(getProductData());

// Test messaging
chrome.runtime.sendMessage({type: "GET_PRODUCT"}, (response) => {
  console.log("Response:", response);
});
```

### Monitor API Calls

In Firefox/Chrome DevTools:
1. Network tab filters to "Fetch/XHR"
2. Click "Compare Price"
3. See POST request to localhost:5000/search
4. Click request to see full response

---

## 🚀 Performance Optimization

### Cache Results
```javascript
// backend/server.js
const cache = new Map();

app.post("/search", async (req, res) => {
  const cacheKey = JSON.stringify(req.body);
  
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }
  
  const results = await searchProducts(req.body.title);
  const ranked = rankProducts(req.body.title, results);
  
  cache.set(cacheKey, ranked);
  res.json(ranked);
});
```

### Reduce Database Size
```javascript
// backend/search.js
// Only return top 20 most relevant products per category
const topResults = results.slice(0, 20);
```

---

## 📊 Code Structure Best Practices

### Keep components focused:
- `content.js` - Only extraction
- `popup.js` - Only UI logic
- `matcher.js` - Only matching
- `search.js` - Only data fetching

### Don't mix concerns:
```javascript
// BAD: Mixing fetching and matching
async function searchAndRank(query) {
  const results = await searchProducts(query);
  const matched = rankProducts(query, results);
  return matched;
}

// GOOD: Separate functions
async function search(query) {
  return await searchProducts(query);
}

function rank(query, products) {
  return rankProducts(query, products);
}
```

---

## 🔐 Security Considerations

### Validate Input
```javascript
// backend/server.js
app.post("/search", (req, res) => {
  const { title, price } = req.body;
  
  // Validate
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: "Invalid title" });
  }
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }
  
  // Process...
});
```

### Escape HTML
```javascript
// extension/popup.js
// Bad: innerHTML can run scripts
productCard.innerHTML = `<p>${product.title}</p>`;

// Good: textContent is safer
productCard.textContent = product.title;
```

---

## 📝 Version Control

### Initial Commit
```bash
git add .
git commit -m "Initial commit: Smart Product Matcher MVP"
git push origin main
```

### Feature Branch Workflow
```bash
# New feature
git checkout -b feature/real-api-integration

# Make changes
# Commit
git add .
git commit -m "Add SerpAPI integration"

# Push and create PR
git push origin feature/real-api-integration
```

---

## 🎓 Learning Resources

- [Chrome Extension API Docs](https://developer.chrome.com/docs/extensions/)
- [Express.js Guide](https://expressjs.com/)
- [JavaScript Algorithms](https://github.com/trekhleb/javascript-algorithms)
- [Web Scraping Ethics](https://blog.apify.com/web-scraping-guide/)

---

## 📞 Common Questions

**Q: How do I add authentication?**
A: See "For Authentication" in dependencies section above.

**Q: Can I use TypeScript?**
A: Yes, but backend/extension currently uses vanilla JS for simplicity.

**Q: How do I deploy?**
A: See Phase 6 in main README - Render, Railway, or Fly.io

**Q: Can I sell this extension?**
A: Check Chrome Extension policies and review license.

---

**Happy coding! 🚀**
