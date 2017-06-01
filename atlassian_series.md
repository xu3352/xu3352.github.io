---
layout: page
title: Atlassian
header: Atlassian Series
group: navigation
tagline: Atlassian系列
number: 6
---
{% include JB/setup %}

{% for tag in site.tags %} 
  {% if (tag[0] == 'atlassian' 
        or tag[0] == 'jira' 
        or tag[0] == 'fisheye' 
        or tag[0] == 'crucible' 
        or tag[0] == 'confluence' 
        or tag[0] == 'crowd') %}
  <h2 id="{{ tag[0] }}-ref">{{ tag[0] }}</h2>
  <ul>
    {% assign pages_list = tag[1] %}  
    {% include JB/pages_list %}
  </ul>
  {% endif %}
{% endfor %}

