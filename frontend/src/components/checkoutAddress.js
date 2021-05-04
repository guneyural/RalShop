import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsPlusCircle, BsPencil, BsTrash } from "react-icons/bs";
import AddressModal from "../components/AddressModal";
import {
  getAddresses,
  deleteAddress,
  selectAddress as SELECT_ADDRESS,
} from "../redux/actions/addressActions";

const CheckoutAddress = ({ setIsModalActive }) => {
  const Address = useSelector((state) => state.Address);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState();
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [editedItem, setEditedItem] = useState();

  useEffect(() => {
    dispatch(getAddresses());
  }, []);
  useEffect(() => {
    if (Address.addresses.length > 0) {
      const index = parseInt(localStorage.getItem("selected-address-index"));
      setSelectedAddress(
        Address.addresses[
          index
            ? isNaN(index)
              ? 0
              : index > Address.addresses.length
              ? 0
              : index
            : 0
        ]
      );
    } else {
      setSelectedAddress();
    }
  }, [Address.addresses]);
  useEffect(() => {
    dispatch(SELECT_ADDRESS(selectedAddress));
  }, [selectedAddress]);
  function removeAddress(id) {
    dispatch(deleteAddress(id));
  }
  function selectAddress(item, index) {
    setSelectedAddress(item);
    localStorage.setItem("selected-address-index", index);
  }
  function editAddress(item) {
    setIsEditModalActive(true);
    setEditedItem(item);
  }

  return (
    <>
      {isEditModalActive && (
        <AddressModal
          setIsModalActive={setIsEditModalActive}
          isEdit={true}
          selectedAddress={editedItem}
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
                onClick={() => setIsModalActive(true)}
              >
                <BsPlusCircle style={{ fontSize: "50px" }} />
                <p style={{ fontSize: "13px" }}>Create new address</p>
              </div>
            </div>
            {Address.addresses.length > 0 ? (
              Address.addresses.map((item, index) => {
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
                          onClick={() => editAddress(item)}
                        >
                          <BsPencil />
                        </button>
                        <button
                          className="address-edit-btn"
                          onClick={() => removeAddress(item._id)}
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
    </>
  );
};

export default CheckoutAddress;
