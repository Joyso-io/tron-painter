import React from 'react';
import Wallet from 'components/Wallet';
import Cart from 'components/Cart';
import Withdraw from 'components/Withdraw';

import { Scrollbars } from 'react-custom-scrollbars';

import './RightControls.scss';

class RightControls extends React.Component {
    state = {
       colorsActive: false
    }

    constructor(props) {
        super(props);
        this.buy = this.buy.bind(this);
    }


    buy() {
        this.props.buyPixels();
    }

    render() {
        return (
            <div className="controls">
                <div className="tools">
                    <a className="wallet" onClick={ this.props.toggle }></a>
                    <Wallet tronWeb={ this.props.tronWeb }/>
                    <a className="cart" onClick={ this.props.toggle } ></a>
                    <Cart row={ this.props.row } col={ this.props.col } color={ this.props.color } pixelPrices={ this.props.pixelPrices } buy={ this.buy } clear={ this.props.clear } />
                    <a className="income" onClick={ this.props.toggle } ></a>
                    <Withdraw toggle={ this.props.toggle } userTotalSales={ this.props.userTotalSales } pendingWithdrawal={ this.props.pendingWithdrawal } withdraw={ this.props.withdraw } />
                </div>
            </div>
        );
    }
};

export default RightControls;
