var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$( document ).delegate('#youtube', 'pageshow', function() {
  var v = getUrlParameter('v');
  console.log(v);
  if (!v) {
    v = '4qDWPrPkzZo';
  }

  $('.myWrapper', '#youtube').html('');

  $('<iframe/>', {
    'src': 'https://www.youtube.com/embed/'+v+'?autoplay=1',
    frameborder: 0,
    allowfullscreen: 'yes'
  }).appendTo($('.myWrapper', '#youtube'));

});
