describe('tax',function() {
    describe('#getTax', function() {
        var SalesTax = require('../../src/tax/salesTax');
        var filters = [0,1,2];
        var salesTax = new SalesTax(10,filters);

        it('should return correct tax', function() {
            var expect_tax = salesTax.getTax(100, 14.99);
            expect(expect_tax).to.equal('1.50');
        });

        it('should return correct tax', function() {
            var expect_tax = salesTax.getTax(0, 12.49);
            expect(expect_tax).to.equal(0);
        });
    });
});
