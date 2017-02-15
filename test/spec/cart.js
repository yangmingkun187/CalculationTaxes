describe('Cart',function() {
    var Cart = require('../../src/cart');
    var Goods = require('../../src/goods');
    var filters = [0,1,2],
        salesTaxRate = 0.1,
        importedTaxRate = 0.05;
    var cart = new Cart(filters,salesTaxRate,importedTaxRate);
    describe('#addCart', function() {
        var goods = new Goods(3,'imported box of chocolates', '10.00', 0, true);
        it('should return correct object', function() {
            var expect_cartGoodsList = cart.addCart(goods,1);
            expect(expect_cartGoodsList[0].goods.id).to.equal(3);
            expect(expect_cartGoodsList[0].goods.name).to.equal('imported box of chocolates');
            expect(expect_cartGoodsList[0].count).to.equal(1);
            expect(expect_cartGoodsList[0].totalTax).to.equal('0.50');
            expect(expect_cartGoodsList[0].priceExcludingTax).to.equal('10.00');
            expect(expect_cartGoodsList[0].priceIncludingTax).to.equal('10.50');
        });
        it('should return correct object', function() {
            var expect_cartGoodsList = cart.addCart(goods,3);
            console.log(expect_cartGoodsList)
            expect(expect_cartGoodsList[0].goods.id).to.equal(3);
            expect(expect_cartGoodsList[0].goods.name).to.equal('imported box of chocolates');
            expect(expect_cartGoodsList[0].count).to.equal(4);
            expect(expect_cartGoodsList[0].totalTax).to.equal('2.00');
            expect(expect_cartGoodsList[0].priceExcludingTax).to.equal('40.00');
            expect(expect_cartGoodsList[0].priceIncludingTax).to.equal('42.00');
        });
    });
    describe('#getTotalTax', function() {
        it('should return correct totalTax', function() {
            var expect_totalTax = cart.getTotalTaxes();
            expect(expect_totalTax).to.equal('2.00');
        });
    });
    describe('#getTotal', function() {
        it('should return correct total', function() {
            var expect_total = cart.getTotal();
            expect(expect_total).to.equal('42.00');
        });
    });

});
