import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './LeftControls.scss';

class LeftControls extends React.Component {
    state = {
       colorsActive: false,
       canvas: null
    }

    constructor(props) {
        super(props);
        this.showColors = this.showColors.bind(this);
        this.selectColor = this.selectColor.bind(this);
        this.download = this.download.bind(this);
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

    download() {
        const canvas = document.getElementById('theCanvas');
        const context = canvas.getContext('2d');
        const url = canvas.toDataURL();
        const snapshot = document.querySelector('.snapshot');
        snapshot.href = url;
    }

    render() {
        const colorItems = Object.entries(this.props.colors).map(([key,value])=>{
            const className = 'color color-' + key;
            return (
                <li key={ key } className={ className } color={ value } onClick={ (e) => this.selectColor(e) } ></li>
            );
        })
        const save_url = this.save;
        let btn_class = this.state.colorsActive ? "active" : "";

        return (
            <div className="controls">
                <div className="tools">
                    <a className="colors" onClick={ this.showColors }>
                    </a>

                    <a className="eraser">
                    </a>

                    <a className="previous" onClick={ this.props.previous } >
                    </a>

                    <a className="move">
                    </a>

                    <a className="snapshot" href="#" download="PixelPainter.png" onClick={ this.download } >
                    </a>

                    <a className="trash" onClick={ this.props.clear }>
                    </a>

                    <ul id="colors" className={btn_class}>
                        { colorItems }
                    </ul>
                </div>
            </div>
        );
    }
};

export default LeftControls;
