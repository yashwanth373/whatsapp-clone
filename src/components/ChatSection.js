import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlinePaperClip } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CgSmileMouthOpen } from "react-icons/cg";
import { MdMic, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import db from "../firebase";
export default function ChatSection({ setinfoOpen, width, group }) {
  const userID = "6QsAI72VdaaNWXaHh2BV";
  const [messages, setMessages] = useState([]);
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    db.collection("groups/" + group.id + "/messages")
      .orderBy("time")
      .onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) =>{
          return {
            id:doc.id,
            ...doc.data()
          }
        }));
      });
  }, []);
  useEffect(() => {
    let snaps = group.users.map((userid) => {
      let snap = db.collection("users").doc(userid).get();
      return snap;
    });
    Promise.all(snaps).then((docs) => {
      setUsernames(
        docs.map((doc) => {
          return { id: doc.id, name: doc.data().name };
        })
      );
    });
  }, []);

  function sendMessage(message) {
    db.collection("groups/" + group.id + "/messages")
      .add(message)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  return (
    <div className="chat" style={{ width: width }}>
      <TopBar
        name={group.name}
        usernames={usernames}
        img={group.img}
        setinfoOpen={setinfoOpen}
      />
      <MessageSection
        messages={messages}
        userID={userID}
        setMessages={setMessages}
        usernames={usernames}
        groupID={group.id}
      />
      <SendBar sendMessage={sendMessage} userID={userID} />
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

function TopBar({ name, usernames, img, setinfoOpen }) {
  const [ddtoggle, setddtoggle] = useState(false);
  const wref = useRef(null);
  useOutsideAlerter(wref, setddtoggle, ddtoggle);
  function UserNamesList() {
    let dummynames = [];
    for (var i = 0; i < usernames.length - 1; i++) {
      dummynames.push(Object.values(usernames[i])[1]);
      dummynames.push(", ");
    }
    dummynames.push(Object.values(usernames[i])[1]);
    return <>{dummynames}</>;
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
        <section className="gName">
          <span>{name}</span>
        </section>
        <section className="gMembers">
          {usernames.length !== 0 ? <UserNamesList /> : ""}
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

function MessageSection({ messages, userID, setMessages, usernames,groupID }) {
  const color = "#029d00";
  useEffect(() => {
    messages.sort(function (a, b) {
      return new Date(b.time.seconds * 1000) - new Date(a.time.seconds * 1000);
    });
  }, []);
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
    console.log(selectedmessageId)
    db.collection("groups/" + groupID + "/messages")
      .doc(selectedmessageId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
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
    console.log(message)
    var d = new Date(message.time);
    let time = d.toTimeString().split(" ")[0];
    let [h, m, s] = time.split(":");
    let hm = h + ":" + m;
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
          <span className="time">{hm}</span>
        </div>
        {showdeletemodal && <DeleteModal type={"Message"} />}
      </>
    );
  }
  function Received({ message }) {
    var d = new Date(message.time);
    let time = d.toTimeString().split(" ")[0];
    let [h, m, s] = time.split(":");
    let hm = h + ":" + m;
    let name = "";
    for (let n of usernames) {
      if (n.id === message.sender) {
        name = n.name;
      }
    }
    return (
      <>
        <div className="received">
          <span className="name" style={{ color: color }}>
            {name}
          </span>
          <span className="msg">{message.message}</span>
          <span className="time">{hm}</span>
        </div>
        {showdeletemodal && <DeleteModal />}
      </>
    );
  }
  const ImgSent = ({ message }) => {
    var d = new Date(message.time);
    let time = d.toTimeString().split(" ")[0];
    let [h, m, s] = time.split(":");
    let hm = h + ":" + m;
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
          <span className="time">{hm}</span>
        </div>
        {showdeletemodal && <DeleteModal type={"Image"} />}
        {showImgmodal && <ImgModal />}
      </>
    );
  };
  const ImgReceived = ({ message }) => {
    var d = new Date(message.time);
    let time = d.toTimeString().split(" ")[0];
    let [h, m, s] = time.split(":");
    let hm = h + ":" + m;
    let name = "";
    for (let n of usernames) {
      if (n.id === message.sender) {
        name = n.name;
      }
    }
    return (
      <>
        <div className="imgreceived">
          <span className="name" style={{ color: color }}>
            {name}
          </span>
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
          <span className="time">{hm}</span>
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
              message.sender === userID ? (
                <Sent message={message} />
              ) : (
                <Received message={message} />
              )
            ) : null
          ) : message.sender === userID ? (
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

function SendBar({ sendMessage, userID }) {
  const [message, setMessage] = useState({
    sender: "",
    message: "",
    time: null,
  });
  function handleSubmit(e) {
    sendMessage({
      ...message,
      message: message.message,
      sender: userID,
      time: Date.now(),
    });
    setMessage({
      sender: "",
      message: "",
      time: null,
    });
    e.preventDefault();
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
        type: "img",
        imglink: reader.result,
        sender: userID,
        time: Date.now(),
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
