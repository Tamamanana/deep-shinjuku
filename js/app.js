jQuery(function () {
  jQuery(".menu__circle").click(function () {
    // ハンバーガーボタンの動き
    jQuery(this).toggleClass("clicked");
    jQuery(".liner__wrapper").toggleClass("clicked");
  });

  // ハンバーガーボタンの開閉
  jQuery(".burger__btn").on("click", function () {
    let isClosed = jQuery(this).hasClass("close");

    // メニューが開いている場合
    if (isClosed) {
      jQuery(".burger__btn").removeClass("close");
      jQuery(".nav__wrapper").removeClass("fade");
      jQuery("body").removeClass("noscroll clicked");
    } else {
      // メニューが閉じている場合
      jQuery(".burger__btn").addClass("close");
      jQuery(".nav__wrapper").addClass("fade");
      jQuery("body").addClass("noscroll clicked");
    }
  });

  // メニューがクリックされたらハンバーガーメニューを閉じる
  jQuery(".nav__item a").on("click", function () {
    jQuery(".burger__btn").removeClass("close");
    jQuery(".nav__wrapper").removeClass("fade");
    jQuery("body").removeClass("noscroll clicked");
  });
});
