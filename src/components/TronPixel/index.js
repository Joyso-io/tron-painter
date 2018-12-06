import React from 'react';
import Canvas from 'components/Canvas';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';

import { Scrollbars } from 'react-custom-scrollbars';

import './TronPixel.scss';

const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';

class TronPixel extends React.Component {
    state = {
        row: 0,
        col: 0,
        color: {
            0: '#fff',
            1: '#e4e4e4',
            2: '#888',
            3: '#222',
            4: '#ffa7d1',
            5: '#e50000',
            6: '#e59500',
            7: '#a06a42',
            8: '#e5d900',
            9: '#94e044',
            10: '#02be01',
            11: '#00d3dd',
            12: '#0083c7',
            13: '#0000ea',
            14: '#cf6ee4',
            15: '#820080'
        }
    }

    constructor(props) {
        super(props);
        this.getPixelColors = this.getPixelColors.bind(this);
        this.draw = this.draw.bind(this);
        this.buy = this.buy.bind(this);
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

        this.draw();
    }

    async buy() {
        console.log("row: " + this.state.row);
        console.log("col: " + this.state.col);
        await Utils.contract.buyPixel(this.state.row, this.state.col, 2).send({ callValue: Utils.tronWeb.toSun(10) });
    }

    draw() {
        let theCanvas = document.querySelector('#theCanvas');

        if (!theCanvas || !theCanvas.getContext) {
            return false
        } else {
            let context = theCanvas.getContext('2d')
            context.clearRect(0, 0, context.width, context.height)
            let rect = theCanvas.getBoundingClientRect()

            this.getPixelColors(context, rect);

            theCanvas.onclick = (e) => {
                this.state.row = (Math.floor((e.offsetX) * 100 / rect.width));
                this.state.col = (Math.floor((e.offsetY) * 100 / rect.height));
                this.buy();
            }
        }

    };

    getPixelColors(canvas, rect) {
        for (var row = 0; row < 100; row++) {
            Utils.contract.getPixelRowColors(row).call()
                .then(colors => {
                    for (var col = 0; col < 100; col++) {
                        canvas.fillStyle = this.state.color[colors[1][col]];
                        canvas.fillRect(colors[0] * rect.width / 100, col * rect.height / 100, rect.width / 100, rect.width / 100);
                    }
                }).catch(err => {
                    console.log(err);
                })
        }
    };

    render() {
        return (
            <div className='landing-wrapper'>
                <Canvas />
            </div>
        );
    };
};

export default TronPixel;
