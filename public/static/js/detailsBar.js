var $remixButton = $('.make-bar-button-remix');

$remixButton.on('click', function(e) {
  analytics.event('Remix Clicked', {label: window.location.href});
});
