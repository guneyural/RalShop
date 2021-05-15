import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfilePageOrderSection = ({ setIsEmpty, isEmpty }) => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.Order);

  useEffect(() => {
    if (Object.keys(orders).length < 1) setIsEmpty(true);
    if (Object.keys(orders) > 0) setIsEmpty(false);
  }, []);

  if (isEmpty) {
    return <h4>No Orders Added</h4>;
  }

  return <h1>Orders</h1>;
};

export default ProfilePageOrderSection;
