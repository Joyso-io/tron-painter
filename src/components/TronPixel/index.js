import React from 'react';
import Canvas from 'components/Canvas';

import { Scrollbars } from 'react-custom-scrollbars';

import './TronPixel.scss';

class TronPixel extends React.Component {
    constructor(props) {
        super(props);
        this.draw = this.draw.bind(this);
        this.windowToCanvas = this.windowToCanvas.bind(this);
    }

    componentDidMount() {
        this.draw();
    }

    draw() {
        let theCanvas = document.querySelector('#theCanvas');

        if (!theCanvas || !theCanvas.getContext) {
            return false
        } else {
            let context = theCanvas.getContext('2d')
            let isAllowDrawLine = false
            theCanvas.onmousedown = (e) => {
                isAllowDrawLine = true
                let ele = this.windowToCanvas(theCanvas, e.clientX, e.clientY)
                let { x, y } = ele
                context.moveTo(x, y)
                theCanvas.onmousemove = (e) => {
                    if (isAllowDrawLine) {
                        let ele = this.windowToCanvas(theCanvas, e.clientX, e.clientY)
                        let { x, y } = ele
                        context.lineTo(x, y)
                        context.stroke()
                    }
                }
            }
            theCanvas.onmouseup = function() {
                isAllowDrawLine = false
            }
        }
    };

    windowToCanvas(canvas, x, y) {
        let rect = canvas.getBoundingClientRect()
        return {
            x: x - rect.left * (canvas.width/rect.width),
            y: y - rect.top * (canvas.height/rect.height)
        }
    }


    render() {
        return (
            <div className='landing-wrapper'>
                <Canvas />
            </div>
        );
    };
};

export default TronPixel;
