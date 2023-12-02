function connectCheckout(){
  console.log('connectCheckout')
  checkoutCard();
  checkoutCash();
}

function checkoutCard(){
  document.getElementById('card').addEventListener('click', () => {
    console.log('card')
    $('#creditCardInput').css('display', 'block')
    $('#cashInput').css('display', 'none')
    $(`#coc`).val(1)
  })
}

function checkoutCash(){
  document.getElementById('cash').addEventListener('click', () => {
    console.log('cash')
    $('#creditCardInput').css('display', 'none')
    $('#cashInput').css('display', 'block')
    $(`#coc`).val(2)
  })
}

function submitCreditCard() {
  var creditCardNumber = document.getElementById("ccNumber").value;
  var creditCardName = document.getElementById("ccName").value;
  var creditCardCCV = document.getElementById("ccCCV").value;
  var creditCardExpDate = document.getElementById("ccExpDate").value;
 
  // ** document.getElementById("creditCardInput").style.display = "none";

  if (creditCardNumber.length < 16 || creditCardNumber.length > 16) {
    alert("Credit card number must be 16 characters");
    return false;
  }

  if (creditCardCCV.length < 3 || creditCardCCV.length > 3) {
    alert("Credit card CCV must be 3 characters");
    return false;
  }

  if (creditCardExpDate.length < 4 || creditCardExpDate.length > 4) {
    alert("Credit card expiration date must be 4 characters (MMYY)");
    return false;
  }

  let validate = validateCard(creditCardNumber, creditCardName, creditCardCCV, creditCardExpDate)
  return validate;
}

function validateCard(creditCardNumber, creditCardName, creditCardCCV, creditCardExpDate){
  // send this data to CC provider
  if(false){
      alert('Card was not accepted')
      return false;
  }
  return true;
}

function submitCash(total){
  var cash = document.getElementById("cash").value;
  console.log(cash)
  console.log(total)
  if(cash >= total){
    return true;
  }
  return false;
}

module.exports = {
  connectCheckout,
  submitCreditCard,
  submitCash
};