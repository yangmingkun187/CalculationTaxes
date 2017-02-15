var Goods = require('./goods');
var SalesTax = require('./tax/salesTax');
var ImportedTax = require('./tax/importedTax');

function Cart(filters,salesTaxRate,importedTaxRate) {
    // 商品集合
    this.cartGoods = [];

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

Cart.prototype.addCart = function (goods) {
    var cartGoods = this.cartGoods;

    // 得到该商品的总税
    var totalTax = this.getTotalTax(goods);

    for(var i = 0; i < cartGoods.length; i++) {
        if(goods.id === cartGoods[i]) {
            cartGoods[i].count++;
            cartGoods[i].totalTax += cartGoods[i].totalTax;
            cartGoods[i].priceExcludingTax += cartGoods[i].priceExcludingTax;
            cartGoods[i].priceIncludingTax += cartGoods[i].priceIncludingTax;
        } else {
            var priceExcludingTax = goods.price;
            var priceIncludingTax = goods.price + totalTax;
            var count = 1;
            cartGoods.push(new cartGoods(goods,count,totalTax,priceExcludingTax,priceIncludingTax));
        }
    }

    return cartGoods;
};

// 得到每条商品总共的税
Cart.prototype.getTotalTax = function (cartItem) {
    // 初始化税
    var salesTax = new SalesTax(this.salesTaxRate, this.filters);
    var importedTax = new ImportedTax(this.importedTaxRate);

    // 得到销售税价
    var salesTaxPrice = salesTax.getTax(cartItem.goods.kind, cartItem.price);

    // 得到进口税价
    var importedTaxPrice = importedTax.getTax(cartItem.goods.isImportDuty, cartItem.price);

    return (salesTaxPrice + importedTaxPrice).toFixed(2);
};

Cart.prototype.getToalTaxes = function () {
    var cartGoods = this.cartGoods, totalTaxes = 0;
    console.log(cartGoods);
    for(var i = 0, len = cartGoods.length; i < len; i++) {
        totalTaxes += cartGoods[i].totalTax;
    }

    return totalTaxes.toFixed(2);
};

Cart.prototype.getTotal = function () {
    var cartGoods = this.cartGoods, total = 0;

    for(var i = 0, len = cartGoods.length; i < len; i++) {
        total += cartGoods[i].priceIncludingTax;
    }

    return total.toFixed(2);
};

module.exports = Cart;
