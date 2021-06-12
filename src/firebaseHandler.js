import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "./constants";

firebase.initializeApp(firebaseConfig);
firebase.auth();
firebase.firestore();


export default firebase;