/**
 * ======================
 *
 * Utils
 *
 * ======================
 */

/**
 * 选择器
 */
function $ ( selector, container ) {
  return container ? container.querySelector(selector) : document.querySelector(selector);
}

/**
 * 获取对象类型
 */
function getType ( variable ) {
  return Object.prototype.toString.call(variable).match(/\s(.+)\]/)[1].toLowerCase();
}

/**
 * css 方法
 * 设置、获取样式值
 */
function css ( element, cssName, value ) {
  if ( !element.nodeType ) return null;
  var isFn;
  if ( getType( cssName ) === 'object' ) {
    for ( var key in cssName ) {
      if ( cssName.hasOwnProperty(key) ){
        css( element, key, cssName[key] );
      }
    }
    return;
  }
  if (value) {
    if (getType( value ) === "function") {
      isFn = true;
    }
    element.style[cssName] = isFn ? value(element, css(element, cssName)) : value;
  } else {
    if ( element.currentStyle ) {
      return element.currentStyle[cssName];
    }
    else {
      return getComputedStyle(element)[cssName];
    }
  }
}

/**
 * ======================
 *
 * Task
 *
 * ======================
 */

/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 0,
  nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
  var i;
  var wrap = $('.aqi-chart-wrap');
  // 初始化 wrap
  wrap.innerHTML = '';

  var chart = document.createElement('div');
  wrap.appendChild(chart);

  /**
   * 获取宽度
   * 按时间单位的不同分配宽度
   */
  function getWidth () {
    switch (pageState.nowGraTime) {
      case 'day':
        return 10;
      case 'week':
        return 50;
      case 'month':
        return 150;
    }
  }

  /**
   * 获取颜色
   * 按空气数值不同，分配颜色
   */
  function getColor ( data ) {
    if ( data <= 50 ) {
      return '#6eb720';
    } else if ( data <= 100 ) {
      return '#d6c60f';
    } else if ( data <= 150 ) {
      return '#ec7e22';
    } else if ( data <= 200 ) {
      return '#df2d00';
    } else if ( data <= 300 ) {
      return '#b414bb';
    } else {
      return '#000';
    }
  }

  for ( i in chartData ) {
    if ( chartData.hasOwnProperty(i) ) {
      var span = document.createElement('span');
      
      css(span, {
        display: 'inline-block',
        width: getWidth() + 'px',
        height: chartData[i] + 'px',
        background: getColor(chartData[i]),
        marginRight: '1px'
      });

      span.title = i;

      chart.appendChild(span);
    }
  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange( e ) {
  var value;
  if( e.target.tagName.toLowerCase() === 'input' ) {   // 防止点击 label 时触发两次事件
  // 确定是否选项发生了变化 
    value = e.target.value;
    if ( pageState.nowGraTime === value ) return;
  // 设置对应数据
    pageState.nowGraTime = value;
    chartData = setAqiChartData();
  // 调用图表渲染函数
    renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(e) {
  var value = parseInt(e.target.value);
  // 确定是否选项发生了变化 
  if ( value === pageState.nowSelectCity ) return;  
  // 设置对应数据
  pageState.nowSelectCity = value;
  chartData = setAqiChartData();
  // 调用图表渲染函数
  renderChart();  
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  $('#form-gra-time').addEventListener('click', graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var options = '',
      select = $('#city-select'),
      cities = Object.keys(aqiSourceData);
  select.innerHTML = cities.map(function (el, index) {
    return '<option value='+ index +'>' + el + '</option>';
  }).join('');
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.addEventListener('change', citySelectChange);
}

/**
 * 设置图表需要的数据格式
 */
function setAqiChartData() {
  // 按城市名称获取数据
  function getCity() {
    if ( pageState.nowSelectCity === -1 ) return '';
    return Object.keys(aqiSourceData)[pageState.nowSelectCity];
  }

  // 按时间单位整理数据
  function formatByTime( data ) {
    var result = {},
        keys = Object.keys(data),
        dayOfUnit,
        days;
    /**
     * process
     * 利用 dayOfUnit 数组整理出需要的数据格式
     *    week: dayOfUnit 应为 [3,7,7,...,7,4]
     *    month: dayOfUnit 应为 [31,29,31]
     */
    function process () {
      var timeName = {
        week: '周',
        month: '月'
      };
      var sum;
      dayOfUnit.forEach(function (el,index) {
        sum = keys.splice(0,el).map(function (el) {
          return data[el];
        }).reduce(function (previous,current) {
          return previous + current;
        });

        result[(index+1)+timeName[pageState.nowGraTime]] = Math.floor(sum/el);
      });
    }
    
    switch (pageState.nowGraTime) {
      case 'week':
        // 组织数组 dayOfUnit = [3,7,7,...,7,4]
        dayOfUnit = [3];
        days = keys.length - 3;
        dayOfUnit.length = Math.ceil(days/7);
        dayOfUnit.fill(7,1).push(days%7);
        
        process();
        break;

      case 'month':
        dayOfUnit = [31,29,31];
        process();
        break;
      
      default:
        result = data;
    }

    return result;
  }


  var data = aqiSourceData[getCity()];
  data = data&&formatByTime(data);

  return data || {};
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData = setAqiChartData();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

window.onload = init;