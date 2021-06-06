import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./stripeCheckoutForm";

const promise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
export default function CheckoutPayment() {
  return (
    <div className="App">
      <Elements stripe={promise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
