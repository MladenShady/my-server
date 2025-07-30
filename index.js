const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server radi!");
});

app.post("/pay", async (req, res) => {
  const { token, name, studentId, course, amount } = req.body;

  if (!token || !name || !studentId || !course || !amount) {
    return res.status(400).json({ error: "Nedostaju potrebni podaci" });
  }

  try {
    const response = await axios.post(
      "https://api.payway.com.au/rest/v1/transactions",
      {
        singleUseTokenId: token,
        principalAmount: Math.round(parseFloat(amount) * 100), // pretvori u cent
        currency: "AUD",
        merchantId: "TEST",
        customFields: {
          name,
          studentId,
          course
        }
      },
      {
        auth: {
          username: "T19814_SEC_ewixb5h3tz2tygfxcbim3khz6d5snz35egf9ngc29vehin9gebnjxqvwhdg9",
          password: ""
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true, result: response.data });
  } catch (error) {
    console.error("❌ Greška:", error.response?.data || error.message);
    res.status(500).json({ error: "Greška prilikom obrade uplate" });
  }
});

app.listen(port, () => {
  console.log(`Server radi na portu ${port}`);
});
