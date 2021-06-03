import React, { useState, useEffect } from "react";
import "./App.css";
import ChatSection from "./components/ChatSection";
import ContactsSection from "./components/ContactsSection";
import InfoSection from "./components/InfoSection";
import db from "./firebase"


function App() {
  const [infoOpen, setinfoOpen] = useState(false);
  const [group, setGroup] = useState();
  useEffect(() => {
    db.collection("groups").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        setGroup({
          id: doc.id,
          ...doc.data(),
        });
      });
    });
  }, []);

  return (
    <>
      {group && (
        <div className="container">
          <ContactsSection />
          <ChatSection
            setinfoOpen={setinfoOpen}
            width={infoOpen ? "40%" : "70%"}
            group={group}
          />
          {infoOpen && (
            <InfoSection setinfoOpen={setinfoOpen} group={group} setGroup={setGroup} />
          )}
        </div>
      )}
    </>
  );
}

export default App;
