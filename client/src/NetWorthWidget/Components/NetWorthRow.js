import React, { Component } from 'react';

class NetWorthRow extends Component {

  constructor(props) {
    super(props)
    this.state = {monthlyPayment: this.props.monthlyPayment}
  }

  render() {

    return (
      <div className="net-worth-row">
        <div className="net-worth-header">{this.props.heading}</div>
        {this.props.monthlyPayment ?
          <div className="net-worth-row-value-wrap">
            <div className="net-worth-currency-symbol">{this.props.currencySymbol}</div>
            <input type="number" className="net-worth-input" value={this.state.monthlyPayment} 
              onChange={e => this.setState({monthlyPayment: e.target.value})} />
          </div> : null
        }
        <div className="net-worth-row-value-wrap">
          <div className="net-worth-row-currency-symbol">{this.props.currencySymbol}</div>
          <input type="number" className="net-worth-value" value={this.props.dollarValue} 
          onChange={e => this.props.onChange(this.props.rowId, Number(e.target.value))} />
        </div>
      </div>
    )
  }
}

export default NetWorthRow