---
layout: page
title: Vim
header: Practical Vim
group: navigation
tagline: 实用的Vim
number: 5
---
[//]: # {% include JB/setup %}

{% for tag in site.tags %} 
  {% if tag[0] == 'practical-vim' %}

  <h2 id="{{ tag[0] }}-ref">{{ tag[0] }}</h2>
  <ul>
    {% assign pages_list = tag[1] %}  
    {% include JB/pages_list %}
  </ul>
  {% endif %}
{% endfor %}

