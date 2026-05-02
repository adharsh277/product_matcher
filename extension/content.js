// Content script - runs on product pages to extract data

function getProductData() {
  let title =
    document.querySelector("#productTitle")?.innerText ||  // Amazon
    document.querySelector("span.VU-ZEz")?.innerText ||    // Flipkart (new)
    document.querySelector("span.B_NuCI")?.innerText ||    // Flipkart (old)
    document.querySelector("h1")?.innerText ||             // Any h1
    document.querySelector("[data-cy='title']")?.innerText; // Flipkart data attr

  let price =
    document.querySelector(".a-price-whole")?.innerText || // Amazon
    document.querySelector("div.Nx9bqj")?.innerText ||     // Flipkart (new)
    document.querySelector("div._30jeq3")?.innerText ||    // Flipkart (old)
    document.querySelector("[data-cy='price-tag']")?.innerText; // Flipkart data attr

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
