const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const {
  MercadoPagoConfig,
  Payment
} = require('mercadopago');

const app = express();

app.use(cors());
app.use(express.json());

const PUBLIC_KEY = 'APP_USR-3391981d-1a45-4a1a-a852-b3bd9a7973bf';

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-345349026574893-060313-41b44251d4a211f276f8f3ad71153757-1691118367'
});

const payment = new Payment(client);

app.get('/api', (req, res) => {
  res.json({
    mensaje: 'Backend funcionando 🚀'
  });
});

app.post('/crear-pago', async (req, res) => {
  try {
    const {
      phoneNumber,
      otp,
      transaction_amount,
      email
    } = req.body;

    const requestId = crypto.randomUUID();

    const tokenResponse = await fetch(
      `https://api.mercadopago.com/platforms/pci/yape/v1/payment?public_key=${PUBLIC_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
          otp,
          requestId
        })
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json({
        error: 'Error generando token Yape',
        detalle: tokenData
      });
    }

    const response = await payment.create({
      body: {
        transaction_amount: Number(transaction_amount),
        token: tokenData.id,
        description: 'Pedido Kimsa Pizza',
        installments: 1,
        payment_method_id: 'yape',
        payer: {
          email
        }
      }
    });

    res.json(response);

  } catch (error) {
    console.error('ERROR MERCADOPAGO:', error);

    res.status(500).json({
      error: error?.cause || error?.message || 'Error creando pago'
    });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo en http://0.0.0.0:3000');
});