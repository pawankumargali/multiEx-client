import React, { Fragment, useState } from 'react';
import NavBar from '../core/Navbar/NavBar';
import UserInfo from '../core/UserInfo/UserInfo';
import './SwapDashboard.css';
import daiIcon from '../../icons/tokens/DAI.svg';
import batIcon from '../../icons/tokens/BAT.svg';
import mkrIcon from '../../icons/tokens/MKR.svg';
import omgIcon from '../../icons/tokens/OMG.svg';


function SwapDashboard({web3, address, balance, isWalletConnected, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract, setPersonalWalletAddress}) {

    const tokenStyles = token => {
        if(!isSelected[token]) return null;
        return {backgroundColor:'#404448', color:'#fff'};
    }

    const totalToAmtStyle = percentageTotal => {
        if(percentageTotal>100) return {color:'red'};
        return null;
    }

/*
Supported Tokens => array : used for token filters
token Icons => map : used for token img
selectedTokens => array: used to store selected tokens for swapping
isSelected => used to check if token is selected and render styles accordingly
fromAmount => amount entered by user for swapping
toAmounts => object: each elt is token and array pair where array = [percentageSelected, amountSelected] for swapping for the particular token
totalToAmounts => array: [totalPercentage, totalAmount] => used to check if output amt exceeds input amount
*/
    const supportedTokens = ['DAI', 'BAT', 'MKR', 'OMG'];
    const tokenIcons = {'DAI':daiIcon, 'BAT':batIcon, 'MKR':mkrIcon, 'OMG':omgIcon};
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [isSelected, setIsSelected] = useState({DAI:false, BAT:false, MKR:false, OMG:false});
    const [fromAmount, setFromAmount] = useState(0);
    const [insufficientFundsError, setInsufficientFundsError] = useState(false);
    const[toAmtLimitExceedError, setToAmtLimitExceedError] = useState(false);
    const [toAmounts, setToAmounts] = useState({
        'DAI':[0,0],
        'BAT':[0,0],
        'MKR':[0,0],
        'OMG':[0,0]  
    });
    const [totalToAmounts, setTotalToAmounts]=useState([0,0]);

   

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

    const getTotalToAmtChange = (currentToAmts) => {
        let sumPercentages=0;
        let sumAmts=0;
        for(const token in currentToAmts) {
            const [percent, amt] = currentToAmts[token];
            sumPercentages+=Number(percent);
            sumAmts+=amt;
        }
        return [sumPercentages, sumAmts];
    };

    const handleFromAmtChange = e => setFromAmount(e.target.value);
    
    const handlePercentSelect = (e, token) => {
        const percentage = Number(e.target.value);
        const amtinETH = Math.round(((percentage*fromAmount)/100)*10000)/10000;
        const currentAmts = {...toAmounts};
        currentAmts[token]=[percentage, amtinETH];
        setToAmounts(currentAmts);
        const updatedTotalToAmts = getTotalToAmtChange(currentAmts);
        setTotalToAmounts(updatedTotalToAmts);
        if(totalToAmounts[0] > 100) {
            setToAmtLimitExceedError("Error: Limit Exceeded. Amount required for swap is greater than amount entered")
        }
        else {
            setToAmtLimitExceedError(false);
        }
    }

    const handleAmountSelect = (e, token) => {
        const amtinETH = Number(e.target.value);
        const percentage = (amtinETH/Number(fromAmount))*100;
        const currentAmts = {...toAmounts};
        currentAmts[token]=[percentage, amtinETH];
        setToAmounts(currentAmts);
        const updatedTotalToAmts = getTotalToAmtChange(currentAmts);
        setTotalToAmounts(updatedTotalToAmts);
    }

    const initiateSwap = e => { 
        e.preventDefault();
        setInsufficientFundsError(false);
        setToAmtLimitExceedError(false);
        if((Number(fromAmount) < Number(balance)) && (Number(fromAmount)!==0) && (Number(totalToAmounts[0]<100))) {
            console.log('Bal:'+balance);
            console.log('SwapAmt:'+fromAmount);
            console.log('Swap Initiated');
        }
        else {
            if(Number(fromAmount)>Number(balance)) 
                setInsufficientFundsError("Error: Funds Insufficient Amount greater than wallet balance");
            else if(totalToAmounts[0]>100) 
                setToAmtLimitExceedError("Error: Limit Exceeded. Amount required for swap is greater than amount entered")
            else if(Number(fromAmount)===0) 
                setInsufficientFundsError("Error: From Amount cannot be zero");    
        }
    }

    return <Fragment>
                <NavBar isWalletConnected={isWalletConnected}
                        setIsWalletConnected={setIsWalletConnected} 
                        isRegistered={isRegistered}
                        setIsRegistered={setIsRegistered}
                        web3={web3}
                        registryContract={registryContract}
                        setRegistryContract={setRegistryContract}
                        setPersonalWalletAddress={setPersonalWalletAddress}
                />
                <UserInfo address={address} balance={balance} />
                <form id="form-div">
                    <label className="form-div-item">From</label>
                    <input className="form-div-item" 
                           type="number" 
                           min={0}
                           onChange={handleFromAmtChange}
                           value={fromAmount}
                           required  
                           autoFocus
                    /> 
                    <span className="form-div-item">ETH</span>
                    {selectedTokens.length===0 && <button id="swap-btn" onClick={initiateSwap}>Swap</button>}
                    {insufficientFundsError && <div className="error-div">{insufficientFundsError}</div>}
                </form>
                <div id="select-tokens">Select Tokens</div>
                <div id="supported-tokens">
                    
                    {supportedTokens.map((token, index) => 
                        <div className="token" 
                             key={index}
                             style={tokenStyles(token)}
                             onClick={() => updateSelectedTokens(token)}
                        >
                            <img className="token-img" src={tokenIcons[token]} alt={token} />
                            <span>{token}</span>
                        </div>
                    )}
                </div>
                {selectedTokens.length!==0 &&
                <table id="token-table">
                    <thead>
                        <tr id="token-table-header">
                            <th>Token</th>
                            <th>Percentage to Swap</th>
                            <th>ETH to be Swapped</th>
                            <th>Tokens per ETH</th>
                            <th>Quantity Acquired</th>

                        </tr>
                    </thead>
                    <tbody>
                        {selectedTokens.map( (token, index) => {
                            return <tr key={index} className="token-table-row">
                                        <td className="token-cell">
                                            <img className="token-img" src={tokenIcons[token]} alt={token} />
                                            {token}
                                        </td>
                                        <td className="range-cell">
                                            <input  type="range" value={toAmounts[token][0]}
                                                    min="0" max="100"
                                                    onChange={e => handlePercentSelect(e, token)}
                                            />
                                            <label>{Math.round(toAmounts[token][0]*100)/100}</label>
                                        </td>
                                        <td className="number-cell">
                                            <input type="number"
                                                   min={0} 
                                                   value={toAmounts[token][1]===0 ? null:toAmounts[token][1]}
                                                   onChange={e => handleAmountSelect(e, token)}
                                            />
                                        </td>
                                        <td>20</td>
                                        <td>300</td>
                                    </tr>
                        })}
                        <tr id="token-table-header">
                            <th>Total</th>
                            <th style={totalToAmtStyle(totalToAmounts[0])}>
                                {Math.round(totalToAmounts[0]*100)/100}
                            </th>
                            <th style={totalToAmtStyle(totalToAmounts[0])}>
                                {Math.round(totalToAmounts[1]*100)/100}
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr style={{backgroundColor:'#F6F9FC'}}>
                            <td align="center" colspan="5">
                                {toAmtLimitExceedError && 
                                <div className="error-div" >
                                    {toAmtLimitExceedError}
                                </div>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                }
                {selectedTokens.length!==0 && <div style={{textAlign:'center', marginBottom:'50px'}}>
                    <button id="swap-btn" onClick={initiateSwap}>Swap</button>
                </div>}
           </Fragment>
}

export default SwapDashboard;