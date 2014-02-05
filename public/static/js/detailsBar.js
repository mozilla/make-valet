var $toggle = $('.make-bar-expand-collapse'),
    $details = $('.make-details'),
    $infoFrame = $('#make-details-iframe'),
    $remixButton = $('.make-bar-button-remix'),
    $arrow = $('img', $toggle),
    $projectContainer = $(".embed-container"),
    $detailsContainer = $('.make-details-page'),
    detailsHidden = window.location.toString().indexOf('details=hidden') > -1,
    nav_open = false;

$remixButton.on('click', function(e) {
  analytics.event('Remix Clicked', {label: window.location.href});
});

$toggle.on('click', function(e) {
  analytics.event('Details Toggled', {label: window.location.href});
  $details.slideToggle({
    duration: 200,
    easing: 'linear'
  });

  // Defer loading of the iframe until the user actually wants to see it
  if (!$infoFrame.attr("src")) {
    $infoFrame.attr("src", $infoFrame.data("src"));
  }

  if (nav_open) {
    nav_open = false;
    $projectContainer.removeClass("open");
    $arrow.attr('src', '/static/images/icon-arrow-down.png');
  } else {
    nav_open = true;
    $projectContainer.addClass("open");
    $arrow.attr('src', '/static/images/icon-arrow-up.png');
  }
});

if (detailsHidden) {
  $projectContainer.addClass('no-details');
  $detailsContainer.addClass('no-details');
}
