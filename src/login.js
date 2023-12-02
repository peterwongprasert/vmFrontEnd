function promptLogin(){
  inputObj = [
    $(`#vm-id`).val(),
    $(`#user-id`).val(),
    $(`#password`).val()
  ]
  $(`#total`).html('Select Item..');
  $(`.page1`).css('display', 'none');

  return inputObj;
}

module.exports = {
  promptLogin
};