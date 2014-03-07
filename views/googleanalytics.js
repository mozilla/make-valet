{% if GA_ACCOUNT %}
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', '{{ GA_ACCOUNT }}']);
  {% if GA_DOMAIN %}
  _gaq.push(['_setDomainName', '{{ GA_DOMAIN }}']);
  {% endif %}
  _gaq.push(['_trackPageview', window.location.pathname]);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
{% endif %}
