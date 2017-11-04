
/**
 * Convert tabs to space in the textbox used for user code input
 */
function tabToSpace() {
  const text = $('#code').val().replace(/\t/g, '    ');
  $('#code').val(text);
}

$('#code').on('input', tabToSpace );

/**
 * Disables button after clicking it once
 */
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

/**
 * Display flash messages
 */
$.notify.defaults({
  autoHideDelay: 15000
});

for (const val in flash) {
  const len = flash[val].length;
  for (let i = 0; i < len; i++) {
    $.notify(flash[val][i], val);
  }
}

/**Vertical Centering**/
(function(){
  var windowHeight = $(window).height();
  var htmlHeight = $('html').height();

  $('#fill-view').addClass('align-items-center');
  var fillView = $('#fill-view').height();
  if (htmlHeight + 5 < windowHeight) {
    var dif = windowHeight - htmlHeight;
    $('#fill-view').animate({
      "min-height": fillView + dif
    }, 300);
  }
})();
