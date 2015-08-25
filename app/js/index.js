// Disable fixed toolbar auto hidden
//$('[data-position=fixed]').fixedtoolbar({ tapToggleBlacklist: "a, img, input, select, textarea, .ui-header-fixed, .ui-footer-fixed, .owl-carousel" })


$( "a" ).loader({ defaults: true });

$( document ).ajaxStart(function() {
  $.mobile.loading( "show", {
    text: "Loading...",
    textVisible: true,
    theme: "b",
    html: ""
  });
});

$( document ).ajaxComplete(function() { $.mobile.loading( "hide" ); });
$( document ).ajaxStop(function() { $.mobile.loading( "hide" ); });

(function( $ ) {

    $.fn.installGlobalFooter = function(path) {

      var __target = this;

      if (!path) {
        path = $(this).data('src');
      }

      $(this).load(path, function() {
        $(this).enhanceWithin();

        $('a[href="'+window.location.hash+'"]', this).addClass("ui-btn-active ui-state-persist");

      });

      return this;

    };

    $.fn.installContent = function(path, cb) {

      var __target = this;

      if (!path) {
        path = $(this).data('src');
      }



      $(this).load(path, function() {
        $(this).enhanceWithin();
        if (cb !== null && cb !== undefined){
          cb();
        }
      });



      return this;

    };

}( jQuery ));


$(function() {

	$("#orderStatusQueryForm").submit(function(e)
	{
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");
    $.ajax(
    {
      url : formURL,
      type: "POST",
      data : postData,
      success:function(data, textStatus, jqXHR)
      {
        var orderStatus = JSON.parse(data);
				$('#orderStatus_quantity').text(orderStatus.order.quantity);
				$('#orderStatus_id').text(orderStatus.order.id);
				$('#orderStatus_user_username').text(orderStatus.order.User.username);
				$('#orderStatus_user_email').text(orderStatus.order.User.email);
				$('#orderStatus_user_mobile').text(orderStatus.order.User.mobile);
				$('#orderStatus_user_address').text(orderStatus.order.User.address);

				$('#orderStatus_shipment_username').text(orderStatus.order.Shipment.username);
				$('#orderStatus_shipment_email').text(orderStatus.order.Shipment.email);
				$('#orderStatus_shipment_mobile').text(orderStatus.order.Shipment.mobile);
				$('#orderStatus_shipment_address').text(orderStatus.order.Shipment.address);

				$('#orderStatus_bank_accountId').text(orderStatus.bank.bank.accountId);
				$('#orderStatus_bank_id').text(orderStatus.bank.bank.id);

				window.location.assign("/index.html#orderStatus");


      },
      error: function(jqXHR, textStatus, errorThrown)
      {
        //if fails
      }
    });
    e.preventDefault(); //STOP default action
	});



	$("#purchaseForm").submit(function(e)
	{
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");
    $.ajax(
    {
      url : formURL,
      type: "POST",
      data : postData,
      success:function(data, textStatus, jqXHR)
      {
        var purchaseResult = JSON.parse(data);
				var product = purchaseResult.order.product;
				$('#purchaseResult_serialNumber').text(purchaseResult.order.id);
				$('#purchaseResult_orderQuantity').text(purchaseResult.order.quantity);
				$('#purchaseResult_productPrice').text(product.price);

				var orderPrice =
					parseInt(purchaseResult.order.quantity, 10) * parseInt(product.price, 10);

				$('#purchaseResult_orderPrice').text(orderPrice);
				$('#purchaseResult_bank_id').text(purchaseResult.bank.id);
				$('#purchaseResult_bank_accountId').text(purchaseResult.bank.accountId);

				window.location.assign("/index.html#purchaseResult");

		localStorage["purchaseResult"] = JSON.stringify(purchaseResult);
      },
      error: function(jqXHR, textStatus, errorThrown)
      {
        //if fails
      }
    });
    e.preventDefault(); //STOP default action
	});

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

        }else{
            $("input[name='order[shipment][username]']").val("");
   			$("input[name='order[shipment][email]']").val("");
   			$("input[name='order[shipment][mobile]']").val("");
   			$("input[name='order[shipment][address]']").val("");
        }
    });

});
