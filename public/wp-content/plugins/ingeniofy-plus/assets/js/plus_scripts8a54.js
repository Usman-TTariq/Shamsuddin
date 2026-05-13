(function ($) {
  "use strict";

  //===== General Variables =====//
  var pgurl,
    width,
    wow,
    feat_caro,
    testi_caro,
    feat_caro2,
    course_caro,
    menu_height,
    scroll,
    countDownDate,
    x,
    now,
    distance,
    days,
    hours,
    minutes,
    seconds;

  if ($(".tq-count-down").length > 0) {
    //===== Count Down =====//
    (countDownDate = new Date("Dec 31, 2025 15:37:25").getTime()),
      // Update the count down every 1 second
      (x = setInterval(function () {
        // Get today's date and time
        (now = new Date().getTime()),
          // Find the distance between now and the count down date
          (distance = countDownDate - now),
          // Time calculations for days, hours, minutes and seconds
          (days = Math.floor(distance / (1000 * 60 * 60 * 24))),
          (hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          )),
          (minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
          (seconds = Math.floor((distance % (1000 * 60)) / 1000));
        // Output the result in an element with id="countDown"
        document.getElementById("tq-count-down").innerHTML =
          "<div class='tq-count-item'><span>" +
          days +
          "</span>" +
          "<span class='tq-count-cap'>Days</span></div>" +
          "<div class='tq-count-item'><span>" +
          hours +
          "</span>" +
          "<span class='tq-count-cap'>Hours</span></div>" +
          "<div class='tq-count-item'><span>" +
          minutes +
          "</span>" +
          "<span class='tq-count-cap'>Mins</span></div>" +
          "<div class='tq-count-item'><span>" +
          seconds +
          "</span>" +
          "<span class='tq-count-cap'>Secs</span></div>";
        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(x);
          document.getElementById("tq-count-down").innerHTML = "EXPIRED";
        }
      }, 1000));
  }

  $(document).ready(function () {
    //===== Menu Active =====//
    pgurl = window.location.href.substr(
      window.location.href.lastIndexOf("https://naudummy.com/") + 1
    );
    $("nav ul li a").each(function () {
      if ($(this).attr("href") == pgurl || $(this).attr("href") == "")
        $(this)
          .parent("li")
          .addClass("active")
          .parent()
          .parent()
          .addClass("active")
          .parent()
          .parent()
          .addClass("active");
    });

    //===== Width =====//
    width = window.innerWidth;

    //===== Side Menu =====//
    $(".tq-menu-btn").on("click", function () {
      $(".tq-side-menu").addClass("active");
      return false;
    });
    $(".tq-side-menu-close").on("click", function () {
      $(".tq-side-menu").removeClass("active");
      return false;
    });

    //===== Responsive Menu =====//
    $(".tq-res-menu-trigger").on("click", function () {
      $(".tq-res-menu").addClass("slidein");
      return false;
    });
    $(".tq-res-menu-close").on("click", function () {
      $(".tq-res-menu").removeClass("slidein");
    });
    $(".tq-res-menu li.menu-item-has-children > a > i").on(
      "click",
      function () {
        $(this).parent().parent().siblings("li").children("ul").slideUp();
        $(this).parent().parent().siblings("li").removeClass("active");
        $(this).parent().parent().children("ul").slideToggle();
        $(this).parent().parent().toggleClass("active");
        return false;
      }
    );

    //===== LightBox =====//
    if ($.isFunction($.fn.fancybox)) {
      $('[data-fancybox],[data-fancybox="gallery"]').fancybox({});
    }

    //===== Counter Up =====//
    if ($.isFunction($.fn.counterUp)) {
      $(".counter").counterUp({
        delay: 10,
        time: 2000
      });
    }

    //===== Audio Player =====//
    if ($.isFunction($.fn.musicPlayer)) {
      $(".tq-player").musicPlayer({
        elements: [
          "artwork",
          "information",
          "controls",
          "progress",
          "time",
          "volume"
        ]
      });
    }

    //=== Swiper Carousel ===//
    if ($(".swiper").length) {
      feat_caro = new Swiper(".tq-feat-caro", {
        slidesPerView: 1,
        spaceBetween: 30,
        effect: "fade",
        centeredSlides: false,
        loop: true,
        speed: 6000,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".tq-feat-pagination",
          clickable: true
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            centeredSlides: false
          },
          577: {
            slidesPerView: 1,
            centeredSlides: false
          },
          770: {
            slidesPerView: 1,
            centeredSlides: false
          },
          995: {
            slidesPerView: 1,
            centeredSlides: false
          },
          1020: {
            slidesPerView: 1,
            centeredSlides: false
          },
          1210: {
            slidesPerView: 1,
            centeredSlides: false
          }
        }
      });
      testi_caro = new Swiper(".tq-testi-caro", {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: false,
        grabCursor: true,
        loop: true,
        speed: 3000,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".tq-testi-pagination",
          clickable: true
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            centeredSlides: false
          },
          577: {
            slidesPerView: 1,
            centeredSlides: false
          },
          770: {
            slidesPerView: 1,
            centeredSlides: false
          },
          995: {
            slidesPerView: 1,
            centeredSlides: false
          },
          1020: {
            slidesPerView: 1,
            centeredSlides: false
          },
          1210: {
            slidesPerView: 1,
            centeredSlides: false
          }
        }
      });
      feat_caro2 = new Swiper(".tq-feat2-caro", {
        slidesPerView: 1,
        spaceBetween: 30,
        effect: "fade",
        centeredSlides: false,
        grabCursor: true,
        loop: true,
        speed: 5000,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".tq-feat-pagination",
          clickable: true
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            centeredSlides: false
          },
          577: {
            slidesPerView: 1,
            centeredSlides: false
          },
          770: {
            slidesPerView: 1,
            centeredSlides: false
          },
          995: {
            slidesPerView: 1,
            centeredSlides: false
          },
          1020: {
            slidesPerView: 1,
            centeredSlides: false
          },
          1210: {
            slidesPerView: 1,
            centeredSlides: false
          }
        }
      });
      course_caro = new Swiper(".tq-courses-caro", {
        slidesPerView: 3,
        spaceBetween: 45,
        centeredSlides: false,
        grabCursor: true,
        loop: true,
        speed: 2000,
        navigation: {
          nextEl: ".tq-swiper-button-next",
          prevEl: ".tq-swiper-button-prev"
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 24,
            centeredSlides: false
          },
          577: {
            slidesPerView: 1,
            spaceBetween: 24,
            centeredSlides: false
          },
          770: {
            slidesPerView: 2,
            spaceBetween: 24,
            centeredSlides: false
          },
          995: {
            slidesPerView: 2,
            spaceBetween: 24,
            centeredSlides: false
          },
          1020: {
            slidesPerView: 3,
            spaceBetween: 45,
            centeredSlides: false
          },
          1210: {
            slidesPerView: 3,
            spaceBetween: 45,
            centeredSlides: false
          }
        }
      });
    }
  }); //===== Document Ready Ends =====//

  //===== Sticky Header =====//
  $(window).on("scroll", function () {
    "use strict";

    menu_height = $("header").innerHeight();
    scroll = $(window).scrollTop();
    if (scroll >= menu_height) {
      $("body").addClass("sticky");
    } else {
      $("body").removeClass("sticky");
    }
  }); //===== Window onScroll Ends =====//
})(jQuery);
