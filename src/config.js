import { initializeApp } from  'firebase/app'
import {
  getFirestore, collection, getDocs
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyASrZnIJIWS91rh6Vy6VUR3TU0l8CX5Rek",
  authDomain: "vending-66979.firebaseapp.com",
  projectId: "vending-66979",
  storageBucket: "vending-66979.appspot.com",
  messagingSenderId: "399935751514",
  appId: "1:399935751514:web:01ba45141004986ffd5f63",
  measurementId: "G-Y6CKTK6TVF"
};

initializeApp(firebaseConfig)

const db = getFirestore()

module.exports = { db };