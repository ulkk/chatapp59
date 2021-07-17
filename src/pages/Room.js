import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../AuthService'
import firebase from '../config/firebase'
import 'firebase/firestore'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const Room = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }))
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
    firebase.firestore().collection('messages').add({
      content: value,
      user: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      //サーバー（firestore上）の時間をデータとして追加できる
    })
    setValue('')//送信後に空にする
  }

  console.log(user)
  const classes = useStyles()
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
        <h1>Room</h1>
        <Box width="75%">
          {messages?.map((message, index) => {
            const formatTime = `
            ${message.timestamp.getHours()}:
            ${message.timestamp.getMinutes()}`
            // ${message.timestamp.getFullYear()}/
            // ${
              //      message.timestamp.getMonth() + 1
              //   }/
              //  ${message.timestamp.getDate()}/
              //  ${message.timestamp.getSeconds()}
              //文字列にする
              
              return (
                <>
                <Box display="flex" flexDirection="row">
                  <div>
                    <p>{message.user}:</p>
                    <p>{message.content}</p>
                  </div>
                  <Box display="flex" flexDirection="row" alignItems="flex-end">
                    <p>{formatTime}</p>
                    <div
                      onClick={() => {
                        if (message.user === user.displayName) {
                          firebase.firestore().collection('messages').doc(message.id).delete()
                        }
                      }}
                      >
                      <IconButton aria-label="delete" className={classes.margin} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </Box>
                </Box>
              </>
            )
          })}
        </Box>

        <form onSubmit={handleSubmit}>
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
          <button type="submit">送信</button>
        </form>
        <button onClick={() => firebase.auth().signout()}>Logout</button>
    </Container>
  )
}
export default Room
