//TODO: 
// - Style everything
// - login
// - create a checkout page (List the items that you purchased)
// - cash and credit pages
// - timeout
// - reset the cart once the purchase is made

import { initializeApp } from  'firebase/app'
import {
  getFirestore, collection, getDocs,
  doc, updateDoc, increment, query, where, onSnapshot
} from 'firebase/firestore'
const login = require('./login')
const myModule = require('./initialize');
// const config = require('./config')

// initialize the purchasing screen
function loadMachine(machineId){
  const colRef = collection(db, 'items')
  // const q = query(colRef, where())

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

  //Accept Button
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
      // docRef = doc(db, 'Transactions', machineId);
      // let updatePromise = updateDoc(docRef, {
      //   total : increment(cart['total'])
      // })

      // updatePromises.push(updatePromise);
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

  // Veryify Login
  function verifyLogin(cred){
    let userRef = collection(db, 'Users');
    let q = query(userRef, where("ID", "==", cred[1]))

    onSnapshot(q, (snapshot) => {
      let user = [];
      snapshot.docs.forEach((doc) => {
        user.push({...doc.data(), id: doc.id})
      })
      console.log(user);
      
      user = user[0]
      console.log(user)

      //if user.password == cred[2] log in successful
      if(user && user.password === cred[2]){
        loadMachine(cred[0])
      }else{
        // reset the form
        document.getElementById('login-form').reset();
      }
    })
  }

  // Login 
  document.getElementById('login').addEventListener('click', () => {
    event.preventDefault();
    cred = login.promptLogin();
    console.log(cred);
    verifyLogin(cred)
  })
  
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
  let cred;
  


  // loadMachine("VM ID HERE");
