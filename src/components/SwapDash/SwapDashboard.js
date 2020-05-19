import React, { Fragment, useState } from 'react';
import Home from '../Home';
import './SwapDashboard.css';
import daiIcon from '../../icons/tokens/DAI.svg';
import batIcon from '../../icons/tokens/BAT.svg';
import mkrIcon from '../../icons/tokens/MKR.svg';
import omgIcon from '../../icons/tokens/OMG.svg';

function SwapDashboard({address, balance, setIsWalletConnected}) {

    const supportedTokens = ['DAI', 'BAT', 'MKR', 'OMG'];
    const tokenIcons = [daiIcon, batIcon, mkrIcon, omgIcon];
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [isSelected, setIsSelected] = useState({DAI:false, BAT:false, MKR:false, OMG:false});
    const [swapAmount, setSwapAmount] = useState(0);

    const tokenStyles = (token) => {
        if(!isSelected[token]) return null;
        return {backgroundColor:'#404448', color:'#fff'};
    }

    const updateSelectedTokens = token => {
        let currentTokens=[...selectedTokens];
        let updatedSelection = {...isSelected};
        const tokenIndex=currentTokens.indexOf(token);
        if(tokenIndex===-1) {
            updatedSelection[token]=true;
            setIsSelected(updatedSelection);
            currentTokens=[...selectedTokens,token];
            setSelectedTokens(currentTokens);
        }
        else {
            updatedSelection[token]=false;
            setIsSelected(updatedSelection);
            currentTokens.splice(tokenIndex,1);
            setSelectedTokens(currentTokens)
        }
    }

    const handleChange = e => { setSwapAmount(e.target.value); console.log(swapAmount);}

    const initiateSwap = () => console.log('Swap Initiated');

    return <Fragment>
                <Home address={address}
                      balance={balance}
                      setIsWalletConnected={setIsWalletConnected}

                />
                <form id="form-div">
                    <label className="form-div-item">From</label>
                    <input className="form-div-item" 
                           type="number" 
                           onChange={handleChange}
                           value={swapAmount}
                           required  
                           autoFocus
                    /> 
                    <span className="form-div-item">ETH</span>
                    <button id="swap-btn" onClick={initiateSwap}>Swap</button>
                    
                </form>
                <div id="select-tokens">Select Tokens</div>
                <div id="supported-tokens">
                    
                    {supportedTokens.map((token, index) => 
                        <div className="token" 
                             key={index}
                             style={tokenStyles(token)}
                             onClick={() => updateSelectedTokens(token)}
                        >
                            <img class="token-img" src={tokenIcons[index]} alt={token} />
                            <span>{token}</span>
                        </div>
                    )}
                </div>
                <table class="pure-table">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Percentage ETH Swapped</th>
                            <th>Swapped ETH</th>
                            <th>Swapped USD</th>
                            <th>Quantity Acquired</th>

                        </tr>
                    </thead>
                    <tbody>
                        {selectedTokens.map( token => {
                            return <tr class="pure-table-odd">
                                        <td>{token}</td>
                                        <td>10%</td>
                                        <td>20 ETH</td>
                                        <td>$100</td>
                                        <td>100</td>
                                    </tr>
                        })}
                        
                    </tbody>
                </table>
           </Fragment>
}

export default SwapDashboard;