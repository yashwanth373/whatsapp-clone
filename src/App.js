import React from "react";
import "./App.css";
import ChatSection from "./components/ChatSection";
import ContactsSection from "./components/ContactsSection";

function App() {
  return (
    <>
      <div className="container">
        <ContactsSection />
        <ChatSection />
      </div>
    </>
  );
}

export default App;
