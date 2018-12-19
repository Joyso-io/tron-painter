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
                    <div className={'color color-'.concat(color[index])}></div>
                    <div className='coordinate'>{ (item < 10) ? ("0" + item) : item }, { (col[index] < 10) ? ("0" + col[index]) : col[index] }</div>
                    <div className='pixel-price'>{ pixelPrices[index] }</div>
                </div>
            );
        });
        const totalPrice = (pixelPrices.length == 0) ? 0 : pixelPrices.reduce((sum, x) => sum + x).toFixed(2);

        return (
            <div id="cart">
                <div className="pixels-information">
                    <div className="pixel-count pixels">
                        <div className="title">
                            Pixel
                        </div>
                        <div className="content">
                            { pixelPrices.length }
                        </div>
                    </div>
                    <div className='total-price pixels'>
                        <div className="title">
                            Tatal(TRX)
                        </div>
                        <div className="content">
                            { totalPrice }
                        </div>
                    </div>
                    <div className='pixel-controls pixels'>
                        <a className='clear' onClick={ this.props.clear }></a>

                        <button className={ 'buy '.concat((col.length == 0) ? 'disable' : '') } onClick={ this.props.buy }>
                            Buy
                        </button>
                    </div>
                </div>

                <div className='pixel-items'>
                    <div className="pixel-title pixels">
                        <div className="title">
                            Pixel
                        </div>
                        <div className="content">
                            Price(TRX)
                        </div>
                    </div>

                    <div className="pixels-content">
                        { pixelItems }
                    </div>
                </div>
            </div>
        );
    }
};

export default Cart;
