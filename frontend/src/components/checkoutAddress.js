import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsPlusCircle, BsPencil } from "react-icons/bs";

const CheckoutAddress = () => {
  const [addresses, setAddresses] = useState([
    {
      name: "Güney",
      surname: "Ural",
      phoneNumber: "+90 545 375 64 01",
      address:
        "Güllübağlar Mahallesi, Yazıcılar Sokak, NO:26, Daire 4, Pendik/İstanbul",
      addressHeader: "ASFAS ASF AS AS FASFASASFAS",
    },
  ]);

  return (
    <div className="checkout-address-section">
      <div className="checkout-address-section-top">
        <span>Delivery Address</span>
      </div>
      <div className="checkout-address-section-center">
        <div className="row">
          <div className="col-md-4 mt-3 address-item">
            <div className="checkout-address-box create-address">
              <BsPlusCircle style={{ fontSize: "50px" }} />
              <p style={{ fontSize: "13px" }}>Create new address</p>
            </div>
          </div>
          {addresses.length > 0 ? (
            addresses.map((item, index) => {
              return (
                <div className="col-md-4 mt-3 address-item" key={index}>
                  <section>
                    <span style={{ fontSize: "14px" }}>
                      {item.addressHeader.length > 13
                        ? `${item.addressHeader.substring(0, 13)}...`
                        : item.addressHeader}
                    </span>
                    <button className="address-edit-btn">
                      <BsPencil />
                    </button>
                  </section>
                  <div className="checkout-address-box">
                    <p>
                      {item.name} {item.surname}
                    </p>
                    <p>{item.phoneNumber}</p>
                    <p>
                      {item.address.length > 47
                        ? `${item.address.substring(0, 47)}...`
                        : item.address}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-muted d-inline">Add an address to order</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutAddress;
