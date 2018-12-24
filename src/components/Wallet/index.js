import React from 'react';
import Utils from 'utils';

import { Scrollbars } from 'react-custom-scrollbars';

import './Wallet.scss';

class Wallet extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.tronWeb)
        if(this.props.tronWeb.loggedIn) {
            const address = this.props.tronWeb.userAddress;
            const balance = this.props.tronWeb.balance;
            return (
                <div id="wallet">
                    <div className='user-address'>
                        { address }
                    </div>

                    <div className='balance'>
                        <div className='title'>
                            Balance:
                        </div>  
                        <div className='user-balance'>
                            { balance }
                        </div>                                                
                    </div>
                </div>
            );
        } else {
            return (
                <div id="wallet">
                    <div className='log-in'>
                        Please Log in <br/>
                        or Download Tronlink
                    </div>
                    <div className='tronlink'>
                        Tronlink:
                    </div>
                    <a className='tronlink-url' href="https://goo.gl/zyBTHT" target="_blank">
                        https://goo.gl/zyBTHT
                    </a>
                </div>
            );
        }
    }
};

export default Wallet;
