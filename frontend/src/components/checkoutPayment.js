import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./stripeCheckoutForm";

const promise = loadStripe("pk_test_6XtghloNmnIJt2Bov5bGRCAg00ozfbAMRE");
export default function CheckoutPayment() {
  return (
    <div className="App">
      <Elements stripe={promise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
