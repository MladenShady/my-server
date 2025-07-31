const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/pay", async (req, res) => {
  const { token, name, studentId, course, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.payway.com.au/rest/v1/transactions",
      {
        customer: {
          reference: studentId,
          firstName: name,
          customFields: {
            course: course
          }
        },
        transactionType: "payment",
        method: {
          type: "token",
          value: token
        },
        principalAmount: parseFloat(amount)
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYWAY_SECRET_KEY + ":").toString("base64")}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      status: "success",
      receiptNumber: response.data.receipt.receiptNumber
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.response?.data?.message || "Payment failed"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
