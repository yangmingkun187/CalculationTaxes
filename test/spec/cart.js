describe('Cart',function() {
    var Cart = require('../../src/cart');
    var filters = [0,1,2],
        salesTaxRate = 10,
        importedTaxRate = 5;
    var cart = new Cart(filters,salesTaxRate,importedTaxRate);
    cart.cartGoods = [{
        goods: {
            id: 0,
            name: 'book',
            price: 12.49,
            kind: 1,
            isImportDuty: false
        },
        count: 1,
        totalTax: 2,
        priceIncludingTax: 4
    },{
        goods: {
            id: 1,
            name: 'food',
            price: 0.49,
            kind: 0,
            isImportDuty: false
        },
        count: 10,
        totalTax: 1.2,
        priceIncludingTax: 3
    }];
    describe('#getTotalTax', function() {
        it('should return correct totalTax', function() {
            var expect_totalTax = cart.getToalTaxes();
            expect(expect_totalTax).to.equal('3.20');
        });
    });
    describe('#getTotal', function() {
        it('should return correct total', function() {
            var expect_total = cart.getTotal();
            expect(expect_total).to.equal('7.00');
        });
    });
});
