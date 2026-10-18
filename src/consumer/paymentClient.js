
async function getPayment(baseUrl, paymentId) {
  const response = await fetch(
    `${baseUrl}/payments/${encodeURIComponent(paymentId)}`
  );

  if (!response.ok) {
    throw new Error(`Payment API returned HTTP ${response.status}`);
  }

  return response.json();
}

module.exports = { getPayment };
