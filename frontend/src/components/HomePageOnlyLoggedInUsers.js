import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import ModalBox from "./messageBox";
import styled from "styled-components";
import moment from "moment";
import NoProfilePhoto from "../assets/noProfilePic.jpg";
import { MdSettings } from "react-icons/md";
import { BiLogOut, BiRightArrowAlt } from "react-icons/bi";
import LoadingIcon from "../assets/loading.gif";
import { priceConverter } from "../utils/helpers";
import { MdInfoOutline } from "react-icons/md";
import { TiTick, TiCancel } from "react-icons/ti";
import { FcPackage, FcShipped } from "react-icons/fc";
import { MdLocalShipping } from "react-icons/md";
import { getChatrooms, setActiveChatroom } from "../redux/actions/chatActions";
import Modal from "./messageBox";
import { MdNotifications } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { getOrders } from "../redux/actions/orderActions";

const ProfileBox = styled.div`
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 10px;
  height: 140px;
`;
const Box = styled.div`
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 10px;
  height: 290px;
`;
const WishlistBox = styled.div`
  background: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 10px;
  height: 140px;
`;
const Row = styled.div`
  @media (max-width: 500px) {
    display: flex;
    flex-direction: column;
  }
`;
const RowItem = styled.div`
  padding: 4px;

  @media (max-width: 500px) {
    width: 90%;
    margin: auto;
  }

  @media (max-width: 405px) {
    width: 100%;
  }
`;
const ProfilePhotoSection = styled.div`
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #dedede;
  background: #efefef;
  margin: auto;
`;
const ProfileImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
`;
const ProfileButton = styled.button`
  margin: 0;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  margin-right: 10px !important;
  margin-top: -5px;

  &:focus {
    outline: 0;
  }
`;
const WishlistTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const BoxTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  transition: 0.3s;
  border-radius: 50%;

  &:hover {
    background: #dedede;
  }

  &:focus {
    outline: 0;
  }
`;
const WishlistInner = styled.div`
  margin: -10px;
  margin-top: 2px;
  height: 90px;
  overflow-y: hidden;
  overflow-x: auto;
  padding-left: 10px;
  display: flex;

  &::-webkit-scrollbar {
    height: 2px;
  }
  &::-webkit-scrollbar-track {
    background: #dddddd;
  }
  &::-webkit-scrollbar-thumb {
    background: #acaaaa;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #c2c2c2;
  }
`;
const BoxInner = styled.div`
  margin: -10px;
  margin-top: 2px;
  height: 245px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 10px;
  display: flex;

  &::-webkit-scrollbar {
    height: 2px;
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: #dddddd;
  }
  &::-webkit-scrollbar-thumb {
    background: #acaaaa;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #c2c2c2;
  }
`;
const WishlistImage = styled.img`
  min-height: 90px;
  min-width: 140px;
  object-fit: cover;
  border-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-right: 20px;
  border: 1px solid #dbdbdb;
  cursor: pointer;
`;
const OrderBox = styled.div``;
const OrderItem = styled.div`
  width: 82%;
  margin: auto;
  padding: 3px 8px;
  height: 200px;
  position: relative;
  @media (max-width: 375px) {
    width: 98%;
  }
  @media (max-width: 1000px) {
    height: 320px;
  }
  @media (max-width: 767px) {
    width: 94%;
    height: 265px;
  }
  @media (max-width: 500px) {
    height: 280px;
  }
  @media (max-width: 375px) {
    width: 96%;
    height: 300px;
  }
  @media (max-width: 360px) {
    height: 320px;
  }
`;
const OrderItemImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: contain;
`;
const OrderItemTitle = styled.p`
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 5px;
  overflow: hidden;
  break-word: pre;
  max-height: 85px;
`;
const OrderItemPrice = styled.p`
  font-size: 15px;
  font-weight: bold;
  margin-top: -12px;
`;
const OrderItemColorAndQty = styled.span`
  display: inline-block;
  font-size: 13.5px;
  font-weight: normal;
  position: relative;
  bottom: 2px;
  color: var(--text-muted);
`;
const ColorPreview = styled.span`
  height: 15px;
  width: 15px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  margin: 1px;
  border: 1px solid black;
  position: relative;
  top: 2.5px;
  left: 3px;
