const express = require('express')
const router = express.Router()

const https = require("https")
const fs = require("fs")

const Ajv = require("ajv");
const ajv = new Ajv()

var update = require('./update.js')

var currencyConvApiKey = undefined
try {
  currencyConvApiKey = fs.readFileSync('currConvApiKey.txt', 'utf8')
}
catch (e) {
  console.log(e)
}

var exchangeRatesApiKey = undefined
try {
  exchangeRatesApiKey = fs.readFileSync('exchangeRatesApiKey.txt', 'utf8')
}
catch (e) {
  console.log(e)
}


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

router.post("/api/changeCurrency", (req, rsp) => {

  if (!validateConvert(req.body)) {
    rsp.status(400)
    rsp.send()
    return;
  }

  const fromCurr = encodeURIComponent(req.body.oldState.currency)
  const toCurr = encodeURIComponent(req.body.newCurrency)
  const url = `https://api.apilayer.com/exchangerates_data/convert?from=${fromCurr}&to=${toCurr}&amount=1`

  // const convCurrKey = `${encodeURIComponent(req.body.oldState.currency)}_${encodeURIComponent(req.body.newCurrency)}`
  // const url = `https://free.currconv.com/api/v7/convert?q=${convCurrKey}&compact=ultra&apiKey=${currencyConvApiKey}`;


  https.get(url, {headers: {apiKey: exchangeRatesApiKey}}, currConvRsp => {
  // https.get(url, currConvRsp => {
    var body = ''

    // https://apilayer.com/marketplace/exchangerates_data-api#documentation-tab 
    // Alternative
    currConvRsp.on('data', c => { body += c })
    currConvRsp.on('end', () => {
      try {
        var currConvRspBody = JSON.parse(body)
      }
      catch (e) {
        console.error("Unable to parse JSON from exchange rates")
        console.error(body)
        rsp.status(500)
        rsp.send()
        return
      }

      convertCurrency(currConvRspBody.result, req.body.newCurrency, req.body.oldState)
      // convertCurrency(currConvRspBody[convCurrKey], req.body.newCurrency, req.body.oldState)
      update.calcTotals(req.body.oldState)

      rsp.setHeader('Content-Type', 'application/json');
      rsp.send(JSON.stringify(req.body.oldState))
    })
    currConvRsp.on('error', e => { console.error(e); rsp.status(500).send("Error") });

  }).on('error', e => { console.error(e); rsp.status(500).send("Error") })
})

module.exports = {router}