import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../AuthService'
import firebase from '../config/firebase'
import 'firebase/firestore'
import 'firebase/storage'
import { file } from '@babel/types'

const Room = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  //const [imgURL,setImgURL] = useState('')
  let imgURL

  useEffect(() => {
    firebase
      .firestore()
      .collection('messages')
      .orderBy(`timestamp`)
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          return {
            ...doc.data({ serverTimestamps: 'estimate' }),
            timestamp: doc.data({ serverTimestamps: 'estimate' }).timestamp.toDate(),
            id: doc.id,
          }
          //firebaseからデータ取ってくる。その時にDate型にかえるためのtoDate()を行っている。
          //({ serverTimestamps: "estimate" }はfirebase.firestore.FieldValue.serverTimestamp() を使うと、すぐにtimestampが入るわけではなく、タイムスタンプが設定されるまでに、少しタイムラグがある。
          //これを解消するために、timestampがnullの時は見積時間を返すよ、というもの。
          //Cannot read property 'toDate' of nullの解消
        })
        setMessages(messages)
      })
  }, [])

  const user = useContext(AuthContext)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(imgURL)
    //new Promise((resolve)=>{
    const fileList = document.getElementById('input').files;
    console.log(fileList)
    if (fileList.length === 0) {
      //setImgURL('')
    } else {
      //for(var i=0;i<fileList.length;i++){
      var file = fileList[0]
      var storageRef = firebase.storage().ref();
      var ImagesRef = storageRef.child('images/' + file.name);

      ImagesRef.put(file).then(function (snapshot) {
        ImagesRef.getDownloadURL().then(function (url) {

          firebase.firestore().collection('messages').add({
            content: value,
            user: user.displayName,
            //iconURL: user.iconURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            //サーバー（firestore上）の時間をデータとして追加できる
            url: url
          })
        });
      });
      //}
    }

    console.log(imgURL)


    setValue('')
    console.log(imgURL)
  }

  // const inputElement = document.getElementById("input");
  // inputElement.addEventListener("change", handleFiles, false);
  // function handleFiles() {

  // }

  return (
    <>
      <h1>Room</h1>
      <ul>
        {messages?.map((message, index) => {
          const formatTime = `${message.timestamp.getFullYear()}/${message.timestamp.getMonth() + 1
            }/${message.timestamp.getDate()}/${message.timestamp.getHours()}:${message.timestamp.getMinutes()}:${message.timestamp.getSeconds()}`
          //文字列にする

          return (
            <>
              <li key={index}>

                {/* {message.iconURL !== '' &&
                  <img src ={message.iconURL} alt =""/>
                } */}

                {message.user}:{message.content}:{formatTime}{message.iconURL}
                {message.url !== '' &&
                  <img src={message.url} alt="" />
                }

                {message.user === user.displayName &&
                  <button
                    onClick={() => {
                      firebase.firestore().collection('messages').doc(message.id).delete()
                    }}
                  >
                    削除
                  </button>
                }

              </li>
            </>
          )
        })}
      </ul>

      <form onSubmit={handleSubmit}>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit">送信</button>
      </form>

      <form method="post" encType="multipart/form-data">
        <input type="file" id="input" name="avatar" accept="image/*" />
      </form>

      <button onClick={() => firebase.auth().signOut()}>Logout</button>
    </>
  )
}
export default Room
