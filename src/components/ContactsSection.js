import React,{useState} from "react";
import { MdClose, MdEdit,MdSearch,MdChat,MdMoreVert } from "react-icons/md";
import {RiDonutChartLine} from "react-icons/ri"
import ChatsList from "./ChatsList"
import Account from './Account'
import {auth} from '../firebase'

export default function ContactsSection({setGroup}) {
  const [show, setShow] = useState(false);

  async function logout() {
    await auth.signOut();
  }
  return <div className="left">
  <Account show={show} close={() => setShow(false)} />
  <div className="header">
    <div className="top">
      <img
        className="avatar"
        src='https://picsum.photos/1000/1000'
        onClick={() => setShow(true)}
        alt="."
      />
      <div className="options">
        <RiDonutChartLine className="icon" />
        <MdChat className="icon" />
        <MdMoreVert className="icon" onClick={logout} />
      </div>
    </div>
    <div className="search">
      <div className="input-box">
        <MdSearch className="search-icon" />
        <input
          // onChange={(e) => filterData(e.target.value)}
          className="input"
          placeholder="Search or start new chat"
        />
      </div>
    </div>
  </div>
  <ChatsList setGroup={setGroup} />
</div>
}
