# 🚀 Smart Product Matcher Chrome Extension

A powerful Chrome extension that extracts product information from Amazon and Flipkart, then finds and ranks similar products using intelligent matching algorithms.

## 🎯 Features


✅ **Product Data Extraction** - Automatically extracts product title, price, and URL from Amazon & Flipkart
✅ **Smart Matching** - Uses keyword similarity scoring to find related products
✅ **Simple UI** - Clean popup interface with ranked results
✅ **Local Backend** - Node.js + Express backend with mock data (ready for real APIs)
✅ **No Dependencies** - Runs completely locally without external APIs (MVP version)

## 📁 Project Structure

```
product_matcher/
├── extension/                 # Chrome Extension files
│   ├── manifest.json         # Extension configuration (MV3)
│   ├── content.js            # Data extraction script
│   ├── popup.html            # Popup UI
│   ├── popup.js              # Popup logic
│   ├── styles.css            # Styling
│   └── background.js         # Service worker
│
└── backend/                   # Node.js Backend
    ├── package.json          # Dependencies
    ├── server.js             # Express server
    ├── matcher.js            # Similarity matching logic
    └── search.js             # Product search (mock data)
```

## 🛠️ Tech Stack

- **Frontend:** Chrome Extension (Manifest V3), Vanilla JavaScript
- **Backend:** Node.js + Express
- **Matching:** Keyword similarity algorithm (no ML required for MVP)
- **Data:** Mock products (easily upgradeable to real APIs)

---

## 📋 Installation & Setup

### Prerequisites
- Node.js 14+ installed
- Chrome/Chromium browser
- Terminal/Command prompt

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Start the Backend Server

```bash
npm start
```

You should see:
```
🚀 Smart Product Matcher Backend running on http://localhost:5000
📝 POST http://localhost:5000/search - Search and compare products
❤️  GET http://localhost:5000/health - Check server status
```

⚠️ **Keep this terminal running!** The extension needs the backend server to work.

### Step 3: Load the Extension in Chrome

1. Open Chrome and go to **chrome://extensions/**
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Navigate to `/workspaces/product_matcher/extension` folder
5. Select the **extension** folder and click **Select Folder**

✅ You should see "Smart Product Matcher" in your extensions list

---

## 🧪 How to Test

### Test 1: Extension Loads Correctly
1. Go to chrome://extensions/
2. Verify "Smart Product Matcher" is listed and enabled
3. Click the extension icon → popup should appear

### Test 2: Extract Product Data
1. Visit **https://www.amazon.in/** (or amazon.com)
2. Open any product page (e.g., search for "iPhone")
3. Click the extension icon
4. You should see the product title and price extracted

### Test 3: Backend Search
1. With the backend running, click **Compare Price** button
2. You should see a list of 5 similar products
3. Each product shows:
   - Match score (%)
   - Price
   - Product name
   - Source (Amazon/Flipkart/Local)

### Test 4: Test the API Directly (Optional)

```bash
# Terminal 1: Make sure backend is running
cd backend && npm start

# Terminal 2: Test the API
curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{"title": "iPhone 13", "price": 52000}'
```

You should get a JSON response with ranked products.

---

## 🎮 How to Use

### On Amazon/Flipkart Product Pages:

1. **Click the extension icon** in Chrome toolbar
2. **See the current product** information displayed
3. **Click "Compare Price" button**
4. **View results** - Top 5 matching products sorted by similarity score
5. **Match percentage** shows how similar each product is (color gradient)

### UI Explanation:

- 🟢 Green: High match (80-100%)
- 🟡 Yellow: Medium match (50-79%)
- 🔴 Red: Lower match (below 50%)

---

## 🔧 How It Works

### 1. Content Script (content.js)
- Runs on Amazon & Flipkart pages
- Extracts: product title, price, URL
- Handles missing data gracefully

### 2. Popup UI (popup.js)
- Sends product data to backend
- Displays results with similarity scores
- Shows top 5 matches

### 3. Backend Matching (matcher.js)
- **Keyword similarity scoring:** Compares word overlap between products
- Normalizes text (lowercase, removes symbols)
- Scores are 0-1 (0 = no match, 1 = perfect match)

### 4. Search Module (search.js)
- Currently returns mock data for MVP
- **Ready to integrate real APIs:** SerpAPI, RapidAPI, Google Shopping

