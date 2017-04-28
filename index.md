---
layout: page
title: Hello World!
tagline: "Just for Fun"
---
{% include JB/setup %}

# Profile
```yaml
title : XU3352'S TECH BLOG

author :
  name : YINGLONG XU
  email : xu3352@gmail.com
  github : xu3352
  twitter : xuyinglong
```

# Latest Posts
<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

