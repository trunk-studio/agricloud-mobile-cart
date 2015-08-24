
$( document ).delegate('#order', 'pagecreate', function() {
  $('div.ui-content', '#order').installContent();
  $('div[data-role=footer]', '#order').installGlobalFooter();
});


$( document ).delegate("#order", "pageshow", function() {
	$('#syncOrderHistory').bind('click',function(){
		$('#syncInfo').slideDown(300);
	});
});