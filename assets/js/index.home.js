$( document ).delegate("#home", "pageshow", function() {

  $('.owl-carousel.header-slides')
  .owlCarousel({
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
