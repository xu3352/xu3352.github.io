#!/bin/bash
#author:xu3352@gmail.com
#desc: umount NTFS disk in Desktop dir

TMP_SH=/tmp/ntfs_umount_tmp.sh
df -h | grep /Desktop/ | awk '{print $9}' > $TMP_SH

grep /Desktop/ $TMP_SH | xargs -n 1 sudo umount
grep /Desktop/ $TMP_SH | xargs -n 1 rm -rf

