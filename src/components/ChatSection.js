import React, { useState } from "react";
import { AiOutlineSearch, AiOutlinePaperClip } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CgSmileMouthOpen } from "react-icons/cg";
import { MdMic } from "react-icons/md";
export default function ChatSection() {
  const [group, setGroup] = useState({
    id: "",
    name: "Dance Group",
    img: "",
    users: [],
    createdAt: "",
  });
  const [messages, setMessages] = useState([]);
  function sendMessage(message) {
    console.log(message);
    setMessages([...messages,message])
  }
  return (
    <div className="chat">
      <TopBar name={group.name} users={group.users} img={group.img} />
      <MessageSection messages={messages}/>
      <SendBar sendMessage={sendMessage} />
    </div>
  );
}

function TopBar({ name, users, img }) {
  return (
    <div className="topBar">
      <div onClick={() => alert("dp clicked")}>
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
          alert("Details clicked");
        }}
      >
        <section className="gName">{name}</section>
        <section className="gMembers">
          {users.length !== 0 ? users : "You, Me"}
        </section>
      </div>
      <div className="icons">
        <AiOutlineSearch onClick={() => alert("Search Clicked")} />
        <BiDotsVerticalRounded onClick={() => alert("Options Clicked")} />
      </div>
    </div>
  );
}

function MessageSection() {
  return <div className="messageSection">
    
  </div>;
}

function SendBar({ sendMessage }) {
  const [message, setMessage] = useState("");
  function handleSubmit(e) {
    console.log(message);
    sendMessage(message);
    setMessage("");
    e.preventDefault();
    // setMessage(e.target.value)
  }
  return (
    <div className="sendBar">
      <div className="botIcons">
        <CgSmileMouthOpen />
        <AiOutlinePaperClip />
      </div>
      <div>
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
            value={message}
            placeholder="Type a message"
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
      <div className="micIcon">
        <MdMic />
      </div>
    </div>
  );
}
