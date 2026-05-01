# Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Terminal 1: Start Backend
```bash
cd backend
npm install
npm start
```

See this output:
```
🚀 Smart Product Matcher Backend running on http://localhost:5000
```

### Terminal 2: Load Extension
1. Open Chrome 🔗 → chrome://extensions/
2. Toggle **Developer mode** (top right)
3. Click **Load unpacked**
4. Select `/extension` folder
5. ✅ Done! Icon appears in toolbar

### 🧪 Test It
1. Go to https://amazon.in → any product page
2. Click extension icon
3. Click **Compare Price**
4. See results! 🎉

---

## ❌ Having Issues?

### Backend Port Error
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
# Then restart: npm start
```

### Extension Not Showing Data
1. F12 → Console tab
2. Verify product page has correct selectors
3. Run: `getProductData()` to test

### CORS Errors
Already handled in server.js ✅

---

## 📁 Key Files

- `extension/content.js` - Extracts product data
- `backend/matcher.js` - Scores similarity
- `backend/search.js` - Mock product database
- `backend/server.js` - Express API

---

**Questions?** Check main README.md for detailed docs.
