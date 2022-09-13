class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }
    setAvailable(status) {
        this.available = status;
    }
}

class GoodsList {
    #goods
    constructor(filter, sortPrice, sortDir) {
        this.#goods = [];
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }

    get list() {
        const forSaleList = this.#goods.filter(good => this.filter.test(good.name));

        if (!this.sortPrice) {
            return forSaleList;
        }
        if (this.sortDir) {
            return forSaleList.sort((number1, number2) => (number1.price - number2.price));
        }
        return forSaleList.sort((number1, number2) => (number2.price - number1.price));
    }

    add(newGood) {
        this.#goods.push(newGood);
    }

    remove(id) {
        const getIndex = this.#goods.findIndex((good) => good.id === id)
        if (getIndex >= 0) {
            this.#goods.splice(getIndex, 1);
        }
        return getIndex;
    }
}

class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }    
}

class Basket {
    constructor() {
        this.goods = [];
    }

    get totalAmount() {
        return this.goods.reduce((accum, curr) => accum + curr.amount, 0)

    }

    get totalSum() {
        return this.goods.reduce((accum, curr) => accum + curr.amount*curr.price, 0)
    }

    add(good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            this.goods[index].amount += amount;
        } else {
            let addGood = new BasketGood(good.id, good.name, good.description, good.sizes, good.price, good.available, amount);
            this.goods.push(addGood);
        }
    }

    remove(good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            if (this.goods[index].amount - amount <= 0 || amount === 0) {
                this.goods.splice(index, 1);
            } else {
                this.goods[index].amount -=amount;
            }       
        }
    }

    clear() {
        this.goods = [];
    }

    removeUnavailable() {
        this.goods = this.goods.filter(item => item.available === false).forEach(value => this.remove(value))
    }
}


const one = new Good(1, "Dress", "Office style, blue color", ["40", "42", "44"],5000, true);
const two = new Good(2, "Suit", "Office style, grey color", ["40", "42", "44"], 8000, true);
const three = new Good(3, "Dress", "Office style, pink color", ["40", "42", "44"], 7000, true);
const four = new Good(4, "Trouses", "Office style, black color", ["40", "42", "44"], 6600, true);
const five = new Good(5, "Coat","Winter season, green color", ["40", "42", "44"], 15000, true);

five.setAvailable(false)
// console.log(five)

regexp = /Dress/i
const catalog = new GoodsList(regexp, true, false)

catalog.add(one);
catalog.add(two);
catalog.add(three);
catalog.add(four);
catalog.add(five);

// console.log(catalog.list);
catalog.sortPrice = true
catalog.sortDir = true
// console.log(catalog.list);

// catalog.remove(1);
// console.log(catalog.list);

const basket = new Basket();
basket.add(one, 3);
basket.add(five, 1);

// console.log(basket.totalAmount)
// console.log(basket.totalSum)

basket.remove(one, 1);
// console.log(basket.goods);

basket.removeUnavailable();
// console.log(basket.goods);

basket.clear();
console.log(basket.goods);
