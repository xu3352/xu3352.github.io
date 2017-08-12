#!/bin/bash
#author:xu3352@gmail.com
#desc: change file access and modification times to regenerate pages 
#       (if jekyll start with --incremental option)

# file list
list=(index.md archive.html categories.html tags.html)

# for loop
length=${#list[*]}
for (( i=0;i<$length;i++ ))
do 
    # echo "file $i:" ${list[$i]}
    touch ${list[$i]}
done

