---
layout: post
title: "Linux自定义PS1提示符:Zsh最右侧加时间提示"
tagline: ""
description: "看到别人的终端每行都有个时间戳, 想到有时候可以快速的知道一个命令执行了多长时间, 嗯, 我也来搞一个"
date: '2018-07-01 12:23:23 +0800'
category: linux
tags: linux
---
> {{ page.description }}

# 终端提示符 PS1
```bash
echo $PS1
{% raw %}%{%f%b%k%}$(prompt_agnoster_main){% endraw %}
```
这个是 `zsh` 的 `agnoster` 主题默认的设置 本机终端配置:[iTerm2+zsh+agnoster主题](https://xu3352.github.io/mac/2017/03/21/how-to-a-amazing-terminal-with-iterm2-zsh-agnoster) 

当前终端的配置不管是使用操作上, 还是外观上都已经有很大提升了, 再加上 `tmux`, 哈哈, 简直就是装逼神器!!!

# 修改 agnoster PS1
首先找到 `agnoster` 主题的配置文件路径: `~/.oh-my-zsh/themes/agnoster.zsh-theme`

```vim
$ vim ~/.oh-my-zsh/themes/agnoster.zsh-theme
{% raw %}
prompt_agnoster_precmd() {
  vcs_info
  PROMPT='%{%f%b%k%}$(prompt_agnoster_main) '
  RPROMPT="[%D{%H:%M:%S}]"
}
{% endraw %}
```

最后的 `RPROMPT` 就是我们加的, 格式可以参考下面的:
```
According to the zshmisc man page there are several % codes for date and time, eg:

 %D     The date in yy-mm-dd format.
 %T     Current time of day, in 24-hour format.
 %t %@  Current time of day, in 12-hour, am/pm format.
 %*     Current time of day in 24-hour format, with seconds.
 %w     The date in day-dd format.
 %W     The date in mm/dd/yy format.
 %D{strftime-format}
```
`%D{strftime-format}` 这里使用的 [Python time strftime()语法](http://www.runoob.com/python/att-time-strftime.html)

# 最终效果
![](/assets/archives/20180701051805_zsh-agnoster-theme.png){:width="100%"}
亮瞎你的双眼, 哈哈哈!!!

---
参考：
- [Linux 101 Hacks 第五章:PS1,PS2,PS3,PS4和提示命令](https://xu3352.github.io/linux/2017/09/15/Linux-101-Hacks-Chapter-5-PS1,PS2,PS3,PS4-and-PROMPT_COMMAND)
- [如何使用iTerm2+zsh+agnoster主题打造高端、惊艳的终端](https://xu3352.github.io/mac/2017/03/21/how-to-a-amazing-terminal-with-iterm2-zsh-agnoster)
- [How to: Change / Setup bash custom prompt (PS1)](https://www.cyberciti.biz/tips/howto-linux-unix-bash-shell-setup-prompt.html)
- [Add timestamp to oh-my-zsh robbyrussell theme](https://superuser.com/questions/943844/add-timestamp-to-oh-my-zsh-robbyrussell-theme/943916)
- [Python time strftime()方法](http://www.runoob.com/python/att-time-strftime.html)

