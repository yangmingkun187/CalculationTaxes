module.exports = {

    // to nearest 0.05
    formatNumber : function(num) {
        var result;
        var remainder = (num * 100) % 10;
        if(remainder > 0 && remainder < 5) {
            result = num.replace(3,5);
        } else if (remainder > 5 && remainder <=9) {
            result = ((Math.round((num * 100) / 10) + '0')/100).toFixed(2);
        } else {
            result = num;
        }
        return result;
    },

    // 字符串的数字自增
    increment : function(oldValue, newValue) {
        return (+oldValue + +newValue).toFixed(2);
    }
};
