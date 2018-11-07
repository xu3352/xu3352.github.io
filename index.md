---
layout: page
title: Hello World!
tagline: "Just for Fun"
number: 1
---
{% include JB/setup %}

# Profile
```yaml
title : XU3352'S TECH BLOG

author :
  name : YINGLONG XU
  email : xu3352@gmail.com
  github : github.com/xu3352
```

# Latest Posts
<ul class="posts">
  {% for post in site.posts limit:25 %}
    <li>
        <span>{{ post.date | date_to_string }}</span> &raquo; 
        <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
        <small> {{ post.tagline }}</small>
    </li>
  {% endfor %}
</ul>

