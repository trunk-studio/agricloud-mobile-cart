
$( document ).delegate('#contact', 'pagecreate', function() {
  $('div.ui-content', '#contact').installContent();
  $('div[data-role=footer]', '#contact').installGlobalFooter();
});
