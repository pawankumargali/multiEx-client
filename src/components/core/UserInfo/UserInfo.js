import React from 'react';
import './UserInfo.css';

function UserInfo({address, balance}) {

    return <div id="user-container">
                <div id="wallet-div">
                    <h3 className="title">Wallet</h3>
                    <p class="content">{address}</p>
                    <p class="content">{Math.round(balance*10000)/10000} ETH</p>
                </div>
                <div id="swappings-div">
                    <h3 className="title">Total Swapped</h3>
                    <p className="content">20,000 ETH</p>
                    <p className="content">$100,000</p>
                </div>
                <div id="savings-div">
                    <h3 className="title">Total Gas Saved</h3>
                    <p className="content">2 ETH</p>
                    <p className="content">$10</p>
                </div>
           </div>;
}

export default UserInfo;