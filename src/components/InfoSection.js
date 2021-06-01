import React, { useState, useEffect, useRef } from "react";
import { IoMdClose, IoMdThumbsDown } from "react-icons/io";
import { IoExitOutline, IoCamera } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { GrCheckmark } from "react-icons/gr";

export default function InfoSection({ setinfoOpen }) {
  const [ddtoggle, setddtoggle] = useState(false);
  const [editgname, setEditgname] = useState(false);
  const [editgdesc, setEditgdesc] = useState(false);
  const [group, setGroup] = useState({
    id: "",
    name: "Dance Group",
    desc: "",
    img: "",
    users: [],
    createdAt: "10:56,26/03/2021",
  });
  const wref = useRef(null);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setddtoggle(!ddtoggle);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, ddtoggle]);
  }
  useOutsideAlerter(wref);
  function DropDown() {
    return (
      <div ref={wref} className="dpdd">
        <span className="dpddItem">Upload Photo</span>
      </div>
    );
  }
  function Edit({ value,changefield }) {
    function handleSubmit(e){
      if(changefield==="name"){
        setGroup({ ...group, name: e.target.value });
      }
      else if(changefield==="desc"){
        setGroup({ ...group, desc: e.target.value });
      }
      
      e.preventDefault();

    }
    if(changefield==="name"){
      return (
        <div className="editform">
          <form autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              maxLength="15"
              autoFocus="autoFocus"
              name="editgname"
              className="editgname"
              value={value}
              onChange={(e) => setGroup({ ...group, name: e.target.value })}
            />
          </form>
        </div>
      );

    }
    else if(changefield==="desc"){
      return (
        <div className="editform">
          <form autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              autoFocus="autoFocus"
              name="editgdesc"
              className="editgdesc"
              value={value}
              onChange={(e) => setGroup({ ...group, desc: e.target.value })}
            />
          </form>
        </div>
      );

    }
    
  }
  return (
    <div className="info">
      <div className="infoTop">
        <span className="closeIcon">
          <IoMdClose onClick={() => setinfoOpen(false)} />
        </span>
        <span className="grpinfo">Group Info</span>
      </div>
      <div className="infoRest">
        <div className="infodetails">
          <div className="infodp">
            {group.img !== "" ? (
              <img src={group.img} alt="dp" />
            ) : (
              <img
                src="https://lh3.googleusercontent.com/ABlX4ekWIQimPjZ1HlsMLYXibPo2xiWnZ2iny1clXQm2IQTcU2RG0-4S1srWsBQmGAo=s300"
                alt="dp"
              />
            )}
            <div className="dphover" onClick={() => setddtoggle(true)}>
              <div>
                <IoCamera className="camicon" />
              </div>
              <div className="changedp">CHANGE GROUP</div>
              <div className="changedp">ICON</div>
            </div>
          </div>
          {ddtoggle && <DropDown />}
          <div className="infomain">
            <div className="infogname">
              <span className="infoname">
                {editgname ? (
                  <Edit changefield={"name"} value={group.name} />
                ) : (
                  group.name
                )}
              </span>
              <span className="infodate">
                Created {group.createdAt.split(",")[1]} at{" "}
                {group.createdAt.split(",")[0]}
              </span>
            </div>
            <span
              className="editicon"
              onClick={() => {
                setEditgname(!editgname);
              }}
            >
              {!editgname ? <MdEdit /> : <GrCheckmark />}
            </span>
          </div>
        </div>
        <div className="infoDesc">
          <div className="infoadesc">
            <span className="desc">Description</span>
            <span className="gdesc">
              {editgdesc ? (
                <Edit changefield={"desc"} value={group.desc} />
              ) : group.desc ==="" ? (
                "Add group description"
              ) : (
                <div className="agdesc">{group.desc}</div>
              )}
            </span>
          </div>
          <span
            className="editicon"
            onClick={() => {
              setEditgdesc(!editgdesc);
            }}
          >
            {!editgdesc ? <MdEdit /> : <GrCheckmark />}
          </span>
        </div>
        {/* <div className="members"></div> */}
        <div className="infoFooter">
          <div className="exitbutton">
            <span className="exiticon">
              <IoExitOutline />
            </span>
            <span className="exit"> Exit group</span>
          </div>
          <div className="reportbutton">
            <span className="reporticon">
              <IoMdThumbsDown />
            </span>
            <span className="report"> Report group</span>
          </div>
        </div>
      </div>
    </div>
  );
}
