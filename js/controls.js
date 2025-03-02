class TimeController {
    constructor() {
        this.currentTime = new Date();
        this.isPlaying = false;
        this.playbackSpeed = 1; // 小时/秒
        this.timeSlider = document.getElementById('time-slider');
        this.playBtn = document.getElementById('play-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        
        this.setupEventListeners();
        this.updateTimeDisplay();
    }
    
    setupEventListeners() {
        // 播放按钮
        this.playBtn.addEventListener('click', () => {
            this.isPlaying = true;
            this.playBtn.style.display = 'none';
            this.pauseBtn.style.display = 'inline-block';
            this.startPlayback();
        });
        
        // 暂停按钮
        this.pauseBtn.addEventListener('click', () => {
            this.isPlaying = false;
            this.pauseBtn.style.display = 'none';
            this.playBtn.style.display = 'inline-block';
        });
        
        // 时间滑块
        this.timeSlider.addEventListener('input', () => {
            const hour = parseInt(this.timeSlider.value);
            this.setTime(hour);
        });
    }
    
    startPlayback() {
        if (!this.isPlaying) return;
        
        const currentHour = parseInt(this.timeSlider.value);
        let nextHour = currentHour + 1;
        
        if (nextHour > 24) {
            nextHour = 0;
        }
        
        this.timeSlider.value = nextHour;
        this.setTime(nextHour);
        
        setTimeout(() => {
            this.startPlayback();
        }, 1000 / this.playbackSpeed);
    }
    
    setTime(hour) {
        this.currentTime.setHours(hour);
        this.updateTimeDisplay();
        
        // 触发时间变化事件
        const event = new CustomEvent('timeChange', { detail: { hour: hour } });
        window.dispatchEvent(event);
    }
    
    updateTimeDisplay() {
        const timeInfo = document.querySelector('.time-info');
        const date = this.currentTime.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        
        timeInfo.textContent = `时间轴: ${date}`;
    }
}

class DataUpdater {
    constructor() {
        this.refreshBtn = document.getElementById('refresh-btn');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.refreshBtn.addEventListener('click', () => {
            this.updateData();
        });
        
        // 监听时间变化事件
        window.addEventListener('timeChange', (e) => {
            this.updateDataForTime(e.detail.hour);
        });
    }
    
    updateData() {
        // 模拟数据更新
        const temperatureValues = document.querySelectorAll('.data-value');
        
        // 随机波动数据
        temperatureValues.forEach(value => {
            const currentText = value.textContent;
            
            if (currentText.includes('°C')) {
                const currentTemp = parseFloat(currentText);
                const newTemp = (currentTemp + (Math.random() * 0.6 - 0.3)).toFixed(1);
                value.textContent = `${newTemp} °C`;
            } else if (currentText.includes('m/s')) {
                const currentWind = parseFloat(currentText);
                const newWind = (currentWind + (Math.random() * 0.4 - 0.2)).toFixed(1);
                value.textContent = `${newWind} m/s`;
            } else if (currentText.includes('mm')) {
                const currentPrecip = parseFloat(currentText);
                const newPrecip = (currentPrecip + (Math.random() * 0.1)).toFixed(1);
                value.textContent = `${newPrecip} mm`;
            } else if (currentText.includes('hPa')) {
                const currentPressure = parseFloat(currentText);
                const newPressure = Math.round(currentPressure + (Math.random() * 2 - 1));
                value.textContent = `${newPressure} hPa`;
            } else if (currentText.includes('%')) {
                const currentHumidity = parseFloat(currentText);
                const newHumidity = Math.round(currentHumidity + (Math.random() * 2 - 1));
                value.textContent = `${newHumidity} %`;
            }
        });
    }
    
    updateDataForTime(hour) {
        // 根据时间更新数据
        // 这里可以实现更复杂的时间相关数据变化
        this.updateData();
    }
} 