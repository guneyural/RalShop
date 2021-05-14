import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddresses, deleteAddress } from "../redux/actions/addressActions";
import { BsPencil, BsTrash } from "react-icons/bs";
import AddressModal from "../components/AddressModal";

const ProfilePageAddressSection = ({ setIsEmpty, isEmpty }) => {
  const dispatch = useDispatch();
  const { deliveryAddresses, billingAddresses, loading, error } = useSelector(
    (state) => state.Address
  );
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [editedItem, setEditedItem] = useState();
  const [isBillingAddress, setIsBillingAddress] = useState(false);

  useEffect(() => {
    dispatch(getAddresses());
  }, []);

  useEffect(() => {
    if (deliveryAddresses.length < 1 && billingAddresses.length < 1) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [deliveryAddresses, billingAddresses]);

  function editAddress(item, billingAddresses) {
    setIsEditModalActive(true);
    setEditedItem(item);
    setIsBillingAddress(billingAddresses);
  }

  function removeAddress(id, isBilling) {
    dispatch(deleteAddress(id, isBilling));
  }

  if (isEmpty) {
    return <h4>No Address Added</h4>;
  }

  return (
    <div>
      <div className="checkout-address-section">
        <div className="checkout-address-section-top">
          <span>Delivery Addresses</span>
        </div>
        {isEditModalActive && (
          <AddressModal
            setIsModalActive={setIsEditModalActive}
            isEdit={true}
            selectedAddress={editedItem}
            isBillingAddress={isBillingAddress}
          />
        )}
        {loading && (
          <>
            <span className="text-muted">Loading...</span>
            <br />
          </>
        )}
        {error && (
          <>
            <span className="text-danger">{error.msg}</span>
            <br />
          </>
        )}
        <div className="checkout-address-section-center">
          <div className="row">
            {deliveryAddresses.length > 0 &&
              deliveryAddresses.map((item, index) => {
                return (
                  <div className="col-md-4 mt-3 ml-3 address-item" key={index}>
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
                    <div className="checkout-address-box">
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
              })}
          </div>
        </div>
      </div>

      <div className="checkout-address-section">
        <div className="checkout-address-section-top">
          <span>Billing Addresses</span>
        </div>
        {isEditModalActive && (
          <AddressModal
            setIsModalActive={setIsEditModalActive}
            isEdit={true}
            selectedAddress={editedItem}
            isBillingAddress={isBillingAddress}
          />
        )}
        {loading && (
          <>
            <span className="text-muted">Loading...</span>
            <br />
          </>
        )}
        {error && (
          <>
            <span className="text-danger">{error.msg}</span>
            <br />
          </>
        )}
        <div className="checkout-address-section-center">
          <div className="row">
            {billingAddresses.length > 0 &&
              billingAddresses.map((item, index) => {
                return (
                  <div className="col-md-4 mt-3 ml-3 address-item" key={index}>
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
                    <div className="checkout-address-box">
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
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageAddressSection;
