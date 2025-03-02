#!/usr/bin/env python3
import os
import urllib.request
import ssl

# 创建纹理目录
os.makedirs('assets/textures', exist_ok=True)

print("正在下载地球纹理...")

# 忽略SSL证书验证（如果需要）
ssl._create_default_https_context = ssl._create_unverified_context

# 纹理URL
textures = {
    'earth_daymap.jpg': 'https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74367/world.topo.200412.3x5400x2700.jpg',
    'earth_nightmap.jpg': 'https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg',
    'earth_normal_map.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'earth_specular_map.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    'clouds.png': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_2048.png'
}

# 下载纹理
for filename, url in textures.items():
    target_path = os.path.join('assets/textures', filename)
    print(f"下载 {filename}...")
    try:
        urllib.request.urlretrieve(url, target_path)
        print(f"✓ {filename} 下载完成")
    except Exception as e:
        print(f"✗ 下载 {filename} 失败: {e}")

print("纹理下载完成！")