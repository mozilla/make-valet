var _gaq = _gaq || [];
_gaq.push(['_setAccount', '{{ GA_ACCOUNT }}']);
{% if GA_DOMAIN %}
_gaq.push(['_setDomainName', '{{ GA_DOMAIN }}']);
{% endif %}
_gaq.push(['_trackPageview']);
