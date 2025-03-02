#!/usr/bin/env python3
"""
创建简单的本地纹理文件，以确保即使下载失败也能显示地球。
需要安装 Pillow 库: pip install pillow
"""

import os
from PIL import Image, ImageDraw

# 创建纹理目录
os.makedirs('assets/textures', exist_ok=True)

print("正在创建本地纹理...")

# 创建地球纹理
def create_earth_texture():
    print("创建地球纹理...")
    # 创建一个1024x512的图像，深蓝色背景
    earth_img = Image.new('RGB', (1024, 512), (0, 0, 128))
    draw = ImageDraw.Draw(earth_img)
    
    # 绘制简单的大陆
    # 南极洲
    draw.ellipse((412, 400, 612, 500), fill=(200, 200, 200))
    
    # 非洲
    points = [(500, 100), (600, 250), (500, 300), (400, 250)]
    draw.polygon(points, fill=(0, 100, 0))
    
    # 欧亚大陆
    draw.ellipse((550, 100, 800, 200), fill=(0, 100, 0))
    
    # 美洲
    draw.ellipse((200, 150, 350, 350), fill=(0, 100, 0))
    
    # 澳大利亚
    draw.ellipse((750, 250, 850, 320), fill=(0, 100, 0))
    
    # 添加一些随机岛屿
    for i in range(20):
        x = int(1024 * (i / 20))
        y = int(512 * ((i % 5) / 5))
        size = 5 + (i % 10)
        draw.ellipse((x, y, x + size, y + size), fill=(0, 120, 0))
    
    # 添加经纬线
    for i in range(0, 1024, 64):
        draw.line([(i, 0), (i, 512)], fill=(255, 255, 255, 50), width=1)
    
    for i in range(0, 512, 64):
        draw.line([(0, i), (1024, i)], fill=(255, 255, 255, 50), width=1)
    
    # 保存地球纹理
    earth_img.save('assets/textures/earth_daymap.jpg')
    print("✓ 地球纹理创建成功")

# 创建云层纹理
def create_clouds_texture():
    print("创建云层纹理...")
    # 创建一个1024x512的透明图像
    clouds_img = Image.new('RGBA', (1024, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(clouds_img)
    
    # 绘制简单的云层
    for i in range(50):
        x = int(1024 * (i / 50))
        y = int(512 * ((i % 5) / 5))
        size = 20 + (i % 30)
        opacity = 100 + (i % 155)
        draw.ellipse((x, y, x + size, y + size), fill=(255, 255, 255, opacity))
    
    # 添加一些大型云系
    for i in range(5):
        x = int(1024 * (i / 5))
        y = int(512 * ((i % 3) / 3))
        size = 50 + (i % 50)
        draw.ellipse((x, y, x + size, y + size), fill=(255, 255, 255, 100))
        
        # 添加云团细节
        for j in range(10):
            subX = x + int((j / 10) * size)
            subY = y + int((j % 5) * size / 5)
            subSize = 10 + (j % 15)
            draw.ellipse((subX, subY, subX + subSize, subY + subSize), fill=(255, 255, 255, 150))
    
    # 保存云层纹理
    clouds_img.save('assets/textures/clouds.png')
    print("✓ 云层纹理创建成功")

# 创建夜间纹理
def create_night_texture():
    print("创建夜间纹理...")
    # 创建一个1024x512的黑色图像
    night_img = Image.new('RGB', (1024, 512), (0, 0, 0))
    draw = ImageDraw.Draw(night_img)
    
    # 添加一些随机灯光点
    for i in range(200):
        x = int(1024 * (i / 200))
        y = int(512 * ((i % 10) / 10))
        size = 1 + (i % 3)
        brightness = 100 + (i % 155)
        draw.ellipse((x, y, x + size, y + size), fill=(brightness, brightness, brightness // 2))
    
    # 保存夜间纹理
    night_img.save('assets/textures/earth_nightmap.jpg')
    print("✓ 夜间纹理创建成功")

try:
    # 创建所有纹理
    create_earth_texture()
    create_clouds_texture()
    create_night_texture()
    print("\n所有本地纹理创建成功！")
except ImportError:
    print("\n错误：无法创建本地纹理，缺少PIL库")
    print("请安装PIL库：pip install pillow")
except Exception as e:
    print(f"\n错误：创建本地纹理时出错：{e}") 