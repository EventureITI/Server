const express = require("express");
const cors = require("cors");
const env = require("dotenv")

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

env.config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SK);

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PK,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { stripeAmount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EGP",
      amount: stripeAmount,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);