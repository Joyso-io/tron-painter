import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './Withdraw.scss';

class Withdraw extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="income">
                <div className="information">
                    <div className="withdraw-content">
                        <div className="title">
                            Total Sales
                        </div>

                        <div className="content">
                            { this.props.userTotalSales }
                        </div>
                    </div>

                    <div className="withdraw-content">
                        <div className="title">
                            Pending Withdrawal
                        </div>

                        <div className="content">
                            { this.props.pendingWithdrawal }
                        </div>
                    </div>
                </div>

                <button className="withdraw-btn" onClick={ this.props.withdraw }>Withdraw</button>
            </div>
        );
    }
};

export default Withdraw;
