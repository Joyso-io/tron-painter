import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
// import TronPixel from 'components/TronPixel'
import Canvas from 'components/Canvas';
import Controls from 'components/Controls';
import Utils from 'utils';
import Swal from 'sweetalert2';
// import banner from 'assets/banner.png';

import './App.scss';

const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';

class App extends React.Component {
    state = {
        tronWeb: {
            installed: false,
            loggedIn: false
        },
        row: [],
        col: [],
        color: [],
        pixelPrices: [],
        currentColor: null,
        colors: {
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
        this.sum = this.sum.bind(this);
        this.getPixelColors = this.getPixelColors.bind(this);
        this.getAllIndexes = this.getAllIndexes.bind(this);
        this.draw = this.draw.bind(this);
        this.updateSelectColor = this.updateSelectColor.bind(this);
        this.drawPixel = this.drawPixel.bind(this);
        this.updatePixelState = this.updatePixelState.bind(this);
        this.buyPixels = this.buyPixels.bind(this);
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
        this.drawPixel();
    }

    draw() {
        let theCanvas = document.querySelector('#theCanvas');
        if (!theCanvas || !theCanvas.getContext) {
            return false
        } else {
            let canvas = theCanvas.getContext('2d');
            canvas.clearRect(0, 0, canvas.width, canvas.height);
            let rect = theCanvas.getBoundingClientRect();

            this.getPixelColors(canvas, rect);

            theCanvas.onclick = (e) => {
                if (this.state.currentColor) {
                    this.setState({ row: (Math.floor((e.offsetX) * 100 / rect.width)) });
                    this.setState({ col: (Math.floor((e.offsetY) * 100 / rect.height)) });
                    let row = Math.floor((e.offsetX) * 100 / rect.width);
                    let col = Math.floor((e.offsetY) * 100 / rect.height);
                    this.drawPixels(canvas, rect, row, col);
                }
            }
        }

    };

    getPixelColors(canvas, rect) {
        for (var row = 0; row < 100; row++) {
            Utils.contract.getPixelRowColors(row).call()
                .then(colors => {
                    for (var col = 0; col < 100; col++) {
                        canvas.fillStyle = this.state.colors[colors[1][col]];
                        canvas.fillRect(colors[0] * rect.width / 100, col * rect.height / 100, rect.width / 100, rect.width / 100);
                    }
                }).catch(err => {
                    console.log(err);
                })
        }
    };

    updateSelectColor(newColorString) {
        this.setState({ currentColor: newColorString });
    }

    drawPixel() {
        let theCanvas = document.querySelector('#theCanvas');
        let canvas = theCanvas.getContext('2d');
        canvas.clearRect(0, 0, canvas.width, canvas.height);
        let rect = theCanvas.getBoundingClientRect();

        theCanvas.onclick = (e) => {
            if (this.state.currentColor) {
                let row = Math.floor((e.offsetX) * 100 / rect.width);
                let col = Math.floor((e.offsetY) * 100 / rect.height);
                let colorInt = Object.keys(this.state.colors).find(key => this.state.colors[key] === this.state.currentColor);

                canvas.fillStyle = this.state.currentColor;
                canvas.fillRect(row * rect.width / 100, col * rect.height / 100, rect.width / 100, rect.width / 100);
                this.updatePixelState(row, col, colorInt);
            }
        }
    }

    async updatePixelState(row, col, colorInt) {
        let rowIndex = new Set(this.getAllIndexes(this.state.row, row));
        let colIndex = new Set(this.getAllIndexes(this.state.col, col));
        let intersection =  Array.from(new Set([...rowIndex].filter(x => colIndex.has(x))));
        
        if (intersection.length > 0) {
            this.state.color[intersection[0]] = colorInt;
            this.setState({ color: this.state.color });
        } else {
            let getPixelPrice = await Utils.contract.getPixelPrice(row, col).call();
            let pixelTrx = getPixelPrice / 1000000;
            let pixelPrice = parseInt(getPixelPrice._hex, 16);
            await this.setState({ row: this.state.row.concat(row), col: this.state.col.concat(col), color: this.state.color.concat(colorInt), pixelPrices: this.state.pixelPrices.concat(pixelTrx) });
        }
    }

    async buyPixels() {
        let total_price = this.state.pixelPrices.reduce((sum, x) => sum + x).toFixed(2);

        await Utils.contract.buyPixels(this.state.row, this.state.col, this.state.color).send({ callValue: Utils.contract.tronWeb.toSun(total_price) });
    }

    sum(arr) {
      return arr.reduce((sum, x) => sum + x);
    }

    getAllIndexes(arr, val) {
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i+1)) != -1){
            indexes.push(i);
        }
        return indexes;
    }

    render() {
        return (
            <div>
                <div className='landing-wrapper'>
                    <Canvas />
                </div>
                <Controls row={ this.state.row } col={ this.state.col } color={ this.state.color } pixelPrices={ this.state.pixelPrices } colors={ this.state.colors } updateColor={ this.updateSelectColor } buyPixels= { this.buyPixels } />
            </div>
        );
    }
}

export default App;
