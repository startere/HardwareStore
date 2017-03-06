function solve() {
	
	function validateModelAndManufacturerAndStoreName(inputStr){
		if(typeof inputStr !== 'string' || inputStr.length < 1 || inputStr.length > 20){
			throw Error();
		}
	}
	function validatePriceAndScrSizeAndWifiRange(inputNum){
		if(typeof inputNum !== 'number' || inputNum <= 0 || Number.isNaN(inputNum)){
			throw Error();
		}
	}
	function validateOutputVolt(inputNum){
		if(typeof inputNum !== 'number' || inputNum < 5 || inputNum > 20 || Number.isNaN(inputNum)){
			throw Error();
		}
	}
	function validateOutputCurr(inputNum){
		if(typeof inputNum !== 'number' || inputNum < 100 || inputNum > 3000 || Number.isNaN(inputNum)){
			throw Error();
		}
	}
	function validateOS(inputStr){
		if(typeof inputStr !== 'string' || inputStr.length < 1 || inputStr.length > 10){
			throw Error();
		}
	}
	function validateLanPortsAndQuantity(inputNum){
		if(typeof inputNum !== 'number' 
			 || inputNum <= 0 
			 || Number.isNaN(inputNum) 
			 || parseInt(Number(inputNum)) !== inputNum 
			 || isNaN(parseInt(inputNum, 10))){
			throw Error();
		}
	}
	function validateQuality(inputStr){
		if(inputStr !== 'high' && inputStr !== 'mid' && inputStr !== 'low'){
			throw Error();
		}
	}
	
  var id = 0;
	
	function idGenerator(){
    id += 1;
    return id;
  }	
	
	class Product{
		constructor(manufacturer, model, price){
			validateModelAndManufacturerAndStoreName(manufacturer);
			validateModelAndManufacturerAndStoreName(model);
      validatePriceAndScrSizeAndWifiRange(price);
			
			this._manufacturer = manufacturer;
			this._model = model;
			this._price = price;
			this.id = idGenerator();
		}
		
	 	get manufacturer() {
			return this._manufacturer;
		}

		get model() {
			return this._model;
		}

		get price() {
			return this._price;
		}
		
		getLabel(){
			var string;
			return string;
		}
	}
	
	class SmartPhone extends Product{
		constructor(manufacturer, model, price, screenSize, operatingSystem){
			
			validatePriceAndScrSizeAndWifiRange(screenSize);
      validateOS(operatingSystem);
		  super(manufacturer, model, price, id);			
			
			this._screenSize = screenSize;
			this._operatingSystem = operatingSystem;
		}
		
	  get screenSize() {
			return this._screenSize;
		}

		get operatingSystem() {
			return this._operatingSystem;
		}
		getLabel(){
			var string = 'SmartPhone - ' + this.manufacturer + ' ' + this.model + ' - **' + this.price + '**';
			return string;
		}
	}
	
	class Charger extends Product{
		constructor(manufacturer, model, price, outputVoltage, outputCurrent){
			
			validateOutputVolt(outputVoltage);
      validateOutputCurr(outputCurrent);
		  super(manufacturer, model, price, id);			
			
			this._outputVoltage = outputVoltage;
			this._outputCurrent = outputCurrent;
	  }
		
		get outputVoltage() {
			return this._outputVoltage;
		}

		get outputCurrent() {
			return this._outputCurrent;
		}
		
		getLabel(){
			var string = 'Charger - ' + this.manufacturer + ' ' + this.model + ' - **' + this.price + '**';
			return string;
		}
	}
	
	class Router extends Product{
		constructor(manufacturer, model, price, wifiRange, lanPorts){
			
			validatePriceAndScrSizeAndWifiRange(wifiRange);
      validateLanPortsAndQuantity(lanPorts);
		  super(manufacturer, model, price, id);			
			
			this._wifiRange = wifiRange;
			this._lanPorts = lanPorts;
	  }
		
		get wifiRange() {
			return this._wifiRange;
		}

		get lanPorts() {
			return this._lanPorts;
		}
		
		getLabel(){
			var string = 'Router - ' + this.manufacturer + ' ' + this.model + ' - **' + this.price + '**';
			return string;
		}
	}
	
  class Headphones extends Product{
		constructor(manufacturer, model, price, quality, hasMicrophone){
			
			validateQuality(quality);
		  super(manufacturer, model, price, id);			
			
			this._quality = quality;
			this._hasMicrophone = (hasMicrophone === 'true');
	  }
		
		get quality() {
			return this._quality;
		}

		get hasMicrophone() {
			return this._hasMicrophone;
		}
		
		getLabel(){
			var string = 'Headphones - ' + this.manufacturer + ' ' + this.model + ' - **' + this.price + '**';
			return string;
		}
	}
	
	class HardwareStore{
		constructor(name){
			validateModelAndManufacturerAndStoreName(name);
			
			this._name = name;
			this._products = [];
		  this._productsStock = [];
			this._moneyMade = 0;
		}
		get name() {
			return this._name;
		}

		get products() {
			return this._products;
		}
		
		get moneyMade() {
			return this._moneyMade;
		}
		
		stock(product, quantity){
			
			if(!(product instanceof Product)){
				throw Error();
			}
			validateLanPortsAndQuantity(quantity);
			
      let index = this._productsStock.findIndex(p => p.product.id === product.id);
			
				if(index === -1){
				  this._products.push(product);
					this._productsStock.push({product, quantity});
		    }
				else{
					this._productsStock[index].quantity += quantity;
				}

			return this;
		}
		
		sell(productId, quantity){
			validateLanPortsAndQuantity(quantity);
			
			var inStock = 0;
			
			var index = this._productsStock.findIndex(p => p.product.id === productId);
			
			inStock = this._productsStock[index].quantity;
			
			if(inStock < quantity){
				throw Error();
			}
			
			this._moneyMade += this._productsStock[index].product.price * quantity;
			
			this._productsStock[index].quantity -= quantity;
			
			if(this._productsStock[index].quantity === 0){
				var depletedIndex;
				
				depletedIndex = this._products.findIndex(p => p.id === productId);
				
				this._products.splice(depletedIndex, 1);
			}
			
			return this;
		}
		getSold(){
		  	return this._moneyMade;
		}
		search(pattern){
			var result = this._productsStock;
			
		  if(typeof pattern === 'object'){
		  		if(pattern.hasOwnProperty('manufacturerPattern')){
		  			var manufPattern = pattern.manufacturerPattern;
						
						var patternCaseInsensitive = manufPattern;
						
			      result = result.filter(p =>
						  p.product.manufacturer.indexOf(patternCaseInsensitive) >= 0)
						
		  		}
		  		if(pattern.hasOwnProperty('modelPattern')){
		  			var modelPattern = pattern.modelPattern;
						
						var patternCaseInsensitive = modelPattern;
						
			      result = result.filter(p =>
						  p.product.model.indexOf(patternCaseInsensitive) >= 0)
		  		}
					if(pattern.hasOwnProperty('type')){
		  			var typePattern = pattern.type;
					  if(typePattern === 'SmartPhone'){
							result = result.filter(p =>
						    p.product instanceof SmartPhone)
						}
						if(typePattern === 'Charger'){
							result = result.filter(p =>
						    p.product instanceof Charger)
						}
						if(typePattern === 'Router'){
							result = result.filter(p =>
						    p.product instanceof Router)
						}
						if(typePattern === 'Headphones'){
							result = result.filter(p =>
						    p.product instanceof Headphones)
						}
		  		}
				if(pattern.hasOwnProperty('minPrice')){
					var minPricePattern = pattern.minPrice;
					result = result.filter(p =>
						    p.product.price >= minPricePattern)
				}
				if(pattern.hasOwnProperty('maxPrice')){
					var maxPricePattern = pattern.maxPrice;
					result = result.filter(p =>
						    p.product.price <= maxPricePattern)
				}
				
		  }
			else{
				var patternCaseInsensitive = pattern.toLowerCase();
						
			  result = this._productsStock.filter(p =>
				  p.product.manufacturer.toLowerCase().indexOf(patternCaseInsensitive) >= 0
				   ||
				  p.product.model.toLowerCase().indexOf(patternCaseInsensitive) >= 0)
			}
		
		  return result;
		}
	}
	
	
  var phone = new SmartPhone('phonemanuf', 'phonemodel', 20, 1080, 'Windows');
	var phone2 = new SmartPhone('phone2manuf', 'phone2model', 20, 1080, 'Windows');
	
	
	var store1 = new HardwareStore('store1name');
	
	console.log(store1._productsStock);

	store1.stock(phone, 42);
	
	console.log(store1._productsStock);
	
	console.log(store1.products);
	
	store1.stock(phone, 1);
	
  store1.stock(phone2, 1);
	
	console.log(store1._productsStock);
	
	console.log(store1.products);
	
	console.log(store1.getSold());
	
	store1.sell(1, 20);
	
	console.log(store1._productsStock);
	
	console.log(store1.getSold());
	
	console.log(store1.search('phone'));
	
	store1.sell(2, 1);
	
  console.log(store1._productsStock);
	
	console.log(store1.products);


var phone = new SmartPhone('HTC', 'One', 903, 5, 'Android');

console.log(phone.getLabel()); // SmartPhone - HTC One - **903**

var headphones = new Headphones('Sennheiser', 'PXC 550 Wireless', 340, 'high', false);
var store = new HardwareStore('Magazin');

store.stock(phone, 1)
    .stock(headphones, 15);

console.log(store.search('senn'));
/*
[ { product:
     Headphones { ... },
    quantity: 15 } ]
*/

console.log(store.search({type: 'SmartPhone', maxPrice: 1000}));
/*
[ { product:
     SmartPhone { ... },
    quantity: 1 } ]
*/

console.log(store.search({type: 'SmartPhone', maxPrice: 900}));
/* [] */

store.sell(headphones.id, 2);
console.log(store.getSold()); // 680
	

	return {
		getSmartPhone(manufacturer, model, price, screenSize, operatingSystem) {
			return new SmartPhone(manufacturer, model, price, screenSize, operatingSystem);
		},
		getCharger(manufacturer, model, price, outputVoltage, outputCurrent) {
			return new Charger(manufacturer, model, price, outputVoltage, outputCurrent);
		},
		getRouter(manufacturer, model, price, wifiRange, lanPorts) {
			return new Router(manufacturer, model, price, wifiRange, lanPorts);
		},
		getHeadphones(manufacturer, model, price, quality, hasMicrophone) {
			return new Headphones(manufacturer, model, price, quality, hasMicrophone);
		},
		getHardwareStore(name) {
      return new HardwareStore(name);
		}
	};
}

//module.exports = solve;

solve();