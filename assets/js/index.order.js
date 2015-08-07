$( document ).delegate("#order", "pagebeforecreate", function() {

  $('#twzipcode').twzipcode({
    'detect': true, // auto dectect user's geo location.
    'zipcodeIntoDistrict': true
  });

  $('#twzipcode_shipment').twzipcode({
    'zipcodeIntoDistrict': true
  });

});
