$(function () {

  // Sidebar Toggler
  function sidebarToggle(toogle) {
    var sidebar = $('#sidebar');
    var padder = $('.content-padder');
    if (toogle) {
      $('.notyf').removeAttr('style');
      sidebar.css({ 'display': 'block', 'x': -300 });
      sidebar.animate({ opacity: 1, x: 0 }, 250, 'swing', function () {
        sidebar.css('display', 'block');
      });
      if ($(window).width() > 960) {
        padder.animate({ marginLeft: sidebar.css('width') }, 250, 'swing');
      }
    } else {
      $('.notyf').css({ width: '90%', margin: '0 auto', display: 'block', right: 0, left: 0 });
      sidebar.css({ 'display': 'block', 'x': '0px' });
      sidebar.animate({ x: -300, opacity: 0 }, 250, 'swing', function () {
        sidebar.css('display', 'none');
      });
      padder.animate({ marginLeft: 0 }, 250, 'swing');
    }
  }

  $('#sidebar_toggle').click(function () {
    var sidebar = $('#sidebar');
    var padder = $('.content-padder');
    if (sidebar.css('x') == '-300px' || sidebar.css('display') == 'none') {
      sidebarToggle(true)
    } else {
      sidebarToggle(false)
    }
  });

  function resize() {
    var sidebar = $('#sidebar');
    var padder = $('.content-padder');
    padder.removeAttr('style');
    if ($(window).width() < 960 && sidebar.css('display') == 'block') {
      sidebarToggle(false);
    } else if ($(window).width() > 960 && sidebar.css('display') == 'none') {
      sidebarToggle(true);
    }
  }

  if ($(window).width() < 960) {
    sidebarToggle(false);
  }

  $(window).resize(function () {
    resize()
  });

  $('.content-padder').click(function () {
    if ($(window).width() < 960) {
      sidebarToggle(false);
    }
  });


  var timeout = null;
  function checkStatus() {
    clearTimeout(timeout);
    var status = $('#status');
    status.text(status.data('online-text'));
    status.removeClass('uk-label-warning');
    status.addClass('uk-label-success');
    timeout = setTimeout(function () {
      status.text(status.data('away-text'));
      status.removeClass('uk-label-success');
      status.addClass('uk-label-warning');
    }, status.data('interval'));
  }

  var status = $('#status');
  if (status.length) {
    if (status.data('enabled') == true) {
      checkStatus();
      $(document).on('mousemove', function () {
        checkStatus();
      });
    } else {
      status.css({ 'display': 'none' });
    }
  }
})
