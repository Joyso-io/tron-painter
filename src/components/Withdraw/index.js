import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './Withdraw.scss';

class Withdraw extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="myModal">
                <div id="withdraw">
                    <div className="header">
                        <span>Withdraw</span>
                        <button className="myModal" onClick={ this.props.toggle }>X</button>
                    </div>

                    <div className="content">
                        <div className="withdraw-price">
                            Total Revenue: {this.props.pendingWithdrawal}
                        </div>
                        <button className="withdraw" onClick={ this.props.withdraw }>Withdraw</button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Withdraw;
