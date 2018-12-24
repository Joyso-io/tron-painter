import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './Canvas.scss';

const Canvas = props => {
    let canvasClass = null;
    if(props.canvasStatus === 0) {
        canvasClass = "eraser"
    } else if (props.canvasStatus === 1) {
        canvasClass = "pencil"
    } else if (props.canvasStatus === 2) {
        canvasClass = "move"
    }

    return (
      <div className="canvas-container">
        <div className="up-down">
          <a className="up" onClick={ props.up } >
            <div className="layer1"></div>
            <div className="layer2"></div>
          </a>
          <a className="down" onClick={ props.down } >
            <div className="layer1"></div>
          </a>
        </div>
        <canvas id="theCanvas" className={ canvasClass } width="900" height="900" onClick={ props.close }></canvas>
      </div>
    );
};

export default Canvas;
