import React, { useState, useEffect } from "react";
import ChatSection from "../components/ChatSection";
import ContactsSection from "../components/ContactsSection";
import InfoSection from "../components/InfoSection";
import { db, auth } from "../firebase";
import "../App2.css";

function App() {
  const [infoOpen, setinfoOpen] = useState(false);
  const [group, setGroup] = useState();
  return (
    <div>
      <div className="top2" />
      <div className="rest" />
      <div className="owncontainer">
        <ContactsSection setGroup={setGroup} />
        {group && (
          <ChatSection
            setinfoOpen={setinfoOpen}
            width={infoOpen ? "40%" : "70%"}
            group={group}
          />
        )}
        {group && infoOpen && (
          <InfoSection
            setinfoOpen={setinfoOpen}
            group={group}
            setGroup={setGroup}
          />
        )}
      </div>
    </div>
  );
}

export default App;
