
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


});
