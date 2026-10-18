
const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const { app, setPayment } = require('../../src/provider/app');

describe('PaymentService contract verification', () => {
  it('satisfies the OrderService contract', async () => {
    setPayment('123', {
      id: '123',
      status: 'approved',
      amount: 4999,
      currency: 'EUR',
    });

    const server = app.listen(0);

    try {
      const address = server.address();
      const port = address.port;

      await new Verifier({
        provider: 'PaymentService',
        providerBaseUrl: `http://127.0.0.1:${port}`,
        pactUrls: [
          path.resolve(
            process.cwd(),
            'pacts/OrderService-PaymentService.json'
          ),
        ],
      }).verifyProvider();
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  });
});
