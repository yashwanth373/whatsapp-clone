import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

export default function ChatsList({setGroup}) {
  const [list, setList] = useState([]);
  useEffect(() => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((snap) => {
        const groupIds = snap.data().Groups;
        console.log(groupIds);
        let snaps = groupIds.map((groupId) => {
          let snap = db.collection("groups").doc(groupId).get();
          return snap;
        });
        Promise.all(snaps).then((docs) => {
          setList(
            docs.map((doc) => {
              return {
                id:doc.id,
                ...doc.data()
              }
            })
          );
        });
      });
  }, []);
  return (
    <div className="list">
      {list.length === 0 ? (
        <p className="text-center mt-3 text-secondary">No groups</p>
      ) : (
        list.map((item, i) =>(
          <div key={i} className="list-item" onClick={()=>{setGroup(item)}}>
            <img className="avatar big" src={item.img} alt="." />
            <div className="ml-1">
              <p className="title">{item.name}</p>
              <p className="subtitle">This is the last message.</p>
            </div>
          </div>
        ))
      )
      }
    </div>
  );
}
