//console.log(data)
var TodoController = (function () {
  // Privet Functions
  var Lists = function (id, val, items) {
    this.id = id;
    this.val = val;
    this.items = items;
  };
  var Todos = function (status, val, tabId) {
    this.status = status;
    this.val = val;
    this.tabId = tabId
  };
  // Public Object / Modules


  return {

    addItem: function (value) {
      var id;


      if (data.lists.length > 0) {
        id = data.lists[data.lists.length - 1].id + 1
      } else {
        id = 0
      }
      var items = [];
      var newList = new Lists(id, value, items);
      data.lists.push(newList);
      // Store
      LocalStor.addToStor(data)
      return newList;
    },
    addTodo: function (status, value, tabId) {
      var stat, newTodo;
      stat = false;
      newTodo = new Todos(stat, value, tabId);
      data.lists[tabId].items.push(newTodo);

      return newTodo;
    },
    completeTodo: function (obj) {
      obj.status = !obj.status
    },
    updateTodo: function (obj, newVal) {
      obj.val = newVal
    },
    removeTodo: function (obj) {
      data.lists[obj.tabId].items.splice(data.lists[obj.tabId].items.indexOf(obj), 1)
    },
    testing: function () {
      console.log(data)
    }
  }
})();

var UIController = (function () {
  // Privet Function
  var DOMStrings = {
    btnAddList: '.addListBtn',
    inputTitle: '.listTitle',
    tabs: '.tabs',
    tabTitleContentTodos: '.collection-header',
    inputTodo: '.inputTodo',
    btnAddTodo: '.btnAddTodo',
    todos: '.collection-item',
    activeTab: '.collection.active'
  };

  // Public Object / Modules
  return {
    getInputValue: function (id) {
      return {
        titleInput: document.querySelector(DOMStrings.inputTitle).value
      }
    },
    getInputTodo: function (id) {
      return {
        titleTab: document.querySelector(`#${id} ${DOMStrings.inputTodo}`).value,
      }
    },
    addListItem: function (obj) {
      var html, elem, tab;
      elem = document.querySelector(DOMStrings.tabs);
      html = function () {
        return `<li class="tab col" id="${obj.id}">
          <a href="#${obj.val.titleInput}">${obj.val.titleInput}</a>
        </li>`;
      };
      elem.insertAdjacentHTML('beforeend', html());
      tab =
        `<ul class="collection with-header active" id="${obj.val.titleInput}-${obj.id}">
              <li class="collection-header row">
                <h4 class=" col s5" >
                  <span class="">${obj.val.titleInput}</span>
                </h4>
                <div class="input-field col s6 " >
                  <input class="validate inputTodo" value="" type="text" />
                  <label class="active" >Add Todo</label>
                </div>
                <span class="col s1">
                  <button class="btnAddTodo" data-index="${obj.id}" data-parent="${obj.val.titleInput}-${obj.id}"><i class="material-icons">add</i></button>
                </span>

              </li>
            </ul>`;
      elem.insertAdjacentHTML('afterend', tab);
    },
    addTodoItem: function (obj, tabId) {
      var todo, htmlTodo;
      todo = document.querySelector(`#${tabId}`);
      htmlTodo =
        `<li class="collection-item">
                    <div class="updateTodo row hide">
                      <input type="text" class="col s9">
                      <span class="col s3">
                        <a class="waves-effect waves-light btn "><i class="material-icons left">cloud</i>update</a>
                      </span>
                    </div>
                    <div>
                      <span class="content">${obj.val}</span>
                      <span class="secondary-content">
                        <span class="done action">
                          <i class="material-icons">crop_square</i>
                        </span>
                        <span class="edit action">
                          <i class="material-icons blue-text text-lighten-1">edit</i>
                        </span>
                        <span class="remove action">
                          <i class="material-icons red-text text-lighten-1">clear</i>
                        </span>
                      </span>
                    </div>
                  </li>`;
      todo.insertAdjacentHTML('beforeend', htmlTodo)
    },
    completeTodo: function (todo) {
      todo.classList.toggle('completed');
      if (todo.querySelector('.done i').textContent === 'check') {
        todo.querySelector('.done i').textContent = 'crop_square';
      } else {
        todo.querySelector('.done i').textContent = 'check';
      }
    },
    updatedTodo: function (obj, todo) {
      var inputEdit = todo.querySelector('.updateTodo');
      inputEdit.classList.toggle("hide");
      inputEdit.querySelector('input').value = todo.querySelector('.content').textContent;
      inputEdit.querySelector('.btn').addEventListener('click', function (e) {
        e.preventDefault();
        var newVal = inputEdit.querySelector('input').value;
        todo.querySelector('.content').textContent = newVal;
        TodoController.updateTodo(obj, newVal);
        inputEdit.querySelector('input').value = '';
        inputEdit.classList.toggle("hide");

      })
    },
    removedTodo: function (obj, todo) {
      todo.parentNode.removeChild(todo);
    },
    getDomStrings: function () {
      return DOMStrings;
    }
  }
})();

