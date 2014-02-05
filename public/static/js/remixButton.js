var $remixButton = $('.make-bar-button-remix');
$remixButton.on('click', function(e) {
  analytics.event('Remixed Clicked', {label: window.location.pathname});
});

