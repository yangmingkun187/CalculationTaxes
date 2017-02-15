var SalesTax = require('./tax/salesTax');
var ImportedTax = require('./tax/importedTax');

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
