var express = require('express')
var router = express.Router()

const Ajv = require("ajv");
const ajv = new Ajv()

const calcTotals = (netWorthObj) => {

  netWorthObj.totalAssets = (
    netWorthObj.chequing +
    netWorthObj.rainyDayFund +
    netWorthObj.savingsTaxes +
    netWorthObj.savingsFun +
    netWorthObj.savingsTravel +
    netWorthObj.savingsPD +
    netWorthObj.investment1 +
    netWorthObj.investment2 +
    netWorthObj.investment3 +
    netWorthObj.primaryHome +
    netWorthObj.secondaryHome)

  netWorthObj.totalLiabilities = (
    netWorthObj.creditCard1 +
    netWorthObj.creditCard2 +
    netWorthObj.mortgage1 +
    netWorthObj.mortgage2 +
    netWorthObj.lineOfCredit +
    netWorthObj.investmentLoan)

  netWorthObj.netWorth = netWorthObj.totalAssets - netWorthObj.totalLiabilities
}

const updateSchema = {
  type: "object",
  properties: {
    currencySymbol: { type: "string" },
    currency: { type: "string" },
    chequing: { type: "number" },
    rainyDayFund: { type: "number" },
    savingsTaxes: { type: "number" },
    savingsFun: { type: "number" },
    savingsTravel: { type: "number" },
    savingsPD: { type: "number" },
    investment1: { type: "number" },
    investment2: { type: "number" },
    investment3: { type: "number" },
    primaryHome: { type: "number" },
    secondaryHome: { type: "number" },
    creditCard1: { type: "number" },
    creditCard2: { type: "number" },
    mortgage1: { type: "number" },
    mortgage2: { type: "number" },
    lineOfCredit: { type: "number" },
    investmentLoan: { type: "number" },
    totalLiabilities: { type: "number" },
    totalAssets: { type: "number" },
    netWorth: { type: "number" },
  },
  required: [
    "chequing", "rainyDayFund", "savingsTaxes", "savingsFun",
    "savingsTravel", "savingsPD", "investment1", "investment2",
    "investment3", "primaryHome", "secondaryHome", "creditCard1",
    "creditCard2", "mortgage1", "mortgage2", "lineOfCredit",
    "investmentLoan"],
  additionalProperties: false,
}
const validateUpdate = ajv.compile(updateSchema)

router.post("/api/update", (req, rsp) => {

  console.log(req.body)
  let payload = { ...req.body }
  if (!validateUpdate(payload)) {
    rsp.status(400)
    rsp.send()
  }
  else {
    calcTotals(payload)
    rsp.setHeader('Content-Type', 'application/json');
    rsp.send(JSON.stringify(payload))
  }
})

module.exports = {router, calcTotals}