const assert = require("assert");
const Money = require("./money_test");
const PortFolio = require("./portfolio");
const Bank = require("./bank");

class MoneyTest2 {
  testMultiplication() {
    const tenEuros = new Money(10, "EUR");
    const twentyEuros = new Money(20, "EUR");
    assert.deepStrictEqual(tenEuros.times(2), twentyEuros);
  }

  testDivision() {
    const originalMoney = new Money(4002, "KRW");
    const actualMoneyAfterDivision = originalMoney.divideBy(4);
    const expectedMoneyAfterDivision = new Money(1000.5, "KRW");
    assert.deepStrictEqual(
      actualMoneyAfterDivision,
      expectedMoneyAfterDivision
    );
  }

  testAddition() {
    const fiveDollars = new Money(5, "USD");
    const tenDollars = new Money(10, "USD");
    const fifteenDollars = new Money(15, "USD");
    const portafolio = new PortFolio();
    portafolio.add(fiveDollars, tenDollars);
    const bank = new Bank();
    bank.addExchangeRate("USD", "USD", 1);
    assert.deepStrictEqual(portafolio.evaluate(bank, "USD"), fifteenDollars);
  }

  testAdditionOfDollarsAndEuros() {
    const fiveDollars = new Money(5, "USD");
    const tenEuros = new Money(10, "EUR");
    const portfolio = new PortFolio();
    portfolio.add(fiveDollars, tenEuros);
    const bank = new Bank();
    bank.addExchangeRate("EUR", "USD", 1.2);
    bank.addExchangeRate("USD", "USD", 1);
    const actualValue = portfolio.evaluate(bank, "USD");
    const expectedValue = new Money(17, "USD");
    assert.deepStrictEqual(actualValue, expectedValue);
  }

  testAdditionOfDollarsAndKoreanWons() {
    const oneDollar = new Money(1, "USD");
    const elevenHundredWon = new Money(1100, "KRW");
    const portfolio = new PortFolio();
    portfolio.add(oneDollar, elevenHundredWon);
    const expectedValue = new Money(2200, "KRW");
    const bank =  new Bank();
    bank.addExchangeRate("USD", "KRW", 1100);
    bank.addExchangeRate("KRW", "KRW", 1);
    assert.deepStrictEqual(portfolio.evaluate(bank, "KRW"), expectedValue);
  }

  testAdditionWithMultipleMissingExchangeRates() {
    const oneDollar = new Money(1, "USD");
    const oneEuro = new Money(1, "EUR");
    const oneWon = new Money(1, "KRW");
    const portfolio = new PortFolio();
    portfolio.add(oneDollar, oneEuro, oneWon);
    const expectedError = new Error(
      "Missing exchange rate(s):[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]"
    );
    const bank = new Bank();
    assert.throws(() => {
      portfolio.evaluate(bank, "Kalganid");
    }, expectedError);
  }

  testConversion() {
    const bank = new Bank();
    bank.addExchangeRate("EUR", "USD", 1.2);
    const tenEuros = new Money(10, "EUR");
    assert.deepStrictEqual(bank.convert(tenEuros, "USD"), new Money(12, "USD"));
  }

  testConversionWithMissingExchangeRates() {
    const bank = new Bank();
    const tenDollar = new Money(10, "USD");
    const expectedError = new Error("USD->Kalganid");
    assert.throws(() => {
      bank.convert(tenDollar, "Kalganid");
    }, expectedError);
  }

  getAllTestMethods() {
    const moneyPrototype = MoneyTest.prototype;
    const allProps = Object.getOwnPropertyNames(moneyPrototype);
    let testMethods = allProps.filter((p) => {
      return typeof moneyPrototype[p] === "function" && p.startsWith("test");
    });

    return testMethods;
  }

  runAllTests() {
    const testMethods = this.getAllTestMethods();
    testMethods.forEach((m) => {
      console.log("Running: %s()", m);
      let method = Reflect.get(this, m);
      try {
        Reflect.apply(method, this, []);
      } catch (e) {
        if (e instanceof assert.AssertionError) {
          console.log(e);
        } else {
          throw e;
        }
      }
    });
  }
}

new MoneyTest2().runAllTests();
