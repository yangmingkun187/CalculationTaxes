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

Cart.prototype.getTotalTaxes = function () {
    var cartGoodsList = this.cartGoodsList, totalTaxes = 0;
    cartGoodsList.forEach(function(cartGoods) {
        totalTaxes += +cartGoods.totalTax;
    })

    return totalTaxes.toFixed(2);
};

Cart.prototype.getTotal = function () {
    var cartGoodsList = this.cartGoodsList, total = 0;
    cartGoodsList.forEach(function(cartGoods) {
        total += +cartGoods.priceIncludingTax;
    })

    return total.toFixed(2);
};

module.exports = Cart;
