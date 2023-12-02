// === How this all works: =======================================================================================
// Once the page is loaded, fetchInventory is called to grab all the local inventory data. 
// That inventory data gives us back an array of objects.
// That object is passed into renderCards and that function renders card DOM elements out of those objects 
// one by one using createCard. Once all the cards are created, we link the buttons using 
// linkButtons and linkCards.

// 
// ===============================================================================================================

// no longer in use
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
    // console.log(item[0]);
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
}

function modifyCheckoutHtml(cart, inventoryObj){
  // console.log(inventoryObj)
  let container = document.getElementById('checkout-list');
  container.innerHTML = '';

  let l = document.createElement('label')
  
  for(const key in cart){
    // let name = document.createElement('label');
    // let quantity = document.createElement('label');
    // let price = document.createElement('label');
    
    // Check if inventoryObj[key] is defined before accessing 'name'
    if (inventoryObj[key] && inventoryObj[key].name) {
      // let name = document.createElement('label');
      // let quantity = document.createElement('label');
      // let price = document.createElement('label');

      // name.textContent = inventoryObj[key].name;
      // quantity.textContent = cart[key] > 1 ? `x(${cart[key]})` : '';
      // price.textContent = inventoryObj[key].price;
      
      // container.appendChild(name);
      // container.appendChild(quantity);
      // container.appendChild(price);

      const columnDiv = document.createElement('div');
      columnDiv.className = 'column';

      // Create labels for Name, Quantity, and Price
      const name = document.createElement('label');
      const quantity = document.createElement('label');
      const price = document.createElement('label');

      // Assign values to labels based on itemData
      name.textContent = inventoryObj[key].name;
      quantity.textContent = cart[key] > 1 ? `x(${cart[key]})` : '';
      price.textContent = inventoryObj[key].price;

      // Add 'item-name' class to the Name label
      name.classList.add('item-name');

      // Append labels to the columnDiv
      columnDiv.appendChild(name);
      columnDiv.appendChild(quantity);
      columnDiv.appendChild(price);
      container.appendChild(columnDiv);
    }
  }

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
  modifyCheckoutHtml(cart, inventoryObj);
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
    delete cart[id];
  }
  cart['total'] -= parseFloat(inventoryObj[id].price);
  $('#total').html(`$${parseFloat(cart['total']).toFixed(2)}`);
  modifyCheckoutHtml(cart, inventoryObj);
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
