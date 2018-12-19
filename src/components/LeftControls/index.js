import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './LeftControls.scss';

class LeftControls extends React.Component {
    state = {
       colorsActive: false
    }

    constructor(props) {
        super(props);
        this.showColors = this.showColors.bind(this);
        this.selectColor = this.selectColor.bind(this);
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
                    <a className="colors-btn" onClick={this.showColors}>
                    </a>

                    <a className="eraser-btn">
                    </a>

                    <a className="return-btn">
                    </a>

                    <a className="move-btn">
                    </a>

                    <a className="snapshot-btn">
                    </a>

                    <a className="trash-btn" onClick={ this.props.clear }>
                    </a>

                    <ul className={btn_class}>
                        { colorItems }
                    </ul>
                </div>
            </div>
        );
    }
};

export default LeftControls;
