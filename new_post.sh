#!/bin/bash
#author:xu3352
#desc: create a new post articles with template

TITLE=$1
TITLE_ZH=$2
TEMPLATE=draft_template.md
DATE=`date "+%Y-%m-%d"`
TIME=`date "+%H:%M:%S"`
# echo $DATE $TIME

# file path generate
FILE_NAME="$DATE-`echo $TITLE|sed 's/[ ][ ]*/-/g'`.md"
echo "file name:" _posts/$FILE_NAME

# template content
CONTENT=`cat $TEMPLATE`

# fill title
POST_TITLE=$TITLE
if [ -n "$TITLE_ZH" ]; then
    POST_TITLE=$TITLE_ZH
fi
CONTENT=`echo "${CONTENT}" | sed "s/{title}/${POST_TITLE}/g"`

# fill time
CONTENT=`echo "${CONTENT}" | sed "s/{time}/${DATE} ${TIME}/g"`

# output file
echo "${CONTENT}" > _posts/$FILE_NAME

# edit file with vim
vim _posts/$FILE_NAME

