import React from "react";
import styled from "styled-components";
import {
  MdLocalShipping,
  MdComment,
  MdLocationOn,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { useHistory, useLocation } from "react-router-dom";

const NavbarItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text-muted);
  transition: 0.2s;
  cursor: pointer;
  padding: 0;
  margin: 0;
  margin-left: 10px;

  &:hover {
    color: black;
    box-shadow: inset 0px -1.3px 0px var(--text-muted);
  }
`;

const NavLinks = [
  { name: "Orders", icon: <MdLocalShipping />, pushTo: "/orders" },
  { name: "Reviews", icon: <MdComment />, pushTo: "/reviews" },
  { name: "Addresses", icon: <MdLocationOn />, pushTo: "/addresses" },
];

const ProfilePageNavbar = () => {
  const history = useHistory();
  const location = useLocation();

  const changePage = (pushTo) => {
    history.push(location.pathname + pushTo);
  };

  return (
    <div style={{ width: "120px" }}>
      <ul style={{ padding: "0", margin: "0" }}>
        {NavLinks.map((navLink, index) => {
          return (
            <NavbarItem
              key={index}
              onClick={() => changePage(navLink.pushTo)}
              className="mt-3"
            >
              {navLink.icon}
              <span>{navLink.name}</span>
              <MdKeyboardArrowRight />
            </NavbarItem>
          );
        })}
      </ul>
    </div>
  );
};

export default ProfilePageNavbar;
