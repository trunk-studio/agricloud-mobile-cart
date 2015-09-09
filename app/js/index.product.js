
$( document ).delegate('#product', 'pagebeforecreate', function() {
  $('div.ui-content', '#product').installContent();
  $('div[data-role=footer]', '#product').installGlobalFooter();
});

var bonusData;
$( document ).delegate("#product", "pageshow", function() {
/*
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
*/
  $("input[name='quantity[0]']").val(0);

  $("#purchaseButton").unbind('click').click( function() {
    console.log('=== purchaseButton clicked ===');
    // list array
    var quantity = $("input[name='quantity[0]']").map(function(){
      return $(this).val();
    }).get();
    // console.log('=== quantity is',quantity);
    // console.log('=== JSON.stringify(quantity) is',JSON.stringify(quantity));
    // compare
    var unOrder = [ "0","0","0","0","0" ];
    // console.log('=== JSON.stringify(unOrder) is',JSON.stringify(unOrder));
    if( JSON.stringify(quantity) != JSON.stringify(unOrder) ){
      window.location.replace("/index.html#purchase")
    }else{
      alert("不好意思啦！需要至少選擇一樣產品才能結帳哟 :) ");
    }
  });

  $("#rebateButton").click(function(){
    $('#rebateEmail').slideDown(300);
    $('#rebateButton').hide();
  });

  $("#rebateEmailBtn").click(function(){
    if($("#inputRebateEmail").val()==''){
      alert("要記得輸入Email哦～");
    }else{
      var quantity = $("input[name='quantity[0]']").map(function(){
        return $(this).val();
      }).get();
      var unOrder = [ "0","0","0","0","0" ];
      if( JSON.stringify(quantity) != JSON.stringify(unOrder) ){
        $.ajax({
          url : '/order/bonus',
          type: "GET",
          data : {email: $("#inputRebateEmail").val()},
          error: function (jqXHR, textStatus, errorThrown) {
            alert(JSON.parse(jqXHR.responseText).message);
            window.location.replace("/index.html#product")
          },
          success:function(data, textStatus, jqXHR){
            console.log(data);
            bonusData = JSON.parse(data);
          }
        });
        window.location.replace("/index.html#purchase")
      }else{
        alert("不好意思啦！需要至少選擇一樣產品才能結帳哟 :) ");
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


//   $("#purchaseButton").delegate("click", function() {
// 	  var orderQuantity = $("#order_quantity").val();
// 		console.log('orderQuantity', orderQuantity);
// 		$("input[name='order[quantity]']").val(orderQuantity);
//
// 		if (localStorage.purchaseResult) {
//    			purchaseResult = JSON.parse(localStorage["purchaseResult"]);
//    			$("input[name='order[user][username]']").val(purchaseResult.order.user.username);
//    			$("input[name='order[user][email]']").val(purchaseResult.order.user.email);
//    			$("input[name='order[user][mobile]']").val(purchaseResult.order.user.mobile);
//    			$("input[name='order[user][address]']").val(purchaseResult.order.user.address);
//    			$("input[name='order[shipment][username]']").val(purchaseResult.order.shipment.username);
//    			$("input[name='order[shipment][email]']").val(purchaseResult.order.shipment.email);
//    			$("input[name='order[shipment][mobile]']").val(purchaseResult.order.shipment.mobile);
//    			$("input[name='order[shipment][address]']").val(purchaseResult.order.shipment.address);
// 		}
// 	});

});
