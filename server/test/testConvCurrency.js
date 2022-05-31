var supertest = require("supertest")
var should = require("should")
var server = supertest.agent("http://localhost:5000")

describe("Net Worth Convert Currency Api Tests", function () {

  it("Simple Case", function (done) {
    let payload = {
      newCurrency: "USD",
      oldState: {
        currency: "CAD",
        currencySymbol: '$',
        
        chequing: 2000,
        rainyDayFund: 500,
        savingsTaxes: 200,
        savingsFun: 150.75,
        savingsTravel: 150.75,
        savingsPD: 250,
        investment1: 10000,
        investment2: 5000,
        investment3: 7000,
        primaryHome: 1250000,
        secondaryHome: 350000,
        
        creditCard1: 2000,
        creditCard2: 1750.75,
        mortgage1: 1000000,
        mortgage2: 200000,
        lineOfCredit: 10000,
        investmentLoan: 15000,
        
        totalLiabilities: -22,
        totalAssets: -44,
        netWorth: -75,
      }
    }

    server.post("/api/changeCurrency")
      .send(payload)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err, rsp) {
        should.equal(rsp.status, 200)
        done();

      });
  });

  it("Bad Argument", function (done) {
    let payload = {
      // newCurrency: "USD",
      oldState: {
        currency: "CAD",
        currencySymbol: '$',
        
        chequing: 2000,
        rainyDayFund: 500,
        savingsTaxes: 200,
        savingsFun: 150.75,
        savingsTravel: 150.75,
        savingsPD: 250,
        investment1: 10000,
        investment2: 5000,
        investment3: 7000,
        primaryHome: 1250000,
        secondaryHome: 350000,
        
        creditCard1: 2000,
        creditCard2: 1750.75,
        mortgage1: 1000000,
        mortgage2: 200000,
        lineOfCredit: 10000,
        investmentLoan: 15000,
      }
    }

    server.post("/api/changeCurrency")
      .send(payload)
      .expect("Content-type", /json/)
      .expect(400)
      .end(function (err, rsp) {
        rsp.status.should.equal(400);
        done();
      });
  });

  it("Invalid Currency", function (done) {
    let payload = {
      newCurrency: "ZZZ",
      oldState: {
        currency: "YYY",
        currencySymbol: '$',
        
        chequing: 2000,
        rainyDayFund: 500,
        savingsTaxes: 200,
        savingsFun: 150.75,
        savingsTravel: 150.75,
        savingsPD: 250,
        investment1: 10000,
        investment2: 5000,
        investment3: 7000,
        primaryHome: 1250000,
        secondaryHome: 350000,
        
        creditCard1: 2000,
        creditCard2: 1750.75,
        mortgage1: 1000000,
        mortgage2: 200000,
        lineOfCredit: 10000,
        investmentLoan: 15000,
      }
    }

    server.post("/api/changeCurrency")
      .send(payload)
      .expect("Content-type", /json/)
      .expect(400)
      .end(function (err, rsp) {
        rsp.status.should.equal(400);
        done();
      });
  });
})