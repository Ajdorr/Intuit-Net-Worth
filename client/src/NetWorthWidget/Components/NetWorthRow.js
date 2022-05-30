import React, { Component } from 'react';

class NetWorthRow extends Component {

  constructor(props) {
    super(props)
    this.state = { monthlyPayment: this.props.monthlyPayment }
  }

  render() {

    const onDollarValueChange = e => {

      const caretSt = e.target.selectionStart
      const element = e.target

      this.props.onChange(this.props.rowId, Number(e.target.value.replace(/,/g, '')), () => {
        element.selectionStart = caretSt
        element.selectionEnd = caretSt
      })

    }

    return (
      <div className="net-worth-row" >
        <div className="net-worth-header">{this.props.heading}</div>
        {this.props.monthlyPayment ?
          <div className="net-worth-row-value-wrap" >
            <div className="net-worth-currency-symbol">{this.props.currencySymbol}</div>
            <input type="number" className="net-worth-input" value={this.state.monthlyPayment}
              onChange={e => this.setState({ monthlyPayment: e.target.value })} />
          </div> : null
        }
        <div className="net-worth-row-value-wrap">
          <div className="net-worth-row-currency-symbol">{this.props.currencySymbol}</div>
          <input className="net-worth-value"
            value={this.props.dollarValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            onChange={onDollarValueChange} />
        </div>
      </div >
    )
  }
}

export default NetWorthRow