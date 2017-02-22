(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Goods = require('../src/goods');
var Cart = require('../src/cart');

app.controller('indexController', function($scope) {
    $scope.showCart = false;
    // 导入所有商品
    $scope.goodsList= Goods.loadAllGoodsInfos();

    // cart数组
    $scope.cartList = [];

    // 总税价
    $scope.totalTaxes = 0;
    $scope.total = 0;

    var filters = [0,1,2], // 定义不需要给税的商品种类数组
        salesTaxRate = 0.1, // 定义销售税税率
        importedTaxRate = 0.05; // 定义进口税率
    var cart = new Cart(filters,salesTaxRate,importedTaxRate);
    $scope.addToCart = function(e, goods, count) {
        if(!$scope.showCart) {
            $scope.cartList = cart.addCart(goods,count);
        }
    };

    $scope.reset = function(e) {
        e.preventDefault();
        $scope.cartList = [];
        cart.cartGoodsList = [];
        $scope.totalTaxes = 0;
        $scope.total = 0;
        $scope.showCart = false;
    };

    $scope.checkout = function(e) {
        e.preventDefault();
        $scope.totalTaxes = cart.getTotalTaxes();
        $scope.total = cart.getTotal();
        $scope.showCart = true;
    }
});
},{"../src/cart":3,"../src/goods":4}],2:[function(require,module,exports){
function CartGoods(goods,count,totalTax,priceExcludingTax,priceIncludingTax) {
    this.goods = goods;

    // 商品数量
    this.count = count || 1;

    // 总税款
    this.totalTax = totalTax || '0.00';

    // 不含税总价
    this.priceExcludingTax = priceExcludingTax || '0.00';

    // 含税总价
    this.priceIncludingTax = priceIncludingTax || '0.00';
}

module.exports = CartGoods;

},{}],3:[function(require,module,exports){
var CartGoods = require('./cart-goods');
var Tools = require('./tools');
var SalesTax = require('./tax/salesTax');
var ImportedTax = require('./tax/importedTax');

function Cart(filters,salesTaxRate,importedTaxRate) {
    // 商品集合
    this.cartGoodsList = [];

    // 总共税款
    this.totalTaxes = 0;

    // 总共价格
    this.total = 0;

    // 不需要付款的商品种类数组
    this.filters = filters;

    // 销售税率
    this.salesTaxRate = salesTaxRate;

    // 进口税率
    this.importedTaxRate = importedTaxRate;
}
// 判断是否已存在该商品;
var filterCartGoodsList = function(cartGoodsList,goods,count,totalTax,priceExcludingTax,priceIncludingTax) {
    var isExist = false;
    var index;
    for(var i = 0; i < cartGoodsList.length; i++) {
        if(goods.id === cartGoodsList[i].goods.id) {
            isExist = true;
            index = i;
        }
    }
    if(isExist) {
        cartGoodsList[index].count += count;
        cartGoodsList[index].totalTax = Tools.increment(+cartGoodsList[index].totalTax,totalTax);
        cartGoodsList[index].priceExcludingTax = Tools.increment(cartGoodsList[index].priceExcludingTax, priceExcludingTax);
        cartGoodsList[index].priceIncludingTax = Tools.increment(cartGoodsList[index].priceIncludingTax, priceIncludingTax);
    } else {
        cartGoodsList.push(new CartGoods(goods,count,totalTax,priceExcludingTax,priceIncludingTax));
    }

    return cartGoodsList;
};

Cart.prototype.addCart = function (goods, count) {
    var cartGoodsList = this.cartGoodsList;

    // 得到该商品的总税
    var totalTax = (this.getTotalTax(goods) * count).toFixed(2);

    var priceExcludingTax = (goods.price * count).toFixed(2);
    var priceIncludingTax = (+goods.price * count + +totalTax).toFixed(2);

    if(cartGoodsList.length === 0) {
        cartGoodsList.push(new CartGoods(goods,count,totalTax,priceExcludingTax,priceIncludingTax));
    } else {
        cartGoodsList = filterCartGoodsList(cartGoodsList,goods,count,totalTax,priceExcludingTax,priceIncludingTax);
    }
    return cartGoodsList;
};

// 得到每条商品总共的税
Cart.prototype.getTotalTax = function (cartGoods) {
    // 初始化税
    var salesTax = new SalesTax(this.salesTaxRate, this.filters);
    var importedTax = new ImportedTax(this.importedTaxRate);

    // 得到销售税价
    var salesTaxPrice = +salesTax.getTax(cartGoods.kind, cartGoods.price);

    // 得到进口税价
    var importedTaxPrice = +importedTax.getTax(cartGoods.isImportDuty, cartGoods.price);

    return Tools.formatNumber((salesTaxPrice + importedTaxPrice).toFixed(2));
};

var forEach = function(array, callback) {
    for(var i = 0; i < array.length; i++) {
        callback(array[i]);
    }
};

Cart.prototype.getTotalTaxes = function () {
    var cartGoodsList = this.cartGoodsList, totalTaxes = 0;
    // forEach(cartGoodsList, function(cartGoods) {
    //     totalTaxes += +cartGoods.totalTax;
    // });
    cartGoodsList.forEach(function(cartGoods) {
        totalTaxes += +cartGoods.totalTax;
    })
    // for(var i = 0, len = cartGoodsList.length; i < len; i++) {
    //     totalTaxes += +cartGoodsList[i].totalTax;
    // }

    return totalTaxes.toFixed(2);
};

Cart.prototype.getTotal = function () {
    var cartGoodsList = this.cartGoodsList, total = 0;

    cartGoodsList.forEach(function(cartGoods) {
        total += +cartGoods.priceIncludingTax;
    })
    // forEach(cartGoodsList, function(cartGoods) {
    //     total += +cartGoods.priceIncludingTax;
    // })
    // for(var i = 0, len = cartGoodsList.length; i < len; i++) {
    //     total += +cartGoodsList[i].priceIncludingTax;
    // }

    return total.toFixed(2);
};

module.exports = Cart;

},{"./cart-goods":2,"./tax/importedTax":5,"./tax/salesTax":6,"./tools":8}],4:[function(require,module,exports){
function Goods(id, name, price, kind, isImportDuty) {
  // 商品编号 Number
  this.id = id;

  // 商品名称 String
  this.name = name;

  // 商品价格 String
  this.price = price || '0.00';

  // 商品种类 Number 0为食物，1为书籍，2为药品，100为其他
  this.kind = kind;

  // 商品是否为进口 Boolean
  this.isImportDuty = isImportDuty;
}

Goods.loadAllGoodsInfos = function () {
  return [
  new Goods(0,'book', '12.49', 1, false),
  new Goods(1,'music CD', '14.99', 100, false),
  new Goods(2,'chocolate', '0.85', 0, false),
  new Goods(3,'imported box of chocolates', '10.00', 0, true),
  new Goods(4,'imported bottle of perfume', '47.50', 100, true),
  new Goods(5,'imported bottle of perfume', '27.99', 100, true),
  new Goods(6,'bottle of perfume', '18.99', 100, false),
  new Goods(7,'packet of headache pills', '9.75', 2, false),
  new Goods(8,'box of imported chocolates', '11.25', 0, true)
  ];
};

module.exports = Goods;

},{}],5:[function(require,module,exports){
var Tax = require('./tax');
var Tools = require('../tools');

function ImportedTax(rate) {
    Tax.call(this, rate);
}

ImportedTax.prototype = Object.create(Tax.prototype);
ImportedTax.prototype.constructor = Tax;

// isImportDuty: 商品是否是进口，price: 商品价格
ImportedTax.prototype.getTax = function(isImportDuty,price) {
    return isImportDuty ? Tools.formatNumber((price * this.rate).toFixed(2)) : 0;
};

module.exports = ImportedTax;

},{"../tools":8,"./tax":7}],6:[function(require,module,exports){
var Tax = require('./tax');
var Tools = require('../tools');

function SalesTax(rate,filters) {
    Tax.call(this, rate);

    // 不需要计算税的商品种类数组
    this.filters = filters;
}

SalesTax.prototype = Object.create(Tax.prototype);
SalesTax.prototype.constructor = Tax;

// kind: 商品种类，price: 商品价格
SalesTax.prototype.getTax = function(kind,price) {
    var isNeedTax = true;
    for(var i = 0, len = this.filters.length; i < len; i++) {
        if(kind === this.filters[i]) {
            isNeedTax = false;
        }
    }

    return isNeedTax ? Tools.formatNumber((price * this.rate).toFixed(2)) : 0;
};

module.exports = SalesTax;

},{"../tools":8,"./tax":7}],7:[function(require,module,exports){
function Tax(rate) {
    // 税率
    this.rate = rate;
}

Tax.prototype.getTax = function(price) {
    return (price * this.rate).toFixed(2);
};

module.exports = Tax;

},{}],8:[function(require,module,exports){
module.exports = {

    // to nearest 0.05
    formatNumber : function(num) {
        var result;
        var remainder = (num * 100) % 10;
        if(remainder > 0 && remainder < 5) {
            result = num.replace(3,5);
        } else if (remainder > 5 && remainder <=9) {
            result = ((Math.round((num * 100) / 10) + '0')/100).toFixed(2);
        } else {
            result = num;
        }
        return result;
    },

    // 字符串的数字自增
    increment : function(oldValue, newValue) {
        return (+oldValue + +newValue).toFixed(2);
    }
};

},{}]},{},[1]);
