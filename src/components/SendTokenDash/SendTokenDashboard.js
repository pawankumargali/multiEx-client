import React, { Fragment, useState } from 'react';
import {initWeb3, initContract} from '../../contractInterfaces/init';
import {uniswap} from '../../contractInterfaces/uniswap';
import NavBar from '../core/Navbar/NavBar';
import {userWallet} from '../../contractInterfaces/userWallet';
import Footer from '../core/Footer/Footer';
import { toast } from 'react-toastify';
import {TxInitiatedToast, TxSentToast, TxSuccessToast, TxFailedToast} from '../core/CustomToasts/CustomToasts';
import 'react-toastify/dist/ReactToastify.css';
import './SendTokenDashboard.css';
import { getUniswapSwapHash, getMultisenderHash } from '../../contractInterfaces/functionHashes';

toast.configure();


function SwapDashboard({web3, tokenAddresses, address, setAddress, balances, setBalances, metamaskAdd, setMetamaskAdd, metamaskBal, setMetamaskBal, isWalletConnected, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract, setPersonalWalletAddress}) {

    const [fromAmount, setFromAmount] = useState(0);
    const [toAmountsArray, setToAmountsArray] = useState([{id:'toAmtDefault',token:"ETH", ethAmt:0, receiverAddress:"", tokenAllocation:0}]);
    const toAmountObj = {id:'', token:"ETH", ethAmt:0, receiverAddress:"", tokenAllocation:0};
    const [currentAmtObjIdNum, setCurrentAmtObjIdNum] = useState(0);
    const [walletNotConnectedError, setWalletNotConnectedError] = useState(false);
    const [amtLimtExceedError, setAmtLimitExceedError] = useState(false);
    const [receiverAddressEmptyError, setReceiverAddressEmptyError] = useState(false);
    const [outputAmt, setOutputAmt] = useState(0);
    const uniswapTokenAddresses = {'ETH':'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE','DAI':'0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', 'USDC':'0x75B0622Cec14130172EaE9Cf166B92E5C112FaFF', 'MKR':'0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD'};
    const multiTokenAddress='0xcb9C3BC7fc71F72E67b985ca7752291E1beaC3D6';

    const handleFromAmtChange = e => setFromAmount(e.target.value);


    const _getTotalOutputAmt = (outputAmtArray) => {
        let totalOutputAmt=0;
        for(const amtObj of outputAmtArray) {
            totalOutputAmt+=Number(amtObj.ethAmt);
        }
        return totalOutputAmt;
    }

    const _isReceiverAddressEmpty = (outputAmtArray) => {
        for(const amtObj of outputAmtArray) {
            if(!amtObj.receiverAddress)
                return true;
        }
        return false;
    }
    const handleTokenSelect = async (e, toAmount, index) =>{
        const toAmtObj = toAmount;
        toAmtObj.token=e.target.value;
        if(toAmtObj.token==='ETH') {
            toAmtObj.tokenAllocation=0;
        }
        else {
            if(web3) {
                const uniswapContract = initContract(web3, uniswap.contract.abi, uniswap.contract.address);
                const tokenExValue = await uniswapContract.methods.getAmount(["0xd0A1E359811322d97991E03f863a0C30C2cF029C", uniswapTokenAddresses[toAmtObj.token] ], (Number(toAmtObj.ethAmt)*Math.pow(10,18)).toString()).call()
                const divFactor = toAmtObj.token==='USDC' ? Math.pow(10,6) : Math.pow(10,18);
                toAmtObj.tokenAllocation = Number(tokenExValue[1])/divFactor;
            }
        }
        const currentToAmountsArray=[...toAmountsArray];
        currentToAmountsArray[index]=toAmtObj;
        setToAmountsArray(currentToAmountsArray);
        // console.log(currentToAmountsArray);
    }
    
    const handletoAmountChange = async (e, toAmount, index) => {
        setAmtLimitExceedError(false);
        const toAmtObj=toAmount;
        toAmtObj.ethAmt=e.target.value;
        // console.log(toAmtObj.token);
       
        if(toAmtObj.token==='ETH') {
            toAmtObj.tokenAllocation=0;
        }
        else {
            if(web3) {
                const uniswapContract = initContract(web3, uniswap.contract.abi, uniswap.contract.address);
                const tokenExValue = await uniswapContract.methods.getAmount(["0xd0A1E359811322d97991E03f863a0C30C2cF029C", uniswapTokenAddresses[toAmtObj.token] ], (Number(toAmtObj.ethAmt)*Math.pow(10,18)).toString()).call()
                const divFactor = toAmtObj.token==='USDC' ? Math.pow(10,6) : Math.pow(10,18);
                toAmtObj.tokenAllocation = Number(tokenExValue[1])/divFactor;
            }
        }
        const currentToAmountsArray=[...toAmountsArray];
        currentToAmountsArray[index]=toAmtObj;
        setToAmountsArray(currentToAmountsArray);
        const totalOutputAmt=_getTotalOutputAmt(currentToAmountsArray);
        setOutputAmt(totalOutputAmt);
        if(totalOutputAmt>Number(fromAmount)){
            setAmtLimitExceedError('Total amount can\'t be greater than input amount');
        }
    }

    const handleToAddressChange = (e, toAmount, index) => {
        const toAmtObj = toAmount;
        toAmtObj.receiverAddress=e.target.value;
        const currentToAmountsArray=[...toAmountsArray];
        currentToAmountsArray[index]=toAmtObj;
        setToAmountsArray(currentToAmountsArray);
        // console.log(currentToAmountsArray);
    }

    const addTransactionRow = () => {
        const currentToAmtsArray = [...toAmountsArray];
        const addObj = toAmountObj;
        setCurrentAmtObjIdNum(currentAmtObjIdNum+1);
        addObj.id='toAmt'+currentAmtObjIdNum;
        currentToAmtsArray.push(toAmountObj);
        setToAmountsArray(currentToAmtsArray);
    };  
    
    const deleteTransactionRow = amtObjId => {
        let currentToAmountsArray = [...toAmountsArray];
        if(currentToAmountsArray.length!==1) {
            currentToAmountsArray = currentToAmountsArray.filter(amtObj => amtObj.id!==amtObjId);
            setToAmountsArray(currentToAmountsArray);
        }
    }

    const initiateSend = async () => {
        try {
            setWalletNotConnectedError(false);
            setAmtLimitExceedError(false);
            setReceiverAddressEmptyError(false);
            const metamaskAcc = window.ethereum.selectedAddress;
                const web3 = await initWeb3();
            const weiBalance = await web3.eth.getBalance(metamaskAcc);
            const accBalance = web3.utils.fromWei(weiBalance,'ether');
            if(Number(fromAmount) > accBalance) {
                return setAmtLimitExceedError('Insufficient Funds. Account balance less than send amount')
            }
            if(outputAmt>Number(fromAmount)) {
                return setAmtLimitExceedError('Total amount to be sent canno\'t be greater than input amount');
            }
            const isReceiverAddressEmpty=_isReceiverAddressEmpty(toAmountsArray);
            if(isReceiverAddressEmpty) {
                return setReceiverAddressEmptyError('Receiver address cannot be empty');
            }
            const sendAmounts=[];
            for(const amtObj of toAmountsArray) {
                if(Number(amtObj.ethAmt)!==0) 
                        sendAmounts.push(amtObj);
            }
            const wallet = new web3.eth.Contract(userWallet.contract.abi, address);
            const poolAddressArray=[];
            const functionHashArray=[];
            for(const amtObj of sendAmounts) {
                if(amtObj.token!=='ETH') {
                    const swapValue= Number(amtObj.ethAmt)*Math.pow(10,18);
                    const toToken = amtObj.token;
                    const swapFuncHash = getUniswapSwapHash(web3, swapValue, uniswapTokenAddresses[toToken]);
                    poolAddressArray.push(uniswap.contract.address);
                    functionHashArray.push(swapFuncHash);
                    }
            }
                const tokenAddressArray=[];
                const receiverAddressArray=[];
                const tokenAmtArray=[];
            for(const amtObj of sendAmounts) { 
                    tokenAddressArray.push(uniswapTokenAddresses[amtObj.token]);
                    receiverAddressArray.push(amtObj.receiverAddress);
                    const multiFactor = amtObj.token==='USDC' ? Math.pow(10,6) : Math.pow(10,18);
                    const tokenAmt = amtObj.token==='ETH' ? Number(amtObj.ethAmt)*multiFactor :Number(amtObj.tokenAllocation)*multiFactor;
                    tokenAmtArray.push(tokenAmt.toString());
            }
                poolAddressArray.push(multiTokenAddress);
                // console.log(tokenAddressArray, receiverAddressArray, tokenAmtArray);
                const multisenderFuncHash = getMultisenderHash(web3, tokenAddressArray, receiverAddressArray, tokenAmtArray);
                functionHashArray.push(multisenderFuncHash);
                // console.log(poolAddressArray);
                // console.log(functionHashArray);       
                const result =  wallet.methods.execute([...poolAddressArray], [...functionHashArray]).send({ from: window.ethereum.selectedAddress, value: Number(fromAmount)*Math.pow(10,18).toString() });
                toast(<TxInitiatedToast />);
                let txHash;
                result.on("transactionHash", (hash) => {
                    txHash=hash;
                    toast(<TxSentToast txHash={txHash} />)
                }).once("confirmation", (confirmationNumber, receipt) => {
                    if (receipt.status) {
                        toast(<TxSuccessToast txHash={txHash}/>);
                    } else {
                        toast(<TxFailedToast txHash={txHash}/>);
                    }
                    // console.log(receipt);
                });
        }
        catch(err) {
            setWalletNotConnectedError('Please connect wallet to initiate Transaction');
            console.log(err);
        }
    }

    return <Fragment>
                <NavBar isWalletConnected={isWalletConnected}
                        setIsWalletConnected={setIsWalletConnected}
                        isRegistered={isRegistered}
                        setIsRegistered={setIsRegistered}
                        registryContract={registryContract}
                        setRegistryContract={setRegistryContract}
                        setAddress={setAddress}
                        setBalances={setBalances}   
                        tokenAddresses={tokenAddresses}
                        setMetamaskAdd={setMetamaskAdd}
                        setMetamaskBal={setMetamaskBal}                 
                />
                <div className="info-item-div">
                    <h3 className="title">Wallet</h3>
                    <p className="content">{metamaskAdd ? metamaskAdd : <span style={{color:'red'}}>Wallet not connected</span>}</p>
                    <p className="content">{metamaskBal ? Math.round(metamaskBal*10000)/10000+' ETH' : ""}</p>
                </div>

                <div id="choose-allocations">Send Amount</div> 
                <form id="form-div-parcel">
                    <input className="form-div-item" 
                           type="number" 
                           min={0}
                           onChange={handleFromAmtChange}
                           value={fromAmount}
                           required  
                           autoFocus
                    /> 
                    <span className="form-div-item-parcel">ETH</span>
                </form>
                {toAmountsArray.length!==0 && 
                <table id="token-table-parcel">
                    <thead>
                        <tr className="token-table-header">
                            <th style={{backgroundColor:'#F0F5F9'}}></th>
                            <th>ETH / Token</th>
                            <th>Send Amount in ETH</th>
                            <th>Tokens Sent</th>
                            <th>Receiver Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {toAmountsArray.map((toAmount, index) =>  
                            <tr key={toAmount.id} >
                                <td>
                                    <button id="delete-row-btn-parcel" onClick={() => deleteTransactionRow(toAmount.id)}>x</button>
                                </td>
                                <td>
                                <select name="token"
                                        onChange={e => handleTokenSelect(e, toAmount, index)}
                                >
                                    <option value="ETH">ETH</option>
                                    <option value="DAI">DAI</option>
                                    <option value="MKR">MKR</option>
                                    <option value="USDC">USDC</option>
                                </select>
                                </td>
                                <td>
                                    <input type="number" 
                                            className="user-input-cell"
                                            min={0}
                                            onChange={e => handletoAmountChange(e, toAmount, index)}
                                    />
                                </td>
                                <td>{toAmount.tokenAllocation}</td>
                                <td>
                                    <input type="text"
                                           style={{width:'350px'}}
                                        className="user-input-cell" 
                                        onChange={e => handleToAddressChange(e, toAmount, index)}
                                    />
                                </td>
                            </tr>
                        )}
                        <tr className="token-table-header">
                        <td style={{backgroundColor:'#F0F5F9'}}>
                            <button id="add-row-btn-parcel" onClick={addTransactionRow}>+</button>
                        </td>
                            <td>Total Amount</td>
                            <td style={outputAmt > Number(fromAmount) ? {color:'red'}: {}}
                                colSpan="4"
                            >
                                {outputAmt}
                            </td>
                        </tr>
                        {walletNotConnectedError && 
                            <tr>
                                <td colSpan="5" style={{color:'red'}}>{walletNotConnectedError}</td>
                            </tr>
                        }
                        {amtLimtExceedError && 
                            <tr>
                                <td colSpan="5" style={{color:'red'}}>{amtLimtExceedError}</td>
                            </tr>
                        }
                        {receiverAddressEmptyError && 
                            <tr>
                                <td colSpan="5" style={{color:'red'}}>{receiverAddressEmptyError}</td>
                            </tr>
                        }
                    </tbody>
                </table>
                }
                {toAmountsArray.length!==0 && 
                    <div style={{textAlign:'center'}}>
                        <button id="send-amt-btn" style={{marginBottom:'20px'}} onClick={initiateSend}>Parcel</button>
                        
                    </div>
                }
                <Footer style={toAmountsArray.length<=1 ? {position:'fixed', bottom:'0'}: {}} />
           </Fragment>
}

export default SwapDashboard;