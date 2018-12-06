import React from 'react';
import TronPixel from 'components/TronPixel'
import Utils from 'utils';
import Swal from 'sweetalert2';
// import banner from 'assets/banner.png';

import './App.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <TronPixel />
            </div>
        );
    }
}

export default App;
