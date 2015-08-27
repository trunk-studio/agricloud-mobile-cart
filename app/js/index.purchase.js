
$( document ).delegate("#purchase", "pagebeforecreate", function() {
  $('div.ui-content', '#purchase').installContent();
  //$('div[data-role=footer]', '#purchase').installGlobalFooter();

});


$( document ).delegate("#purchase", "pageshow", function() {

  var submitFlag = false;
  // purchase form submit button
  $("#purchaseForm").on('submit',function(e){
    console.log('=== purchaseForm submit button clicked ===');
    if(!submitFlag){
      submitFlag = true;
      var postData = $(this).serializeArray();
      var formURL = $(this).attr("action");
      console.log(formURL);
      console.log('=== log postData ===');
      console.log(postData);
      if(postData.length > 15 || !postData){
        $.ajax({
          url : formURL,
          type: "POST",
          data : postData,
          success:function(data, textStatus, jqXHR){
            console.log('=== submit successed ===');
            $(this).attr('disabled', 'disabled');
            var order = JSON.parse(data);
            var purchaseHistory = [];
            if (localStorage.purchaseHistory){
              purchaseHistory = JSON.parse(localStorage.purchaseHistory);
              // purchaseHistory.push(order);
              Array.prototype.push.apply(purchaseHistory,order.order);
            }else{
              purchaseHistory = JSON.parse(data);
            }
            console.log('=== log purchaseHistory ===');
            console.log(purchaseHistory);
            localStorage['purchaseHistory'] = JSON.stringify(purchaseHistory);
            window.location.replace("/index.html#order");
          },
          error: function(jqXHR, textStatus, errorThrown)
          {
            console.log('=== submit error ==>',errorThrown);
            var errTxt = '不好意思啦！我們遇到一點問題了：' + errorThrown;
            alert(errTxt);
          }
        });
      }else{
        console.log('=== no any product selected ===');
        alert("哇！我們忘記你選了哪些商品了:( \n\n我們去重新選擇商品:) ");
        window.location.replace("/index.html#product");
      }
    }else {
      console.log('=== from has being repert submit ===');
    }
    e.preventDefault();
  });

});

$( document ).delegate("#purchase", "pageshow", function() {

  // twzipcode
  console.log('=== load zipcode ===');
  $('#twzipcode').twzipcode({
    'detect': false,
    'zipcodeIntoDistrict': true
  });
  $('#twzipcode select').data('inline', 'true');
  $('#twzipcode > div').css('display', 'inline-block');

  $('#twzipcode_shipment').twzipcode({
    'zipcodeIntoDistrict': true
  });
  $('#twzipcode_shipment select').data('inline', 'true');
  $('#twzipcode_shipment > div').css('display', 'inline-block');

  // shipment-user sync info checkbox
	$('#order_infoto_shipment').change(function() {
    if($(this).is(":checked")) {
    	$("input[name='order[shipment][username]']").val($("input[name='order[user][username]']").val());
			$("input[name='order[shipment][email]']").val($("input[name='order[user][email]']").val());
			$("input[name='order[shipment][mobile]']").val($("input[name='order[user][mobile]']").val());
			$("input[name='order[shipment][address]']").val($("input[name='order[user][address]']").val());

  		$("input[name='order[user][username]']").change(function(){
  			$("input[name='order[shipment][username]']").val($(this).val());
  		});
  		$("input[name='order[user][email]']").change(function(){
  			$("input[name='order[shipment][email]']").val($(this).val());
  		});
  		$("input[name='order[user][mobile]']").change(function(){
  			$("input[name='order[shipment][mobile]']").val($(this).val());
  		});
  		$("input[name='order[user][address]']").change(function(){
  			$("input[name='order[shipment][address]']").val($(this).val());
  		});

      var twzipcode_shipment = $('#twzipcode_shipment');
      twzipcode_shipment.find("[name='order[shipment][city]']")
          .val($("select[name='order[user][city]']").val())
          .trigger('change');
      twzipcode_shipment.find("[name='order[shipment][district]']")
          .val($("select[name='order[user][district]']").val())
          .trigger('change');

    }else{
      $("input[name='order[shipment][username]']").val("");
			$("input[name='order[shipment][email]']").val("");
			$("input[name='order[shipment][mobile]']").val("");
			$("input[name='order[shipment][address]']").val("");
      $('#twzipcode_shipment').twzipcode('reset');
    }
  });

// });
//
//
// $( document ).delegate("#purchase", "pageshow", function() {

  var productName = $("div[name=productInfo] h2").map(function(){
    return $(this).text();
  }).get();

  var quantity = $("input[name='quantity[0]']").map(function(){
    return $(this).val();
  }).get();

  var productInfoArray = $("div[name=productInfo]").map(function(){
    return $(this).data();
  }).get();

  var priceSum = 0;
  var allProductQuantity = 0
  $('#purchaseTable tbody').empty();
  $.each(productInfoArray,function (i) {
    priceSum += (productInfoArray[i].price*quantity[i]);
    allProductQuantity += Number(quantity[i]);
    $('#purchaseTable').find('tbody:last').append(
      '<tr>'+
        '<td>'+
          '<small>'+productName[i]+'</small>'+
          '<input type=\"hidden\" name=\"order[orderItems]['+i+'][ProductId]\" value='+productInfoArray[i].orderproductid+'>'+
        '</td>'+
        '<td align="right">'+
          '$'+productInfoArray[i].price+
        '</td>'+
        '<td align="right">'+
          quantity[i]+
          '<input type=\"hidden\" name=\"order[orderItems]['+i+'][quantity]\" value='+quantity[i]+'>'+
        '</td>'+
        '<td align="right">'+
          '$'+productInfoArray[i].price*quantity[i]+
        '</td>'+
      '</tr>');
  });
  console.log(allProductQuantity);
  var shippingRate = 0;
  if(allProductQuantity == 1)
    shippingRate = 90;
  else
    shippingRate = allProductQuantity * 60;

  $('#purchaseTable').find('tbody:last').append(
    // '<tr>'+
    //   '<td colspan=\"4\" align=\"right\"><font color=\"red\">預購優惠九折 - <b>$'+ Math.round(priceSum*0.1) +'</b> 元</font></td>'+
    // '</tr>'+
    '<tr>'+
      '<td colspan=\"4\" align=\"right\"><font color=\"green\">運費 <b>$'+ shippingRate +'</b> 元</font></td>'+
    '</tr>'+
    '<tr>'+
      '<td colspan=\"4\" align=\"right\"><font color=\"blue\">訂單金額總計（含運費）  <b>$'+ priceSum+'</b> 元</font></td>'+
      '<input type=\"hidden\" name=\"order[paymentTotalAmount]\" value='+priceSum + shippingRate+'>'+
    '</tr>'
  );

});
