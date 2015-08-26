
$( document ).delegate('#order', 'pagecreate', function() {
  $('div.ui-content', '#order').installContent();
  $('div[data-role=footer]', '#order').installGlobalFooter();
});


$( document ).delegate("#order", "pageshow", function() {
	$('#syncOrderHistory').bind('click',function(){
		$('#syncInfo').slideDown(300);
	});

  var showPurchaseList = function(list){
    $('#orderStatusList').empty();
    $.each(list, function (i) {
        try{
            $('#orderStatusList').append(
            '<li class=\"ui-li-has-thumb ui-last-child\">'+
                '<a href=\"#orderStatus\" rel=\"external\" class=\"ui-btn ui-btn-icon-right ui-icon-carat-r\">'+
                '<img src=\"img/blackcat.jpg\" />'+
                '<h3>雲端文旦禮盒</h3>'+
                '<p>訂單日期：'+ list[i].createdAt +'</p>'+
                '<p>金額：$'+ list[i].priceSum +
                '元、配送地址：'+ list[i].Shipment.address +'</p>'+
            '</a></li>');
        }catch(e){

        }
    });
  };

  var urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results === null ? false : results[1];
  };

  $("#sendOrderSyncRequestForm").on('submit',function(e){
    console.log("~~~~~~~~~~~~");
    e.preventDefault();
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");
    $.ajax({
      url : formURL,
      type: "POST",
      data : postData,
      success:function(data, textStatus, jqXHR){}
    });
  });

  $("#orderStatusRequestForm").on('submit',function(e){
    e.preventDefault();
    console.log('=== getOrderStatusRequestBtn ===');
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
        var list = JSON.parse(data).purchaseHistory
        localStorage['purchaseHistory'] = JSON.stringify(list);
        showPurchaseList(list);
      }
    });
  });


  console.log('~~~~~~~~~~~~~~~~~~');
  if(localStorage.purchaseHistory){
    var list = JSON.parse(localStorage["purchaseHistory"]);
    showPurchaseList(list);
  }

  var token = urlParam('token');
  if(token){
    $('#syncInfo').slideDown(300);
    $('#token').val(token);
  }

});
