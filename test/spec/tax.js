describe('Tax',function() {
    describe('#getTax', function() {
        var Tax = require('../../src/tax/tax');
        var tax = new Tax(10);

        it('should return correct tax', function() {
            var expect_tax = tax.getTax(100);
            expect(expect_tax).to.equal('10.00');
        });

        it('should return correct tax', function() {
            var expect_tax = tax.getTax(14.49);
            expect(expect_tax).to.equal('1.45');
        });
    });
});

describe('salesTax',function() {
    describe('#getTax', function() {
        var SalesTax = require('../../src/tax/salesTax');
        var filters = [0,1,2];
        var salesTax = new SalesTax(10,filters);

        it('should return correct tax', function() {
            var expect_tax = salesTax.getTax(100, 14.99);
            expect(expect_tax).to.equal('1.50');
        });

        it('should return correct tax', function() {
            var expect_tax = salesTax.getTax(0, 14.49);
            expect(expect_tax).to.equal(0);
        });
    });
});

describe('importedTax',function() {
    describe('#getTax', function() {
        var ImportedTax = require('../../src/tax/importedTax');
        var importedTax = new ImportedTax(5);
        var isImportDuty = true;
        it('should return correct tax', function() {
            var expect_tax = importedTax.getTax(isImportDuty,10.00);
            expect(expect_tax).to.equal('0.50');
        });

        it('should return correct tax', function() {
            var expect_tax = importedTax.getTax(!isImportDuty, 10.00);
            expect(expect_tax).to.equal(0);
        });
    });
});
