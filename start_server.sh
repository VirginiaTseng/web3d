#!/bin/bash

echo "正在启动极地气象预报系统服务器..."

# 检查是否安装了Python
# if command -v python3 &>/dev/null; then
#     echo "使用Python启动服务器..."
#     python3 -m http.server 8000
# elif command -v python &>/dev/null; then
#     echo "使用Python启动服务器..."
#     python -m http.server 8000
# 检查是否安装了Node.js
# el

if command -v npx &>/dev/null; then
    echo "使用Node.js启动服务器..."
    npx http-server -p 8000
else
    echo "错误：未找到Python或Node.js，请安装其中一个以启动本地服务器。"
    exit 1
fi 