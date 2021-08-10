import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyBWn9kzojV6c3K18CS8aFLboteECg1njXU",
  authDomain: "itesa-p5.firebaseapp.com",
  projectId: "itesa-p5",
  storageBucket: "itesa-p5.appspot.com",
  messagingSenderId: "159222681310",
  appId: "1:159222681310:web:31146d63cfc48d0df97c4f",
});

export const db = firebase.firestore();
export const auth = firebase.auth();

export default app;
