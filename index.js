const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /pay
app.post('/pay', async (req, res) => {
  const { token, amount } = req.body;

  if (!token || !amount) {
    return res.status(400).json({ error: 'Nedostaje token ili iznos.' });
  }

  try {
    const response = await axios.post(
      'https://api.payway.com.au/rest/v1/transactions',
      {
        singleUseTokenId: token,
        principalAmount: Math.round(amount * 100), // u centima
        currency: 'AUD',
        merchantId: 'TEST',
      },
      {
        auth: {
          username: 'T19814_SEC_ewixb5h3tz2tygfxcbim3khz6d5snz35egf9ngc29vehin9gebnjxqvwhdg9',
          password: '',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ success: true, result: response.data });
  } catch (error) {
    console.error('❌ Greška u transakciji:', error.response?.data || error.message);
    res.status(500).json({ error: 'Greška prilikom plaćanja' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server pokrenut na portu ${port}`);
});
