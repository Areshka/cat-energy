(function () {
  /*======   begin MENU   ======*/
  var mainNav = document.querySelector(".mainNav");
  var toggle = document.querySelector(".mainNav__toggle");

  mainNav.classList.remove('mainNav--nojs');

  toggle.addEventListener("click", function (event) {
    event.preventDefault();
    if (mainNav.classList.contains("mainNav--closed")) {
      mainNav.classList.remove("mainNav--closed");
      mainNav.classList.add("mainNav--opened");
    } else {
      mainNav.classList.remove("mainNav--opened");
      mainNav.classList.add("mainNav--closed");
    }
  });
  /*======    end MENU    ======*/

  /*======   begin SLIDER   ======*/
  var slider = document.querySelector(".slider__images");
  var imgBefore = slider.querySelector(".slider__image--before");
  var imgAfter = slider.querySelector(".slider__image--after");
  var radioBefore = document.getElementById("before");
  var radioAfter = document.getElementById("after");
  var track = document.querySelector(".slider__track");
  var thumb = track.querySelector(".slider__thumb");

  radioBefore.addEventListener("change", function(event) {
    event.preventDefault();
    if(radioBefore.checked == true) {
      imgBefore.style.width = "100%";
      imgAfter.style.width = "0";
      thumb.style.marginLeft = "0";
    }
  });

  radioAfter.addEventListener("change", function(event) {
    event.preventDefault();
    if(radioAfter.checked == true) {
      imgAfter.style.width = "100%";
      imgBefore.style.width = "0";
      thumb.style.marginLeft = "35px";
    }
  });

  /*======    end SLIDER    ======*/

})();
