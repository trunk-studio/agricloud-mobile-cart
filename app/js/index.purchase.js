
$( document ).delegate("#purchase", "pagebeforecreate", function() {
  $('div.ui-content', '#purchase').installContent();
  //$('div[data-role=footer]', '#purchase').installGlobalFooter();

});

$( document ).delegate("#purchase", "pageshow", function() {

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

  $("#purchaseForm").on('submit',function(e){
    e.preventDefault();

    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");

    console.log(formURL);
    console.log(postData);
    $.ajax({
      url : formURL,
      type: "POST",
      data : postData,
      success:function(data, textStatus, jqXHR){
        console.log(data);
      }
    });
  });


});



$( document ).delegate("#purchase", "pageshow", function() {

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
  $('#purchaseTable tbody').empty();
  $.each(productInfoArray,function (i) {
    priceSum += (productInfoArray[i].price*quantity[i]);
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

  $('#purchaseTable').find('tbody:last').append(
    '<tr>'+
      '<td colspan=\"4\" align=\"right\"><font color=\"red\">預購優惠九折 - <b>$'+ Math.round(priceSum*0.1) +'</b> 元</font></td>'+
    '</tr>'+
    '<tr>'+
      '<td colspan=\"4\" align=\"right\"><font color=\"green\">運費 <b>$'+ 180 +'</b> 元</font></td>'+
    '</tr>'+
    '<tr>'+
      '<td colspan=\"4\" align=\"right\"><font color=\"blue\">訂單金額總計（含運費）  <b>$'+ Math.round(priceSum*0.9+180) +'</b> 元</font></td>'+
      '<input type=\"hidden\" name=\"order[priceSum]\" value='+Math.round(priceSum*0.9+180)+'>'+
    '</tr>'
  );


});
