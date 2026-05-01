// Content script - runs on product pages to extract data

function getProductData() {
  let title = "";
  let price = "";

  // Amazon selectors
  if (document.querySelector("#productTitle")) {
    title = document.querySelector("#productTitle")?.innerText || "";
    price = document.querySelector(".a-price-whole")?.innerText || "";
    price = price.replace(/[^\d.]/g, ""); // Remove currency symbols
  }
  // Flipkart selectors
  else if (document.querySelector("span.B_NuCI")) {
    title = document.querySelector("span.B_NuCI")?.innerText || "";
    const priceElement = document.querySelector("div._30jeq3");
    if (priceElement) {
      price = priceElement.innerText;
      price = price.replace(/[^\d.]/g, "");
    }
  }

  return {
    title: title.trim(),
    price: parseFloat(price) || 0,
    url: window.location.href,
    source: window.location.hostname.includes("amazon") ? "Amazon" : "Flipkart"
  };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PRODUCT") {
    const productData = getProductData();
    sendResponse(productData);
  }
});
