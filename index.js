const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// GET /
app.get('/', (req, res) => {
  res.send('banana');
});

// POST /pay
app.post('/pay', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token nije poslat' });
  }

  try {
    const response = await axios.post(
      'https://api.payway.com.au/rest/v1/transactions',
      {
        singleUseTokenId: token,
        principalAmount: 100, // u centima: 100 = $1.00
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
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Greška prilikom plaćanja' });
  }
});

app.listen(port, () => {
  console.log(`Server radi na portu ${port}`);
});
