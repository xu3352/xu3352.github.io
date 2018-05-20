#!/bin/bash
#author:xu3352
#desc: commit post articles

MSG=$1

if [ "" == "$MSG" ] 
then
    MSG="发布新文章"
fi

# add dir
echo "git add _posts/"
git add _posts/

# commit to local
echo " git commit -m \"$MSG\""
git commit -m "$MSG"

# push to github
echo "git push origin master"
git push origin master

