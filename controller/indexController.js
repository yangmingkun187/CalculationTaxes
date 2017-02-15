var Goods = require('../src/goods');
var Cart = require('../src/cart');

app.controller('indexController', function($scope) {
    $scope.showCart = false;
    // 导入所有商品
    $scope.goodsList= Goods.loadAllGoodsInfos();

    // cart数组
    $scope.cartList = [];

    // 总税价
    $scope.totalTaxes = 0;
    $scope.total = 0;

    var filters = [0,1,2], // 定义不需要给税的商品种类数组
        salesTaxRate = 0.1, // 定义销售税税率
        importedTaxRate = 0.05; // 定义进口税率
    var cart = new Cart(filters,salesTaxRate,importedTaxRate);
    $scope.addToCart = function(e, goods, count) {
        if(!$scope.showCart) {
            $scope.cartList = cart.addCart(goods,count);
        }
    };

    $scope.reset = function(e) {
        e.preventDefault();
        $scope.cartList = [];
        cart.cartGoodsList = [];
        $scope.totalTaxes = 0;
        $scope.total = 0;
        $scope.showCart = false;
    };

    $scope.checkout = function(e) {
        e.preventDefault();
        $scope.totalTaxes = cart.getTotalTaxes();
        $scope.total = cart.getTotal();
        $scope.showCart = true;
    }
});