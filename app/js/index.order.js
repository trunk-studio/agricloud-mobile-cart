
$( document ).delegate('#order', 'pagecreate', function() {
  $('div.ui-content', '#order').installContent();
  $('div[data-role=footer]', '#order').installGlobalFooter();
});


$( document ).delegate("#order", "pageshow", function() {
	$('#syncOrderHistory').bind('click',function(){
		$('#syncInfo').slideDown(300);
	});

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
      }
    });
  });





	//方便測試用
	// var purchaseHistorySpec = {
	// 	purchaseHistory: [{
	// 		createdAt: 'YYYYMMDD',
	// 		priceSum: 1260,
	// 		User:{
	// 			id: 4,
	// 			username: 'testOrderUser',
	// 			email: 'smlsun@gmail.com',
	// 			admin: false,
	// 			createdAt: '2015-08-24T10:17:24.000Z',
	// 			updatedAt: '2015-08-24T10:17:24.000Z',
	// 			RoleId: null
	// 		},
	// 		Shipment: {
	// 			username: '收件者1',
	// 			mobile: '0922-222-222',
	// 			taxId: '123456789',
	// 			email: 'smlsun@gmail.com',
	// 			address: '收件者的家'
	// 		},
	// 		OrderItems: [{
	// 			name: '【特級】平安柚',
	// 			description: '每箱六台斤 甜度 ★★★★★',
	// 			quantity: 1,
	// 			ProductId: 5
	// 		}]
	// 	},
	// 	{
	// 		createdAt: 'YYYYMMDD',
	// 		priceSum: 1260,
	// 		User:{
	// 			id: 4,
	// 			username: 'testOrderUser',
	// 			email: 'smlsun@gmail.com',
	// 			admin: false,
	// 			createdAt: '2015-08-24T10:17:24.000Z',
	// 			updatedAt: '2015-08-24T10:17:24.000Z',
	// 			RoleId: null
	// 		},
	// 		Shipment: {
	// 			username: '收件者2',
	// 			mobile: '0922-222-222',
	// 			taxId: '123456789',
	// 			email: 'smlsun@gmail.com',
	// 			address: '收件者的家'
	// 		},
	// 		OrderItems: [{
	// 			name: '【特級】平安柚',
	// 			description: '每箱六台斤 甜度 ★★★★★',
	// 			quantity: 1,
	// 			ProductId: 5
	// 		}]
	// 	}]
	// };
	// localStorage["purchaseHistory"] = JSON.stringify(purchaseHistorySpec);

	$('#orderStatusList').empty();
  console.log('~~~~~~~~~~~~~~~~~~');
	if(localStorage.purchaseHistory){
		var list = JSON.parse(localStorage["purchaseHistory"]);
		$.each(list, function (i) {
			$('#orderStatusList').append(
			'<li class=\"ui-li-has-thumb ui-last-child\">'+
				'<a href=\"#orderStatus\" rel=\"external\" class=\"ui-btn ui-btn-icon-right ui-icon-carat-r\">'+
				'<img src=\"img/blackcat.jpg\" />'+
				'<h3>雲端文旦禮盒</h3>'+
				'<p>訂單日期：'+ list[i].createdAt +'</p>'+
				'<p>金額：$'+ list[i].priceSum +
				'元、配送地址：'+ list[i].Shipment.address +'</p>'+
			'</a></li>');
		});
	}
});
