import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
// import TronPixel from 'components/TronPixel'
import Header from 'components/Header';
import Canvas from 'components/Canvas';
import LeftControls from 'components/LeftControls';
import RightControls from 'components/RightControls';
import Utils from 'utils';
import Swal from 'sweetalert2';
// import banner from 'assets/banner.png';

import './App.scss';

const FOUNDATION_ADDRESS = 'TFSiTozdHoj5J9EgNqXCXXLg4mhwnWSopS';

class App extends React.Component {
    state = {
        tronWeb: {
            installed: false,
            loggedIn: false,
            userAddress: null,
            balance: 0
        },
        row: [],
        col: [],
        color: [],
        pixelPrices: [],
        currentColor: null,
        userTotalSales: 0,
        pendingWithdrawal: 0,
        isMaxCount: false,
        canvasStatus: null,
        selectPixels: [],
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
        this.clear = this.clear.bind(this);
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
        this.windowToCanvas = this.windowToCanvas.bind(this);
        this.pathExists = this.pathExists.bind(this);
        this.previous = this.previous.bind(this);
        this.erase = this.erase.bind(this);
        this.drawColor = this.drawColor.bind(this);
        this.up = this.up.bind(this);
        this.down = this.down.bind(this);
        this.moveCanvas = this.moveCanvas.bind(this);
        this.getPixelColors = this.getPixelColors.bind(this);
        this.getAllIndexes = this.getAllIndexes.bind(this);
        this.checkPendingWithdrawal = this.checkPendingWithdrawal.bind(this);
        this.userTotalSales = this.userTotalSales.bind(this);
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

            window.tronWeb.on('addressChanged', async() => {
                await Utils.setTronWeb(window.tronWeb);
                this.checkPendingWithdrawal();
                this.userTotalSales(window.tronWeb.defaultAddress.hex);
                if(this.state.tronWeb.loggedIn)
                    return;
                
                const address = window.tronWeb.defaultAddress.base58;
                let balance = await window.tronWeb.trx.getBalance(address);
                balance = balance / 1000000;

                await this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true,
                        userAddress: address,
                        balance: balance
                    }
                });
            });
        }

        await Utils.setTronWeb(window.tronWeb);

        this.draw();
        this.drawPixel();
        this.userTotalSales(window.tronWeb.defaultAddress.hex);
        this.checkPendingWithdrawal();
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
        let isAllowDrawLine = false

        theCanvas.onmousedown = (e) => {
            const rowArray = [];
            const colArray = [];
            if (this.state.currentColor || this.state.canvasStatus === 0 || this.state.canvasStatus === 1) {
                isAllowDrawLine = true
                let { row, col } = this.windowToCanvas(e)
                let colorInt = Object.keys(this.state.colors).find(key => this.state.colors[key] === this.state.currentColor);
                let rowInt = row;
                let colInt = col;
                if (this.state.canvasStatus === 1) {
                    this.updatePixelState(row, col, colorInt, canvas, rect);
                }
                theCanvas.onmousemove = async (e) => {
                    const { row, col } = this.windowToCanvas(e)
                    let intersection = this.pathExists(row, col, rowArray, colArray);
                    if (isAllowDrawLine && intersection < 1 && !(rowInt === row && colInt === col)) {
                        rowArray.push(row);
                        colArray.push(col);
                        if (this.state.canvasStatus === 1) {
                            this.updatePixelState(row, col, colorInt, canvas, rect);
                        } else {
                            let intersection = this.pathExists(row, col, this.state.row, this.state.col);

                            if (intersection.length > 0) {
                                await this.clear(row, col, intersection[0]);

                                [this.state.row, this.state.col, this.state.color, this.state.pixelPrices, this.state.selectPixels].forEach((e) => {
                                    e.splice(intersection[0], 1);
                                })

                                this.setState({ 
                                    row: this.state.row, col: this.state.col, color: this.state.color, 
                                    pixelPrices: this.state.pixelPrices, selectPixels: this.state.selectPixels, isMaxCount: false 
                                })
                            }
                        }
                    }
                }
            } else if (this.state.canvasStatus === 2) {
                isAllowDrawLine = true;
                var e = e || window.event;
                var diffX = e.clientX - theCanvas.offsetLeft;
                var diffY = e.clientY - theCanvas.offsetTop;

                theCanvas.onmousemove = async (e) => {
                    if (isAllowDrawLine) {
                        theCanvas.style.marginLeft = e.clientX - diffX + 'px';
                        theCanvas.style.marginTop = e.clientY - diffY + 'px';

                        var cw = document.documentElement.clientWidth || document.body.clientWidth;
                        var ch = document.documentElement.clientHeight || document.body.clientHeight;
                        if (e.clientX - diffX < 0) {
                            theCanvas.style.left = '0px';
                        }else if (e.clientX - diffX > cw - theCanvas.offsetWidth) {
                            theCanvas.style.left = cw - theCanvas.offsetWidth + 'px';
                        }
                        if (e.clientY - diffY < 0) {
                            theCanvas.style.top = '0px';
                        }else if (e.clientY > ch - theCanvas.offsetHeight) {
                            theCanvas.style.top = ch - theCanvas.offsetHeight + 'px';
                        }
                    }
                }
            }
        }
        theCanvas.onmouseup = async (e) => {
            if (this.draw) {
                isAllowDrawLine = false
                let selectPixelPrices = await Utils.contract.getPixelPrices(this.state.row, this.state.col).call();
                let pixelPrices = selectPixelPrices.map(function(item) { return (parseInt(item._hex, 16) / 1000000) });
                this.setState({ pixelPrices: pixelPrices });
            }
        }
    }

    windowToCanvas(e) {
        let theCanvas = document.querySelector('#theCanvas');
        let canvas = theCanvas.getContext('2d');
        canvas.clearRect(0, 0, canvas.width, canvas.height);
        let rect = theCanvas.getBoundingClientRect();

        return {
            row: Math.floor((e.offsetX) * 100 / rect.width),
            col: Math.floor((e.offsetY) * 100 / rect.height)
        }
    }

    updatePixelState(row, col, colorInt, canvas, rect) {
        let intersection = this.pathExists(row, col, this.state.row, this.state.col);

        if (intersection.length > 0) {
            this.state.color[intersection[0]] = colorInt;
            this.setState({ color: this.state.color });

            canvas.fillStyle = this.state.currentColor;
            canvas.fillRect(row * rect.width / 100, col * rect.height / 100, rect.width / 100, rect.width / 100);
        } else if(!this.state.isMaxCount) {
            this.setState({ 
                row: this.state.row.concat(row), col: this.state.col.concat(col), color: this.state.color.concat(colorInt),
                selectPixels: this.state.selectPixels.concat({ row: row, col: col })
            });

            if (this.state.row.length > 99)
                this.setState({ isMaxCount: true })

            canvas.fillStyle = this.state.currentColor;
            canvas.fillRect(row * rect.width / 100, col * rect.height / 100, rect.width / 100, rect.width / 100);
        }
    }

    pathExists(row, col, rowArray, colArray) {
        let rowIndex = new Set(this.getAllIndexes(rowArray, row));
        let colIndex = new Set(this.getAllIndexes(colArray, col));
        let intersection = Array.from(new Set([...rowIndex].filter(x => colIndex.has(x))));

        return intersection
    }



    async buyPixels() {
        let total_price = this.state.pixelPrices.reduce((sum, x) => sum + x).toFixed(2);

        await Utils.contract.buyPixels(this.state.row, this.state.col, this.state.color).send({ callValue: Utils.contract.tronWeb.toSun(total_price) });
        await this.clear();
    }

    async checkPendingWithdrawal() {
        let respond = await Utils.contract.checkPendingWithdrawal().call();
        await this.setState({ pendingWithdrawal: (parseInt(respond._hex, 16) / 1000000) })
    }

    async userTotalSales(address) {
        let respond = await Utils.contract.getUserTotalSales(address).call();
        await this.setState({ userTotalSales: (parseInt(respond._hex, 16) / 1000000) })
    }

    async clear(row = null, col = null, inputIndex = null) {
        let theCanvas = document.querySelector('#theCanvas');
        let canvas = theCanvas.getContext('2d');
        canvas.clearRect(0, 0, canvas.width, canvas.height);
        let rect = theCanvas.getBoundingClientRect();

        let rows = new Array();
        let cols = new Array();

        if (row === null || col == null || inputIndex == null) {
            for (let index in this.state.selectPixels) {
                rows.push(this.state.selectPixels[index].row);
                cols.push(this.state.selectPixels[index].col);
            }

            await Utils.contract.getPixelColors(rows, cols).call()
                    .then(color => {
                        for (var i = 0; i < this.state.selectPixels.length; i++) {
                            canvas.fillStyle = this.state.colors[color[i]];
                            canvas.fillRect(this.state.selectPixels[i].row * 9, this.state.selectPixels[i].col * 9, 9, 9);
                        }
                    }).catch(err => {
                        console.log(err);
                    })
            this.setState({ row: [], col: [], color: [], pixelPrices: [], selectPixels: [], isMaxCount: false })
        } else {
            await Utils.contract.getPixelColor(row, col).call()
                    .then(color => {
                            canvas.fillStyle = this.state.colors[color];
                            canvas.fillRect(this.state.selectPixels[inputIndex].row * 9, this.state.selectPixels[inputIndex].col * 9, 9, 9);
                    }).catch(err => {
                        console.log(err);
                    });
        }
    }

    async withdraw() {
        await Utils.contract.withdraw().send();
    }

    erase() {
        this.setState({ canvasStatus: 0, currentColor: null })
    }

    drawColor() {
        this.setState({ canvasStatus: 1 })
    }

    moveCanvas() {
        this.setState({ canvasStatus: 2, currentColor: null })
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

    toggle(e) {
        let name = e.target.className;
        let element = document.getElementById(name);

        if (!element.classList.contains('is-visible')) {
            this.close();
        }

        element.classList.toggle('is-visible');
    }

    close() {
        let visibles = document.querySelectorAll('.is-visible');
        visibles.forEach((e) => {
            e.classList.remove('is-visible');
        });
    }

    async previous() {
        this.close();
        if (this.state.row.length > 0) {
            const e = this.state.selectPixels[this.state.selectPixels.length - 1];
            await this.clear(e.row, e.col, this.state.selectPixels.length - 1);

            await [this.state.row, this.state.col, this.state.color, this.state.pixelPrices, this.state.selectPixels].forEach((array, i) => {
                array.pop();
            });

            await this.setState({ row: this.state.row, col: this.state.col, color: this.state.color, pixelPrices: this.state.pixelPrices, selectPixels: this.state.selectPixels, isMaxCount: false })
        }
    }

    up() {
        const canvas = document.getElementById('theCanvas');
        if (canvas.style.width === "") {
            canvas.style.width = "1200px";
            canvas.style.height = "1200px";
        } else {
            canvas.style.width = parseInt(canvas.style.width, 10) + 300 + "px"
            canvas.style.height = parseInt(canvas.style.height, 10) + 300 + "px"
        }
    }

    down() {
        const canvas = document.getElementById('theCanvas');
        if (canvas.style.width !== "" && canvas.style.width !== "900px") {
            canvas.style.width = parseInt(canvas.style.width, 10) - 300 + "px"
            canvas.style.height = parseInt(canvas.style.height, 10) - 300 + "px"
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div id='pixel-canvas'>
                    <div className='controls-content left-controls'>
                        <LeftControls 
                            row={ this.state.row } col={ this.state.col } color={ this.state.color } pixelPrices={ this.state.pixelPrices } colors={ this.state.colors }  drawColor={ this.drawColor }
                            updateColor={ this.updateSelectColor } clear={ this.clear } previous={ this.previous } toggle={ this.toggle } close={ this.close } erase={ this.erase } moveCanvas= { this.moveCanvas }
                            />
                    </div>
                    <Canvas close={ this.close } up={ this.up } down={ this.down } canvasStatus={ this.state.canvasStatus } />
                    <div className='controls-content right-controls'>
                        <RightControls 
                            row={ this.state.row } col={ this.state.col } color={ this.state.color } pixelPrices={ this.state.pixelPrices } colors={ this.state.colors } tronWeb={ this.state.tronWeb }
                            buyPixels= { this.buyPixels } userTotalSales={ this.state.userTotalSales } pendingWithdrawal={ this.state.pendingWithdrawal } withdraw={ this.withdraw } toggle={ this.toggle } clear={ this.clear }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
