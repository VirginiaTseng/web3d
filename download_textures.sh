#!/bin/bash

# 创建纹理目录
mkdir -p assets/textures

# 下载地球纹理
echo "正在下载地球纹理..."

# 地球日间纹理
curl -o assets/textures/earth_daymap.jpg https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74367/world.topo.200412.3x5400x2700.jpg

# 地球夜间纹理
curl -o assets/textures/earth_nightmap.jpg https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg

# 地球法线贴图
curl -o assets/textures/earth_normal_map.jpg https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg

# 地球高光贴图
curl -o assets/textures/earth_specular_map.jpg https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg

# 云层纹理
curl -o assets/textures/clouds.png https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_2048.png

echo "纹理下载完成！" 