
const express = require('express');

const app = express();
app.use(express.json());

const payments = new Map();

function setPayment(id, payment) {
  payments.set(String(id), payment);
}

app.get('/payments/:id', (req, res) => {
  const payment = payments.get(req.params.id);

  if (!payment) {
    return res.status(404).json({
      error: 'Payment not found'
    });
  }

  return res.status(200).json(payment);
});

module.exports = { app, setPayment };
