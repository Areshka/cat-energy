(function () {
  var mainNav = document.querySelector(".mainNav");
  var toggle = document.querySelector(".mainNav__toggle");

  mainNav.classList.remove('mainNav--nojs');

  toggle.addEventListener("click", function(event) {
    event.preventDefault();
    if(mainNav.classList.contains("mainNav--closed")) {
      mainNav.classList.remove("mainNav--closed");
      mainNav.classList.add("mainNav--opened");
    } else {
      mainNav.classList.remove("mainNav--opened");
      mainNav.classList.add("mainNav--closed");
    }
  });
})();
