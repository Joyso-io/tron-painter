import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './Canvas.scss';

const Canvas = props => {
    return (
        <canvas id="theCanvas" width="900" height="900" onClick={ props.close }></canvas>
    );
};

export default Canvas;