var LocalStor = (function () {
  var addTodosStor = function (arr) {

    for (var el in arr) {
      UIController.addTodoItem(el, `${arr.val.titleInput}-${arr.id}`)
      AppController.addTodoController(`${arr.val.titleInput}-${arr.id}`)
      AppController.todoActions(el, arr.val.titleInput)
    }
  };
  var addContent = function (data) {
    if (data !== null) {
      data.lists.forEach(function (item) {
        UIController.addListItem(item)
        addTodosStor(item)
      })
      /*for (var i = 0; i < data.lists.length; i++) {
        item = data.lists[i]
        UIController.addListItem(item)
        console.log('item', item)
        for (var elem = 0; elem < item.items.length; elem++) {

          UIController.addTodoItem(elem, `${item.val.titleInput}-${item.id}`)
          AppController.addTodoController(`${item.val.titleInput}-${item.id}`)
          AppController.todoActions(elem, item.val.titleInput)

        }
      }*/

    }
  };
  return {
    addToStor: function () {
      localStorage.setItem("data", JSON.stringify(data))
    },
    initStor: function () {
      //TodoController.data = localStorage.getItem("data")
      data = JSON.parse(localStorage.getItem("data"))


      //console.log(JSON.parse(localStorage.getItem("data")));
      if (data !== null) {
        data = JSON.parse(localStorage.getItem("data"))
        addContent(data)
        return data
      } else {
        data = {
          lists: []
        }
      }

      return data

      //console.log(JSON.parse(localStorage.getItem("data")).lists.length)
    },

    clearStore: function () {
      localStorage.clear()
    }
  }
  //return console.log(JSON.parse(localStorage.getItem('data')))

})()
var AppController = (function (TodoCtrl, UICtrl, StoreData) {
  var DOM = UICtrl.getDomStrings();
  var setupEventListeners = function () {
    var addListBtn = document.querySelector(DOM.btnAddList);
    addListBtn.addEventListener('click', addListController);
    document.addEventListener('keypress', function (e) {
      if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
        addListController();
      }
    });
  };
  var addListController = function () {
    var value, newList;
    // 1. get Input data
    value = UICtrl.getInputValue();
    document.querySelector(DOM.inputTitle).value = '';
    // 2. store the value
    newList = TodoCtrl.addItem(value);
    // 3. Add the List in UI
    UICtrl.addListItem(newList);
    if (DOM.tabTitleContentTodos !== null) {
      var addTodoBtns = document.querySelector(DOM.tabTitleContentTodos);
      var addBtn = document.querySelector(DOM.btnAddTodo);
      addTodoBtns.addEventListener('click', function (e) {
        if (e.target === addBtn) {
          id = e.target.dataset.parent;
          AppController.addTodoController(id);
        }
      });
    }
  };


  return {
    addTodoController: function (id) {
      var newTodo, todoValue, tabId, tabIndex, val;
      // 1. get Input data
      newTodo = UICtrl.getInputTodo(id);
      tabId = id;
      tabId = tabId.split('-');
      tabIndex = tabId[tabId.length - 1];
      tabIndex = parseInt(tabIndex);
      val = newTodo.titleTab;
      //status, value, tabId
      todoValue = TodoCtrl.addTodo(false, val, tabIndex);

      // 4. add new todo
      UICtrl.addTodoItem(todoValue, id);
      document.querySelector(DOM.inputTodo).value = '';
      AppController.todoActions(todoValue, todoValue.val);
    },
    todoActions: function (obj, contentToDo) {
      var todos = document.querySelectorAll(DOM.todos);
      todos.forEach(function (item) {
        if (item.querySelector('.content').textContent === contentToDo) {
          item.addEventListener('click', function (e) {
            var todo = e.target.parentNode.parentNode.parentNode.parentNode;
            if (e.target.parentNode.classList.contains('done')) {
              TodoCtrl.completeTodo(obj);
              UICtrl.completeTodo(todo);
              LocalStor.addToStor(data)
            } else if (e.target.parentNode.classList.contains('edit')) {
              UICtrl.updatedTodo(obj, todo);
              LocalStor.addToStor(data)
            } else if (e.target.parentNode.classList.contains('remove')) {
              UICtrl.removedTodo(obj, todo);
              TodoCtrl.removeTodo(obj);
              LocalStor.addToStor(data)

            }

          })

        }
      });
    },
    init: function () {
      var data;
      data = StoreData.initStor()
      document.querySelector(DOM.inputTitle).value = '';
      setupEventListeners();
      //return data
    }
  }
})(TodoController, UIController, LocalStor);
AppController.init();
