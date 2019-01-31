var TodoController = (function() {
  // Privet Functions
  var Lists = function (id, val, items) {
    this.id = id;
    this.val = val;
    this.items = items;
  };
  // Public Object / Modules
  var data = {
    lists: [],
  };
  return {
    addItem: function (value) {
      var id ;
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
    testing: function () {
      console.log(data)
    }
  }
})();

var UIController = (function() {
  // Privet Function
  var DOMStrings = {
    btnAddList : '.addListBtn',
    inputTitle: '.listTitle'
  };

  // Public Object / Modules
  return {
    getInputValue: function () {
      return {
        titleInput: document.querySelector(DOMStrings.inputTitle).value
      }
    },
    getDomStrings: function () {
      return DOMStrings
    }
  }
})();


var AppController= (function (TodoCtrl, UICtrl) {
  var DOM = UICtrl.getDomStrings();
  var setupEventListeners = function () {
    var addListBtn = document.querySelector(DOM.btnAddList);
    addListBtn.addEventListener('click', addListController);

    document.addEventListener('keypress', function (e) {
      if(e.key==="Enter" || e.keyCode === 13 || e.which === 13){
        addListController();
      }
    })
  };

  var addListController = function () {
    var value, newList;
    // 1. get Input data
    value = UICtrl.getInputValue();
    console.log(value);
    document.querySelector(DOM.inputTitle).value = '';
    // 2. store the value
    newList = TodoCtrl.addItem(value);
    // 3. Add the List in UI

  };
  return {
    init: function () {
      document.querySelector(DOM.inputTitle).value = '';
      setupEventListeners();
    }

}



})(TodoController, UIController);
AppController.init();
