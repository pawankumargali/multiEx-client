import React from 'react';
import './UserInfo.css';

function UserInfo({address, balance}) {

    console.log(address, balance);
    return <div id="user-container">
                <div id="wallet-div">
                    <h3 className="title">Wallet</h3>
                    {/* <p class="content">0xEeAe948cdf2282C390E723025b89C0F6Baf926a0</p> */}
                    <p class="content">{address}</p>
                    {/* <p class="content">300ETH</p> */}
                    <p class="content">{balance} ETH</p>
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