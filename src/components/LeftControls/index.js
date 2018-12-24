import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './LeftControls.scss';

class LeftControls extends React.Component {
    constructor(props) {
        super(props);
        this.selectColor = this.selectColor.bind(this);
        this.download = this.download.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    selectColor(e) {
        let element = e.target;
        let color = element.getAttribute('color');
        this.props.drawColor();
        this.props.updateColor(color);
        this.props.close();
    }

    download() {
        this.props.close();
        const canvas = document.getElementById('theCanvas');
        const context = canvas.getContext('2d');
        const url = canvas.toDataURL();
        const snapshot = document.querySelector('.snapshot');
        snapshot.href = url;
    }

    clearAll() {
        this.props.close();
        this.props.clear();
    }

    render() {
        const colorItems = Object.entries(this.props.colors).map(([key,value])=>{
            const className = 'color color-' + key;
            return (
                <li key={ key } className={ className } color={ value } onClick={ (e) => this.selectColor(e) } ></li>
            );
        })
        const save_url = this.save;

        return (
            <div className="controls">
                <div className="tools">
                    <a className="colors" onClick={ this.props.toggle } >
                    </a>

                    <a className="eraser" onClick={ this.props.erase } >
                    </a>

                    <a className="previous" onClick={ this.props.previous } >
                    </a>

                    <a className="move" onClick={ this.props.moveCanvas } >
                    </a>

                    <a className="snapshot" href="#" download="PixelPainter.png" onClick={ this.download } >
                    </a>

                    <a className="trash" onClick={ this.clearAll }>
                    </a>

                    <ul id="colors">
                        { colorItems }
                    </ul>
                </div>
            </div>
        );
    }
};

export default LeftControls;
