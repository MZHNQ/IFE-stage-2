function $ ( selector ) {
  return document.querySelector( selector );
}


/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var city = $('#aqi-city-input').value.trim(),
      num  = $('#aqi-value-input').value.trim();

  if ( !/^[A-Za-z\u4e00-\u9fa5]+$/.exec(city) ) {
    alert("城市名称只能使用中英文字符！");
    return;
  } 
  else if ( !/^\d+$/.exec(num) ) {
    alert("空气质量值必须是整数！");
    return;
  }

  aqiData[city] = parseInt(num);
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var i;
  var table = $('#aqi-table');
  // table.innerHTML = '';
  
  if (isEmptyObj(aqiData)) return;

  var temp = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';

  for ( i in aqiData ) {
    if ( aqiData.hasOwnProperty(i) ) {
      temp += '<tr><td>' + i + '</td><td>' + aqiData[i] + '</td><td><button data-city=' + i + '>删除</button></td></tr>';
    }
  }

  table.innerHTML = temp;
}

/**
 * 判断对象是否为空
 * 空：true
 */
function isEmptyObj ( obj ) {
  return Object.keys(obj).length ? false : true;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
  // do sth.
  var city = e.target.dataset.city;
  delete aqiData[city];
  renderAqiList();
}

function init() {
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addBtn = $('#add-btn');
  addBtn.addEventListener('click', addBtnHandle);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  $('#aqi-table').addEventListener('click', delBtnHandle);
}

window.onload = init;