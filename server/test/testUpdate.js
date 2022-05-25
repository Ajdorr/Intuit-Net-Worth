var supertest = require("supertest")
var should = require("should")
var server = supertest.agent("http://localhost:5000")

describe("Net Worth Update Api Tests", function () {

  it("Simple Case", function (done) {
    let payload = {
      currencySymbol: '$',
      currency: "CAD",

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

    server.post("/api/update")
      .send(payload)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err, rsp) {
        should.equal(rsp.status, 200)
        should.equal(rsp.body.totalAssets, 1625251.5)
        should.equal(rsp.body.totalLiabilities, 1228750.75)
        should.equal(rsp.body.netWorth, 396500.75)
        done();

      });
  });

  it("Missing Totals", function (done) {
    let payload = {
      currencySymbol: '$',
      currency: "CAD",

      chequing: 2500,
      rainyDayFund: 20,
      savingsTaxes: 250,
      savingsFun: 155.75,
      savingsTravel: 150.75,
      savingsPD: 250,
      investment1: 1000,
      investment2: 50000,
      investment3: 700,
      primaryHome: 1500000,
      secondaryHome: 450000,

      creditCard1: 1000,
      creditCard2: 450.75,
      mortgage1: 800000,
      mortgage2: 100000,
      lineOfCredit: 5000,
      investmentLoan: 1525,
    }

    server.post("/api/update")
      .send(payload)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err, rsp) {
        should.equal(rsp.status, 200)
        should.equal(rsp.body.totalAssets, 2005026.5)
        should.equal(rsp.body.totalLiabilities, 907975.75)
        should.equal(rsp.body.netWorth, 1097050.75)
        done();
      });
  });

  it("All Zeros", function (done) {
    let payload = {
      currencySymbol: '$',
      currency: "CAD",

      chequing: 0,
      rainyDayFund: 0,
      savingsTaxes: 0,
      savingsFun: 0,
      savingsTravel: 0,
      savingsPD: 0,
      investment1: 0,
      investment2: 0,
      investment3: 0,
      primaryHome: 0,
      secondaryHome: 0,

      creditCard1: 0,
      creditCard2: 0,
      mortgage1: 0,
      mortgage2: 0,
      lineOfCredit: 0,
      investmentLoan: 0,
    }

    server.post("/api/update")
      .send(payload)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err, rsp) {
        should.equal(rsp.status, 200)
        should.equal(rsp.body.totalAssets, 0)
        should.equal(rsp.body.totalLiabilities, 0)
        should.equal(rsp.body.netWorth, 0)
        done();

      });
  });

    it("Negative Result", function (done) {
    let payload = {
      currencySymbol: '$',
      currency: "CAD",

      chequing: 10,
      rainyDayFund: 20,
      savingsTaxes: 30,
      savingsFun: 10,
      savingsTravel: 10,
      savingsPD: 20,
      investment1: 100,
      investment2: 100,
      investment3: 100,
      primaryHome: 500,
      secondaryHome: 100,

      creditCard1: 500,
      creditCard2: 500,
      mortgage1: 200,
      mortgage2: 100,
      lineOfCredit: 50,
      investmentLoan: 50,
    }

    server.post("/api/update")
      .send(payload)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err, rsp) {
        should.equal(rsp.status, 200)
        should.equal(rsp.body.totalAssets, 1000)
        should.equal(rsp.body.totalLiabilities, 1400)
        should.equal(rsp.body.netWorth, -400)
        done();

      });
  });

  it("Bad Argument", function (done) {
    let payload = {
      currency: "CAD",
      // currencySymbol: "$"

      chequing: 2000,
      rainyDayFund: 500,
      savingsTaxes: 200,
      savingsTravel: 150.75,
      savingsPD: 250,
      investment1: 10000,
      // investment2: 5000,
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

    server.post("/api/update")
      .send(payload)
      .expect("Content-type", /json/)
      .expect(400)
      .end(function (err, rsp) {
        rsp.status.should.equal(400);
        done();
      });
  });
})