function Goods(id, name, price, kind, isImportDuty) {
  // 商品编号 Number
  this.id = id;

  // 商品名称 String
  this.name = name;

  // 商品价格 Number
  this.price = price || 0.00;

  // 商品种类 Number 0为食物，1为书籍，2为药品，100为其他
  this.kind = kind;

  // 商品是否为进口 Boolean
  this.isImportDuty = isImportDuty;
}

Goods.loadAllItemInfos = function () {
  return [
  new Goods(0,'book', 12.49, 1, false),
  new Goods(1,'music CD', 14.99, 100, false),
  new Goods(2,'chocolate', 0.85, 0, false),
  new Goods(3,'imported box of chocolates', 10.00, 0, true),
  new Goods(4,'imported bottle of perfume', 47.5, 100, true),
  new Goods(5,'imported bottle of perfume', 27.99, 100, true),
  new Goods(6,'bottle of perfume', 18.99, 100, false),
  new Goods(7,'packet of headache pills', 9.75, 2, false),
  new Goods(8,'box of imported chocolates', 11.25, 0, true)
  ];
};

module.exports = Goods;
