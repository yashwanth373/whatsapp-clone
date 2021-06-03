import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlinePaperClip } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CgSmileMouthOpen } from "react-icons/cg";
import { MdMic, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import db from "../firebase";
export default function ChatSection({ setinfoOpen, width, group }) {
  let dummyUserId = 2750192;
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    db.collection("groups/" + group.id + "/messages").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        setMessages([...messages,doc.data()])
      });
    });
  }, []);

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
      <MessageSection
        messages={messages}
        dummyUserId={dummyUserId}
        setMessages={setMessages}
      />
      <SendBar sendMessage={sendMessage} dummyUserId={dummyUserId} />
    </div>
  );
}

function useOutsideAlerter(ref, setddtoggle, ddtoggle) {
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

function TopBar({ name, users, img, setinfoOpen }) {
  console.log(users);
  let names = [];
  const [usernames, setUsernames] = useState([]);
  useEffect(() => {
    let snaps = users.map((userId) => {
      let snap = db.collection("users").doc(userId).get();
      return snap;
    });
    Promise.all(snaps).then((docs) => {
      setUsernames(
        docs.map((doc) => {
          return doc.data().name;
        })
      );
    });
  }, []);
  const [ddtoggle, setddtoggle] = useState(false);
  const wref = useRef(null);
  useOutsideAlerter(wref, setddtoggle, ddtoggle);
  function UserNamesList(){
    let dummynames=[]
    for(var i=0;i<usernames.length-1;i++)
    {
      dummynames.push(usernames[i])
      dummynames.push(",")
    }
    dummynames.push(usernames[i])
    return <>{dummynames}</>
  }
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
        <section className="gName"><span>{name}</span></section>
        <section className="gMembers">
          {usernames.length !== 0 ? <UserNamesList/>:""}
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

function MessageSection({ messages, dummyUserId, setMessages }) {
  const [showdeletemodal, setShowDeleteModal] = useState(false);
  const [showImgmodal, setShowImgModal] = useState(false);
  const [selectedmessageId, setSelectedMessageId] = useState("");
  const [selectedImgSrc, setSelectedImgSrc] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  function deletemsg() {
    setMessages(messages.filter((msg) => msg.id !== selectedmessageId));
  }

  function DeleteModal({ type }) {
    return (
      <div className="modal">
        <div className="modalTitle">Delete {type}?</div>
        <div className="modalbuttons">
          <div
            className="cancelbutton"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            CANCEL
          </div>
          <div
            className="deletebutton"
            onClick={() => {
              setShowDeleteModal(false);
              deletemsg();
            }}
          >
            DELETE
          </div>
        </div>
      </div>
    );
  }
  function ImgModal() {
    return (
      <div className="imgmodal">
        <span className="closebutton">
          <IoMdClose
            onClick={() => {
              setShowImgModal(!showImgmodal);
            }}
          />
        </span>
        <img src={selectedImgSrc} alt="image" />
      </div>
    );
  }
  function Sent({ message }) {
    return (
      <>
        <div className="sent">
          <span className="msg">{message.message}</span>
          <button className="dd">
            <MdDelete
              className="ddIcon"
              onClick={() => {
                setSelectedMessageId(message.id);
                setShowDeleteModal(true);
              }}
            />
          </button>
          <span className="time">{message.time.split(",")[0]}</span>
        </div>
        {showdeletemodal && <DeleteModal type={"Message"} />}
      </>
    );
  }
  function Received({ message }) {
    return (
      <>
        <div className="received">
          {/* <button className="dd">
            <MdDelete
              className="ddIcon"
              onClick={() => {
                setSelectedMessageId(message.id);
                setShowDeleteModal(true);
              }}
            />
          </button> */}
          <span className="msg">{message.message}</span>
          <span className="time">{message.time.split(",")[0]}</span>
        </div>
        {showdeletemodal && <DeleteModal />}
      </>
    );
  }
  const ImgSent = ({ message }) => {
    console.log(message);
    return (
      <>
        <div className="imgsent">
          <button className="dd">
            <MdDelete
              className="ddIcon"
              onClick={() => {
                setSelectedMessageId(message.id);
                setShowDeleteModal(true);
              }}
            />
          </button>
          <span className="img">
            <img
              src={message.imglink}
              onClick={() => {
                setShowImgModal(true);
                setSelectedImgSrc(message.imglink);
              }}
              alt="img"
            />
          </span>
          <span className="time">{message.time.split(",")[0]}</span>
        </div>
        {showdeletemodal && <DeleteModal type={"Image"} />}
        {showImgmodal && <ImgModal />}
      </>
    );
  };
  const ImgReceived = ({ message }) => {
    return (
      <>
        <div className="imgreceived">
          {/* <button className="dd">
            <MdDelete
              className="ddIcon"
              onClick={() => {
                setSelectedMessageId(message.id);
                setShowDeleteModal(true);
              }}
            />
          </button> */}
          <span className="img">
            <img
              src={message.imglink}
              alt="image"
              onClick={() => {
                setShowImgModal(true);
                setSelectedImgSrc(message.imglink);
              }}
            />
          </span>
          <span className="time">{message.time.split(",")[0]}</span>
        </div>
        {showdeletemodal && <DeleteModal />}
        {showImgmodal && <ImgModal />}
      </>
    );
  };
  return (
    <div className="messageSection">
      <div className="message">
        {messages.map((message) =>
          !message.type ? (
            message.message !== "" ? (
              message.senderId === dummyUserId ? (
                <Sent message={message} />
              ) : (
                <Received message={message} />
              )
            ) : null
          ) : message.senderId === dummyUserId ? (
            <ImgSent message={message} />
          ) : (
            <ImgReceived message={message} />
          )
        )}
        <div ref={messagesEndRef} />
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
  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    let date = new Date();
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
      sendMessage({
        ...message,
        id: Date.now(),
        type: "img",
        imglink: reader.result,
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
    };
  };

  return (
    <div className="sendBar">
      <div className="botIcons">
        <CgSmileMouthOpen className="boticon" />
        <AiOutlinePaperClip className="boticon" onClick={handleClick} />
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
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
