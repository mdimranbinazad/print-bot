
function tabToSpace() {
  const text = $('#code').val().replace(/\t/g, '    ');
  $('#code').val(text);
}

$('#code').on('input', tabToSpace );

function disableOnClick(){
  $('.disableOnClick').on('click', (function() {
    const clickedItems = {};
    return function() {
      if (clickedItems[this]) return false;
      clickedItems[this] = true;
      $(this).addClass('disabled');
      return true;
    };
  }()));
};

disableOnClick();
