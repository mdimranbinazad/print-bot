
function tabToSpace() {
  const text = $('#code').val().replace(/\t/g, '    ');
  $('#code').val(text);
}

$('#code').on('input', tabToSpace );

console.log('script ok');
