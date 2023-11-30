import { initializeApp } from  'firebase/app'
import {
  getFirestore, collection, getDocs,
  doc, updateDoc, increment
} from 'firebase/firestore'
const myModule = require('./initialize');
// const config = require('./config')

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

// const db = config.db

let cart = { total : 0 };
let inventoryObj = {};

function loadMachine(machineId){
  const colRef = collection(db, 'items')

  getDocs(colRef)
  .then((snapshot) => {
    let items = []
    snapshot.docs.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id})
    })
    // console.log(items)

    // run the functions
    myModule.init(items, cart, inventoryObj);
  })
  .catch(err => {
    console.log(err.message)
  })
}

  //setting up a listener for the accept button
  document.getElementById('finalize').addEventListener('click', (e) => {
    let docRef;
    const updatePromises = [];

    // we need to go through all the items in the cart
    for(const key in cart){

      // ignore the total portion
      if(cart.hasOwnProperty(key) && key !== 'total'){

        //key-value pair: "key" : quantity
        console.log(`${key}: ${cart[key]}`);

        console.log(inventoryObj[key])

        // console.log(inventoryObj[key].quantity)
        // console.log(inventoryObj[key]);

        if(inventoryObj[key]){
          inventoryObj[key].quantity -= cart[key];
    
          docRef = doc(db, 'items', inventoryObj[key].id);
    
          // Push the update promise into the array
          const updatePromise = updateDoc(docRef, {
            quantity: inventoryObj[key].quantity,
          });
    
          updatePromises.push(updatePromise);
        }else{
          console.error(`Document with ID ${key} not found in inventoryObj`);
        }
      }

      // push another updateDoc into the promise array
      docRef = doc(db, 'Transactions', machineId);
      let updatePromise = updateDoc(docRef, {
        total : increment(cart['total'])
      })
    }

    // execute the promises
    Promise.all(updatePromises)
    .then(() => {
      console.log('All updates successful');
      cart = {};
      console.log(cart);
    })
    .catch((error) => {
      console.error('Error updating documents:', error);
    });
  })
  

  loadMachine("VM ID HERE");
