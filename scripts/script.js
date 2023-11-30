// === How this all works: =======================================================================================
// Once the page is loaded, fetchInventory is called to grab all the local inventory data. 
// That inventory data gives us back an array of objects.
// That object is passed into renderCards and that function renders card DOM elements out of those objects 
// one by one using createCard. Once all the cards are created, we link the buttons using 
// linkButtons and linkCards.

// TODO: 
// We need to create a function that updates the inventory when the user accepts the transaction. 
// 

// ===============================================================================================================
// const { JSDOM } = require('jsdom');
// const jQuery = require('jquery')(new JSDOM().window);
// import fetch from 'node-fetch';

let cart = { total : 0 };
let inventoryObj = {};

async function fetchInventory() {
  try {
    const response = await fetch('data/inventory.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data. HTTP status: ' + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON:', error);
    return null;
  }
}

//function in charge of rendering all the cards
function renderCards(inventory){
  console.log(inventory);

  //pass the inventory into this function and cycle through it's data creating cards
  inventory.forEach((item) => {
    // we might as well populate the inventory object here too. 
    inventoryObj[item.id] = item;

    let appending = createCard(item);

    document.getElementById('card-list').appendChild(appending);
  })

  //test object
  // let appending = createCard('something')

  // document.getElementById('card-list').appendChild(appending);
}

// not finished, but here is the function to create the cards dynamically
// once we have all the necessary data, we can pass objects into this function item by item
function createCard(item){

  // test object
  // item = {
  //   img : './images/knotts.jpg',
  //   imgAlt : 'alt',
  //   name : 'Knotts',
  //   id : '3'
  // };

  // creating a card DOM element from top down
  // const card = document.createElement("div");
  // card.classList.add("card", "example");

  // const cardBody = document.createElement("div")
  // cardBody.classList.add("card-body")

  // const cardPicture = document.createElement("div");
  // cardPicture.classList.add("row", "card-picture");
  // const img = document.createElement('img')
  // img.src = item.image;
  // img.alt = item.name;
  // cardPicture.appendChild(img)

  // const cardText = document.createElement('div');
  // cardText.classList.add('card-text');
  // const h3 = document.createElement('h3')
  // h3.textContent = item.name;
  // cardText.appendChild(h3)

  // const buttonContainer = document.createElement('div');
  // buttonContainer.classList.add('row', 'container');

  // const minusButton = document.createElement('button');
  // minusButton.classList.add('btn', 'btn-danger', 'bottom');
  // minusButton.value = 'm-' + item.id;
  // minusButton.textContent = '-';

  // const input = document.createElement('input');
  // input.setAttribute('type', 'text');
  // input.setAttribute('id', item.id);
  // input.setAttribute('name', item.name);
  // input.setAttribute('value', 0);
  // input.setAttribute('hidden', true);

  // const countSpan = document.createElement('span');
  // countSpan.classList.add('bottom');
  // countSpan.setAttribute('id', item.id);
  // countSpan.textContent = '0';

  // const plusButton = document.createElement('button');
  // plusButton.classList.add('btn', 'btn-primary', 'bottom');
  // plusButton.value = 'a-' + item.id;
  // plusButton.textContent = '+';

  // // sticking all the elements together
  // card.appendChild(cardBody);
  // cardBody.appendChild(cardPicture);
  // cardBody.appendChild(cardText);
  // card.appendChild(buttonContainer);
  // buttonContainer.appendChild(minusButton);
  // buttonContainer.appendChild(input);
  // buttonContainer.appendChild(countSpan);
  // buttonContainer.appendChild(plusButton);



  // Create the main container div
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('example');

  // Create the card div
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'card-body');
  cardDiv.id = item.id;

  // Create the row for the card picture
  const pictureRow = document.createElement('div');
  pictureRow.classList.add('row', 'card-picture');

  // Create the image element
  const image = document.createElement('img');
  image.src = item.image;
  image.alt = item.name;

  // Append the image to the picture row
  pictureRow.appendChild(image);

  // Create the card text div
  const cardTextDiv = document.createElement('div');
  cardTextDiv.classList.add('card-text');

  // Create the heading for the item name
  const itemNameHeading = document.createElement('h3');
  itemNameHeading.textContent = item.name;

  // Create the price heading with id
  const priceHeading = document.createElement('h4');
  priceHeading.textContent = `$${item.price.toFixed(2)}`;
  priceHeading.setAttribute('value', item.id);
  priceHeading.setAttribute('id', item.id);

  // Create the span for the bottom count
  const bottomSpan = document.createElement('span');
  bottomSpan.classList.add('bottom');
  bottomSpan.setAttribute('id', `count-${item.id}`);
  bottomSpan.textContent = '0';

  // Append the headings and span to the card text div
  cardTextDiv.appendChild(itemNameHeading);
  cardTextDiv.appendChild(priceHeading);
  cardTextDiv.appendChild(bottomSpan);

  // Append the picture row and card text div to the card div
  cardDiv.appendChild(pictureRow);
  cardDiv.appendChild(cardTextDiv);

  // Create the row for the bottom buttons
  const bottomRow = document.createElement('div');
  bottomRow.classList.add('row', 'bottom-row');

  // Create the decrement button
  const decrementButton = document.createElement('button');
  decrementButton.classList.add('btn', 'btn-danger', 'btn-bottom');
  decrementButton.setAttribute('id', `${item.id}`);
  decrementButton.textContent = '-';

  // Create the input element for quantity (hidden)
  const quantityInput = document.createElement('input');
  quantityInput.setAttribute('type', 'text');
  quantityInput.setAttribute('value', '0');
  quantityInput.setAttribute('id', item.id);
  quantityInput.setAttribute('name', item.name);
  quantityInput.setAttribute('hidden', '');

  // Append the decrement button and input to the bottom row
  bottomRow.appendChild(decrementButton);
  bottomRow.appendChild(quantityInput);

  // Append the card div and bottom row to the main container div
  cardContainer.appendChild(cardDiv);
  cardContainer.appendChild(bottomRow);
  
  return cardContainer;
}

