// Content script - runs on product pages to extract data

function getProductData() {
  let title = null;
  let price = null;

  // Try standard selectors first
  let selectors = [
    "#productTitle",
    "span.VU-ZEz",
    "span.B_NuCI",
    "h1",
    "h2",
    "[data-cy='title']"
  ];
  
  for (let selector of selectors) {
    let el = document.querySelector(selector);
    if (el && el.innerText && el.innerText.trim().length > 5) {
      title = el.innerText.trim();
      break;
    }
  }

  // If still not found, search through the page content
  if (!title) {
    let mainContent = document.querySelector("main") || document.querySelector("[role='main']") || document.body;
    let textLines = mainContent.innerText.split('\n').filter(line => {
      let trimmed = line.trim();
      return trimmed.length > 10 && trimmed.length < 500;
    });
    
    if (textLines.length > 0) {
      title = textLines[0];
    }
  }

  // Get price using selectors
  let priceSelectors = [
    ".a-price-whole",
    "div.Nx9bqj",
    "div._30jeq3",
    "[data-cy='price-tag']"
  ];
  
  for (let selector of priceSelectors) {
    let el = document.querySelector(selector);
    if (el && el.innerText) {
      price = el.innerText.trim();
      break;
    }
  }

  console.log("✅ Extracted:", { title, price });

  if (!title) {
    console.error("❌ Title not found");
    return null;
  }

  return { title, price };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PRODUCT") {
    const productData = getProductData();
    sendResponse(productData);
  }
});
