
$( document ).delegate("#splash", "pageshow", function() {

  setTimeout(function(){
          $.mobile.changePage("#home", "fade");
  }, 1000);

});

$( document ).delegate("#home", "pageshow", function() {
console.log("test");
  $('.owl-carousel.header-slides').owlCarousel({
	    loop:true,
	    margin:0,
	    nav:false,
			autoHeight:true,
	    responsive:{
	        0:{
	            items:1
	        }
	    }
	});

});

$( document ).delegate("#order", "pagebeforecreate", function() {

  $('#twzipcode').twzipcode({
    'detect': true, // auto dectect user's geo location.
    'zipcodeIntoDistrict': true
  });

  $('#twzipcode_shipment').twzipcode({
    'zipcodeIntoDistrict': true
  });

});

$( document ).delegate("#product", "pageshow", function() {

	$('.owl-carousel.product-slides').owlCarousel({
	    loop:true,
	    margin:0,
	    nav:false,
			autoHeight:true,
			responsive:{
	        0:{
	            items:1
	        }
	    }
	});

});
