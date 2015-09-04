
$( document ).delegate('#order', 'pagecreate', function() {
  $('div.ui-content', '#order').installContent();
  $('div[data-role=footer]', '#order').installGlobalFooter();
});


$( document ).delegate("#order", "pageshow", function() {

  $('#syncOrderHistory').bind('click',function(){
    $('#syncMail').slideDown(300);
    $('#syncOrderHistory').hide();
  });

  var showPurchaseList = function(list){
    $('#orderStatusList').empty();
    var status = {
      new: '尚未付款',
      paymentConfirm: '已付款，待出貨',
      deliveryConfirm: '已出貨完成'
    }
    $.each(list, function (i) {
        try{
            $('#orderStatusList').append(
            '<li class=\"ui-li-has-thumb ui-last-child\" id='+ i +'>'+
                '<a href=\"#orderStatus\" rel=\"external\" class=\"ui-btn ui-btn-icon-right ui-icon-carat-r\">'+
                '<img src=\"img/blackcat.jpg\" />'+
                '<h3>雲端文旦禮盒</h3>'+
                '<h3>狀態：'+status[list[i].status]+'</h3>'+
                '<p>訂單日期：'+ list[i].createdAt.split("T")[0] +'</p>'+
                '<p>金額：$'+ list[i].paymentTotalAmount +'元</p>'+
                '<p>配送地址：'+ list[i].Shipment.address +'</p>'+
            '</a></li>');
        }catch(e){

        }
    });
  };

  var urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results === null ? false : results[1];
  };

  var submitLock = false;
  $("#sendOrderSyncRequestForm").on('submit',function(e){
    console.log("=== send verified code clicked ===");
    e.preventDefault();
    e.stopImmediatePropagation();
    // check email length ensure no empty
    var email = $("input[name='email']").val();
    console.log("=== email is ==>",email.length);
    if(email.length<=5){
      console.log('=== email fiele is empty ===');
      alert("哇！你好像沒有輸入完整的 Email 喔！:(");
    }else{
      var postData = $(this).serializeArray();
      var formURL = $(this).attr("action");
      console.log("=== postData is ==>",postData);
      if(!submitLock){
        submitLock = true;
        $.ajax({
          url : formURL,
          type: "POST",
          data : postData,
          error: function (jqXHR, textStatus, errorThrown) {
            submitLock = false;
            // alert(JSON.parse(jqXHR.responseText).message);
            var errTxt = '我們查不到你的訂單記錄:( \n\n如果你很確定這是我們的問題，請跟我們聯絡囉:)';
            alert(errTxt);
          },
          success:function(data, textStatus, jqXHR){
            submitLock = false;
            alert('驗證碼已經寄到你的信箱了喔～');
          }
        });
      }else {
        console.log('!!! redundancy submit !!!');
        alert('');
      }
    }
  });

  // $("#orderStatusRequestForm").on('submit',function(e){
  //   e.preventDefault();
  //   e.stopImmediatePropagation();
  //   console.log('=== getOrderStatusRequestBtn ===');
  //   var postData = $(this).serializeArray();
  //   var formURL = $(this).attr("action");
  //
  //   console.log(formURL);
  //   console.log(postData);
  //   $.ajax({
  //     url : formURL,
  //     type: "POST",
  //     data : postData,
  //     success:function(data, textStatus, jqXHR){
  //       var data = JSON.parse(data)
  //       localStorage['purchaseHistory'] = JSON.stringify(data.purchaseHistory);
  //       showPurchaseList(data.purchaseHistory);
  //       $('#syncToken').hide();
  //       $('#syncOrderHistory').show();
  //     },
  //     error: function (data, textStatus, jqXHR) {
  //       alert('再確認一下喔，驗證碼錯誤哟 :)')
  //     }
  //   });
  // });



  if(localStorage.shipmentInfo){
    var shipmentInfo = JSON.parse(localStorage.shipmentInfo);
    var email = "";

    console.log('shipmentInfo', shipmentInfo);

    shipmentInfo.forEach(function(single){
      if(single.name === 'order[user][email]') email = single.value;
    });

    console.log('=== email ===', email);

    $.ajax({
      url : '/order/status',
      type: "POST",
      data : {email: email},
      success:function(data, textStatus, jqXHR){
        var data = JSON.parse(data)
        localStorage['purchaseHistory'] = JSON.stringify(data.purchaseHistory);
        showPurchaseList(data.purchaseHistory);
        $('#syncToken').hide();
        $('#syncOrderHistory').show();
      },
      error: function (data, textStatus, jqXHR) {
        alert('再確認一下喔，email 錯誤哟 :)')
      }
    });
  }


  console.log('~~~~~~~~~~~~~~~~~~');
  if(localStorage.purchaseHistory){
    var list = JSON.parse(localStorage["purchaseHistory"]);
    showPurchaseList(list);
  }

  var token = urlParam('token');
  if(token){
    $('#syncToken').slideDown(300);
    $('#token').val(token);
    $('#syncOrderHistory').hide();
  }
  $( document ).delegate('#orderStatusList li', 'click', function() {
    var orderStatus = JSON.parse(localStorage["purchaseHistory"])[this.id];
    console.log('=== orderStatus ===', orderStatus);

    $('#orderStatus_id').text(orderStatus.serialNumber);
    $('#orderStatus_createdDate').text(orderStatus.createdAt.split("T")[0]);

    $("div[name='orderItemInfo']").remove();
    $.each(orderStatus.OrderItems ,function(i){
      $('#orderItem').after(
        '<div name=\"orderItemInfo\" data-role=\"fieldcontain\" class=\"ui-field-contain\">'+
          '<label for=\"orderStatus_orderitem_name\">名稱:</label>'+
          '<span id=\"orderStatus_orderitem_name\">'+ orderStatus.OrderItems[i].name +'</span>'+
        '</div>'+

        '<div name=\"orderItemInfo\"  data-role=\"fieldcontain\" class=\"ui-field-contain\">'+
          '<label for=\"orderStatus_orderitem_quantity\">數量:</label>'+
          '<span id=\"orderStatus_orderitem_quantity\">'+ orderStatus.OrderItems[i].quantity +'</span>'+
        '</div>');
    });
    $('#orderStatus_paymentTotalAmount').text(orderStatus.paymentTotalAmount);

    $('#orderStatus_user_username').text(orderStatus.User.username);
    $('#orderStatus_user_email').text(orderStatus.User.email);
    $('#orderStatus_user_mobile').text(orderStatus.User.mobile);
    $('#orderStatus_user_address').text(orderStatus.User.address);

    $('#orderStatus_shipment_username').text(orderStatus.Shipment.username);
    $('#orderStatus_shipment_email').text(orderStatus.Shipment.email);
    $('#orderStatus_shipment_mobile').text(orderStatus.Shipment.mobile);
    $('#orderStatus_shipment_address').text(orderStatus.Shipment.address);

  });

});
