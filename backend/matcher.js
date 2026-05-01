// Product matching and ranking logic using similarity scoring

function similarity(original, candidate) {
  // Normalize strings
  const a = original.toLowerCase().trim();
  const b = candidate.toLowerCase().trim();

  // Remove special characters but keep spaces
  const cleanA = a.replace(/[^a-z0-9\s]/g, "");
  const cleanB = b.replace(/[^a-z0-9\s]/g, "");

  // Extract words
  const wordsA = cleanA.split(/\s+/).filter(w => w.length > 0);
  const wordsB = cleanB.split(/\s+/).filter(w => w.length > 0);

  // Count matching words
  let matches = 0;
  wordsA.forEach(word => {
    if (wordsB.includes(word)) {
      matches++;
    }
  });

  // Calculate similarity score (0-1)
  const maxLength = Math.max(wordsA.length, wordsB.length);
  if (maxLength === 0) return 0;

  return matches / maxLength;
}

function rankProducts(originalTitle, productList) {
  // Add similarity score to each product
  const scored = productList.map(product => ({
    ...product,
    score: similarity(originalTitle, product.title)
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored;
}

module.exports = { rankProducts, similarity };
