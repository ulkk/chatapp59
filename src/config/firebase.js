import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  //各人の認証情報を記述
  apiKey: "AIzaSyClViNGdJOUbOfkFinC0NtHcIep0bth3JQ",
  authDomain: "chatapp59-2a948.firebaseapp.com",
  projectId: "chatapp59-2a948",
  storageBucket: "chatapp59-2a948.appspot.com",
  messagingSenderId: "487270450531",
  appId: "1:487270450531:web:4c2f4a301758be71f27f56",
  measurementId: "G-RC2K3EF530",
};

firebase.inisitalizeApp(firebaseConfig);

export default firebase;
