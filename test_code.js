const assert = require("assert");
const Money = require("./money_test");
const PortFolio = require("./portfolio");
const Bank = require("./bank");

class MoneyTest {
  setUp() {
    this.bank = new Bank();
    this.bank.addExchangeRate("EUR", "USD", 1.2);
    this.bank.addExchangeRate("USD", "KRW", 1100);
  }

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
    assert.deepStrictEqual(
      portafolio.evaluate(this.bank, "USD"),
      fifteenDollars
    );
  }

  testAdditionOfDollarsAndEuros() {
    const fiveDollars = new Money(5, "USD");
    const tenEuros = new Money(10, "EUR");
    const portfolio = new PortFolio();
    portfolio.add(fiveDollars, tenEuros);
    const actualValue = portfolio.evaluate(this.bank, "USD");
    const expectedValue = new Money(17, "USD");
    assert.deepStrictEqual(actualValue, expectedValue);
  }

  testAdditionOfDollarsAndKoreanWons() {
    const oneDollar = new Money(1, "USD");
    const elevenHundredWon = new Money(1100, "KRW");
    const portfolio = new PortFolio();
    portfolio.add(oneDollar, elevenHundredWon);
    const expectedValue = new Money(2200, "KRW");
    assert.deepStrictEqual(portfolio.evaluate(this.bank, "KRW"), expectedValue);
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
    assert.throws(() => {
      portfolio.evaluate(this.bank, "Kalganid");
    }, expectedError);
  }

  testConversion() {
    const tenEuros = new Money(10, "EUR");
    assert.deepStrictEqual(
      this.bank.convert(tenEuros, "USD"),
      new Money(12, "USD")
    );
    this.bank.addExchangeRate("EUR", "USD", 1.3);
    assert.deepStrictEqual(
      this.bank.convert(tenEuros, "USD"),
      new Money(13, "USD")
    );
  }

  testConversionWithMissingExchangeRates() {
    const tenDollar = new Money(10, "USD");
    const expectedError = new Error("USD->Kalganid");
    assert.throws(() => {
      this.bank.convert(tenDollar, "Kalganid");
    }, expectedError);
  }

  testMethodsRandomOrder(){
    const order1 = this.randomizeTestOrder();
    const order2 = this.randomizeTestOrder();
    assert.notDeepStrictEqual(order1, order2);
  }

  getAllTestMethods() {
    const moneyPrototype = MoneyTest.prototype;
    const allProps = Object.getOwnPropertyNames(moneyPrototype);
    let testMethods = allProps.filter((p) => {
      return typeof moneyPrototype[p] === "function" && p.startsWith("test");
    });

    return testMethods;
  }

  randomizeTestOrder() {
    const testMethods = this.getAllTestMethods();
    for (let i = testMethods.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [testMethods[i], testMethods[j]] = [testMethods[j], testMethods[i]];
    }
    return testMethods;
    }

  runAllTests() {
    const randomTestMethods = this.randomizeTestOrder();
    randomTestMethods.forEach((m) => {
      console.log("Running: %s()", m);
      let method = Reflect.get(this, m);
      try {
        this.setUp();
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

new MoneyTest().runAllTests();
