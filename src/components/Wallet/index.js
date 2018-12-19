import React from 'react';
import Utils from 'utils';

import { Scrollbars } from 'react-custom-scrollbars';

import './Wallet.scss';

class Wallet extends React.Component {
    state = {
       colorsActive: false
    }

    constructor(props) {
        super(props);
    }

    render() {
        if(window.tronweb) {
            const address = Utils.tronweb.defaultAddress.base58;
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
                            12,000
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
