#!/bin/bash
#author:xu3352
#desc: start up jekyll

# clear nohup.out
echo "" > nohup.out

# kill first
ps aux|grep -v 'grep'|grep 'jekyll'|awk '{print $2}'| xargs kill -9

# start up jekyll
cd ~/blog
nohup bundle exec jekyll serve --drafts --incremental --trace &

