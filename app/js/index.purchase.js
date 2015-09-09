
function isNumeric(num) {
    return (num > 0 || num === 0 || num === '0' || num < 0) && num !== true && isFinite(num);
}


$( document ).delegate("#purchase", "pagebeforecreate", function() {
  $('div.ui-content', '#purchase').installContent();
  //$('div[data-role=footer]', '#purchase').installGlobalFooter();

});


$( document ).delegate("#purchase", "pageshow", function() {


  if(localStorage.shipmentInfo){
    var shipmentInfo = JSON.parse(localStorage["shipmentInfo"]);
    for (var i = 11; i<shipmentInfo.length; i++) {
      var find = $("input[name=\"" + shipmentInfo[i].name + "\"]");
      if(find.length)
        $("input[name=\"" + shipmentInfo[i].name + "\"]").val(shipmentInfo[i].value);
    }
  }
  // purchase form submit button
  var submitLock = false;
  $("#purchaseForm").on('submit',function(e){
    console.log('=== purchase submit button clicked ===');
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");
    console.log('=== log formURL ==>',formURL);
    console.log('=== log postData ==>',postData);
    localStorage["shipmentInfo"] = JSON.stringify(postData);
    // check if postData(cart) is empty
    if(postData === undefined || postData.length < 16){
      console.log('=== no any product selected ===');
      alert("哇！我們忘記你選了哪些商品了:( \n\n我們去重新選擇商品吧:)");
      window.location.replace("/index.html#product");
    }else{
      // get payer info
      var name = $("input[name='order[user][username]']").val();
      var email = $("input[name='order[user][email]']").val();
      var mobile = $("input[name='order[user][mobile]']").val();
      var address = $("input[name='order[user][address]']").val();
      var city = $("select[name='order[user][city]']").val();
      console.log('=== count name ==>',name.length);
      console.log('=== count email ==>',email.length);
      console.log('=== count mobile ==>',mobile.length);
      console.log('=== count address ==>',address.length);
      console.log('=== count city selected ==>',city.length);
      // check if user empty.
      if(name.length<=1 || email.length<=5 || mobile.length<=8 || address.length<=3  || city.length<2){
        if(name.length==0 || email.length==0 || mobile.length==0 || address.length==0)
          alert("哇！訂購者資訊好像有欄位忘記填囉！:(\n\n（姓名/Email/電話/縣市/地址）");
        else if(mobile.length<=8)
          alert("哇！訂購者電話號碼不足 9 碼喔！:(");
        else if(address.length<=3)
          alert("訂購者地址太短囉！是不是填錯了呢？:(");
        else if(city.length<2)
          alert("請選擇訂購者所在縣市:)");
        else if(name.length<=1)
          alert("哇！不好意思！訂購者姓名請至少輸入兩個字 :)");
      }else{
        // get shipment info
        var sname = $("input[name='order[shipment][username]']").val();
        var semail = $("input[name='order[shipment][email]']").val();
        var smobile = $("input[name='order[shipment][mobile]']").val();
        var saddress = $("input[name='order[shipment][address]']").val();
        var scity = $("select[name='order[user][city]']").val();
        console.log('=== count sname ==>',sname.length);
        console.log('=== count semail ==>',semail.length);
        console.log('=== count smobile ==>',smobile.length);
        console.log('=== count saddress ==>',saddress.length);
        console.log('=== count scity selected ==>',scity.length);
        // check if shipment empty
        if(sname.length<=1 || smobile.length<=8 || saddress.length<=3 || city.length<2){
          if(sname.length==0 || semail.length==0 || smobile.length==0 || saddress.length==0)
            alert("收件人欄位是空的喲！\n\n（或是點選「同訂購者資訊」）");
          else if(smobile.length<=8)
            alert("哇！收件人電話號碼不足 9 碼喔！:(");
          else if (saddress.length<=3)
            alert("收件人地址太短囉！是不是填錯了呢？:(");
          else if(scity.length<2)
            alert("請選擇收件人所在縣市:)");
          else if(sname.length<=1)
            alert("哇！不好意思！收件人姓名請至少輸入兩個字 :)");
        }else{
          // check mobile/smobile numeric
          if(!isNumeric(mobile) || !isNumeric(smobile)){
              alert("哇！訂購者/收件人電話號碼含有非數字哟 :(");
          }else{
            // check any redundancy submit.
            if(!submitLock){
              submitLock = true;
              $.ajax({
                url : formURL,
                type: "POST",
                data : postData,
                error: function (jqXHR, textStatus, errorThrown) {
                  //console.log('=== submit error ==>',errorThrown);
                  var errTxt = '不好意思啦！:(\n\n"' +
                    JSON.parse(jqXHR.responseText).message +
                    '\"\n\n請使用下一頁的方式聯絡我們，我們會立刻處理:)';
                  alert(errTxt);
                  // unlock after submit failed.
                  submitLock = false;
                  window.location.replace("/index.html#contact");
                },
                success:function(data, textStatus, jqXHR){
                  console.log('=== submit successed ===');
                  $(this).attr('disabled', 'disabled');
                  var order = JSON.parse(data);
                  var purchaseHistory = [];

                  if (localStorage.purchaseHistory){
                    purchaseHistory = JSON.parse(localStorage.purchaseHistory);
                  }
                  purchaseHistory.push(JSON.parse(data).order);

                  console.log('=== data ===', data);

                  localStorage['purchaseHistory'] = JSON.stringify(purchaseHistory);
                  // unlock after submit successed.
                  submitLock = false;

                  alert('顯示訊息：恭喜你！訂單已經建立囉！\n\n相關資訊請至您的信箱查看，請記得確認匯款及相關資訊是否正確喔！:)');
                  setTimeout(function(){ window.location.replace("/index.html#order"); },500);
                }
              });
            }else {
              console.log('!!! redundancy submit !!!');
            } // check any redundancy submit end
          } // check mobile/smobile numeric end
        } // check if shipment info empty end
      } // check if user info empty end
    } // check if cart(postDate) empty end
    e.preventDefault();
    e.stopImmediatePropagation();
  }); // purchase form submit button end

});

