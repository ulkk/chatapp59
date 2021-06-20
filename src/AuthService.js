import React,{useEffect,useEffect} from 'react'
import firebase from './confg/firebase'

const AuthProvider = () => {
    const[user,setUser] = useState(null)
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user=>{
            setUser()
        })
    },[])
}