**Example Flow:**
```
User clicks "Compare Price"
    ↓
Extension extracts product data
    ↓
Sends POST to http://localhost:5000/search
    ↓
Backend searches mock database
    ↓
Rankings products by similarity
    ↓
Returns ranked list with scores
    ↓
Popup displays results
```

---

## 📊 Similarity Scoring Example

**Original Product:** "Apple iPhone 13 128GB Blue"

| Product | Score | Match % |
|---------|-------|---------|
| Apple iPhone 13 128GB Black | 0.80 | 80% |
| iPhone 13 Pro 256GB | 0.67 | 67% |
| iPhone 12 128GB | 0.50 | 50% |
| Samsung Galaxy S21 | 0.00 | 0% |

---

## 🚀 Upgrade Paths (Future Enhancements)

### Phase 2 (Easy to add):
- [ ] Integrate with **SerpAPI** for real Google Shopping results
- [ ] Add **RapidAPI** integration
- [ ] Direct scraping with **Cheerio** (with rate limiting)

### Phase 3 (More complex):
- [ ] **Semantic similarity** using OpenAI embeddings
- [ ] **ML model** for better matching (TensorFlow.js)
- [ ] Database to cache results

### Phase 4 (Advanced):
- [ ] Price history tracking
- [ ] User alerts for price drops
- [ ] Safari extension version

---

## ⚠️ Known Limitations & Solutions

| Issue | Reason | Solution |
|-------|--------|----------|
| DOM selectors break | Websites change HTML structure | Manually update selectors in content.js |
| Extension not loading | Manifest v3 compatibility | Already using MV3 - should work |
| Backend 404 errors | Port already in use | Kill process on port 5000 or change PORT in server.js |
| No data extracted | Wrong URL or not a product page | Ensure you're on Amazon/Flipkart product page |
| CORS errors | Backend security | Already added CORS middleware in server.js |

---

## 🔗 API Endpoints

### POST /search
Search and rank products

**Request:**
```json
{
  "title": "iPhone 13 128GB",
  "price": 52000
}
```

**Response:**
```json
[
  {
    "title": "iPhone 13 128GB Blue",
    "price": 51999,
    "source": "Amazon",
    "score": 0.95
  },
  {
    "title": "iPhone 13 Pro 128GB",
    "price": 79999,
    "source": "Flipkart",
    "score": 0.75
  }
]
```

### GET /health
Check if server is running

**Response:**
```json
{
  "status": "ok",
  "message": "Smart Product Matcher Backend is running"
}
```

---

## 🎨 Customization

### Change Port (in backend/server.js):
```javascript
const PORT = 5000; // Change to any available port
```

### Add More Selectors (in extension/content.js):
```javascript
// Add new selectors for other websites
let price = document.querySelector(".your-custom-selector")?.innerText;
```

### Modify Similarity Algorithm (in backend/matcher.js):
Current: Simple keyword overlap
Future: Use Levenshtein distance, phonetic matching, etc.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Error: Port 5000 already in use
# Solution 1: Kill the process
lsof -i :5000
kill -9 <PID>

# Solution 2: Use different port
# Edit backend/server.js and change PORT
```

### Extension not extracting data
1. Open DevTools (F12) on the product page
2. Go to Console tab
3. Run: `getProductData()` to see what's being extracted
4. Update selectors in content.js if needed

### Backend receiving 404 from extension
1. Check if backend is running on port 5000
2. Run: `curl http://localhost:5000/health`
3. If fails, restart backend

### Results not displaying
1. Check Chrome DevTools (F12)
2. Look for errors in Console
3. Verify JSON response format from backend

---

## 📝 Code Quality Notes

- ✅ Clean, readable code
- ✅ Error handling included
- ✅ No external dependencies (except Express)
- ✅ Comments on key logic
- ✅ Console logging for debugging
- ✅ CORS enabled for extension communication

---

## 📄 License

MIT - Free to use and modify

---

## 🤝 Contributing

This is an MVP. Future improvements welcome!

**Next Steps:**
1. Add real API integration
2. Improve similarity matching
3. Add database caching
4. Create settings panel

---

## 📞 Support

If something breaks:
1. Check console in Chrome DevTools
2. Verify backend is running
3. Check port 5000 is accessible
4. Review the troubleshooting section above

---

**Happy comparing! 🎉**
