import React from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { auth } from "../firebase";

export default function Account({ show, close }) {
  return (
    <div className={`account ${show ? "shown" : ""}`}>
      <div className="header">
        <p className="fs-large ml-1 my-0">Account</p>
        <MdClose className="close-icon mr-1" onClick={close} />
      </div>
      <img
        src="https://picsum.photos/1000/1000"
        className="account-img mt-4"
        alt="."
      />
      <div className="info">
        <div className="info-box">
          <span>Your Name</span>
          <div className="info-content">
            <p className="m-0">{auth.currentUser.displayName}</p>
            <MdEdit className="icon" />
          </div>
        </div>
        <div className="info-box">
          <span>Your Email</span>
          <div className="info-content">
            <p className="m-0">{auth.currentUser.email}</p>
            <MdEdit className="icon" />
          </div>
        </div>
        <div className="info-box">
          <span>Your Bio</span>
          <div className="info-content">
            <p className="m-0">i'm available only for chats</p>
            <MdEdit className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
