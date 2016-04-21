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
  [].forEach.call(arr, function (el) {
    if ( el !== '' ) result.push(el);
  })
  return result;
}
// 去除数组中的重复
function unique ( arr ) {
  var result = [];
  arr.forEach(function (el) {
    if (result.indexOf(el) === -1) result.push(el);
  });
  return result;
}
// 限制数组的数量
function limit ( arr, n ) {
  if (arr.length > n) return arr.slice(arr.length - n);
  return arr;
}
// hover
function hover ( element, fIn, fOut ) {
  element.addEventListener('mouseover', fIn);
  element.addEventListener('mouseout', fOut);
}

/*
 *
 * task
 *
 */

function Queue ( option ) {
  this.data = [];
  this.container = $(option.selector);
  this.type = option.type;
  this.init();
};

Queue.prototype.render = function ( match ) {
  this.output.innerHTML = this.data.map(function (el) {
    return '<span>' + el + '</span>';
  }).join('');
};

Queue.prototype.initElements = function () {
  this.input = document.createElement(this.type);
  this.container.appendChild(this.input);
  if (this.type === 'textarea') {
    this.btn = document.createElement('button');
    this.btn.innerHTML = "确认兴趣爱好";
    this.container.appendChild(this.btn);
  }
  this.output = document.createElement('div');
  this.container.appendChild(this.output);
};

Queue.prototype._getInput = function () {
  var result = this.input.value.trim();
  return removeEmpty(result.split(/[\s\n,，;；]/));
};

Queue.prototype.addHandler = function () {
  var newData = this._getInput();
  if (!Array.isArray(newData)) newData = [newData];
  this.data = this.data.concat(newData);
  this.data = limit(unique( this.data ), 10);
  this.render();
};

Queue.prototype.removeHandler = function (e) {
  if ( e.target.tagName.toLowerCase() !== 'span' ) return;
  var index = Array.from(this.container.querySelectorAll('span')).indexOf(e.target);
  this.data.splice(index, 1);
  this.render();
};

Queue.prototype._hover = function () {
  hover(this.container, function(e){
    if (e.target.tagName.toLowerCase() !== 'span') return;
    e.target.innerHTML = "删除" + e.target.innerHTML;
  }, function(e){
    if (e.target.tagName.toLowerCase() !== 'span') return;
    e.target.innerHTML = e.target.innerHTML.slice(2);
  });
}

Queue.prototype.initEvent = function () {
  if (this.type === 'textarea') {
    this.btn.addEventListener('click', this.addHandler.bind(this));
  } else {
    this.input.addEventListener('keyup', function (e) {
      if ( e.which === 32 || e.which === 13 || e.which === 186 ) {
        this.addHandler();
        e.target.value = '';
      }
    }.bind(this));
    this.output.addEventListener('click', this.removeHandler.bind(this));
    this._hover();
  }
};

Queue.prototype.init = function () {
  this.initElements();
  this.initEvent();
};

var hobby = new Queue({
  selector: '#hobby',
  type: 'textarea'
});

var tag = new Queue({
  selector: '#tag',
  type: 'input'
});