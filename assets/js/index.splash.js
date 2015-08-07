$( document ).delegate("#splash", "pageshow", function() {

  setTimeout(function(){
          $.mobile.changePage("#home", "fade");
  }, 1000);

});
