import React from 'react';
import Message from 'components/Message';
import Featured from 'components/Featured';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';
import Swal from 'sweetalert2';
// import banner from 'assets/banner.png';

import './App.scss';

const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';

class App extends React.Component {
    state = {
        currentMessage: {
            message: '',
            loading: false
        },
        messages: {
            recent: ''
        }

    }
    // message = '';

    constructor(props) {
        super(props);
        this.onMessageEdit = this.onMessageEdit.bind(this);
        this.onMessageSend = this.onMessageSend.bind(this);
    }

    async componentDidMount() {
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if(tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if(tries >= 10) {
                    const TRONGRID_API = 'https://api.trongrid.io';

                    window.tronWeb = new TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if(!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState
                });

                resolve();
            }, 100);
        });

        if(!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', () => {
                if(this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }

        await Utils.setTronWeb(window.tronWeb);

        this.getmessage();
    }

    async getmessage() {
        console.log('aaaaaa');
        await Utils.contract.get().call()
        .then(respond => {
            this.state.messages.recent = parseInt(respond._hex);
        });
    }

    async setmessage(param) {
        await Utils.contract.set(param).send();
    }

    async onMessageSend() {
        const {
            loading,
            message
        } = this.state.currentMessage;

        if(loading)
            return;

        if(!message.trim().length)
            return;

        this.setState({
            currentMessage: {
                loading: true,
                message
            }
        });

        await Utils.contract.set(message).send()
        .then(respond => {
            this.getmessage();
        });
    }

    handleSearchTermSubmit(event) {
        event.preventDefault();
        this.props.onSearchTermSubmit(this.textInput.value);
    }

    onMessageEdit({ target: { value } }) {
        if(this.state.currentMessage.loading)
            return;

        this.setState({
            currentMessage: {
                message: value,
                loading: false
            }
        });
        this.getmessage();
     }


    render() {
        return (
            <div className='kontainer'>
                <div className='message'>
                    <div>
                      { this.state['messages']['recent'] }
                    </div>
                </div>

                <div className='testaaa'>
                    <textarea
                        placeholder='Enter your message to post'
                        value={ this.state.currentMessage.message }
                        onChange={ this.onMessageEdit }></textarea>
                </div>

                <div
                    className={ 'sendButton' + (!!this.state.currentMessage.message.trim().length ? '' : ' disabled') }
                    onClick={ this.onMessageSend }
                >
                    Post Message
                </div>                
            </div>
        );
    }
}

export default App;
