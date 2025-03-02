#!/usr/bin/env python3
import os
import urllib.request
import ssl
import time
import sys

# 创建纹理目录
os.makedirs('assets/textures', exist_ok=True)

print("正在下载地球纹理...")

# 忽略SSL证书验证（如果需要）
ssl._create_default_https_context = ssl._create_unverified_context

# 更新纹理URL - 使用更可靠的来源
textures = {
    # 基本地球纹理 - 使用NASA Blue Marble图像
    #'earth_daymap.jpg': 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_cloud_2048.jpg',
    
    # 备用地球纹理
    'earth_daymap_alt.jpg': 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg',
    
    # 云层纹理
    'clouds.jpg': 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg',
    
    # 备用云层纹理
    'clouds_alt.jpg': 'https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg',
    
    # 地形纹理
    'earth_topo.jpg': 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73934/gebco_08_rev_elev_21600x10800.png',
    
    # 夜间纹理
    'earth_nightmap.jpg': 'https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg',
}

# 创建一个简单的进度条
def show_progress(block_num, block_size, total_size):
    if total_size > 0:
        percent = min(100, block_num * block_size * 100 / total_size)
        sys.stdout.write(f"\r下载进度: {percent:.1f}%")
        sys.stdout.flush()

# 下载纹理
success_count = 0
for filename, url in textures.items():
    target_path = os.path.join('assets/textures', filename)
    print(f"\n正在下载 {filename}...")
    try:
        # 使用进度条下载
        urllib.request.urlretrieve(url, target_path, show_progress)
        print(f"\n✓ {filename} 下载完成")
        success_count += 1
    except Exception as e:
        print(f"\n✗ 下载 {filename} 失败: {e}")
        # 如果是HTTP 404错误，尝试备用URL
        if "HTTP Error 404" in str(e):
            print("  尝试备用URL...")
            try:
                # 尝试从Three.js CDN下载
                backup_url = f"https://threejs.org/examples/textures/planets/{filename}"
                urllib.request.urlretrieve(backup_url, target_path, show_progress)
                print(f"\n✓ 从备用URL下载 {filename} 成功")
                success_count += 1
            except Exception as e2:
                print(f"\n✗ 从备用URL下载 {filename} 失败: {e2}")

# 如果没有成功下载任何纹理，创建一个简单的纹理
if success_count == 0:
    print("\n无法从网络下载纹理，创建简单的本地纹理...")
    
    # 创建一个简单的地球纹理
    try:
        from PIL import Image, ImageDraw
        
        # 创建地球纹理
        earth_img = Image.new('RGB', (1024, 512), (0, 0, 128))  # 深蓝色背景
        draw = ImageDraw.Draw(earth_img)
        
        # 绘制简单的大陆
        draw.ellipse((200, 100, 400, 250), fill=(0, 100, 0))  # 绿色大陆
        draw.ellipse((500, 150, 700, 300), fill=(0, 100, 0))
        draw.ellipse((300, 300, 500, 400), fill=(0, 100, 0))
        
        # 保存地球纹理
        earth_img.save('assets/textures/earth_daymap.jpg')
        print("✓ 创建本地地球纹理成功")
        
        # 创建云层纹理
        clouds_img = Image.new('RGBA', (1024, 512), (0, 0, 0, 0))  # 透明背景
        draw = ImageDraw.Draw(clouds_img)
        
        # 绘制简单的云层
        for i in range(50):
            x = int(1024 * (i / 50))
            y = int(512 * ((i % 5) / 5))
            size = 20 + (i % 30)
            opacity = 100 + (i % 155)
            draw.ellipse((x, y, x + size, y + size), fill=(255, 255, 255, opacity))
        
        # 保存云层纹理
        clouds_img.save('assets/textures/clouds.png')
        print("✓ 创建本地云层纹理成功")
        
    except ImportError:
        print("✗ 无法创建本地纹理：缺少PIL库")
        print("  请安装PIL库：pip install pillow")
        
        # 创建一个文本文件，说明如何手动下载纹理
        with open('assets/textures/README.txt', 'w') as f:
            f.write("""
请手动下载以下纹理文件并放置在此目录：

1. 地球日间纹理 (earth_daymap.jpg):
   https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_cloud_2048.jpg

2. 云层纹理 (clouds.jpg):
   https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg

或者从以下网站下载纹理：
- NASA Visible Earth: https://visibleearth.nasa.gov/
- Three.js 示例: https://threejs.org/examples/textures/planets/
            """)
            
        print("✓ 创建纹理下载说明文件")

print("\n纹理下载完成！")
print(f"成功下载: {success_count}/{len(textures)} 个纹理")
print("现在可以运行应用查看地球效果了！")