const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Proveri da li je key dostupan
const paywaySecretKey = process.env.PAYWAY_SECRET_KEY;
if (!paywaySecretKey) {
  console.error('❌ PAYWAY_SECRET_KEY nije definisan u env var.');
  process.exit(1);
}

app.post('/pay', async (req, res) => {
  const { token, name, studentId, course, amount } = req.body;

  if (!token || !name || !studentId || !course || !amount) {
    return res.status(400).json({ error: 'Nedostaju podaci za plaćanje.' });
  }

  try {
    const response = await axios.post(
      'https://api.payway.com.au/rest/v1/transactions',
      {
        singleUseTokenId: token,
        principalAmount: Math.round(parseFloat(amount) * 100), // npr. 100.50 → 10050
        currency: 'AUD',
        merchantId: 'TEST',
        customFields: {
          Name: name,
          ID: studentId,
          Course: course
        }
      },
      {
        auth: {
          username: paywaySecretKey,
          password: ''
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ success: true, result: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Greška prilikom plaćanja.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server radi na portu ${port}`);
});
