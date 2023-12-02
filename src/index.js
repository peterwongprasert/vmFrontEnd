//TODO: 
// - Style everything
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
const slide = require('./slide')
const checkoutFunc = require('./checkout')

// initialize the purchasing screen
function loadMachine(machineId){
  currentMachine = machineId;
  console.log('load machine')
  // const colRef = collection(db, 'items')

  let colRef = collection(db, 'Vending_Machines');
  let q = query(colRef, where("vendingMachineID", "==", machineId));
  let items;

  // getDocs(colRef)
  getDocs(q)
  .then((snapshot) => {
    let machine = []
    snapshot.docs.forEach((doc) => {
      machine.push({ ...doc.data(), id: doc.id})
    })
    // console.log(machine)
    // console.log(machine[0])
    console.log(machine[0].id)

    // run the functions
    // items = loadInventory(machine[0].items);
    loadInventory(machine[0].items)
    .then((items) => {
      console.log()
      console.log('then: ' + items);
      myModule.init(items, cart, inventoryObj);
    })
    .catch((error) => {
      console.error('Error loading inventory:', error);
    });

    console.log(items);

    // myModule.init(items, cart, inventoryObj);
  })
  .catch(err => {
    // console.log(err.message)
  })
}

// for all items
// function loadMachine(machineId){
//   const colRef = collection(db, 'items')
//   // const q = query(colRef, where())

//   getDocs(colRef)
//   .then((snapshot) => {
//     let items = []
//     snapshot.docs.forEach((doc) => {
//       items.push({ ...doc.data(), id: doc.id})
//     })
//     console.log(items)

//     // run the functions
//     myModule.init(items, cart, inventoryObj);
//   })
//   .catch(err => {
//     console.log(err.message)
//   })
// }

// function loadInventory(itemsRay){
//   // const colRef = collection(db, 'items')
//   let colRef = collection(db, 'items')
//   let q
//   let items = []

//   itemsRay.forEach(element => {
//     q = query(colRef, where("id", "==", element))

//     getDocs(q)
//     .then((snapshot) => {
//       snapshot.docs.forEach((doc) => {
//         items.push({ ...doc.data(), id: doc.id})
//       })
//     })
//     .catch(err => {
//       console.log(err.message)
//     })
//   });
//   return(items);
//   // console.log(items)
// }

function loadInventory(itemsRay) {
  console.log('load inventory')

  let colRef = collection(db, 'items');

  return Promise.all(
    itemsRay.map((element) => {
      const q = query(colRef, where("id", "==", element));
      return getDocs(q)
        .then((snapshot) => {
          return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        })
        .catch((err) => {
          console.log(err.message);
        });
    })
  );
}

  //Accept Button
  document.getElementById('finalize').addEventListener('click', (e) => {
    console.log('click')
    let docRef;
    const updatePromises = [];

    let check = $(`#coc`).val() === '1' ? checkoutFunc.submitCreditCard() : checkoutFunc.submitCash(cart.total)
    if($(`#coc`).val() === '1'){
      check = checkoutFunc.submitCreditCard()
    }else{
      check = checkoutFunc.submitCash(cart.total)
    }
    console.log(check)
    // we need to go through all the items in the cart
    if(check){
      for (const key in cart) {
        // ignore the total portion
        if (cart.hasOwnProperty(key) && key !== 'total') {
            // key-value pair: "key" : quantity
            console.log(`${key}: ${cart[key]}`);

            console.log(inventoryObj[key])

            if (inventoryObj[key]) {
                inventoryObj[key].quantity -= cart[key];

                docRef = doc(db, 'items', inventoryObj[key].id);

                // Push the update promise into the array
                const updatePromise = updateDoc(docRef, {
                    quantity: inventoryObj[key].quantity,
                });

                updatePromises.push(updatePromise);
            } else {
                console.error(`Document with ID ${key} not found in inventoryObj`);
            }
        }
      }

    const colRef = collection(db, 'Transactions');
    const q = query(colRef, where("vendingMachineID", "==", currentMachine));

    getDocs(q)
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // Assuming `increment` is correctly imported
              const updatePromise = updateDoc(doc.ref, {
                  total: increment((cart['total']))
              });

              updatePromises.push(updatePromise);
          });

          // Move the Promise.all block here, outside the forEach loop
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
      .catch((error) => {
          console.error('Error querying documents:', error);
      });
    }else{
      console.log('not accepted')
    }

});

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

  $(document).ready(function() {
    slide.connectSlides(page);
    checkoutFunc.connectCheckout();
  });
  
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
  let currentMachine;
  let page = 1;

  // slide.connectSlides(page);
  // checkoutFunc.connectCheckout();

  // loadMachine("VM ID HERE");
