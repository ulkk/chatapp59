import React, { useState, useContext } from "react"
import firebase from "../config/firebase"
import { AuthContext } from "../AuthService"
import { Redirect } from "react-router"

const Login = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        console.log(err)
      })
  }

  const user = useContext(AuthContext)
  if (user) {
    return <Redirect to="/" />
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">E-mail</label>
          <input
            type="name"
            id="name"
            name="name"
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default Login
