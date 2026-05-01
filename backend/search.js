// Product search module - returns mock data (ready for real API integration)

async function searchProducts(query) {
  // MOCK DATA - Replace this with real API calls later (SerpAPI, RapidAPI, etc.)
  // For MVP, we return similar product variations

  const mockDatabase = {
    "iPhone": [
      { title: "Apple iPhone 13 128GB Black", price: 52000, source: "Amazon" },
      { title: "iPhone 13 128GB Blue", price: 51999, source: "Flipkart" },
      { title: "iPhone 13 Pro 128GB", price: 79999, source: "Amazon" },
      { title: "iPhone 12 128GB", price: 45000, source: "Flipkart" },
      { title: "iPhone SE 2022 64GB", price: 32999, source: "Amazon" },
      { title: "Apple iPhone 13 Mini 128GB", price: 47999, source: "Flipkart" },
      { title: "iPhone 14 128GB", price: 62999, source: "Amazon" },
      { title: "Apple iPhone 13 256GB", price: 61999, source: "Flipkart" }
    ],
    "Samsung": [
      { title: "Samsung Galaxy S21 128GB", price: 48999, source: "Amazon" },
      { title: "Samsung Galaxy S22 256GB", price: 59999, source: "Flipkart" },
      { title: "Samsung Galaxy A12", price: 13999, source: "Amazon" },
      { title: "Samsung Galaxy S21 FE", price: 35999, source: "Flipkart" },
      { title: "Samsung Galaxy S22 Ultra", price: 99999, source: "Amazon" },
      { title: "Samsung Galaxy Note20", price: 42000, source: "Flipkart" }
    ],
    "OnePlus": [
      { title: "OnePlus 10 Pro 128GB", price: 66999, source: "Amazon" },
      { title: "OnePlus 9 256GB", price: 42999, source: "Flipkart" },
      { title: "OnePlus 11 128GB", price: 61999, source: "Amazon" },
      { title: "OnePlus Nord 2", price: 29999, source: "Flipkart" },
      { title: "OnePlus 10 256GB", price: 71999, source: "Amazon" }
    ],
    "Mi": [
      { title: "Xiaomi 11X Pro 128GB", price: 39999, source: "Amazon" },
      { title: "Xiaomi Mi 12 256GB", price: 52999, source: "Flipkart" },
      { title: "Xiaomi Redmi Note 11", price: 17999, source: "Amazon" },
      { title: "Xiaomi 12 Pro 256GB", price: 62999, source: "Flipkart" }
    ]
  };

  // Find matching category from query
  let results = [];
  for (const [category, products] of Object.entries(mockDatabase)) {
    if (query.toLowerCase().includes(category.toLowerCase())) {
      results = products;
      break;
    }
  }

  // If no category match, return generic results
  if (results.length === 0) {
    results = mockDatabase["iPhone"].slice(0, 3);
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return results;
}

module.exports = { searchProducts };
