#!/bin/bash
#author:xu3352@gmail.com
#desc: remount NTFS disk as rw type

TMP_SH=/tmp/ntfs_mount_rw_tmp.sh

diskutil list | grep NTFS | awk '{print "umount /Volumes/"$3"\n", "mkdir -p ~/Desktop/"$3"\n", "sudo mount -t ntfs -o rw,auto,nobrowse", "/dev/"$6, "~/Desktop/"$3"\n"}' > $TMP_SH

sudo sh $TMP_SH

