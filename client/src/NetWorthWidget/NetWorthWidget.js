import React, { Component } from 'react';
import { api } from '../api';
import './NetWorth.css'
import NetWorthRow from './Components/NetWorthRow';

const SAVE_KEY = 'savedNetWorth'

class NetWorthWidget extends Component {

  constructor(props) {
    super(props)
    this.state = {

      // Currency
      currencySymbol: '$',
      currency: "CAD",

      // Assets
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

      // Liabilities
      creditCard1: 0,
      creditCard2: 0,
      mortgage1: 0,
      mortgage2: 0,
      lineOfCredit: 0,
      investmentLoan: 0,

      // Totals
      totalLiabilities: 0,
      totalAssets: 0,
      netWorth: 0,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
  }

  handleChange(heading, newValue) {
    let newState = { ...this.state }
    newState[heading] = newValue

    api.post('/api/update', newState).then(rsp => {
      this.setState(rsp.data)
      localStorage.setItem(SAVE_KEY, JSON.stringify(rsp.data))
    }).catch(err => {
      console.log(err) // FIXME 
    })
  }

  handleCurrencyChange(event) {

    let payload = {
      oldState: this.state,
      newCurrency: event.target.value,
    }

    api.post('/api/changeCurrency', payload).then(rsp => {
      this.setState(rsp.data)
      localStorage.setItem(SAVE_KEY, JSON.stringify(rsp.data))
    }).catch(err => {
      console.log(err) // FIXME 
    })
  }

  componentDidMount() {

    let savedNetWorth = localStorage.getItem(SAVE_KEY)
    if (savedNetWorth) {
      try {
        let savedState = JSON.parse(savedNetWorth)
        this.setState(savedState)
      }
      catch (e) {} // ignore, just use defaults
    }
  }

  render() {
    return (
      <div className="net-worth-root">

        <div className="net-worth-row net-worth-heading">
          <div className="net-worth-heading-title">Select Currency:</div>
          <label><select onChange={this.handleCurrencyChange} value={this.state.currency}>
            <option value="AUD">AUD</option> {/* Australian Dollar */}
            <option value="BSD">BSD</option> {/* Bahamian Dollar */}
            <option value="BBD">BBD</option> {/* Barbadian Dollar */}
            <option value="CAD">CAD</option> {/* Canadian Dollar */}
            <option value="FJD">FJD</option> {/* Fijan Dollar */}
            <option value="GYD">GYD</option> {/* Guanese Dollar */}
            <option value="HKD">HKD</option> {/* Hong Kong Dollar */}
            <option value="JMD">JMD</option> {/* Jamaican Dollar */}
            <option value="SGD">SGD</option> {/* Singapore Dollar */}
            <option value="USD">USD</option> {/* United States Dollar */}
          </select></label>
        </div>

        <div className="net-worth-row net-worth-row-space" />

        <div className="net-worth-row net-worth-heading">Assets</div>
        <div className="net-worth-row net-worth-heading">Cash and Investments</div>
        <NetWorthRow heading="Chequing" rowId="chequing" dollarValue={this.state.chequing} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Rainy Day Fund" rowId="rainyDayFund" dollarValue={this.state.rainyDayFund} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Savings Taxes" rowId="savingsTaxes" dollarValue={this.state.savingsTaxes} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Savings Fun" rowId="savingsFun" dollarValue={this.state.savingsFun} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Savings Travel" rowId="savingsTravel" dollarValue={this.state.savingsTravel} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Savings Personal Development" rowId="savingsPD" dollarValue={this.state.savingsPD} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Investment 1" rowId="investment1" dollarValue={this.state.investment1} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Investment 2" rowId="investment2" dollarValue={this.state.investment2} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Investment 3" rowId="investment3" dollarValue={this.state.investment3} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />

        <div className="net-worth-row net-worth-heading">Long Term Assets</div>
        <NetWorthRow heading="Primary Home" rowId="primaryHome" dollarValue={this.state.primaryHome} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />
        <NetWorthRow heading="Seconday Home" rowId="secondaryHome" dollarValue={this.state.secondaryHome} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} />

        <div className="net-worth-row net-worth-heading">
          <div className="net-worth-heading-title">Total Assets</div>
          <div>{this.state.currencySymbol}</div>
          <div>{this.state.totalAssets}</div>
        </div>

        <div className="net-worth-row net-worth-row-space" />

        <div className="net-worth-row net-worth-heading">Liabilities</div>
        <div className="net-worth-row">
          <div>Short Term Liabilities</div>
          <div>Monthly Payment</div>
        </div>

        <NetWorthRow heading="Credit Card 1" rowId="creditCard1" dollarValue={this.state.creditCard1} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} monthlyPayment="0" />
        <NetWorthRow heading="Credit Card 2" rowId="creditCard2" dollarValue={this.state.creditCard2} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} monthlyPayment="0" />

        <div className="net-worth-row net-worth-heading">Long Term Debt</div>
        <NetWorthRow heading="Mortgage 1" rowId="mortgage1" dollarValue={this.state.mortgage1} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} monthlyPayment="0" />
        <NetWorthRow heading="Mortgage 2" rowId="mortgage2" dollarValue={this.state.mortgage2} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} monthlyPayment="0" />
        <NetWorthRow heading="Line Of Credit" rowId="lineOfCredit" dollarValue={this.state.lineOfCredit} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} monthlyPayment="0" />
        <NetWorthRow heading="Investment Loan" rowId="investmentLoan" dollarValue={this.state.investmentLoan} 
          currencySymbol={this.state.currencySymbol} onChange={this.handleChange} monthlyPayment="0" />

        <div className="net-worth-row net-worth-heading">
          <div className="net-worth-heading-title">Total Liabilities</div>
          <div>{this.state.currencySymbol}</div>
          <div>{this.state.totalLiabilities}</div>
        </div>

        <div className="net-worth-row net-worth-row-space" />

        <div className="net-worth-row net-worth-heading">
          <div className="net-worth-heading-title">Net Worth</div>
          <div>{this.state.currencySymbol}</div>
          <div>{this.state.netWorth}</div>
        </div>

      </div>
    )
  }
}

export default NetWorthWidget;