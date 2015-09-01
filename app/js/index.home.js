
$( document ).delegate('#home', 'pagecreate', function() {
  $('div.ui-content', '#home').installContent();
  $('div[data-role=footer]', '#home').installGlobalFooter();
});

$( document ).delegate('#home', 'pageshow', function() {

/*
  $('.owl-carousel', '#home').owlCarousel({
      responsiveClass: false,
      lazyLoad : true,
	    loop: true,
	    margin: 0,
	    nav: false,
      dots: true,
			autoHeight: false,
      items: 1
	});
  */
 
 if(localStorage.purchaseHistory){
   if(!$.isArray(JSON.parse(localStorage.purchaseHistory)))
    localStorage.removeItem('purchaseHistory');
 }
 
});
