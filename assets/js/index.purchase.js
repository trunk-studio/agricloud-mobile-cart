$( document ).delegate("#purchase", "pagebeforecreate", function() {

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
