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
