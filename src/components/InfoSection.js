import React from "react";
import { IoMdClose } from "react-icons/io";

export default function InfoSection({ setinfoOpen }) {
  return (
    <div className="info">
      <div className="infoTop">
        <span className="closeIcon">
          <IoMdClose onClick={() => setinfoOpen(false)} />
        </span>
        <span className="grpinfo">Group Info</span>
      </div>
      <div className="infoRest">
        <div className="infodetails"></div>
        <div className="infoDesc"></div>
        {/* <div className="members"></div> */}
        <div className="infoFooter"></div>
      </div>
    </div>
  );
}
