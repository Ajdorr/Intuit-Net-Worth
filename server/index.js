const express = require("express");
var https = require("https")
const Ajv = require("ajv");

const PORT = 5000;

const app = express();
app.use(express.json())

const ajv = new Ajv()


function calcTotals(netWorthObj) {

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


app.post("/api/update", (req, rsp) => {

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

function convertCurrency(conversionRate, newCurrency, netWorthObj) {

  netWorthObj.currency = newCurrency
  netWorthObj.chequing = conversionRate * netWorthObj.chequing
  netWorthObj.rainyDayFund = conversionRate * netWorthObj.rainyDayFund
  netWorthObj.savingsTaxes = conversionRate * netWorthObj.savingsTaxes
  netWorthObj.savingsFun = conversionRate * netWorthObj.savingsFun
  netWorthObj.savingsTravel = conversionRate * netWorthObj.savingsTravel
  netWorthObj.savingsPD = conversionRate * netWorthObj.savingsPD
  netWorthObj.investment1 = conversionRate * netWorthObj.investment1
  netWorthObj.investment2 = conversionRate * netWorthObj.investment2
  netWorthObj.investment3 = conversionRate * netWorthObj.investment3
  netWorthObj.primaryHome = conversionRate * netWorthObj.primaryHome
  netWorthObj.secondaryHome = conversionRate * netWorthObj.secondaryHome
  netWorthObj.creditCard1 = conversionRate * netWorthObj.creditCard1
  netWorthObj.creditCard2 = conversionRate * netWorthObj.creditCard2
  netWorthObj.mortgage1 = conversionRate * netWorthObj.mortgage1
  netWorthObj.mortgage2 = conversionRate * netWorthObj.mortgage2
  netWorthObj.lineOfCredit = conversionRate * netWorthObj.lineOfCredit
  netWorthObj.investmentLoan = conversionRate * netWorthObj.investmentLoan

}

const convertSchema = {
  type: "object",
  properties: {
    newCurrency: { type: "string" },
    oldState: {
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
  },
  additionalProperties: false,
  required: ["newCurrency", "oldState"],
}
const validateConvert = ajv.compile(convertSchema)

app.post("/api/changeCurrency", (req, rsp) => {

  if (!validateConvert(req.body)) {
    rsp.status(400)
    rsp.send()
    return;
  }

  const apiKey = "1e0689db7449592f3739"
  const convCurrKey = `${encodeURIComponent(req.body.oldState.currency)}_${encodeURIComponent(req.body.newCurrency)}`
  const url = `https://free.currconv.com/api/v7/convert?q=${convCurrKey}&compact=ultra&apiKey=${apiKey}`;

  https.get(url, currConvRsp => {
    var body = ''

    currConvRsp.on('data', c => { body += c })
    currConvRsp.on('end', () => {
      try {
        var currConvRspBody = JSON.parse(body)
      }
      catch (e) {
        // This typically happens when the free version goes down
        // https://www.currencyconverterapi.com/server-status
        console.error("Unable to parse JSON from currency converter")
        console.error(body)
        rsp.status(500)
        rsp.send()
        return
      }

      convertCurrency(currConvRspBody[convCurrKey], req.body.newCurrency, req.body.oldState)
      calcTotals(req.body.oldState)

      rsp.setHeader('Content-Type', 'application/json');
      rsp.send(JSON.stringify(req.body.oldState))
    })
    currConvRsp.on('error', e => { console.error(e); rsp.status(500).send("Error") });

  }).on('error', e => { console.error(e); rsp.status(500).send("Error") })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`)
})

