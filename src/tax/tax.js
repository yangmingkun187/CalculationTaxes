function Tax(rate) {
    // 税率
    this.rate = rate;
}

Tax.prototype.getTax = function(price) {
    return (price * this.rate).toFixed(2);
};

module.exports = Tax;
