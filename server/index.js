const express = require("express");
var https = require("https")
const PORT = 5000;
const app = express();

app.use(express.json())

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

app.post("/api/update", (req, rsp) => {

  console.log(req.body)
  let payload = {...req.body}

  calcTotals(payload)

  rsp.setHeader('Content-Type', 'application/json');
  rsp.send(JSON.stringify(payload))
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
  netWorthObj.totalLiabilities = conversionRate * netWorthObj.totalLiabilities
  netWorthObj.totalAssets = conversionRate * netWorthObj.totalAssets
  netWorthObj.netWorth = conversionRate * netWorthObj.netWorth

}

app.post("/api/changeCurrency", (req, rsp) => {

  const apiKey = "1e0689db7449592f3739"
  const convCurrKey = `${encodeURIComponent(req.body.oldState.currency)}_${encodeURIComponent(req.body.newCurrency)}`
  const url = `https://free.currconv.com/api/v7/convert?q=${convCurrKey}&compact=ultra&apiKey=${apiKey}`;

  https.get(url, currConvRsp => {
    var body = ''

    currConvRsp.on('data', c => { body += c })
    currConvRsp.on('end', () => { 
      var currConvRspBody = JSON.parse(body)
      convertCurrency(currConvRspBody[convCurrKey], req.body.newCurrency, req.body.oldState)
      calcTotals(req.body.oldState)

      rsp.setHeader('Content-Type', 'application/json');
      rsp.send(JSON.stringify(req.body.oldState))
    })
    currConvRsp.on('error', e => {console.error(e); rsp.status(500).send("Error")});

  }).on('error', e => {console.error(e); rsp.status(500).send("Error")})
})

app.get("/api", (req, rsp) => {
  console.log('Got /api')
  rsp.send("Hello world")
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`)
})

