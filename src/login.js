function promptLogin(){
  inputObj = [
    $(`#vm-id`).val(),
    $(`#user-id`).val(),
    $(`#password`).val()
  ]

  return inputObj;
}

module.exports = {
  promptLogin
};