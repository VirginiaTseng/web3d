document.addEventListener('DOMContentLoaded', () => {
    // 更新日期和时间
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // 初始化应用
    initApp();
});

function initApp() {
    try {
        // 检查WebGL支持
        if (!checkWebGLSupport()) {
            showError('您的浏览器不支持WebGL，请使用现代浏览器访问本页面。');
            return;
        }
        
        // 初始化地球
        const earthContainer = document.getElementById('earth-container');
        const earth = new Earth(earthContainer);
        
        // 监听地球加载事件
        earth.loadingManager.onLoad = () => {
            console.log('所有资源加载完成');
            hideLoadingScreen();
        };
        
        earth.loadingManager.onError = (url) => {
            console.error('加载资源出错:', url);
            showError('加载资源时出错，正在使用备用数据...');
        };
        
        // 初始化时间控制器
        const timeController = new TimeController();
        
        // 初始化数据更新器
        const dataUpdater = new DataUpdater();
        
        // 如果5秒后仍未加载完成，也隐藏加载屏幕（防止加载卡住）
        setTimeout(() => {
            hideLoadingScreen();
        }, 5000);
    } catch (error) {
        console.error('初始化应用时出错:', error);
        showError('初始化应用时出错，请刷新页面重试。');
    }
}

function updateDateTime() {
    const now = new Date();
    
    // 更新日期
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    }
    
    // 更新时间
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = `星期${['日', '一', '二', '三', '四', '五', '六'][now.getDay()]} ${now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })}`;
    }
}

function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
} 