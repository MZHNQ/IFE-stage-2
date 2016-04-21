// Node
function Node (data) {
  this.data     = data;
  this.parent   = null;
  this.children = [];
}

/*===========
 *
 *  Tree
 *
 *===========
 *
 * Methods:
 *
 *  traverseDF( callback )
 *  traverseBF( callback )
 *  contains( data, traversal )
 *  add ( child, parent )
 *  remove ( node, parent )
 *
 */

function Tree (data) {
  var node = new Node(data);
  this._root = node;
}

Tree.prototype.traverseDF = function (callback) {
  (function recurse (currentNode) {
    currentNode.children.forEach(function (el) {
      recurse(el);
    })
    callback(currentNode);
  })(this._root);
};

Tree.prototype.traverseBF = function (callback) {
  var queue = [];
  queue.push(this._root);
  currentTree = queue.shift();

  while (currentTree) {
    currentTree.children.forEach( function (el) {
      queue.push(el);
    });
    callback(currentTree);
    currentTree = queue.shift();
  }
};

Tree.prototype.contains = function (callback, traversal) {
  traversal.call(this, callback);
};

Tree.prototype.add =function (data, toData, traversal) {
  var child    = new Node(data),
      parent   = null,
      callback = function (node) {
        if (node.data === toData) {
          parent = node;
        }
      };
      this.contains(callback, traversal);
      if (parent) {
        parent.children.push(child);
        child.parent = parent;
      } else {
        throw new Error('Cannot add node to a non-existent parent.');
      }
};

Tree.prototype.remove = function (data, fromData, traversal) {
  var tree          = this,
      parent        = null,
      childToRemove = null,
      index;

  var callback = function (node) {
    if (node.data === fromData) {
      parent = node;
    }
  }

  function findIndex (arr, data) {
    var index;
    arr.forEach(function (el, i) {
      if (el.data === data) index = i;
    })
    return index;
  }

  this.contains(callback, traversal);

  if (parent) {
    index = findIndex(parent.children, data);
    if (index === undefined) {
      throw new Error('Node to remove does not exist.');
    } else {
      childToRemove = parent.children.splice(index, 1);
    }
  } else {
    throw new Error('Parent does not exist.');
  }

  return childToRemove;
};

// 上面是一个树结构，下面我想实现一个树对象，名称暂定为 TreeElement
// 接收一个参数，参数结构如下

var treeData = {
  data: 'one', children: [
    {data: 'two', children: [
      {data: 'five', children: []},
      {data: 'six', children: []},
      {data: 'seven', children: []}
    ]},
    {data: 'three', children: []},
    {data: 'four', children: [
      {data: 'eight', children: []},
      {data: 'nine', children: []}
  ]}
]};

var template = {
  root: '<div class="node-data"></div><ul class="node-children"></ul>',
  element: '<li><div class="node-data"></div><ul class="node-children"></ul></li>',
  render: function (type) {
    var temp = document.createElement('div');
    var fragment = document.createDocumentFragment();
    temp.innerHTML = this[type];
    Array.from(temp.children).forEach(function (el) {
      fragment.appendChild(el);
    });
    return {
      html: fragment,
      title: fragment.querySelector('.node-data'),
      container: fragment.querySelector('.node-children')
    };
  }
};

function TreeComponent (data, template) {
  this.tree = null;
  this.template = template;
  this.initTree(data);
  this.render(template);
}

TreeComponent.prototype.initTree = function (data) {
  var self = this;
  (function createTree (currentTree, parentTree) {
    if (!parentTree) {
      self.tree = new Tree(currentTree.data);
    } else {
      self.tree.add(currentTree.data, parentTree.data, self.tree.traverseBF);
    }

    if (currentTree.children.length) {
      currentTree.children.forEach(function (el) {
        createTree(el, currentTree);
      })
    }
  })(data);
}

TreeComponent.prototype.render = function () {
  var container = document.querySelector('#tree-container');
  container.innerHTML = '';
  this.tree.traverseBF(function (node) {
    var parent,
        type;
    if (!node.parent) {
      parent = container;
      type = 'root';
    } else {
      parent = node.parent._dom.container;
      type = 'element';
    }
    
    node._dom = this.template.render(type);
  
    node._dom.title.innerHTML = node.data;
    parent.appendChild(node._dom.html);
  });
};

TreeComponent.prototype.traversal = function (traversalType) {
  this.render();
  tree.animate = new Animation();
  this.tree[traversalType](function (node) {
    tree.animate.queue.push(node);
  });
  tree.animate.start(this.draw).then(this.render.bind(this));
};

TreeComponent.prototype.draw = function (cur, pre) {
  if (pre) {
    pre._dom.title.classList.remove('highlight');
  }
  cur._dom.title.classList.add('highlight');
};

function Animation () {
  this.queue = [];
}

Animation.prototype.start = function (callback) {
  var self = this;
  var currentElement, lastElement;
  self.promise = new Promise (function (resolve, reject) {
    self.timer = setTimeout(function tick () {
      if (!self.queue.length) {
        self.stop();
        resolve(currentElement);
      } else {
        lastElement = currentElement;
        currentElement = self.queue.shift();
        callback(currentElement, lastElement);
        self.timer = setTimeout(tick, 500);
      }
    }, 500)
  });
  return self.promise;
};

Animation.prototype.stop = function () {
  clearTimeout(this.timer);
  this.timer = null;
}

// var ani = new Animation();
// ani.queue = [1,2,3,4,5,6];
// ani.start(function (el, pre) {
//   console.log(el, pre);
// }).then(function () {
//   alert('结束');
// });

var tree = new TreeComponent(treeData, template);
document.querySelector('#dfc').addEventListener('click', function() {
  if (tree.animate) {
    tree.animate.stop();
    tree.animate = null;
  }
  tree.traversal('traverseDF');
});
document.querySelector('#bfc').addEventListener('click', function() {
  if (tree.animate) {
    tree.animate.stop();
    tree.animate = null;
  }
  tree.traversal('traverseBF')
});
