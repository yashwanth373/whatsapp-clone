import React, { useState } from "react";
import "./App.css";
import ChatSection from "./components/ChatSection";
import ContactsSection from "./components/ContactsSection";
import InfoSection from "./components/InfoSection";

function App() {
  const [infoOpen, setinfoOpen] = useState(false);
  return (
    <>
      <div className="container">
        <ContactsSection />
        {!infoOpen ? (
          <ChatSection setinfoOpen={setinfoOpen} width={"70%"} />
        ) : (
          <ChatSection setinfoOpen={setinfoOpen} width={"40%"} />
        )}
        {infoOpen && <InfoSection setinfoOpen={setinfoOpen} />}
      </div>
    </>
  );
}

export default App;
