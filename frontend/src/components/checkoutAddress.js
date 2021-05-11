import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsPlusCircle, BsPencil, BsTrash } from "react-icons/bs";
import AddressModal from "../components/AddressModal";
import {
  getAddresses,
  deleteAddress,
  selectAddress as SELECT_ADDRESS,
  selectBillingAddress as SELECT_BILLING_ADDRESS,
} from "../redux/actions/addressActions";

const CheckoutAddress = ({
  setIsModalActive,
  isBillingAddress,
  setIsBillingAddress,
}) => {
  const Address = useSelector((state) => state.Address);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState();
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [editedItem, setEditedItem] = useState();
  const [selectedBillingAddress, setSelectedBillingAddress] = useState();

  useEffect(() => {
    dispatch(getAddresses());
  }, []);
  useEffect(() => {
    if (Address.deliveryAddresses.length > 0) {
      const index = parseInt(localStorage.getItem("selected-address-index"));
      setSelectedAddress(
        Address.deliveryAddresses[
          index
            ? isNaN(index)
              ? 0
              : index > Address.deliveryAddresses.length
              ? 0
              : index
            : 0
        ]
      );
    } else {
      setSelectedAddress();
    }
  }, [Address.deliveryAddresses]);
  useEffect(() => {
    dispatch(SELECT_ADDRESS(selectedAddress));
  }, [selectedAddress]);
  function removeAddress(id, isBilling) {
    dispatch(deleteAddress(id, isBilling));
  }
  function selectAddress(item, index) {
    setSelectedAddress(item);
    localStorage.setItem("selected-address-index", index);
  }
  function selectBillingAddress(item) {
    setSelectedBillingAddress(item);
    dispatch(SELECT_BILLING_ADDRESS(item));
  }
  function editAddress(item, billingAddresses) {
    setIsEditModalActive(true);
    setEditedItem(item);
    setIsBillingAddress(billingAddresses);
  }
  function createNewAddress(billingAddresses) {
    setIsModalActive(true);
    setIsBillingAddress(billingAddresses);
  }

  return (
    <>
      {isEditModalActive && (
        <AddressModal
          setIsModalActive={setIsEditModalActive}
          isEdit={true}
          selectedAddress={editedItem}
          isBillingAddress={isBillingAddress}
        />
      )}
      {Address.loading && (
        <>
          <span className="text-muted">Loading...</span>
          <br />
        </>
      )}
      {Address.error && (
        <>
          <span className="text-danger">{Address.error.msg}</span>
          <br />
        </>
      )}
      <span className="text-muted" style={{ fontSize: "14px" }}>
        Selected address will have darker background. Click over address to
        select.
      </span>
      <div className="checkout-address-section">
        <div className="checkout-address-section-top">
          <span>Delivery Address</span>
        </div>
        <div className="checkout-address-section-center">
          <div className="row">
            <div className="col-md-4 mt-3 address-item">
              <div
                className="checkout-address-box create-address"
                onClick={() => createNewAddress(false)}
              >
                <BsPlusCircle style={{ fontSize: "50px" }} />
                <p style={{ fontSize: "13px" }}>Create new address</p>
              </div>
            </div>
            {Address.deliveryAddresses.length > 0 ? (
              Address.deliveryAddresses.map((item, index) => {
                return (
                  <div
                    className={`col-md-4 mt-3 address-item ${
                      selectedAddress !== undefined &&
                      item._id === selectedAddress._id &&
                      "selected-address"
                    }`}
                    key={index}
                  >
                    <section>
                      <span
                        style={{ fontSize: "12px" }}
                        className="address-header"
                      >
                        {item.addressHeader.length > 12
                          ? `${item.addressHeader.substring(0, 12)}...`
                          : item.addressHeader}
                      </span>
                      <div>
                        <button
                          className="address-edit-btn"
                          onClick={() => editAddress(item, false)}
                        >
                          <BsPencil />
                        </button>
                        <button
                          className="address-edit-btn"
                          onClick={() => removeAddress(item._id, false)}
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </section>
                    <div
                      className="checkout-address-box"
                      onClick={() => selectAddress(item, index)}
                    >
                      <p>
                        {item.name} {item.surname}
                      </p>
                      <p>{item.phoneNumber}</p>
                      <p>{item.email}</p>
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
              <span className="text-muted d-inline">
                Add an address to order
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="checkout-address-section">
        <div className="checkout-address-section-top">
          <span>Billing Address</span>
        </div>

        <div className="checkout-address-section-center">
          <div className="row">
            <div className="col-md-4 mt-3 address-item">
              <div
                className="checkout-address-box create-address"
                onClick={() => createNewAddress(true)}
              >
                <BsPlusCircle style={{ fontSize: "50px" }} />
                <p style={{ fontSize: "13px" }}>Create new address</p>
              </div>
            </div>
            {Address.billingAddresses.length > 0 ? (
              Address.billingAddresses.map((item, index) => {
                return (
                  <div
                    className={`col-md-4 mt-3 address-item ${
                      selectedBillingAddress !== undefined &&
                      item._id === selectedBillingAddress._id &&
                      "selected-address"
                    }`}
                    key={index}
                  >
                    <section>
                      <span
                        style={{ fontSize: "12px" }}
                        className="address-header"
                      >
                        {item.addressHeader.length > 12
                          ? `${item.addressHeader.substring(0, 12)}...`
                          : item.addressHeader}
                      </span>
                      <div>
                        <button
                          className="address-edit-btn"
                          onClick={() => editAddress(item, true)}
                        >
                          <BsPencil />
                        </button>
                        <button
                          className="address-edit-btn"
                          onClick={() => removeAddress(item._id, true)}
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </section>
                    <div
                      className="checkout-address-box"
                      onClick={() => selectBillingAddress(item)}
                    >
                      <p>
                        {item.name} {item.surname}
                      </p>
                      <p>{item.phoneNumber}</p>
                      <p>{item.email}</p>
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
              <span className="text-muted d-inline">
                Add an billing address to order
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutAddress;
