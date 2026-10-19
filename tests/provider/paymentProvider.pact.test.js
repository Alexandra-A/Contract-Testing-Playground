
const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const { app, setPayment } = require('../../src/provider/app');

describe('PaymentService contract verification', () => {
  it('satisfies the OrderService contract', async () => {
    const server = app.listen(0);

    try {
      const port = server.address().port;

      await new Verifier({
        provider: 'PaymentService',
        providerBaseUrl: `http://127.0.0.1:${port}`,
        pactUrls: [
          path.resolve(
            process.cwd(),
            'pacts/OrderService-PaymentService.json'
          ),
        ],
        stateHandlers: {
          'payment 123 exists': async () => {
            setPayment('123', {
              id: '123',
              status: 'approved',
              amount: 4999,
              currency: 'EUR',
            });
          },
        },
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
