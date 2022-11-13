const Money = require("./money_test");
const Bank = require("./bank");

class PortFolio {
  constructor() {
    this.moneys = [];
  }

  add(...moneys) {
    this.moneys = this.moneys.concat(moneys);
  }

  evaluate(bank, currency) {
    const failures = [];
    let totalAmount = this.moneys.reduce((sum, money) => {
      try {
        const convertedMoney = bank.convert(money, currency);
        const convertedAmount = convertedMoney.amount;

        return sum + convertedAmount;
      } catch (error) {
        failures.push(error.message);
        return sum;
      }
    }, 0);

    if (!failures.length) {
      return new Money(totalAmount, currency);
    }
    throw new Error("Missing exchange rate(s):[" + failures.join() + "]");
  }
}

module.exports = PortFolio;
