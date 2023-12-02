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
function renderCards(inventory, inventoryObj){
  console.log('render cards')
  console.log(inventoryObj);
  // inventory = inventory[0];
  

  //pass the inventory into this function and cycle through it's data creating cards
  inventory.forEach((item) => {
    console.log(item[0]);
    // we might as well populate the inventory object here too. 
    inventoryObj[item[0].id] = item[0];
    // console.log(inventoryObj[item.id])
    let appending = createCard(item[0]);

    document.getElementById('card-list').appendChild(appending);
  })

  // inventory.forEach((item) => {
  //   console.log(item)
  // })
}

// not finished, but here is the function to create the cards dynamically
// once we have all the necessary data, we can pass objects into this function item by item
function createCard(item){
  console.log("item: " + item);
  // creating a card DOM element from top down
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
  priceHeading.textContent = `$${parseFloat(item.price).toFixed(2)}`;
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

function linkCards(cart, inventoryObj){
  let cards = document.querySelectorAll('.card');
  cards.forEach((card) => {

    // console.log(inventoryObj[card.id])
    card.addEventListener('click', () => {
      //this looks a little messy, but we need query selectors to get the current count
      //if the item's cart amount is less than the inventory
      console.log(inventoryObj)
      if(parseInt($(`input[id=${card.id}]`).val()) < inventoryObj[card.id].quantity){
        // $(`#${id}`).val(quantity + 1)
        // $(`span[id=${id}]`).html($(`#${id}`).val())
        addQuantity(cart, inventoryObj, card.id, parseInt($(`input[id=${card.id}]`).val()));
      }
    })
  })
}

function linkButtons(cart, inventoryObj){
  let buttons = document.querySelectorAll('.btn-bottom');
  buttons.forEach((button) => {

    button.addEventListener('click', () => {
      if(parseInt($(`input[id=${button.id}]`).val()) > 0){
        // $(`#${id}`).val(quantity + 1)
        // $(`span[id=${id}]`).html($(`#${id}`).val())
        subQuantity(cart, inventoryObj, button.id, parseInt($(`input[id=${button.id}]`).val()));
      }
    })
  })

  let accept = document.getElementById('finalize')

  accept.addEventListener('click', () => {
    finalize();
  })
}

function addQuantity(cart, inventoryObj, id, quantity){
  $(`input[id=${id}]`).val(quantity + 1)
  $(`span[id=count-${id}]`).html($(`input[id=${id}]`).val())

  // add 1 to the cart and update the cart total
  if(cart.hasOwnProperty(id)) {
    // If yes, increment the quantity by 1
    cart[id]++;
  } else {
    // If not, add the item to the inventory with a quantity of 1
    cart[id] = 1;
  }

  if(cart[id] > 0){
    $(`button[id=${id}]`).css('display', 'block')
  }

  // update the total and modify the screen total
  cart['total'] += parseFloat(inventoryObj[id].price);
  $('#total').html(`$${parseFloat(cart['total']).toFixed(2)}`);
  console.log(cart);
}

function subQuantity(cart, inventoryObj, id, quantity){
  $(`input[id=${id}]`).val(quantity - 1)
  $(`span[id=count-${id}]`).html($(`input[id=${id}]`).val())

  if(cart.hasOwnProperty(id)) {
    cart[id]-= 1;
  }
  if(cart[id] === 0){
    $(`button[id=${id}]`).css('display', 'none')
  }
  cart['total'] -= parseFloat(inventoryObj[id].price);
  $('#total').html(`$${parseFloat(cart['total']).toFixed(2)}`);
  console.log(cart);
}

// this is the function that runs once the user accepts the checkout
function finalize(){
  console.log('finallize');
}

// function that is ran once the page loads
async function init(inventory, cart, inventoryObj) {
  console.log('modules init loaded')
  // try {
    // let inventory = await fetchInventory();
    // console.log(inventory);
    console.log(inventoryObj)
    if (inventory) {
      renderCards(inventory, inventoryObj);
      linkButtons(cart, inventoryObj);
      linkCards(cart, inventoryObj);
      // console.log(inventoryObj[3].name);
    } else {
      // Handle the case where the inventory couldn't be fetched
    }
  // } catch (error) {
  //   console.error('An error occurred:', error);
  // }
};

// GENERATED
// async function init(cart, inventoryObj) {
//   console.log('modules init loaded');
//   try {
//     const inventory = await fetchInventory();
//     if (inventory) {
//       renderCards(inventory, inventoryObj);
//       linkButtons(cart, inventoryObj);
//       linkCards(cart, inventoryObj);
//     } else {
//       // Handle the case where the inventory couldn't be fetched
//     }
//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }

module.exports = {
  init,
  fetchInventory,
  renderCards,
  createCard,
  linkCards,
  linkButtons,
  addQuantity,
  subQuantity,
  finalize,
};
