
const path = require('path');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { getPayment } = require('../../src/consumer/paymentClient');

const { like } = MatchersV3;

describe('Payment API contract', () => {
  const provider = new PactV3({
    consumer: 'OrderService',
    provider: 'PaymentService',
    pactDir: path.resolve(process.cwd(), 'pacts'),
  });

  it('returns an approved payment', async () => {
    await provider
      .given('payment 123 exists')
      .uponReceiving('a request for payment 123')
      .withRequest({
        method: 'GET',
        path: '/payments/123',
      })
      .willRespondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          id: like('123'),
          status: like('approved'),
          amount: like(4999),
          currency: like('EUR'),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const payment = await getPayment(mockServer.url, '123');

      expect(payment).toEqual({
        id: '123',
        status: 'approved',
        amount: 4999,
        currency: 'USD',
      });
    });
  });
});
