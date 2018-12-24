import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './Canvas.scss';

const Canvas = props => {
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
        <canvas id="theCanvas" width="900" height="900" onClick={ props.close }></canvas>
      </div>
    );
};

export default Canvas;
