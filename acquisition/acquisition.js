/*
* Scenario:
* 
* A big company has a revenue and a market cap. It plans to build a new
* product which can potentially increase the company's market cap (market
* cap increase factor). The company has to decide whether the product is
* worth building in-house or can rather be built by a partner company.
*/

BigCompany = function(revenue, marketCap, newProduct) {
  var self = this;
  this.revenue = revenue;
  this.marketCap = marketCap;
  this.newProduct = newProduct;
  this.maxAquisitionPrice =
    this.newProduct.marketCapIncreaseFactor * this.marketCap;
}

BigCompany.prototype = new (function() {
  this.checkProduct = function() {
    var affordable = false;
    if (this.newProduct.price < this.maxAquisitionPrice) {
      affordable = true;
    }
    return affordable;
  }

  this.checkPriceList = function(priceList) {
    var oldProduct = this.product;
    var affordabilityList = {};
    for (var i = 0; i < priceList.length; i++) {
      var product = new Product(10, priceList[i]);
      bigCompany.newProduct = product;
      affordabilityList[priceList[i]] = this.checkProduct();
    }
    this.product = oldProduct;
    return affordabilityList;
  }
})();


var Product = function(marketCapIncreaseFactor, price) {
  var self = this;
  this.marketCapIncreaseFactor = marketCapIncreaseFactor;
  this.price = price;
}

Product.prototype = new (function() {
})();

newProduct = new Product(10, 60000000000);
bigCompany = new BigCompany(1000000000, 5000000000, newProduct);

var priceList = [
  10
  , 1000000000
  , 2000000000
  , 3000000000
  , 4000000000
  , 5000000000
  , 6000000000
  , 7000000000
  , 800000000099999999
]

console.log(bigCompany.checkPriceList(priceList));