`;
const OrderRow = styled.div`
  padding: 3px 8px;
  overflow: hidden;
  -webkit-transition: max-height 0.8s;
  -moz-transition: max-height 0.8s;
  transition: max-height 0.8s;
  transition-delay: 0;
`;
const ChatCount = styled.p`
  font-size: 15.5px;
  color: var(--text-muted);
`;
const InfoText = styled.p`
  margin: auto;
  font-weight: 500;
  color: var(--text-muted);
  text-align: center;
`;
const ChatroomBox = styled.div`
  cursor: pointer;
  display: flex;
  transition: 0.2s;
  padding: 5px;
  &:hover {
    background: #e9e9e9;
  }
  position: relative;
`;
const CompanyName = styled.p`
  font-weight: 500;
`;
const FullName = styled.p`
  margin-top: -20px;
  color: var(--text-muted);
  font-size: 15px;
  font-weight: 400;
`;
const LastMessage = styled.p`
  color: var(--text-muted);
  font-weight: 300;
  margin-top: -15px;
`;
const HomePageOnlyLoggedInUsers = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.Auth);
  const { inSellerRoute } = useSelector((state) => state.Seller);
  const { Chat } = useSelector((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products } = useSelector((state) => state.Wishlist);
  const dispatch = useDispatch();
  const { orders, loading: isLoading } = useSelector((state) => state.Order);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    dispatch(getOrders());
    dispatch(getChatrooms(inSellerRoute));
  }, []);

  useEffect(() => {
    setNotifications(Chat.notifications);
  }, [Chat.notifications]);

  const activeChat = (roomId, participant) => {
    dispatch(setActiveChatroom(roomId, participant, inSellerRoute));
    history.push(
      inSellerRoute
        ? `/chat/seller/message/${roomId}`
        : `/chat/message/${roomId}`
    );
  };

  return (
    <Row className="mt-4 row">
      {isModalOpen && (
        <ModalBox
          isRedux={true}
          action={logoutUser}
          message={"Do you want to logout?"}
          setIsModalOpen={setIsModalOpen}
          header={"Logout"}
          btnText={"Logout"}
        />
      )}
      <RowItem className="col-lg-4 col-md-5 col-6 mb-2">
        <ProfileBox>
          <div className="row">
            <div className="col-sm-5 col-6">
              <ProfilePhotoSection>
                <ProfileImage
                  src={
                    user.hasPhoto !== null
                      ? user.hasPhoto
                        ? user.profilePhoto.url
                        : NoProfilePhoto
                      : NoProfilePhoto
                  }
                  alt="profile img"
                />
              </ProfilePhotoSection>
            </div>
            <div className="col-sm-7 col-6">
              <p>
                <b>{user.username}</b>
                <p
                  className="m-0 p-0"
                  style={{
                    marginTop: "-8px",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  Member since {moment(user.createdAt).format("ll")}
                </p>
              </p>
              <ProfileButton
                className="m-0"
                onClick={() => history.push("/account/settings")}
              >
                <MdSettings
                  style={{ display: "inline-block", marginTop: "-2px" }}
                />{" "}
                Settings
              </ProfileButton>
              <ProfileButton
                className="m-0"
                onClick={() => setIsModalOpen(true)}
              >
                <BiLogOut /> Logout
              </ProfileButton>
            </div>
          </div>
        </ProfileBox>
      </RowItem>
      <RowItem className="col-lg-8 col-md-7 col-6 mb-2">
        <WishlistBox>
          <WishlistTop>
            <p className="m-0">
              <b>Wishlist</b>
            </p>

            <ArrowButton onClick={() => history.push("/wishlist")}>
              <BiRightArrowAlt
                style={{ fontSize: "30px", fontWeight: "bolder" }}
              />
            </ArrowButton>
          </WishlistTop>
          <WishlistInner
            style={
              products.length === 0
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {}
            }
          >
            {products.length === 0 ? (
              <div style={{ fontSize: "18px", textAlign: "center" }}>
                <p style={{ margin: "0" }}>
                  No products added to your wishlist.
                </p>
                <p style={{ margin: "0", fontSize: "16px" }}>Start Shopping.</p>
              </div>
            ) : (
              products.map((item, index) => {
                return (
                  <WishlistImage
                    key={index}
                    src={item.images[0].url}
                    alt="wishlist product"
                    onClick={() => history.push(`/product/${item._id}`)}
                  />
                );
              })
            )}
          </WishlistInner>
        </WishlistBox>
      </RowItem>
      <RowItem className="col-lg-8 col-md-8 col-6 mb-2">
        <Box>
          <BoxTop>
            <p className="m-0">
              <b>Last Order</b>
            </p>
            <ArrowButton onClick={() => history.push("/user/orders")}>
              <BiRightArrowAlt
                style={{ fontSize: "30px", fontWeight: "bolder" }}
              />
            </ArrowButton>
          </BoxTop>
          <BoxInner
            style={
              isLoading || Object.keys(orders).length === 0
                ? {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }
                : {}
            }
          >
            {Object.keys(orders).length === 0 && !isLoading && (
              <p style={{ fontSize: "18px", textAlign: "center" }}>
                You don't have any orders.
              </p>
            )}
            {isLoading ? (
              <img
                src={LoadingIcon}
                alt="loading spinner"
                height="120"
                width="120"
              />
            ) : (
              Object.keys(orders).map((order, index) => {
                if (index === 0) {
                  return (
                    <div key={index}>
                      <OrderBox
                        style={index === 0 ? { marginTop: "35px" } : {}}
                      >
                        <OrderRow className="row">
                          {orders[order][0].order.note && (
                            <span
                              style={{
                                fontSize: "14px",
                                color: "var(--text-muted)",
                              }}
                            >
                              <span
                                style={{ fontSize: "20px", color: "black" }}
                              >
                                <b>
                                  <MdInfoOutline />
                                </b>
                              </span>{" "}
                              {orders[order][0].order.note}
                            </span>
                          )}
                          {orders[order].map((orderItem, idx) => {
                            return (
                              <div className="col-md-6 p-0 m-0" key={idx}>
                                <OrderItem>
                                  <Link
                                    to={`/product/${orderItem.order.Product.product._id}`}
                                  >
                                    <OrderItemImage
                                      src={
                                        orderItem.order.Product.product
                                          .images[0].url
                                      }
                                      alt="product"
                                    />
                                  </Link>
                                  <OrderItemTitle>
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: "#333",
                                      }}
                                    >
                                      {orderItem.order.seller.companyName}
                                    </span>{" "}
                                    {orderItem.order.Product.product.title
                                      .length > 55
                                      ? `${orderItem.order.Product.product.title.substring(
                                          0,
                                          55
                                        )}...`
                                      : orderItem.order.Product.product.title}
                                  </OrderItemTitle>
                                  <OrderItemPrice>
                                    {priceConverter(
                                      orderItem.order.Product.product.price
                                    )}{" "}
                                    -{" "}
                                    <OrderItemColorAndQty>
                                      qty: {orderItem.order.Product.quantity}
                                    </OrderItemColorAndQty>
                                    <ColorPreview
                                      style={{
                                        background:
                                          "#" + orderItem.order.Product.color,
                                      }}
                                    />
                                  </OrderItemPrice>
                                  <OrderItemPrice
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "normal",
                                      }}
                                    >
                                      {orderItem.order.status ===
                                        "waitingConfirmation" &&
                                        "Waiting confirmation by seller"}
                                      {orderItem.order.status ===
                                        "cancelRequest" &&
                                        "Waiting confirmation by seller to confirm cancellation"}
                                      {orderItem.order.status ===
                                        "confirmed" && (
                                        <>
                                          <TiTick
                                            style={{
                                              fontSize: "18px",
                                              color: "black",
                                              fontWeight: "bold",
                                            }}
                                          />{" "}
                                          Order confirmed by the seller
                                        </>
                                      )}
                                      {orderItem.order.status ===
                                        "cancelled" && (
                                        <>
                                          <TiCancel
                                            style={{
                                              fontSize: "18px",
                                              color: "red",
                                              fontWeight: "bold",
                                            }}
                                          />{" "}
                                          Order is cancelled
                                        </>
                                      )}
                                      {orderItem.order.status === "packing" && (
                                        <>
                                          <FcPackage /> Order is packing
                                        </>
                                      )}
                                      {orderItem.order.status === "shipped" && (
                                        <>
                                          <MdLocalShipping
                                            style={{
                                              fontSize: "18px",
                                              fontWeight: "bold",
                                            }}
                                          />{" "}
                                          Order is shipped
                                        </>
                                      )}
                                      {orderItem.order.status ===
                                        "delivered" && (
                                        <>
                                          <FcShipped
                                            style={{
                                              fontSize: "18px",
                                              fontWeight: "bold",
                                            }}
                                          />{" "}
                                          Order is delivered
                                        </>
                                      )}
                                    </span>
                                  </OrderItemPrice>
                                </OrderItem>
                              </div>
                            );
                          })}
                        </OrderRow>
                      </OrderBox>
                    </div>
                  );
                }
              })
            )}
          </BoxInner>
        </Box>
      </RowItem>
      <RowItem className="col-lg-4 col-md-4 col-6">
        <Box>
          <BoxTop>
            <p className="m-0">
              <b>Messages</b>{" "}
              {notifications.length > 0 && (
                <MdNotifications
                  style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}
                />
              )}
            </p>
            <ArrowButton onClick={() => history.push("/chat")}>
              <BiRightArrowAlt
                style={{ fontSize: "30px", fontWeight: "bolder" }}
              />
            </ArrowButton>
          </BoxTop>
          <BoxInner
            style={
              Chat.loading || Chat.chatrooms.length === 0
                ? {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }
                : { display: "block" }
            }
          >
            {Chat.loading ? (
              <img
                src={LoadingIcon}
                alt="loading spinner"
                height="120"
                width="120"
              />
            ) : (
              <>
                <ChatCount>{Chat.chatrooms.length} Chats</ChatCount>
                <div className="main-area">
                  {Chat.chatrooms.length >= 1 &&
                    Chat.chatrooms.map((room, index) => {
                      return (
                        <ChatroomBox
                          key={index}
                          className={
                            notifications.some(
                              (notif) => notif.chatroom === room.chatroom._id
                            )
                              ? "border-bottom chatroom-highlight"
                              : "border-bottom"
                          }
                          onClick={() =>
                            activeChat(
                              room.chatroom._id,
                              inSellerRoute
                                ? room.chatroom.creator
                                : room.chatroom.participant
                            )
                          }
                        >
                          <section>
                            <BiMessageDetail
                              style={{
                                height: "30px",
                                width: "30px",
                                marginTop: "50%",
                              }}
                            />
                            {notifications.some(
                              (notification) =>
                                notification.chatroom === room.chatroom._id
                            ) && (
                              <MdNotifications
                                style={{ color: "#c9222b", fontSize: "22px" }}
                              />
                            )}
                          </section>
                          <section
                            style={{ paddingLeft: "15px", paddingTop: "5px" }}
                          >
                            <CompanyName>
                              {inSellerRoute
                                ? room.chatroom.creator.username
                                : room.chatroom.participant.companyName}
                            </CompanyName>
                            {!inSellerRoute && (
                              <FullName>
                                {room.chatroom.participant.fullname}
                              </FullName>
                            )}
                            {room.lastMessage !== null &&
                              (room.lastMessage.isPhoto ? (
                                <LastMessage>A Photo Has Been Sent</LastMessage>
                              ) : (
                                <LastMessage>
                                  {room.lastMessage.body.length > 18
                                    ? `${room.lastMessage.body.substring(
                                        0,
                                        18
                                      )}...`
                                    : room.lastMessage.body}
                                </LastMessage>
                              ))}
                          </section>
                          <HiDotsVertical
                            style={{
                              position: "absolute",
                              right: "0",
                              paddingTop: "5px",
                              fontSize: "24px",
                            }}
                          />
                        </ChatroomBox>
                      );
                    })}
                </div>
              </>
            )}
            {Chat.chatrooms.length === 0 && !Chat.loading && (
              <p style={{ fontSize: "18px" }}>
                You didn't send message to any seller
              </p>
            )}
          </BoxInner>
        </Box>
      </RowItem>
    </Row>
  );
};

export default HomePageOnlyLoggedInUsers;
