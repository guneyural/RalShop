import react, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddress as CREATE_ADDRESS,
  updateAddress,
} from "../redux/actions/addressActions";
import { GrClose } from "react-icons/gr";
import { countries } from "../data/countries";
import styled from "styled-components";

const Labels = styled.label`
  font-weight: 500;
`;
const InputField = styled.input`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 90%;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const InputFieldFullWidth = styled.input`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 95%;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const TextField = styled.textarea`
  padding: 4px 12px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 95%;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const Select = styled.select`
  padding: 4px 5px;
  border-radius: 3px;
  background: #efefef;
  border: 1px solid #c2c2c2;
  width: 90%;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const Button = styled.button`
  width: 95%;
  text-align: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const InformationText = styled.span`
  display: block;
  margin-top: -15px;
`;

const AddressModal = ({ setIsModalActive, isEdit, selectedAddress }) => {
  const dispatch = useDispatch();
  const { Address, lastAction } = useSelector((state) => state);
  const [name, setName] = useState(isEdit ? selectedAddress.name : "");
  const [surname, setSurname] = useState(isEdit ? selectedAddress.surname : "");
  const [country, setCountry] = useState(isEdit ? selectedAddress.country : "");
  const [phoneNumber, setPhoneNumber] = useState(
    isEdit ? selectedAddress.phoneNumber : ""
  );
  const [addressHeader, setAddressHeader] = useState(
    isEdit ? selectedAddress.addressHeader : ""
  );
  const [addressDetails, setAddressDetails] = useState(
    isEdit ? selectedAddress.address : ""
  );
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    // Close the modal when user presses ESC
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 27) {
        setIsModalActive(false);
      }
    });
  }, []);
  useEffect(() => {
    if (isButtonClicked) {
      if (lastAction === "CREATE_ADDRESS" || lastAction === "UPDATE_ADDRESS") {
        setIsModalActive(false);
        setIsButtonClicked(false);
      }
    }
  }, [lastAction]);

  function createAddress(e) {
    e.preventDefault();
    setIsButtonClicked(true);
    const addressObject = {
      name,
      surname,
      country,
      phoneNumber,
      address: addressDetails,
      addressHeader,
    };
    dispatch(CREATE_ADDRESS(addressObject));
  }
  function editAddress(e) {
    e.preventDefault();
    setIsButtonClicked(true);
    const addressObject = {
      name,
      surname,
      country,
      phoneNumber,
      address: addressDetails,
      addressHeader,
    };
    dispatch(updateAddress(selectedAddress._id, addressObject));
  }

  return (
    <div className="address-modal-background">
      <div className="address-modal">
        <div className="address-modal-top">
          <h6>{isEdit ? "Edit address" : "Create new address"}</h6>
          <button onClick={() => setIsModalActive(false)}>
            <GrClose />
          </button>
        </div>
        <div className="address-modal-center">
          <form onSubmit={(e) => (isEdit ? editAddress(e) : createAddress(e))}>
            <div className="row">
              <div className="col-md-6 mt-2">
                <Labels htmlFor="name">Name</Labels>
                <InputField
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mt-2">
                <Labels htmlFor="surname">Surname</Labels>
                <InputField
                  type="text"
                  placeholder="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mt-2">
                <Labels htmlFor="country">Country</Labels>
                <Select
                  name="country"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  <option value="">Select Your Country</option>
                  {countries.map((item, idx) => {
                    return (
                      <option
                        value={item.code}
                        key={idx}
                      >{`${item.code} - ${item.name}`}</option>
                    );
                  })}
                </Select>
              </div>
              <div className="col-md-6 mt-2">
                <Labels htmlFor="surname">Phone Number</Labels>
                <InputField
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-2">
                <Labels htmlFor="addressHeader">Address Header</Labels>
                <InputFieldFullWidth
                  type="text"
                  placeholder="Address Header"
                  value={addressHeader}
                  onChange={(e) => setAddressHeader(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-2">
                <Labels htmlFor="addressHeader">Address</Labels>
                <TextField
                  placeholder="Address Details"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  required
                ></TextField>
              </div>
              <div className="mt-3">
                {Address.loading && (
                  <InformationText className="text-muted">
                    Loading...
                  </InformationText>
                )}
                {Address.error && (
                  <InformationText className="text-danger">
                    {Address.error.msg}
                  </InformationText>
                )}
                <Button className="default-btn">
                  {isEdit ? "Edit" : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
