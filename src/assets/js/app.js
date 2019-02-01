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
  var data = {
    lists: [],
  };
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
      return newList;
    },
    addTodo: function (status, value, tabId) {
      var stat, newTodo;
      stat = false;

      newTodo = new Todos(stat,value, tabId);
      console.log('newTodo', newTodo);
      data.lists[tabId].items.push(newTodo);
      return newTodo;
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
      console.log(obj)
      html =
        `<li class="tab col" id="${obj.id}">
          <a href="#${obj.val.titleInput}">${obj.val.titleInput}</a>
        </li>`;
      elem.insertAdjacentHTML('beforeend', html);
      tab = `<ul class="collection with-header active" id="${obj.val.titleInput}-${obj.id}">
              <li class="collection-header row">
                <h4 class=" col s5" >
                  <span class="">${obj.val.titleInput}</span>
                </h4>
                <div class="input-field col s6 " >
                  <input class="validate inputTodo" value="Alvin" type="text" />
                  <label class="active" >Todo</label>
                </div>
                <span class="col s1">
                  <button class="btnAddTodo" data-index="${obj.id}" data-parent="${obj.val.titleInput}-${obj.id}"><i class="material-icons">add</i></button>
                </span>
              
              </li>
            </ul>`;
      elem.insertAdjacentHTML('afterend', tab);
    },
    addTodoItem: function(obj,tabId) {
      console.log('obj',obj)
      var todo, htmlTodo;
      console.log(`todo: #${tabId}`)
      todo = document.querySelector(`#${tabId}`);
      htmlTodo = `<li class="collection-item">
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
    getDomStrings: function () {
      return DOMStrings
    }
  }
})();

var AppController = (function (TodoCtrl, UICtrl) {
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
    console.log('val', value);
    document.querySelector(DOM.inputTitle).value = '';
    // 2. store the value
    newList = TodoCtrl.addItem(value);
    console.log(newList);
    // 3. Add the List in UI
    UICtrl.addListItem(newList);
    console.log(DOM.tabTitleContentTodos);
    if (DOM.tabTitleContentTodos !== null){
      var addTodoBtns = document.querySelector(DOM.tabTitleContentTodos);
      var addBtn = document.querySelector(DOM.btnAddTodo);
      addTodoBtns.addEventListener('click', function (e) {
        if(e.target === addBtn) {
          id = e.target.dataset.parent
          console.log('parent: ',e.target.dataset.parent)
          addTodoController(id)
        }
        console.log(e.target)
      });
    }



  };
  var addTodoController= function (id) {
    var newTodo, todoValue, tabId, tabIndex, val;
    // 1. get Input data
    newTodo = UICtrl.getInputTodo(id);
    tabId = id;
    tabId = tabId.split('-');
    tabIndex = tabId[tabId.length -1];
    tabIndex = parseInt(tabIndex);
    val = newTodo.titleTab;
    //status, value, tabId
    todoValue = TodoCtrl.addTodo(false, val, tabIndex);
    // 4. add new todo
    UICtrl.addTodoItem(todoValue, id)
  };
  return {
    init: function () {
      document.querySelector(DOM.inputTitle).value = '';
      setupEventListeners();
    }
  }
})(TodoController, UIController);
AppController.init();
