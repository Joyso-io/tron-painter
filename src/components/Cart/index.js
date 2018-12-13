import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './Cart.scss';

class Cart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let col = this.props.col;
        let color = this.props.color;
        let pixelPrices = this.props.pixelPrices;
        const pixelItems = this.props.row.map(function(item, index, array){
            return (
                <div className='pixel' key={ index }> 
                    <span className='coordinate'>{ item }, { col[index] }</span>
                    <span className={'color color-'.concat(color[index])}></span>
                    <span className='float-right'>{ pixelPrices[index] } Trx</span>
                </div>
            );
        });
        const totalPrice = (pixelPrices.length == 0) ? 0 : pixelPrices.reduce((sum, x) => sum + x).toFixed(2);

        return (
            <div id="cart">
                <div className="title">
                    購買明細
                </div>
                <div className='totalPrice'>{ totalPrice } Trx</div>
                <button className={ 'buy-button '.concat((col.length == 0) ? 'disable' : '') } onClick={ this.props.buy }>
                    buy
                </button>

                <button className='clear' onClick={ this.props.clear }>
                    clear
                </button>
                <div className='pixelItems'>
                    { pixelItems }
                </div>
            </div>
        );
    }
};

export default Cart;