$( document ).delegate("#purchase", "pageshow", function() {

  // twzipcode
  console.log('=== load zipcode ===');
  if(localStorage.shipmentInfo){
    var shipmentInfo = JSON.parse(localStorage["shipmentInfo"]);
    $('#twzipcode').twzipcode({
      'detect': false,
      'zipcodeIntoDistrict': true,
      'zipcodeSel'  : shipmentInfo[21].value,
      'countySel'   : shipmentInfo[19].value,
      'districtSel' : shipmentInfo[20].value
    });

    $('#twzipcode_shipment').twzipcode({
      'zipcodeIntoDistrict': true,
      'zipcodeSel'  : shipmentInfo[28].value,
      'countySel'   : shipmentInfo[26].value,
      'districtSel' : shipmentInfo[27].value
    });

  }else{
    $('#twzipcode').twzipcode({
      'detect': false,
      'zipcodeIntoDistrict': true
    });

    $('#twzipcode_shipment').twzipcode({
      'zipcodeIntoDistrict': true
    });
  }
  $('#twzipcode select').data('inline', 'true');
  $('#twzipcode > div').css('display', 'inline-block');

  $('#twzipcode_shipment select').data('inline', 'true');
  $('#twzipcode_shipment > div').css('display', 'inline-block');

  // shipment-user sync info checkbox
	$('#order_infoto_shipment').change(function() {
    if($(this).is(":checked")) {
      // copy user to shipment
    	$("input[name='order[shipment][username]']").val($("input[name='order[user][username]']").val());
			$("input[name='order[shipment][email]']").val($("input[name='order[user][email]']").val());
			$("input[name='order[shipment][mobile]']").val($("input[name='order[user][mobile]']").val());
			$("input[name='order[shipment][address]']").val($("input[name='order[user][address]']").val());
      // target change
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
      // twzipcode_shipment
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

  var productName = $("div[name=productInfo] h2").map(function(){
    return $(this).text();
  }).get();

  var quantity = $("input[name='quantity[0]']").map(function(){
    return $(this).val();
  }).get();

  var price = $("input[name='price']").map(function(){
    return $(this).val();
  }).get();


  var productInfoArray = $("div[name=productInfo]").map(function(){
    return $(this).data();
  }).get();

  var rebateEmail = $("#inputRebateEmail").val()
  if(rebateEmail!=""){
    $("input[name='order[user][email]']").val(rebateEmail);
    $("input[name='order[shipment][email]']").val(rebateEmail);
  }

  var priceSum = 0;
  var allProductQuantity = 0
  $('#purchaseTable tbody').empty();
  $.each(productInfoArray,function (i) {
    priceSum += (price[i] * quantity[i]);
    allProductQuantity += Number(quantity[i]);
    $('#purchaseTable').find('tbody:last').append(
      '<tr>'+
        '<td>'+
          '<small>'+productName[i]+'</small>'+
          '<input type=\"hidden\" name=\"order[orderItems]['+i+'][ProductId]\" value='+productInfoArray[i].orderproductid+'>'+
        '</td>'+
        '<td align="right">'+
          '$'+ price[i] +
          '<input type=\"hidden\" name=\"order[orderItems]['+i+'][price]\" value='+price[i]+'>'+
        '</td>'+
        '<td align="right">'+
          quantity[i]+
          '<input type=\"hidden\" name=\"order[orderItems]['+i+'][quantity]\" value='+quantity[i]+'>'+
        '</td>'+
        '<td align="right">'+
          '$'+ price[i] * quantity[i]+
        '</td>'+
      '</tr>');
  });
  console.log('=== allProductQuantity ==>',allProductQuantity);
  var shippingRate = 0;
  if(allProductQuantity == 1)
    shippingRate = 90;
  else
    shippingRate = allProductQuantity * 60;

  if(bonus !== null ){
    $("input[name='order[usedDiscountPoint]']").val(true);
  }else{
    $("input[name='order[usedDiscountPoint]']").val(false);
    bonus = 0;
  }

  $('#purchaseTable').find('tbody:last').append(
    // '<tr>'+
    //   '<td colspan=\"4\" align=\"right\"><font color=\"red\">訂購優惠九折 - <b>$'+ Math.round(priceSum*0.1) +'</b> 元</font></td>'+
    // '</tr>'+
    '<tr>'+
      '<td colspan=\"4\" align=\"right\"><font color=\"green\">運費 <b>$'+ shippingRate +'</b> 元</font></td>'+
    '</tr>'+
    '<tr>'+
      '<td colspan=\"4\" align=\"right\"><font color=\"green\">預購金折扣 <b>$'+ bonus +'</b> 元</font></td>'+
    '</tr>'+
    '<tr>'+
      '<td colspan=\"4\" align=\"right\"><font color=\"blue\">訂單金額總計（含運費）  <b>$'+ (priceSum + shippingRate - bonus)+'</b> 元</font></td>'+
      '<input type=\"hidden\" name=\"order[paymentTotalAmount]\" value='+(priceSum + shippingRate - bonus) +'>'+
    '</tr>'
  );


  // transform window if postData(cart) is empty.
  var checkLock = false;
  if(!checkLock){
    checkLock = true;
    console.log('=== checkLock status ==>',checkLock);
    console.log('=== allProductQuantity ==>',allProductQuantity);
    if( allProductQuantity === 0 ){
      console.log('=== no any product selected ===');
      alert("哇！我們忘記你選了哪些商品了:( \n\n我們去重新選擇商品吧:)");
      window.location.replace("/index.html#product");
    }
  }

});
