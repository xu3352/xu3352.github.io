---
layout: post
title: "Python Flask:一个极简的web服务+文件上传"
tagline: ""
description: "`Flask` 是一个面向简单需求小型应用的 “微框架（`microframework`）”"
date: '2018-04-29 16:43:26 +0800'
category: python
tags: flask web-server python
---
> {{ page.description }}

# 目标清单
1. 环境搭建
2. `Hello World!` 示例
3. 文件上传
4. 执行 `shell` 脚本

# 环境搭建
Python 2 和 3 都有支持, 但是都有最低版本限制:`>= Python 2.6` 和 `>= Python 3.3` 

尽量使用最新版本就没问题了

`Linux` 应该是都自带了 `Python` 环境的:
```bash
# 查看python版本号
$ python -V
Python 2.7.5
```

## pip 安装
确认 `pip` 是否安装了
```bash
# 查看 pip 版本号
$ pip -V
pip 10.0.1 from /usr/lib/python2.7/site-packages/pip (python 2.7)
```

下载pip的安装包 [get-pip.py](https://bootstrap.pypa.io/get-pip.py)
```bash
# 安装 pip
$ python get-pip.py
```

安装成功后再检查一下 pip 的版本号即可

# Hello World 示例

## 安装 flask 模块
```bash
$ python -m pip install flask
```

如果是 python3 的话, 可能就是 `python3 -m pip3 install flask`

## 小示例
```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
```

启动服务
```bash
$ python hello.py
 * Running on http://127.0.0.1:5000/
```

现在访问 `http://127.0.0.1:5000/`, 你会看见 `Hello World` 

也可以指定端口:
```python
app.run(host='0.0.0.0', port=8080, debug=True)
```

# 文件上传
```python
import os
from flask import Flask, request, redirect, url_for
from werkzeug import secure_filename

UPLOAD_FOLDER = '/tmp/uploads'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
@app.route('/upload/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('upload_success', filename=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form action="" method=post enctype=multipart/form-data>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''

@app.route('/upload_success')
def upload_success():
    return '''
    <!doctype html>
    <title>上传成功</title>
    <h1>上传成功</h1>
    <a href="/upload/">继续上传</a>
    '''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
```

1. 限制指定的后缀文件才可以上传
2. 上传成功后, 跳转到成功页面
3. 成功页面可以再返回上传页面
4. 文件上传到指定的目录, 目录需要提前创建好

# 执行 shell 脚本
只放核心的代码了
```bash
# 引入包
import subprocess

# 执行shell
@app.route('/cmd')
def cmd():
    cmd = ["ls","-lh","/tmp/uploads"]
    p = subprocess.Popen(cmd, stdout = subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            stdin=subprocess.PIPE)
    out,err = p.communicate()
    return out
```
可以使用脚本, 那么就又可以做好多其他的事情了

# 总结
总之, 可以用很少的代码实现简单的需求了

---
参考：
- [欢迎使用 Flask](http://docs.jinkan.org/docs/flask/)
- [选择一个 Python Web 框架：Django vs Flask vs Pyramid 【已翻译100%】](https://www.oschina.net/translate/django-flask-pyramid?lang=chs&page=1#)
- [Flask 上传文件](http://docs.jinkan.org/docs/flask/patterns/fileuploads.html)
- [Running a shell command from a flask app](https://stackoverflow.com/questions/23977475/running-a-shell-command-from-a-flask-app)
- [Linux安装python3.6](https://www.cnblogs.com/kimyeee/p/7250560.html)

