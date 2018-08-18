---
layout: post
title: "Python virtualenv 和 virtualenvwrapper 安装和使用"
tagline: ""
description: "`virtualenv` 一款非常流行的 `Python` 库环境管理工具; 旨在解决不同工作环境依赖库冲突的问题; 好比 `Java` 里的 `Maven` 来管理第三方的包一样, 每个环境可指定一套特定版本号的依赖包"
date: '2018-08-17 21:32:45 +0800'
category: python
tags: virtualenvwrapper virtualenv python
---
> {{ page.description }}

# 初学者推荐
话说此类的工具还不少, 有标准库的, 有非标准库的, 如何选择呢?

[What is the difference between venv, pyvenv, pyenv, virtualenv, virtualenvwrapper, pipenv, etc?](https://stackoverflow.com/questions/41573587/what-is-the-difference-between-venv-pyvenv-pyenv-virtualenv-virtualenvwrappe)

> Most of these tools complement each other. For instance, `pipenv` integrates `pip`, `virtualenv` and even `pyenv` if desired. The only tools that are true alternatives to each other here are `venv` and `virtualenv`.
> 
> **Recommendation for beginners:**
> 
> This is my personal recommendation for beginners: start by learning `virtualenv` and `pip`, tools which work with both Python 2 and 3 and in a variety of situations, and pick up the other tools once you start needing them.

这里把这些都介绍了一遍, 有兴趣的可以去了解一下; 总之呢 `virtualenv` 就是初学者的首先了!!! 

(简单易用, 兼容 `python` 2 和 3; 一旦上手这个, 其他的工具分分钟捡起来用)

# virtualenv 安装使用
[Virtualenv 官网首页:安装/使用手册等](https://virtualenv.pypa.io/en/stable/)
```bash
# 使用pip安装
$ sudo pip install virtualenv
```

```bash
# 使用文档
$ virtualenv -h
Usage: virtualenv [OPTIONS] DEST_DIR

Options:
  --version             show program\'s version number and exit
  -h, --help            show this help message and exit
  -v, --verbose         Increase verbosity.
  -q, --quiet           Decrease verbosity.
  -p PYTHON_EXE, --python=PYTHON_EXE
                        The Python interpreter to use, e.g.,
                        --python=python3.5 will use the python3.5 interpreter
                        to create the new environment.  The default is the
                        interpreter that virtualenv was installed with
                        (/usr/bin/python)
  ...
```

常用命令
```bash
# 创建环境目录
$ mkdir my_venv_folder
$ cd  my_venv_folder

# 创建虚拟环境目录:这里起名为 venv_name
# 环境创建完成之后, 此目录下回新增 bin, include, lib 几个目录
$ virtualenv venv_name 

# 激活环境 (通常情况下, 激活环境后Linux提示符会有改变)
$ source bin/activate

# 查看当前环境下的 python 和 pip 的指向路径
(venv_name)...$ which python
(venv_name)...$ which pip

# 当前环境安装 requests 包
(venv_name)...$ pip install requests

# 脱离当前环境
(venv_name)...$ deactivate

# 再次查看python命令执行时, 已经是系统默认的了
$ which python
```

**重点**:
- `创建环境` - `virtualenv venv_name`
- `激活环境` - `source /path/to/vevn/bin/activate`
- `导出依赖包` - `pip freeze > requirments.txt` 导出依赖包列表
- `导入依赖包` - `pip install -r requirments.txt` 还原环境依赖包(换环境/换机器之类的)
- `脱离环境` - `deactivate`
- `删除环境` - `rm venv_name` 脱离环境之后, 然后删除环境目录即可

# virtualenvwrapper 安装使用
> **virtualenvwrapper** is a set of extensions to `virtualenv` (see docs). It gives you commands like `mkvirtualenv`, `lssitepackages`, and especially `workon` for switching between different `virtualenv` directories. This tool is especially useful if you want multiple `virtualenv` directories.

其实就是对 `virtualenv` 做了扩展, 让你更方便的使用 `virtualenv` 工具, 尤其是 `workon` 可以快速的在不同环境之间进行切换; 懒人必备!!!

```bash
# 安装
# 使用 pip 进行安装 (记得是系统环境下哦)
$ sudo pip install virtualenvwrapper

# Mac自带的 six包 版本过低且不能自动更新时
$ sudo pip install virtualenvwrapper --upgrade --ignore-installed six

# 环境配置
# 查看 virtualenvwrapper.sh 路径
$ which virtualenvwrapper.sh
/usr/local/bin/virtualenvwrapper.sh

# 配置环境变量 (以后创建的环境目录都集中放在 $WORKON_HOME 目录下管理了)
# 配置文件位置: ~/.bashrc (bash) 或 ~/.zshrc (zsh)
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
```

常用命令
```bash
# workon  进入|切换 环境
$ workon ENVNAME

# mkvirtualenv 创建环境
$ mkvirtualenv [-a project_path] [-i package] [-r requirements_file] [virtualenv options] ENVNAME

# lsvirtualenv 展示环境列表
$ lsvirtualenv [-b] [-l] [-h]

# rmvirtualenv 删除环境
$ rmvirtualenv ENVNAME

# cpvirtualenv 复制环境
$ cpvirtualenv ENVNAME [TARGETENVNAME]

# allvirtualenv 所有环境运行命令 (比如安装包)
$ allvirtualenv command with arguments
$ allvirtualenv pip install -U pip

# deactivate 退出当前环境
$ deactivate

# mkproject  创建项目
$ mkproject [-f|--force] [-t template] [virtualenv_options] ENVNAME
```
[更多 virtualenvwrapper 使用命令](https://virtualenvwrapper.readthedocs.io/en/latest/command_ref.html)

# 其他
**virtualenv 报错**
```bash
ERROR: virtualenv is not compatible with this system or executable
```
额, 看意思是哪块不兼容了; 

本机环境为: Mac OS X EI Captitan 10.11.6; python2.6 和 python2.7 好像是自带的, python3.5.2 是自己手动安装的; 

最早 python 命令默认指向了 3.5.2 版本; 所以第一次使用 pip 安装 `virutalenv` 时, 实际上安装在 python 3.5.2 上面, 创建环境时出现了上面的错误信息;

本机没有使用 `Anaconda` 之类的环境...

**大致的解决过程**: (记得备份是个好习惯!!!)
- `pip uninstall virtualenv` 先把不好使的卸载了 (python3.5.2)
- 把 `python` 指向了自带的 `python2.7` 版本
- 升级了 `python2.7` 的 `pip`
- 重新安装 `pip install virtualenv`

---
参考：
- [官网-Virtualenv 安装/使用手册](https://virtualenv.pypa.io/en/stable/)
- [官网-Virtualenvwrapper 安装/使用手册](https://virtualenvwrapper.readthedocs.io/en/latest/)
- [What is the difference between venv, pyvenv, pyenv, virtualenv, virtualenvwrapper, pipenv, etc?](https://stackoverflow.com/questions/41573587/what-is-the-difference-between-venv-pyvenv-pyenv-virtualenv-virtualenvwrappe)
- [聊聊 virtualenv 和 virtualenvwrapper 实践](https://segmentfault.com/a/1190000004079979)
- [Cannot uninstall 'six'. It is a distutils installed project and thus we cannot accurately determine which files belong to it which would lead to only a partial uninstall.](https://github.com/pypa/pip/issues/3165)

