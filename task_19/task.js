(function () {
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


  /*
   *
   * 并归排序
   *
   */
  // 并归排序中会用到的合并方法
  function merge (arr1, arr2) {
    var result = [];
    while (arr1.length && arr2.length) {
      if ( arr1[0] > arr2[0] ) {
        result.push(arr2.shift());
      } else {
        result.push(arr1.shift());
      }
    }
    result = result.concat(arr1).concat(arr2);
    return result;
  }
  // 并归排序
  function mergeSort ( arr, start ) {
    start = start || 0;
    if ( arr.length === 1 ) return arr;
    var dividPoint = Math.floor( arr.length/2 );
    var arr1 = arr.slice(0,dividPoint);
    var arr2 = arr.slice(dividPoint);
    var newArr = merge(mergeSort(arr1, start), mergeSort(arr2, dividPoint+start));
    // 每一步都去改变原来数组，为渲染做准备
    [].splice.apply(queueData,[start, newArr.length].concat(newArr));
    // 将每一步的变化记录在 state 中
    state.push(queueData.slice());
    
    return newArr;
  }
  

  /*
   *
   * task
   *
   */
  // 队列数组
  var queueData = [];
  // 储存数组在排序过程中每一次的变化
  var state = [];
  // 管理动画过程的 interval
  var interval;

  // 渲染数组
  function renderQueue () {
    var queueWrap = $('#queue-wrap');
    queueWrap.innerHTML = '';
    var queue     = document.createElement('div');
    queueWrap.appendChild(queue);
    queue.innerHTML = queueData.map(function (el,index) {
      return '<span style="height:'+el*2+'px"><em>' + el + '</em></span>';
    }).join('');
  }
  // 生成随机数组
  function dataGenerator () {
    var len = 60;
    var i;
    queueData = [];
    for (i=0;i<len;i++) {
      queueData.push(Math.ceil(Math.random()*100));
    }
    renderQueue();
  }
  
  // 渲染 state 中每一步的结果
  function draw () {
    queueData = state.shift();
    renderQueue();
  }
  
  // 排序的事件处理函数
  function sortHandler () {
    if (interval) return alert('排序演示正在进行');
    mergeSort(queueData);
    interval = setInterval(function(){
      if (!state.length) {
        clearInterval(interval);
        interval = null;
        return;
      }
      draw();
    }, 200);
  }
  
  // 添加、删除队列元素的事件生成器
  function deal (func, succ) {
    var args = [].slice.call(arguments, 2);
    return function (e) {
      try {
        var arg = args.map(function (el) {
          return typeof el === 'function' ? el(e) : el;
        });
        var result = func.apply(queueData, arg);
        renderQueue();

        succ && succ(result + " 被移出了队列");
      } catch (exception) {
        alert(exception.message);
      }
    }
  }

  function getInput () {
    var num = $('input').value.trim();
    if (!validate(num) || parseInt(num)>100) throw new Error('请输入不超过 100 的正整数');
    return parseInt($('input').value.trim());
  }

  function validate (str) {
    return /^\d+$/.test(str);
  }

  function getIndex (e) {
    if ( e.target.tagName.toLowerCase() !== 'span' ) return;
    return Array.from(document.querySelectorAll('span')).indexOf(e.target);
  }

  function initEvent () {
    $('#unshift').addEventListener('click', deal([].unshift, null, getInput));
    $('#push').addEventListener('click', deal([].push, null, getInput));
    $('#shift').addEventListener('click', deal([].shift, window.alert));
    $('#pop').addEventListener('click', deal([].pop, window.alert));
    $('#queue-wrap').addEventListener('click', deal([].splice, window.alert, getIndex, 1));
    $('#sort').addEventListener('click', sortHandler);
    $('#generate').addEventListener('click', dataGenerator);
  }

  function init () {
    initEvent();
  }

  window.onload = init;

})();