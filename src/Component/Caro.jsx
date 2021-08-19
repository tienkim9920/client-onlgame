import React from 'react';
import './Caro.css'

function Caro(props) {
    return (
        <div className="layout-section-caro container">
            <div className="wrapper-caro">
                <div className="group-caro-board">
                    <div className="board" id="board">
                        <div className="cell" data-cell></div>
                        <div className="cell" data-cell></div>
                        <div className="cell" data-cell></div>
                        <div className="cell" data-cell></div>
                        <div className="cell" data-cell></div>
                        <div className="cell" data-cell></div>
                        <div className="cell" data-cell></div>
                        <div className="cell" data-cell></div>
                        <div className="cell" data-cell></div>
                    </div>
                    <div className="winning-message" id="winningMessage">
                        <div data-winning-message-text></div>
                        <button id="restartButton">Restart</button>
                    </div>
                </div>
                <div className="group-caro-user">

                </div>
            </div>
        </div>

    );
}

export default Caro;