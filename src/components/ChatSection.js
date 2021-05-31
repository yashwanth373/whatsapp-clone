import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlinePaperClip } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CgSmileMouthOpen } from "react-icons/cg";
import { MdMic } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
export default function ChatSection({setinfoOpen,width}) {
  let dummyUserId = 2750192;
  const [group] = useState({
    id: "",
    name: "Dance Group",
    img: "",
    users: [],
    createdAt: "",
  });
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      senderId: 2323245,
      message: "Hello World",
      time: "14:52,30/5/2021",
    },
  ]);

  function sendMessage(message) {
    setMessages([...messages, message]);
  }
  return (
        <div className="chat" style={{ width: width }}>
          <TopBar
            name={group.name}
            users={group.users}
            img={group.img}
            setinfoOpen={setinfoOpen}
          />
          <MessageSection messages={messages} dummyUserId={dummyUserId} />
          <SendBar sendMessage={sendMessage} dummyUserId={dummyUserId} />
        </div>
  );
}

function TopBar({ name, users, img, setinfoOpen }) {
  const [ddtoggle, setddtoggle] = useState(false);
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
      <div ref={wref} className="ddMenu">
        <span
          className="ddItem"
          onClick={() => {
            setinfoOpen(true);
            setddtoggle(!ddtoggle);
          }}
        >
          Contact info
        </span>
        <span className="ddItem">Select Messages</span>
        <span className="ddItem">Mute Notifications</span>
        <span className="ddItem">Delete Chat</span>
      </div>
    );
  }
  return (
    <div className="topBar">
      <div onClick={() => setinfoOpen(true)}>
        {img !== "" ? (
          <img className="dp" src={img} alt="dp" />
        ) : (
          <img
            className="dp"
            src="https://lh3.googleusercontent.com/ABlX4ekWIQimPjZ1HlsMLYXibPo2xiWnZ2iny1clXQm2IQTcU2RG0-4S1srWsBQmGAo=s300"
            alt="dp"
          />
        )}
      </div>
      <div
        className="details"
        onClick={() => {
          setinfoOpen(true);
        }}
      >
        <section className="gName">{name}</section>
        <section className="gMembers">
          {users.length !== 0 ? users : "You, Me"}
        </section>
      </div>
      <div className="icons">
        <AiOutlineSearch onClick={() => alert("Search Clicked")} />
        <BiDotsVerticalRounded
          role="button"
          onClick={() => setddtoggle(!ddtoggle)}
        />
      </div>
      {ddtoggle && <DropDown />}
    </div>
  );
}

function MessageSection({ messages, dummyUserId }) {
  const Sent = ({ message }) => {
    return (
      <div className="sent">
        <button className="dd">
          <FiChevronDown className="ddIcon" />
        </button>
        <span className="msg">{message.message}</span>
        <span className="time">{message.time.split(",")[0]}</span>
      </div>
    );
  };
  const Received = ({ message }) => {
    return (
      <div className="received">
        <button className="dd">
          <FiChevronDown className="ddIcon" />
        </button>
        <span className="msg">{message.message}</span>
        <span className="time">{message.time.split(",")[0]}</span>
      </div>
    );
  };
  return (
    <div className="messageSection">
      <div className="message">
        {messages.map((message) =>
          message.message !== "" ? (
            message.senderId === dummyUserId ? (
              <Sent message={message} />
            ) : (
              <Received message={message} />
            )
          ) : null
        )}
      </div>
    </div>
  );
}

function SendBar({ sendMessage, dummyUserId }) {
  const [message, setMessage] = useState({
    id: "",
    senderId: null,
    message: "",
    time: "",
  });
  function handleSubmit(e) {
    let date = new Date();
    sendMessage({
      ...message,
      id: Date.now(),
      message: message.message,
      senderId: dummyUserId,
      time:
        date.getHours() +
        ":" +
        ((date.getMinutes() < 10 ? "0" : "") + date.getMinutes()) +
        "," +
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear(),
    });
    setMessage({
      id: "",
      senderId: "",
      message: "",
      time: "",
    });
    e.preventDefault();
    // setMessage(e.target.value)
  }
  return (
    <div className="sendBar">
      <div className="botIcons">
        <CgSmileMouthOpen />
        <AiOutlinePaperClip />
      </div>
      <div className="form">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          autoComplete="off"
        >
          <input
            type="text"
            name="message"
            className="messageField"
            value={message.message}
            placeholder="Type a message"
            onChange={(e) =>
              setMessage({ ...message, message: e.target.value })
            }
          />
        </form>
      </div>
      <div className="micIcon">
        <MdMic />
      </div>
    </div>
  );
}