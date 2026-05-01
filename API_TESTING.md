# API Testing & Debugging Guide

## 🧪 Test Backend Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Smart Product Matcher Backend is running"
}
```

---

### 2. Search for Products

#### Test 1: iPhone Search
```bash
curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 13 128GB",
    "price": 52000
  }'
```

**Expected Response:**
```json
[
  {
    "title": "Apple iPhone 13 128GB Black",
    "price": 52000,
    "source": "Amazon",
    "score": 0.8
  },
  {
    "title": "iPhone 13 128GB Blue",
    "price": 51999,
    "source": "Flipkart",
    "score": 0.95
  },
  ...
]
```

#### Test 2: Samsung Search
```bash
curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Samsung Galaxy S21",
    "price": 48999
  }'
```

#### Test 3: OnePlus Search
```bash
curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{
    "title": "OnePlus 10 Pro",
    "price": 66999
  }'
```

---

## 🐍 Test with Python

```python
import requests
import json

# Test endpoint
url = "http://localhost:5000/search"
payload = {
    "title": "iPhone 13 128GB",
    "price": 52000
}

response = requests.post(url, json=payload)
print(json.dumps(response.json(), indent=2))

# Check scores
for product in response.json():
    print(f"{product['title']}: {product['score']*100:.1f}% match")
```

---

## 🧠 Test Similarity Matching

### Verify Similarity Scoring Works Correctly

**Test Case 1:** Exact Match
```
Original: "iPhone 13 128GB"
Product:  "iPhone 13 128GB"
Expected: High score (~0.8-1.0)
```

**Test Case 2:** Similar Product
```
Original: "iPhone 13 128GB"
Product:  "iPhone 13 Pro 128GB"
Expected: Medium-high score (~0.6-0.8)
```

**Test Case 3:** Different Product
```
Original: "iPhone 13 128GB"
Product:  "Samsung Galaxy S21"
Expected: Low score (~0-0.3)
```

---

## 🔍 Debug Mode

### Enable Console Logging

Edit `backend/server.js` and add:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Body:", JSON.stringify(req.body));
  next();
});
```

### Test Content Script Extraction

Open DevTools (F12) on Amazon/Flipkart product page and run:
```javascript
// Test extraction
getProductData()

// Example output:
// {
//   "title": "Apple iPhone 13 (128GB) - Starlight",
//   "price": 52000,
//   "url": "https://www.amazon.in/...",
//   "source": "Amazon"
// }
```

---

## ❌ Common Test Failures

### Test Fails: 400 Bad Request
```
Error: "Product title is required"
```
**Solution:** Ensure title is non-empty string

### Test Fails: 500 Internal Error
```
Error: "Internal server error"
```
**Solution:** 
1. Check backend logs in terminal
2. Verify search.js has data for the query
3. Check matcher.js logic

### Test Fails: Connection Refused
```
Error: "Cannot connect to localhost:5000"
```
**Solution:**
1. Backend not running
2. Run: `npm start` in backend folder
3. Or check port 5000 is available

---

## 📊 Performance Testing

### Measure Response Time
```bash
time curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{"title":"iPhone 13","price":52000}' \
  -s | jq .
```

Expected: < 1 second response time

---

## 🔧 Extension Popup Debugging

### Check Extension Logs

1. Open Chrome DevTools on extension page
2. Go to Sources → Extensions → Smart Product Matcher
3. Set breakpoints in popup.js to debug message passing

### Test Extension-to-Backend Communication

In Chrome Console (on any page):
```javascript
fetch("http://localhost:5000/health")
  .then(r => r.json())
  .then(d => console.log(d))
```

Should print: `{status: 'ok', message: '...'}`

---

## 📋 Full End-to-End Test Checklist

- [ ] Backend starts without errors
- [ ] `curl http://localhost:5000/health` returns ok
- [ ] Extension loads in Chrome
- [ ] Extension icon appears in toolbar
- [ ] Can click extension and see popup
- [ ] Go to Amazon product page
- [ ] Popup shows extracted product
- [ ] Click "Compare Price" button
- [ ] See ranked results appear
- [ ] Results have scores > 0
- [ ] Can test different product types

---

**All tests passing?** You're ready to use the extension! 🚀
