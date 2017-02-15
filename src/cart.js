var Goods = require('./goods');
var CartGoods = require('./cart-goods');
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
// 字符串的数字自增
var increment = function(a) {
    return (a * 2).toFixed(2);
};
// 判断如果已存在该商品，则count加1;
var filterCartGoodsList = function(cartGoodsList,goods,count,totalTax,priceExcludingTax,priceIncludingTax) {
    for(var i = 0; i < cartGoodsList.length; i++) {
        if(goods.id === cartGoodsList[i].goods.id) {
            cartGoodsList[i].count++;
            cartGoodsList[i].totalTax = increment(cartGoodsList[i].totalTax);
            cartGoodsList[i].priceExcludingTax = increment(cartGoodsList[i].priceExcludingTax);
            cartGoodsList[i].priceIncludingTax = increment(cartGoodsList[i].priceIncludingTax);
        } else {
            cartGoodsList.push(new CartGoods(goods,count,totalTax,priceExcludingTax,priceIncludingTax));
        }
    }
    return cartGoodsList;
};

Cart.prototype.addCart = function (goods) {
    var cartGoodsList = this.cartGoodsList;

    // 得到该商品的总税
    var totalTax = this.getTotalTax(goods).toFixed(2);

    var priceExcludingTax = goods.price;
    var priceIncludingTax = (+goods.price + +totalTax).toFixed(2);
    var count = 1;

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

    return salesTaxPrice + importedTaxPrice;
};

Cart.prototype.getToalTaxes = function () {
    var cartGoodsList = this.cartGoodsList, totalTaxes = 0;
    for(var i = 0, len = cartGoodsList.length; i < len; i++) {
        totalTaxes += +cartGoodsList[i].totalTax;
    }

    return totalTaxes.toFixed(2);
};

Cart.prototype.getTotal = function () {
    var cartGoodsList = this.cartGoodsList, total = 0;
    console.log(cartGoodsList);
    for(var i = 0, len = cartGoodsList.length; i < len; i++) {
        total += +cartGoodsList[i].priceIncludingTax;
    }

    return total.toFixed(2);
};

module.exports = Cart;
