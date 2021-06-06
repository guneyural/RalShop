import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import LoadingIcon from "../assets/loading.gif";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { createOrder } from "../redux/actions/orderActions";

const Labels = styled.label`
  font-size: 15px;
`;
const InputField = styled.input`
  padding: 9px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 100%;
`;

export default function CheckoutForm() {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const Address = useSelector((state) => state.Address.selectedDeliveryAddress);
  const BillingAddress = useSelector(
    (state) => state.Address.selectedBillingAddress
  );
  const cartProducts = useSelector((state) => state.Cart.products);
  const User = useSelector((state) => state.Auth.user);
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    window
      .fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-token": localStorage.getItem("user-token"),
        },
        body: JSON.stringify({
          items: cartProducts.filter((product) => product.selected === true),
          shippingFee: 4.99,
          shippingAddress: {
            address: {
              city: Address.city,
              country: Address.country,
              line1: Address.address,
              postal_code: "35890",
              state: Address.state,
            },
            name: `${Address.name} ${Address.surname}`,
            phone: Address.phoneNumber,
          },
          address: {
            line1: BillingAddress.address,
            postal_code: "34890",
            state: BillingAddress.state,
            country: BillingAddress.country,
            city: BillingAddress.city,
          },
          email: BillingAddress.email,
          name: `${BillingAddress.name} ${BillingAddress.surname}`,
          phone: BillingAddress.phoneNumber,
        }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setCustomerId(data.customer);
        setPaymentIntentId(data.paymentIntentId);
      });
  }, []);

  const cardStyle = {
    hidePostalCode: true,
    style: {
      base: {
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#333333",
        iconColor: "#fa755a",
      },
    },
  };
  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      receipt_email: billingEmail,
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name,
          phone: BillingAddress.phoneNumber,
          email: billingEmail,
          address: {
            line1: BillingAddress.address,
            postal_code: "34890",
            state: BillingAddress.state,
            country: BillingAddress.country,
            city: BillingAddress.city,
          },
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      axios
        .post(
          "https://ural-shop.herokuapp.com/api/stripe/create-invoice",
          {
            items: cartProducts.filter((product) => product.selected === true),
            paymentIntentId,
            customerId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "user-token": localStorage.getItem("user-token"),
            },
          }
        )
        .then((res) => res.data)
        .then((data) => {
          setError(null);
          setProcessing(false);
          setSucceeded(true);
          setSuccessMessage("Payment Succeeded. Creating Order...");

          const orderedProducts = cartProducts.filter(
            (product) => product.selected === true
          );
          let total_amount = 0;
          let orderedProductCount = 0;
          let groupId = uuidv4();
          orderedProducts.forEach(
            (item) => (total_amount += item.price * item.qty)
          );

          orderedProducts.forEach((item) => {
            const orderData = {
              billingAddress: BillingAddress,
              deliveryAddress: Address,
              user: User._id,
              invoiceId: data,
              paymentIntentId,
              seller: item.seller,
              Product: {
                product: item.product,
                color: item.color,
                quantity: item.qty,
              },
              totalAmount: total_amount + 4.99,
              groupId,
            };
            dispatch(createOrder(orderData));
            orderedProductCount++;
          });

          if (orderedProductCount === orderedProducts.length) {
            setSuccessMessage("Products Ordered. Redirecting...");
            setTimeout(() => {
              history.push("/user/orders");
            }, [1000]);
          }
        })
        .catch((err) => {
          setError(null);
          setProcessing(false);
          setSucceeded(false);
        });
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="mt-3">
      <div className="row">
        <div className="col-lg-6">
          <Labels htmlFor="billingEmail">
            Card Holder Email (Email address of the card owner)*
          </Labels>
          <InputField
            type="email"
            id="billingEmail"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            placeholder="Enter email address of the card owner"
            required
          />
          <Labels htmlFor="name" className="mt-3">
            Card Holder Name (Name on the card)*
          </Labels>
          <InputField
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the name on the card"
            required
          />
        </div>
        <div className="col-lg-6 card-information-section">
          <CardElement
            id="card-element"
            options={cardStyle}
            onChange={handleChange}
            className="mt-3"
          />
        </div>
      </div>
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
        className="default-btn"
      >
        <span id="button-text">Pay now</span>
      </button>
      {successMessage && (
        <div className="text-success" style={{ fontWeight: "bold" }}>
          {successMessage}
        </div>
      )}
      {processing && (
        <img src={LoadingIcon} alt="Loading..." height="50" width="50" />
      )}
      {error && (
        <div className="card-error text-danger" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
