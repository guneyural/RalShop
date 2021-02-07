import React, { useState, useEffect } from "react";
import ProfileSettingsSection from "../components/profileSettings";
import PasswordSettingsSection from "../components/passwordSettings";

const ProfileSettings = () => {
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    document.querySelectorAll(`.settings-nav li`).forEach((item) => {
      item.classList.remove("settings-tab-active");
    });
    document
      .querySelector(`.settings-nav li[data-tab="${tab}"]`)
      .classList.add("settings-tab-active");
  }, [tab]);

  const changeTab = (tabName) => {
    setTab(tabName);
  };

  return (
    <div className="profile-settings-section">
      <section className="settings-nav mb-2">
        <ul>
          <li data-tab="profile" onClick={() => changeTab("profile")}>
            Profile
          </li>
          <li data-tab="password" onClick={() => changeTab("password")}>
            Password
          </li>
        </ul>
      </section>
      {tab === "profile" && <ProfileSettingsSection />}
      {tab === "password" && <PasswordSettingsSection />}
    </div>
  );
};

export default ProfileSettings;
