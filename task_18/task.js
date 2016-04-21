function $ ( selector ) {
  return document.querySelector(selector);
}

var btn2Method = {
  '左侧入': 'unshift',
  '右侧入': 'push',
  '左侧出': 'shift',
  '右侧出': 'pop'
};

var queueData = [];

function renderQueue () {
  var queueWrap = $('#queue-wrap');
  queueWrap.innerHTML = '';
  var queue     = document.createElement('div');
  var temp      = '';
  queueWrap.appendChild(queue);
  queue.innerHTML = queueData.map(function (el,index) {
    return '<span style="height:'+el*2+'px"><em>' + el + '</em></span>';
  }).join('');
}

function queueHandler (e) {
  if ( e.target.tagName.toLowerCase() !== 'button' ) return;
  var data,
      input;
  var type = btn2Method[e.target.innerHTML];
  if (type === 'unshift' || type === 'push') {
    input = $('input').value.trim();
    if ( !/^\d+$/.exec(input) ) {
      alert("输入无效，请输入阿拉伯数字！");
      return;
    }
    queueData[type](parseInt(input));
  } else {
    alert(queueData[type]()+" 被移出了队列");
  }

  renderQueue();
}

function delHandler (e) {
  if ( e.target.tagName.toLowerCase() !== 'span' ) return;
  var index = Array.from(document.querySelectorAll('span')).indexOf(e.target);
  queueData.splice(index,1);
  renderQueue();
}

function initEvent () {
  document.addEventListener('click', queueHandler);
  $('#queue-wrap').addEventListener('click', delHandler);
}

function init () {
  initEvent();
}

window.onload = init;