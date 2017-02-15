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
