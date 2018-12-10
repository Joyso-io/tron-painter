import React from 'react';
import Cart from 'components/Cart';
import Withdraw from 'components/Withdraw';

import { Scrollbars } from 'react-custom-scrollbars';

import './Controls.scss';

class Controls extends React.Component {
    state = {
       colorsActive: false
    }

    constructor(props) {
        super(props);
        this.showColors = this.showColors.bind(this);
        this.selectColor = this.selectColor.bind(this);
        this.toggle = this.toggle.bind(this);
        this.buy = this.buy.bind(this);
    }

    showColors() {
       this.setState({ colorsActive: !this.state.colorsActive })
    }

    selectColor(e) {
        let element = e.target;
        let color = element.getAttribute('color');
        this.props.updateColor(color);
        this.showColors();
    }

    toggle(e) {
        let name = e.target.className;
        let element = document.querySelector("#" + name);

        element.classList.toggle('is-visible');
    }

    buy() {
        this.props.buyPixels();
    }

    render() {
        const colorItems = Object.entries(this.props.colors).map(([key,value])=>{
            const className = 'color color-' + key;
            return (
                <li key={ key } className={ className } color={ value } onClick={ (e) => this.selectColor(e) } ></li>
            );
        })
        let btn_class = this.state.colorsActive ? "colors active" : "colors";

        return (
            <div className="controls">
                <div className="tools">
                    <button onClick={this.showColors}>
                        Button
                    </button>

                    <ul className={btn_class}>
                        { colorItems }
                    </ul>

                    <button className="cart" onClick={ this.toggle }>
                        Cart
                    </button>

                    <button className="myModal" onClick={ this.toggle }>
                        Withdraw
                    </button>

                    <Cart row={ this.props.row } col={ this.props.col } color={ this.props.color } pixelPrices={ this.props.pixelPrices } buy={ this.buy }/>
                    <Withdraw toggle={ this.toggle } pendingWithdrawal={ this.props.pendingWithdrawal } withdraw={ this.props.withdraw }/>
                </div>
            </div>
        );
    }
};

export default Controls;