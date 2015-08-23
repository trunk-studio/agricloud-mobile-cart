
$( document ).delegate('#product', 'pagebeforecreate', function() {
  $('div.ui-content', '#product').installContent();
  $('div[data-role=footer]', '#product').installGlobalFooter();
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

$( document ).delegate("#product", "pagebeforecreate", function() {

  $.get("/product/1", function(data, status){

    var product = data.product;

    $('#product_stockQuantity').text(product.stockQuantity);
    $('#product_name').text(product.name);
    $('#product_description').text(product.description);
    $('#product_price').text(product.price);
    $('#product_image').attr("src", product.image);

    for (var i = 1; i <= product.stockQuantity; i++) {
      $('#order_quantity')
          .append($('<option></option>')
          .attr("value", i)
          .text(i + ' 箱'));
      $('#order_quantity option[value=1]').attr('selected', 'selected');
    }
  });


  $("#purchaseButton").delegate("click", function() {
	  var orderQuantity = $("#order_quantity").val();
		console.log('orderQuantity', orderQuantity);
		$("input[name='order[quantity]']").val(orderQuantity);

		if (localStorage.purchaseResult) {
   			purchaseResult = JSON.parse(localStorage["purchaseResult"]);
   			$("input[name='order[user][username]']").val(purchaseResult.order.user.username);
   			$("input[name='order[user][email]']").val(purchaseResult.order.user.email);
   			$("input[name='order[user][mobile]']").val(purchaseResult.order.user.mobile);
   			$("input[name='order[user][address]']").val(purchaseResult.order.user.address);
   			$("input[name='order[shipment][username]']").val(purchaseResult.order.shipment.username);
   			$("input[name='order[shipment][email]']").val(purchaseResult.order.shipment.email);
   			$("input[name='order[shipment][mobile]']").val(purchaseResult.order.shipment.mobile);
   			$("input[name='order[shipment][address]']").val(purchaseResult.order.shipment.address);
		}
	});

});
