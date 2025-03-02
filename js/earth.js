class Earth {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        
        // 添加背景渐变
        this.scene.background = this.createGradientBackground();
        
        this.camera = new THREE.PerspectiveCamera(
            45, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // 改进渲染器设置
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        container.appendChild(this.renderer.domElement);
        
        // 初始化控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        
        // 初始化光照
        this.setupLights();
        
        // 加载管理器用于跟踪纹理加载
        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onLoad = () => {
            console.log('所有纹理加载完成');
        };
        this.loadingManager.onError = (url) => {
            console.error('加载纹理出错:', url);
            // 如果纹理加载失败，使用备用纹理
            this.useBackupTextures();
        };
        
        // 创建地球
        this.createEarth();
        
        // 创建大气层
        this.createAtmosphere();
        
        // 创建云层
        this.createClouds();
        
        // 创建站点标记
        this.createStationMarkers();
        
        // 创建气压场
        this.createPressureField();
        
        // 创建风场
        this.createWindField();
        
        // 创建温度场
        this.createTemperatureField();
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 初始化射线检测
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // 开始动画循环
        this.animate();
    }
    
    createGradientBackground() {
        // 创建渐变背景纹理
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 2;
        
        const context = canvas.getContext('2d');
        
        // 创建径向渐变
        const gradient = context.createRadialGradient(
            canvas.width / 2, 
            canvas.height / 2, 
            0, 
            canvas.width / 2, 
            canvas.height / 2, 
            canvas.width / 2
        );
        
        // 添加渐变颜色
        gradient.addColorStop(0, '#0a1329');
        gradient.addColorStop(1, '#000000');
        
        // 填充渐变
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        
        return texture;
    }
    
    setupLights() {
        // 环境光 - 增强亮度
        const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
        this.scene.add(ambientLight);
        
        // 方向光 - 调整位置和强度，模拟太阳光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);
        
        // 添加半球光以更好地照亮地球
        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
        this.scene.add(hemisphereLight);
    }
    
    createEarth() {
        // 加载纹理
        const textureLoader = new THREE.TextureLoader(this.loadingManager);
        
        try {
            // 尝试加载高质量纹理
            const earthDayMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_4k.jpg', undefined, undefined, () => {
                console.error('无法加载高质量地球纹理，尝试备用纹理');
                this.loadBackupEarthTexture();
            });
            
            const earthNormalMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_4k.jpg');
            const earthSpecularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_4k.jpg');
            
            // 改进纹理设置
            earthDayMap.anisotropy = 16;
            
            const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
            const earthMaterial = new THREE.MeshPhongMaterial({
                map: earthDayMap,
                normalMap: earthNormalMap,
                normalScale: new THREE.Vector2(0.05, 0.05),
                specularMap: earthSpecularMap,
                specular: new THREE.Color(0x333333),
                shininess: 25,
                reflectivity: 0.2
            });
            
            this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
            this.scene.add(this.earth);
            
            // 添加南极点标记
            const southPoleGeometry = new THREE.SphereGeometry(0.03, 16, 16);
            const southPoleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const southPole = new THREE.Mesh(southPoleGeometry, southPoleMaterial);
            southPole.position.set(0, -2, 0);
            this.scene.add(southPole);
        } catch (error) {
            console.error('加载地球纹理时出错:', error);
            this.loadBackupEarthTexture();
        }
    }
    
    loadBackupEarthTexture() {
        try {
            const textureLoader = new THREE.TextureLoader(this.loadingManager);
            
            // 尝试加载NASA蓝色大理石纹理
            const earthDayMap = textureLoader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg', undefined, undefined, () => {
                console.error('无法加载NASA蓝色大理石纹理，尝试本地纹理');
                
                // 尝试加载本地纹理
                const localEarthDayMap = textureLoader.load('assets/textures/earth_daymap.jpg', undefined, undefined, () => {
                    console.error('无法加载本地地球纹理，使用程序化纹理');
                    this.useBackupTextures();
                });
                
                const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
                const earthMaterial = new THREE.MeshPhongMaterial({
                    map: localEarthDayMap,
                    specular: new THREE.Color(0x333333),
                    shininess: 15
                });
                
                this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
                this.scene.add(this.earth);
                
                // 添加南极点标记
                const southPoleGeometry = new THREE.SphereGeometry(0.03, 16, 16);
                const southPoleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const southPole = new THREE.Mesh(southPoleGeometry, southPoleMaterial);
                southPole.position.set(0, -2, 0);
                this.scene.add(southPole);
            });
            
            const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
            const earthMaterial = new THREE.MeshPhongMaterial({
                map: earthDayMap,
                specular: new THREE.Color(0x333333),
                shininess: 15
            });
            
            this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
            this.scene.add(this.earth);
            
            // 添加南极点标记
            const southPoleGeometry = new THREE.SphereGeometry(0.03, 16, 16);
            const southPoleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const southPole = new THREE.Mesh(southPoleGeometry, southPoleMaterial);
            southPole.position.set(0, -2, 0);
            this.scene.add(southPole);
        } catch (error) {
            console.error('加载备用地球纹理时出错:', error);
            this.useBackupTextures();
        }
    }
    
    createAtmosphere() {
        // 创建大气层效果
        const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x0077ff,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        
        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(this.atmosphere);
        
        // 创建大气层光晕
        const glowGeometry = new THREE.SphereGeometry(2.15, 64, 64);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'c': { value: 0.2 },
                'p': { value: 4.0 },
                'glowColor': { value: new THREE.Color(0x0077ff) },
                'viewVector': { value: new THREE.Vector3(0, 0, 1) }
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normal);
                    vec3 vNormel = normalize(viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(this.glow);
    }
    
    createClouds() {
        try {
            const textureLoader = new THREE.TextureLoader(this.loadingManager);
            
            const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_4k.png', undefined, undefined, () => {
                console.error('无法加载高质量云层纹理，尝试NASA云层纹理');
                
                // 尝试加载NASA云层纹理
                const nasaCloudsTexture = textureLoader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg', undefined, undefined, () => {
                    console.error('无法加载NASA云层纹理，尝试备用纹理');
                    
                    // 尝试加载备用云层纹理
                    const backupCloudsTexture = textureLoader.load('assets/textures/clouds.png', undefined, undefined, () => {
                        console.error('无法加载备用云层纹理，使用程序化纹理');
                        
                        if (this.clouds) {
                            this.scene.remove(this.clouds);
                        }
                        
                        const cloudsTexture = this.createProceduralCloudsTexture();
                        const cloudsGeometry = new THREE.SphereGeometry(2.05, 64, 64);
                        const cloudsMaterial = new THREE.MeshPhongMaterial({
                            map: cloudsTexture,
                            transparent: true,
                            opacity: 0.4
                        });
                        
                        this.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
                        this.scene.add(this.clouds);
                    });
                    
                    const cloudsGeometry = new THREE.SphereGeometry(2.05, 64, 64);
                    const cloudsMaterial = new THREE.MeshPhongMaterial({
                        map: backupCloudsTexture,
                        transparent: true,
                        opacity: 0.4
                    });
                    
                    this.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
                    this.scene.add(this.clouds);
                });
                
                const cloudsGeometry = new THREE.SphereGeometry(2.05, 64, 64);
                const cloudsMaterial = new THREE.MeshPhongMaterial({
                    map: nasaCloudsTexture,
                    transparent: true,
                    opacity: 0.4
                });
                
                this.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
                this.scene.add(this.clouds);
            });
            
            const cloudsGeometry = new THREE.SphereGeometry(2.05, 64, 64);
            const cloudsMaterial = new THREE.MeshPhongMaterial({
                map: cloudsTexture,
                transparent: true,
                opacity: 0.4
            });
            
            this.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
            this.scene.add(this.clouds);
        } catch (error) {
            console.error('加载云层纹理时出错:', error);
            
            // 创建简单的云层
            const cloudsTexture = this.createProceduralCloudsTexture();
            const cloudsGeometry = new THREE.SphereGeometry(2.05, 64, 64);
            const cloudsMaterial = new THREE.MeshPhongMaterial({
                map: cloudsTexture,
                transparent: true,
                opacity: 0.4
            });
            
            this.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
            this.scene.add(this.clouds);
        }
    }
    
    createProceduralEarthTexture() {
        // 创建程序化地球纹理
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // 绘制海洋
        ctx.fillStyle = '#1a237e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制简化的大陆
        ctx.fillStyle = '#4caf50';
        
        // 南极洲
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height * 0.85, canvas.width * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // 非洲
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.5, canvas.height * 0.2);
        ctx.lineTo(canvas.width * 0.6, canvas.height * 0.5);
        ctx.lineTo(canvas.width * 0.5, canvas.height * 0.6);
        ctx.lineTo(canvas.width * 0.4, canvas.height * 0.5);
        ctx.closePath();
        ctx.fill();
        
        // 欧亚大陆
        ctx.beginPath();
        ctx.ellipse(canvas.width * 0.6, canvas.height * 0.3, canvas.width * 0.25, canvas.height * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 美洲
        ctx.beginPath();
        ctx.ellipse(canvas.width * 0.25, canvas.height * 0.4, canvas.width * 0.1, canvas.height * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 澳大利亚
        ctx.beginPath();
        ctx.ellipse(canvas.width * 0.8, canvas.height * 0.6, canvas.width * 0.08, canvas.height * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加一些随机岛屿
        ctx.fillStyle = '#81c784';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 2 + Math.random() * 8;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 添加经纬线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        // 经线
        for (let i = 0; i < canvas.width; i += canvas.width / 24) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        
        // 纬线
        for (let i = 0; i < canvas.height; i += canvas.height / 12) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    createProceduralCloudsTexture() {
        // 创建程序化云层纹理
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // 透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制云层
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        
        // 添加一些随机云团
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 5 + Math.random() * 20;
            const opacity = 0.1 + Math.random() * 0.5;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        }
        
        // 添加一些大型云系
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 30 + Math.random() * 50;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            
            // 添加云团细节
            for (let j = 0; j < 10; j++) {
                const subX = x + (Math.random() * size * 0.8) - (size * 0.4);
                const subY = y + (Math.random() * size * 0.8) - (size * 0.4);
                const subSize = 5 + Math.random() * 15;
                
                ctx.beginPath();
                ctx.arc(subX, subY, subSize, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
            }
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    useBackupTextures() {
        console.log('使用备用纹理');
        
        // 创建程序化地球纹理
        const earthTexture = this.createProceduralEarthTexture();
        
        // 重新创建地球
        if (this.earth) {
            this.scene.remove(this.earth);
        }
        
        const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthTexture,
            specular: new THREE.Color(0x333333),
            shininess: 15
        });
        
        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.scene.add(this.earth);
        
        // 添加南极点标记
        const southPoleGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const southPoleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const southPole = new THREE.Mesh(southPoleGeometry, southPoleMaterial);
        southPole.position.set(0, -2, 0);
        this.scene.add(southPole);
        
        // 创建程序化云层纹理
        if (this.clouds) {
            this.scene.remove(this.clouds);
        }
        
        const cloudsTexture = this.createProceduralCloudsTexture();
        const cloudsGeometry = new THREE.SphereGeometry(2.05, 64, 64);
        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.4
        });
        
        this.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        this.scene.add(this.clouds);
    }
    
    createStationMarkers() {
        this.markers = [];
        
        // 为每个站点创建标记
        weatherData.stations.forEach(station => {
            // 将经纬度转换为3D坐标
            const lat = station.location.lat * (Math.PI / 180);
            const lon = station.location.lon * (Math.PI / 180);
            
            const x = -2.05 * Math.cos(lat) * Math.sin(lon);
            const y = 2.05 * Math.sin(lat);
            const z = 2.05 * Math.cos(lat) * Math.cos(lon);
            
            // 创建标记几何体
            const markerGeometry = new THREE.SphereGeometry(0.04, 16, 16);
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x64ffda });
            
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, y, z);
            
            // 存储站点数据
            marker.userData = station;
            
            this.scene.add(marker);
            this.markers.push(marker);
        });
    }
    
    createPressureField() {
        // 创建气压场可视化
        const pressureGeometry = new THREE.SphereGeometry(2.1, 64, 64);
        const pressureMaterial = new THREE.MeshBasicMaterial({
            color: 0xff7043,
            transparent: true,
            opacity: 0.4,
            wireframe: false,
            blending: THREE.AdditiveBlending
        });
        
        this.pressureField = new THREE.Mesh(pressureGeometry, pressureMaterial);
        this.scene.add(this.pressureField);
        
        // 创建气压场动画效果
        const pressureVertices = pressureGeometry.attributes.position;
        const pressureVerticesCount = pressureVertices.count;
        
        // 存储原始顶点位置
        this.pressureOriginalPositions = new Float32Array(pressureVerticesCount * 3);
        for (let i = 0; i < pressureVerticesCount; i++) {
            this.pressureOriginalPositions[i * 3] = pressureVertices.getX(i);
            this.pressureOriginalPositions[i * 3 + 1] = pressureVertices.getY(i);
            this.pressureOriginalPositions[i * 3 + 2] = pressureVertices.getZ(i);
        }
        
        // 默认显示气压场
        this.pressureField.visible = document.getElementById('pressure-layer').checked;
    }
    
    createWindField() {
        // 创建风场可视化
        const windGroup = new THREE.Group();
        
        // 创建风向箭头
        const arrowCount = 50;
        const arrowLength = 0.2;
        
        for (let i = 0; i < arrowCount; i++) {
            // 随机位置
            const phi = Math.random() * Math.PI;
            const theta = Math.random() * Math.PI * 2;
            
            const x = -2.1 * Math.sin(phi) * Math.cos(theta);
            const y = 2.1 * Math.cos(phi);
            const z = 2.1 * Math.sin(phi) * Math.sin(theta);
            
            // 创建箭头
            const dir = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();
            
            const origin = new THREE.Vector3(x, y, z);
            const arrow = new THREE.ArrowHelper(
                dir,
                origin,
                arrowLength,
                0x29b6f6,
                arrowLength * 0.3,
                arrowLength * 0.2
            );
            
            windGroup.add(arrow);
        }
        
        this.windField = windGroup;
        this.scene.add(this.windField);
        
        // 默认显示风场
        this.windField.visible = document.getElementById('wind-layer').checked;
    }
    
    createTemperatureField() {
        // 创建温度分布可视化
        const tempGeometry = new THREE.SphereGeometry(2.08, 64, 64);
        const tempMaterial = new THREE.MeshBasicMaterial({
            color: 0xff9e80,
            transparent: true,
            opacity: 0.3,
            wireframe: false,
            blending: THREE.AdditiveBlending
        });
        
        this.temperatureField = new THREE.Mesh(tempGeometry, tempMaterial);
        this.scene.add(this.temperatureField);
        
        // 默认隐藏温度场
        this.temperatureField.visible = document.getElementById('temperature-layer').checked;
    }
    
    updatePressureField(time) {
        if (!this.pressureField || !this.pressureField.visible) return;
        
        const pressureVertices = this.pressureField.geometry.attributes.position;
        const pressureVerticesCount = pressureVertices.count;
        
        // 更新气压场动画
        for (let i = 0; i < pressureVerticesCount; i++) {
            const x = this.pressureOriginalPositions[i * 3];
            const y = this.pressureOriginalPositions[i * 3 + 1];
            const z = this.pressureOriginalPositions[i * 3 + 2];
            
            // 根据时间和位置计算扰动
            const noise = 0.05 * Math.sin(time * 0.001 + x * 5 + y * 3 + z * 2);
            
            pressureVertices.setXYZ(
                i,
                x * (1 + noise),
                y * (1 + noise),
                z * (1 + noise)
            );
        }
        
        pressureVertices.needsUpdate = true;
    }
    
    updateWindField(time) {
        if (!this.windField || !this.windField.visible) return;
        
        // 更新风场动画
        this.windField.children.forEach((arrow, index) => {
            const speed = 0.005;
            const angle = time * speed + index * 0.1;
            
            // 更新箭头方向
            const dir = new THREE.Vector3(
                Math.sin(angle),
                Math.cos(angle * 0.7),
                Math.sin(angle * 1.3)
            ).normalize();
            
            arrow.setDirection(dir);
        });
    }
    
    setupEventListeners() {
        // 添加鼠标事件监听
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
        
        // 添加图层切换事件监听
        document.getElementById('temperature-layer').addEventListener('change', (e) => {
            this.temperatureField.visible = e.target.checked;
        });
        
        document.getElementById('wind-layer').addEventListener('change', (e) => {
            this.windField.visible = e.target.checked;
        });
        
        document.getElementById('pressure-layer').addEventListener('change', (e) => {
            this.pressureField.visible = e.target.checked;
        });
        
        document.getElementById('observation-layer').addEventListener('change', (e) => {
            this.markers.forEach(marker => {
                marker.visible = e.target.checked;
            });
        });
        
        document.getElementById('cloud-layer').addEventListener('change', (e) => {
            this.clouds.visible = e.target.checked;
        });
        
        // 添加重置按钮事件
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetView();
        });
        
        // 添加概览按钮事件
        document.getElementById('overview-btn').addEventListener('click', () => {
            this.showOverview();
        });
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    onMouseClick(event) {
        // 计算鼠标位置
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // 射线检测
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // 检测与标记的交叉
        const intersects = this.raycaster.intersectObjects(this.markers);
        
        if (intersects.length > 0) {
            const station = intersects[0].object.userData;
            console.log('Selected station:', station);
            
            // 更新站点信息面板
            this.updateStationInfo(station);
            
            // 聚焦到选中的站点
            this.focusOnStation(intersects[0].object.position);
        }
    }
    
    updateStationInfo(station) {
        // 更新站点信息面板
        const stationHeader = document.querySelector('.station-header h3');
        const coordinates = document.querySelector('.coordinates');
        
        if (stationHeader && coordinates) {
            stationHeader.textContent = station.name;
            coordinates.textContent = `${Math.abs(station.location.lat)}°S, ${station.location.lon}°E`;
        }
    }
    
    focusOnStation(position) {
        // 聚焦相机到选中的站点
        const targetPosition = position.clone().normalize().multiplyScalar(5);
        
        // 使用GSAP或自定义动画来平滑过渡
        const duration = 1000; // 毫秒
        const startTime = Date.now();
        const startPosition = this.camera.position.clone();
        
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeProgress = this.easeOutQuad(progress);
            
            // 插值计算新位置
            const newPosition = new THREE.Vector3().lerpVectors(
                startPosition,
                targetPosition,
                easeProgress
            );
            
            this.camera.position.copy(newPosition);
            this.camera.lookAt(0, 0, 0);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    easeOutQuad(t) {
        return t * (2 - t);
    }
    
    resetView() {
        // 重置相机位置和旋转
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    }
    
    showOverview() {
        // 显示南极洲视角
        const targetPosition = new THREE.Vector3(0, -3, 3);
        
        // 使用动画平滑过渡
        const duration = 1000; // 毫秒
        const startTime = Date.now();
        const startPosition = this.camera.position.clone();
        
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeProgress = this.easeOutQuad(progress);
            
            // 插值计算新位置
            const newPosition = new THREE.Vector3().lerpVectors(
                startPosition,
                targetPosition,
                easeProgress
            );
            
            this.camera.position.copy(newPosition);
            this.camera.lookAt(0, 0, 0);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // 旋转地球和云层
        this.earth.rotation.y += 0.0005;
        if (this.clouds) {
            this.clouds.rotation.y += 0.0007;
        }
        if (this.atmosphere) {
            this.atmosphere.rotation.y += 0.0005;
        }
        
        // 更新大气层光晕视角
        if (this.glow && this.glow.material.uniforms) {
            this.glow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
                this.camera.position,
                this.glow.position
            );
        }
        
        // 更新气压场动画
        this.updatePressureField(Date.now());
        
        // 更新风场动画
        this.updateWindField(Date.now());
        
        // 更新控制器
        this.controls.update();
        
        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }
} 