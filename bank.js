const Money = require("./money_test");

class Bank {
    constructor(){
        this.exchangeRates = new Map();
    }

    addExchangeRate(currencyFrom, currencyTo, rate){
        const key = `${currencyFrom}->${currencyTo}`;
        this.exchangeRates.set(key, rate);
    }

    convert(money, currency){
        if (money.currency === currency) {
            return new Money(money.amount, currency);
          }
        const key = `${money.currency}->${currency}`;
        const rate = this.exchangeRates.get(key);

        if (rate === undefined) {
            throw new Error(key);
        }

        return new Money(money.amount * rate, currency);
    }
}

module.exports = Bank;