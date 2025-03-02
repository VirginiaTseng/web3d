// 模拟气象数据
const weatherData = {
    // 南极洲气象站数据
    stations: [
        {
            id: 'taishan',
            name: '泰山站',
            location: { lat: -73.8614, lon: 76.9764 },
            data: {
                temperature: -32.1,
                windSpeed: 8.4,
                humidity: 70,
                pressure: 1012
            }
        },
        {
            id: 'zhongshan',
            name: '中山站',
            location: { lat: -69.3718, lon: 76.3824 },
            data: {
                temperature: -28.5,
                windSpeed: 7.2,
                humidity: 65,
                pressure: 1015
            }
        },
        {
            id: 'kunlun',
            name: '昆仑站',
            location: { lat: -80.4167, lon: 77.1167 },
            data: {
                temperature: -40.2,
                windSpeed: 5.8,
                humidity: 55,
                pressure: 1008
            }
        },
        {
            id: 'changcheng',
            name: '长城站',
            location: { lat: -62.2167, lon: -58.9667 },
            data: {
                temperature: -25.7,
                windSpeed: 9.3,
                humidity: 72,
                pressure: 1010
            }
        },
        {
            id: 'amundsen-scott',
            name: '阿蒙森-斯科特站',
            location: { lat: -90.0000, lon: 0.0000 },
            data: {
                temperature: -42.8,
                windSpeed: 4.6,
                humidity: 50,
                pressure: 1005
            }
        }
    ],
    
    // 南极洲整体数据
    antarctica: {
        surfaceTemperature: -26.8,
        temperature2m: -32.4,
        windSpeed: 8.6,
        precipitation: 0.2,
        pressure: 1012,
        humidity: 70
    },
    
    // 时间序列数据（24小时）
    timeSeriesData: Array.from({ length: 24 }, (_, i) => {
        return {
            hour: i,
            temperature: -30 + Math.sin(i * Math.PI / 12) * 5,
            windSpeed: 8 + Math.cos(i * Math.PI / 12) * 2,
            pressure: 1010 + Math.sin(i * Math.PI / 6) * 5,
            humidity: 65 + Math.cos(i * Math.PI / 8) * 10,
            precipitation: Math.max(0, 0.1 * Math.sin(i * Math.PI / 6))
        };
    })
};

// 获取特定时间的数据
function getDataForHour(hour) {
    return weatherData.timeSeriesData[hour];
}

// 获取站点数据
function getStationData(stationId) {
    return weatherData.stations.find(station => station.id === stationId);
}

// 根据经纬度获取温度
function getTemperatureAtLocation(lat, lon) {
    // 简单模拟：温度随纬度变化
    const baseTemp = -20;
    const latFactor = Math.abs(lat) / 90; // 纬度因子
    return baseTemp - (latFactor * 30);
}

// 根据经纬度获取气压
function getPressureAtLocation(lat, lon) {
    // 简单模拟：气压随纬度和经度变化
    const basePressure = 1013;
    const latFactor = Math.abs(lat) / 90; // 纬度因子
    const lonFactor = (Math.sin(lon * Math.PI / 180) + 1) / 2; // 经度因子
    return basePressure - (latFactor * 10) + (lonFactor * 5);
}

// 根据经纬度获取风速
function getWindSpeedAtLocation(lat, lon) {
    // 简单模拟：风速随纬度变化
    const baseWindSpeed = 5;
    const latFactor = Math.abs(lat) / 90; // 纬度因子
    return baseWindSpeed + (latFactor * 8);
} 