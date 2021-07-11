import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthService";
import firebase from "../config/firebase";
import "firebase/firestore";
//import "../css/style.scss";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    firebase
      .firestore()
      .collection("messages")
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          return data;
        });
        messages.sort(function (a, b) {
          if (a.date > b.date) {
            return 1;
          } else if (a.date < b.date) {
            return -1;
          }
          return 0;
        });
        setMessages(messages);
      });
  }, []);

  const user = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    firebase.firestore().collection("messages").add({
      content: value,
      user: user.displayName,
      date: new Date(),
    });
  };
  return (
    <>
      <h1>Room</h1>
      <ul>
        {messages?.map((message, index) => {
          return (
            <>
              <li key={index}>
                {message.user}:{message.content}
                <button
                  className="style"
                  onClick={() => {
                    if (message.user === user.displayName) {
                      firebase
                        .firestore()
                        .collection("messages")
                        .doc(message.id)
                        .delete();
                    }
                  }}
                >
                  削除
                </button>
              </li>
            </>
          );
        })}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">送信</button>
      </form>
      <button onClick={() => firebase.auth().signout()}>Logout</button>
    </>
  );
};
export default Room;
