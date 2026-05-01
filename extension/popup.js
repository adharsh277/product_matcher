// Popup script - handles UI and communication

document.getElementById("compareBtn").onclick = async () => {
  const resultDiv = document.getElementById("result");
  const productInfo = document.getElementById("productInfo");
  const errorDiv = document.getElementById("error");
  const loadingDiv = document.getElementById("loading");

  // Hide previous results
  resultDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");
  loadingDiv.classList.remove("hidden");

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Extract product data from content script
    const product = await chrome.tabs.sendMessage(tab.id, { type: "GET_PRODUCT" });

    if (!product.title) {
      throw new Error("Could not extract product information. Please ensure you're on a product page.");
    }

    // Display current product
    document.getElementById("currentTitle").innerText = product.title;
    document.getElementById("currentPrice").innerText = product.price || "N/A";
    productInfo.classList.remove("hidden");

    // Send to backend for matching
    const response = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: product.title, price: product.price })
    });

    if (!response.ok) {
      throw new Error("Backend not running. Please start the server on port 5000.");
    }

    const data = await response.json();
    displayResults(data);

  } catch (error) {
    errorDiv.innerText = "Error: " + error.message;
    errorDiv.classList.remove("hidden");
  } finally {
    loadingDiv.classList.add("hidden");
  }
};

function displayResults(rankedProducts) {
  const resultDiv = document.getElementById("result");
  const productsList = document.getElementById("productsList");

  productsList.innerHTML = "";

  // Show top 5 results
  const topResults = rankedProducts.slice(0, 5);

  topResults.forEach((product, index) => {
    const scorePercent = Math.round(product.score * 100);
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <div class="rank">#${index + 1}</div>
      <h4>${product.title}</h4>
      <p class="price">₹${product.price}</p>
      <div class="score-bar">
        <div class="score-fill" style="width: ${scorePercent}%"></div>
      </div>
      <p class="score-text">Match: ${scorePercent}%</p>
      <p class="source">Source: ${product.source || "Local"}</p>
    `;
    productsList.appendChild(productCard);
  });

  resultDiv.classList.remove("hidden");
}
