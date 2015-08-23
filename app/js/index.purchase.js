
$( document ).delegate("#purchase", "pagebeforecreate", function() {
  $('div.ui-content', '#purchase').installContent();
  //$('div[data-role=footer]', '#purchase').installGlobalFooter();

});

$( document ).delegate("#purchase", "pagecreate", function() {

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

});



$( document ).delegate("#purchase", "pageshow", function() {

  var productName = $("div[name=productPrice] h2").map(function(){
    return $(this).text();
  }).get();

  var quantity = $("input[name='quantity[0]']").map(function(){
    return $(this).val();
  }).get();

  var priceArray = $("div[name=productPrice]").map(function(){
    return $(this).data("price");
  }).get();

  var priceSum = 0;
  $.each(priceArray,function (i) {
    // console.log(productName[i]+','+quantity[i]+','+priceArray[i]);
    // console.log($('#showOrder'));
    priceSum += (priceArray[i]*quantity[i]);
    $('#purchaseTable').find('tbody:last').append(
      '<tr>'+
        '<td>'+
          '<small>'+productName[i]+'</small>'+
        '</td>'+
        '<td align="right">'+
          '$'+priceArray[i]+
        '</td>'+
        '<td align="right">'+
          quantity[i]+
          '<input type=\"hidden\" name=\"order[quantity]\" value=\"\">'+
        '</td>'+
        '<td align="right">'+
          '$'+priceArray[i]*quantity[i]+
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
    '</tr>'
  );


});