/*
 *
 * utils
 *
 */
// 选择器
function $ ( selector, container ) {
  container = container || document;
  return container.querySelector(selector);
}
// 去除数组中的空字符串
function removeEmpty ( arr ) {
  var result = [];
  [].forEach.call(arr, function(el){
    if ( el !== '' ) result.push(el);
  })
  return result;
}
// 去除 HTML element 上的 class
function clearClass ( HTMLel ) {
  HTMLel.className = "";
}
// 添加 class
function addClass ( HTMLel, className ) {
  HTMLel.className = className;
}

/*
 *
 * task
 *
 */  
// queue
var queueData = [];
// 渲染
function renderQueue ( match ) {
  var queueWrap = $('#queue-wrap'),
      queue     = document.createElement('ul');
  queueWrap.innerHTML = '';
  queueWrap.appendChild(queue);
  queue.innerHTML = queueData.map(function (el,index) {
    var result = el;
    if ( match && RegExp(match).test(el) ) {
      result = String(el).replace(match, '<span class="high-light">'+match+'</span>')
    }
    return '<li>' + result + '</li>';
  }).join('');
}

function deal (func, succ) {
  var args = [].slice.call(arguments, 2);
  return function (e) {
    try {
      var arg = args.map(function (el) {
        return typeof el === 'function' ? el(e) : el;
      });
      if ( Array.isArray(arg[0]) ) {
        arg[0].forEach(function(el){
          func.apply(queueData, [el].concat(arg.slice(1)));
        })
      } else {
        var result = func.apply(queueData, arg);
      }
      renderQueue();

      succ && succ(result + " 被移出了队列");
    } catch (exception) {
      alert(exception.message);
    }
  }
}

function getInput () {
  var result = $('#input').value.trim();
  if (!validate(result)) throw new Error('请输入中英文或数字，用逗号、回车、空格作为区分');
  result = removeEmpty(result.split(/[\s\n,，]/));
  return result;
}

function getInputReverse () {
  return getInput().reverse();
}

function validate (str) {
  return /^[\dA-Za-z\u4e00-\u9fa5\s\n,，]+$/.test(str);
}

function getIndex (e) {
  if ( e.target.tagName.toLowerCase() !== 'span' ) return;
  return Array.from(document.querySelectorAll('span')).indexOf(e.target);
}

function searchHandler () {
  var input = $('#search-input').value;
  var reg = RegExp(input);
  var list = Array.from(document.querySelectorAll('li'));
  list.forEach(function (el) {
    clearClass(el);
  });
  var result = queueData.forEach(function (el, index) {
    if (reg.test(el)) addClass(list[index], 'high-light');
  });
}

function initEvent () {
  $('#unshift').addEventListener('click', deal([].unshift, null, getInputReverse));
  $('#push').addEventListener('click', deal([].push, null, getInput));
  $('#shift').addEventListener('click', deal([].shift, window.alert));
  $('#pop').addEventListener('click', deal([].pop, window.alert));
  $('#queue-wrap').addEventListener('click', deal([].splice, window.alert, getIndex, 1));
  $('#search').addEventListener('click', function(){renderQueue($('#search-input').value)});
}

function init () {
  renderQueue();
  initEvent();
}

window.onload = init;