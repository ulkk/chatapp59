import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../AuthService'

const Room = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const user = useContext(AuthContext)
  const handleSubmit = (e) => {
    e.preventDefault()
  }
  return
}
export default Room