// Adding liseners to the buttons so that they update the html
// function linkCardButtons(){
//   let buttons = document.querySelectorAll('.btn');
//   buttons.forEach((button) => {
//     button.addEventListener('click', () => {
//       console.log(button.value)

//       //in the html, values are assigned to buttons ex) a-1 for add with id of 1
//       let bRay = button.value.split('-');
//       let type = bRay[0];
//       let id = bRay[1];

//       //getting the quantity
//       let quantity = parseInt($(`#${id}`).val())

//       // if the button is clicked, add or subtract the quantity
//       if(type === 'a' && quantity < inventoryObj[id].quantity){
//         // $(`#${id}`).val(quantity + 1)
//         // $(`span[id=${id}]`).html($(`#${id}`).val())
//         addQuantity(id, quantity);

//       } else if(type === 'm' && quantity > 0){
//         // $(`#${id}`).val(quantity - 1)
//         // $(`span[id=${id}]`).html($(`#${id}`).val())
//         subQuantity(id, quantity)

//       }

//       console.log($(`#${id}`).val())
//     })
//   })
// }

function linkCards(){
  let cards = document.querySelectorAll('.card');
  cards.forEach((card) => {

    card.addEventListener('click', () => {
      //this looks a little messy, but we need query selectors to get the current count
      if(parseInt($(`input[id=${card.id}]`).val()) < inventoryObj[card.id].quantity){
        // $(`#${id}`).val(quantity + 1)
        // $(`span[id=${id}]`).html($(`#${id}`).val())
        addQuantity(card.id, parseInt($(`input[id=${card.id}]`).val()));
      }
    })
  })
}

function linkButtons(){
  let buttons = document.querySelectorAll('.btn-bottom');
  buttons.forEach((button) => {

    button.addEventListener('click', () => {
      if(parseInt($(`input[id=${button.id}]`).val()) > 0){
        // $(`#${id}`).val(quantity + 1)
        // $(`span[id=${id}]`).html($(`#${id}`).val())
        subQuantity(button.id, parseInt($(`input[id=${button.id}]`).val()));
      }
    })
  })

  let accept = document.getElementById('finalize')

  accept.addEventListener('click', () => {
    finalize();
  })

  // a siqq one liner
  // document.getElementById('finalize').addEventListener('click', () => finalize())
}

function addQuantity(id, quantity){
  $(`input[id=${id}]`).val(quantity + 1)
  $(`span[id=count-${id}]`).html($(`input[id=${id}]`).val())

  // add 1 to the cart and update the cart total
  if (cart.hasOwnProperty(id)) {
    // If yes, increment the quantity by 1
    cart[id]++;
  } else {
    // If not, add the item to the inventory with a quantity of 1
    cart[id] = 1;
  }
  // another sickk one liner
  // cart.hasOwnProperty(id) ? cart[id]++ : cart[id] = 1;

  // update the total and modify the screen total
  cart['total'] += inventoryObj[id].price;
  $('#total').html(`$${cart['total'].toFixed(2)}`);
  console.log(cart);
}

function subQuantity(id, quantity){
  $(`input[id=${id}]`).val(quantity - 1)
  $(`span[id=count-${id}]`).html($(`input[id=${id}]`).val())

  if (cart.hasOwnProperty(id)) {
    cart[id]-= 1;
  }
  cart['total'] -= inventoryObj[id].price;
  $('#total').html(`$${cart['total'].toFixed(2)}`);
  console.log(cart);
}

// this is the function that runs once the user accepts the checkout
function finalize(){
  console.log('finallize');

  // const fs = require('fs')
  // console.log(fs)

}

// function that is ran once the page loads
jQuery(async function() {
  try {
    let inventory = await fetchInventory();
    // console.log(inventory);
    if (inventory) {
      renderCards(inventory);
      // renderCards(inventory);
      linkButtons();
      linkCards();
      // console.log(inventoryObj[3].name);
    } else {
      // Handle the case where the inventory couldn't be fetched
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});
