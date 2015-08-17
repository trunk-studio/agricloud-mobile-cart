
$( document ).delegate('#order', 'pagecreate', function() {
  $('div[data-role=footer]', '#order').installGlobalFooter();
});
