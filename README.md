# 极地气象预报系统

这是一个基于 Three.js 的极地气象预报系统，可以实时显示南极洲的气象数据，包括温度场、风场、气压场等。

## 功能特点

- 使用 Three.js 创建的交互式 3D 地球
- 多种气象数据图层（温度、风速、气压等）
- 观测站点标记和信息显示
- 时间轴控制和数据动态更新
- 响应式布局和美观的 UI 设计

## 使用方法

1. 克隆或下载本项目
2. 在本地服务器上运行项目（由于浏览器安全限制，直接打开 HTML 文件可能无法正常加载纹理）
3. 使用以下命令启动简易服务器：

```bash
# 如果安装了 Python
python -m http.server

# 如果安装了 Node.js
npx http-server
```

4. 在浏览器中访问 `http://localhost:8000` 或相应端口

## 纹理资源

本项目使用的地球纹理来自以下资源：

- 地球日间纹理：NASA Visible Earth
- 地球法线贴图：NASA Blue Marble
- 云层纹理：NASA Visible Earth

## 项目结构

```
web3d/
├── index.html          # 主HTML文件
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── main.js         # 主JavaScript文件
│   ├── earth.js        # 地球可视化
│   ├── controls.js     # 时间控制器
│   └── data.js         # 模拟数据
└── assets/
    ├── icons/          # 图标
    └── textures/       # 纹理
```

## 注意事项

- 请确保您的浏览器支持 WebGL
- 对于较低配置的设备，可能需要关闭部分图层以提高性能
- 本项目中的数据为模拟数据，不代表实际气象情况

## 许可证

MIT 


要运行此项目，您需要：
确保您的系统上安装了 Python 或 Node.js
运行 download_textures.sh 脚本下载地球纹理
运行 start_server.sh 脚本启动本地服务器
在浏览器中访问 http://localhost:8000
这个项目实现了一个功能完整的极地气象预报系统，包括：
使用 Three.js 创建的交互式 3D 地球
多种气象数据图层（温度、风速、气压等）
观测站点标记和信息显示
时间轴控制和数据动态更新
响应式布局和美观的 UI 设计