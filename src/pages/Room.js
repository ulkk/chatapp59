import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthService";
import firebase from "../config/firebase";
import "firebase/firestore";
const Room = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    firebase
      .firestore()
      .collection("messages")
      .orderBy(`timestamp`)
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          return {
            ...doc.data({ serverTimestamps: "estimate" }),
            timestamp: doc
              .data({ serverTimestamps: "estimate" })
              .timestamp.toDate(),
          };
          // .timestamp.toDate(),
          //firebaseからデータ取ってくる。その時にDate型にかえるためのtoDate()を行っている。
          //({ serverTimestamps: "estimate" }はfirebase.firestore.FieldValue.serverTimestamp() を使うと、すぐにtimestampが入るわけではなく、タイムスタンプが設定されるまでに、少しタイムラグがある。
          //これを解消するために、timestampがnullの時は見積時間を返すよ、というもの。
          //Cannot read property 'toDate' of nullの解消
        });

        // messages.sort(function (a, b) {
        //   if (a.date > b.date) {
        //     return 1
        //   } else if (a.date < b.date) {
        //     return -1
        //   }
        //   return 0
        // })
        setMessages(messages);
      });
  }, []);

  const user = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    firebase.firestore().collection("messages").add({
      content: value,
      user: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      //サーバー（firestore上）の時間をデータとして追加できる
    });
    // date: new Date(),
  };

  console.log(user);
  return (
    <>
      <h1>Room</h1>
      <ul>
        {messages?.map((message, index) => {
          const formatTime = `${message.timestamp.getFullYear()}/${
            message.timestamp.getMonth() + 1
          }/${message.timestamp.getDate()}/${message.timestamp.getHours()}:${message.timestamp.getMinutes()}:${message.timestamp.getSeconds()}`;
          //文字列にする

          return (
            <li key={index}>
              {message.user}:{message.content}
              <span>{formatTime}</span>
            </li>
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
      <button onClick={() => firebase.auth().signOut()}>Logout</button>
    </>
  );
};
export default Room;
