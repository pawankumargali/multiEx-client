import React, { useState, Fragment } from 'react';
import NavBar from '../core/Navbar/NavBar';
import UserInfo from '../core/UserInfo/UserInfo';
import Footer from '../core/Footer/Footer';
import { userWallet } from '../../contractInterfaces/userWallet';
import './TransactionDashboard.css';
import compoundIcon from '../../icons/pools/compound.png';
import aaveIcon from '../../icons/pools/aave.png';
import uniswapIcon from '../../icons/pools/uniswap.png';
// Material-UI switch imports
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import {getDepositHashCompoundAave, getDepositAndBorrowCompoundHash, getDepositAndStreamAaveHash, getUniswapSwapHash} from '../../contractInterfaces/functionHashes';

function TransactionDashboard({web3, address, balance, isWalletConnected, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract, personalWalletAddress, setPersonalWalletAddress}) {
    
  const poolStyles = pool => {
        if(!isSelected[pool]) return null;
        return {backgroundColor:'#6A5ACD'};
    }

    const supportedPools = ['compound', 'aave', 'uniswap'];
    const poolIcons = {'compound':compoundIcon, 'aave':aaveIcon, 'uniswap':uniswapIcon };
    const [selectedPools, setSelectedPools] = useState([]);
    const [isSelected, setIsSelected] = useState({compound:false, aave:false, uniswap:false});
    const [isPoolTransactSelected, setIsPoolTransactSelected] = useState({
        'compound': { lend:false, borrow:false },
        'aave': {lend: false, borrow:false},
        'uniswap': {lend:false, borrow:false}

    });
    const [lendAmts, setLendAmts] = useState({'compound':0, 'aave':0, 'uniswap':0});
    const [borrowAmts, setBorrowAmts] = useState({'compound':0, 'aave':0, 'uniswap':0});
    const poolAddresses = {'compound':'0x533dfFF0908196568d22806230f85de0ae576dCE' ,'aave':'0x8cFc0fcD556882bbD5e4f1257BB8dfF862219ad1', 'uniswap':'0xCC2f880f977d96b7DE75aD64Fc25696cC5b549d0'};
    const [savedTransactions, setSavedTransactions]=useState(0);
    const [lendError, setLendError]=useState(false); 
    const [borrowError, setBorrowError] = useState(false);
    const [walletError, setWalletError] = useState(false);

    const updateSelectedPools = pool => {
        let currentPools=[...selectedPools];
        let updatedSelection = {...isSelected};
        const poolIndex=currentPools.indexOf(pool);
        if(poolIndex===-1) {
            updatedSelection[pool]=true;
            setIsSelected(updatedSelection);
            currentPools=[...selectedPools,pool];
            setSelectedPools(currentPools);
            const currentPoolTransactSelection = {...isPoolTransactSelected};
            currentPoolTransactSelection[pool].lend=false;
            currentPoolTransactSelection[pool].borrow=false;
            setIsPoolTransactSelected(currentPoolTransactSelection);
        }
        else {
            updatedSelection[pool]=false;
            setIsSelected(updatedSelection);
            currentPools.splice(poolIndex,1);
            setSelectedPools(currentPools);
        }
    }

    const handleIsPoolTransactSelected = (e, pool) => {
        const currentPoolTransactSelection = {...isPoolTransactSelected};
        if(e.target.name==='lend') {
            currentPoolTransactSelection[pool].lend=e.target.checked;
        }
        else {
            currentPoolTransactSelection[pool].borrow=e.target.checked;
        }
        setIsPoolTransactSelected(currentPoolTransactSelection);
    };

    const handleLendAmtChange = (e, pool) => {
        const currentLendAmts = {...lendAmts};
        currentLendAmts[pool]=e.target.value;
        setLendAmts(currentLendAmts);
    } 
    const handleBorrowAmtChange = (e, pool) => {
        const currentBorrowAmts = {...borrowAmts};
        currentBorrowAmts[pool]=e.target.value;
        setBorrowAmts(currentBorrowAmts);
    }

    const initiateTransaction = async () => {
        
        if(!personalWalletAddress) 
            return setWalletError("Error: Please connect to portal wallet to initiate any transaction");
        const wallet = new web3.eth.Contract(userWallet.contract.abi, personalWalletAddress);
        let transactionCount=0;
        let totalLendAmt=0;
        // let totalBorrowAmt=Number(borrowAmts['compound']);
        console.log('triggered 1');
        // if(totalBorrowAmt>0) {
        //     transactionCount++;

        // }
        for(const pool in lendAmts) {
            if(lendAmts[pool]>0) {
                totalLendAmt+=Number(lendAmts[pool]);
                transactionCount++;
            }
        }
        console.log('triggered 2');

        setSavedTransactions(transactionCount-1);
        console.log(isPoolTransactSelected);
        console.log(totalLendAmt);
        // console.log(totalBorrowAmt);
        console.log(balance);
        if(totalLendAmt>Number(balance)) 
        {
            console.log('Trig 11');
            return setLendError("Error : Lend Amount greater than wallet balance");
        }
            
        if(totalLendAmt<=0) {
            console.log('Trig 22');
            return setLendError("Error: Lend amount cannot be zero");
        }
        // if(totalBorrowAmt<=0) {
        //     console.log('Trig33');
        //     return setBorrowError("Error: Borrow amount cannot be zero");
        // }
            
        console.log('triggered 3');

        const poolAddressArray=[];
        const depositHashArray=[];

        // COMPOUND LEND AND BORROW
        if(isPoolTransactSelected['compound'].lend===true && isPoolTransactSelected['compound'].borrow===true) {
            if(poolAddressArray.indexOf(poolAddresses['compound'])===-1)     
                poolAddressArray.push(poolAddresses['compound']);
            const lendValue = Number(lendAmts['compound'])*Math.pow(10,18);
            const borrowValue = Number(borrowAmts['compound'])*Math.pow(10,18);
            const depositAndBorrowHash = getDepositAndBorrowCompoundHash(web3, lendValue, borrowValue);
            depositHashArray.push(depositAndBorrowHash);
            console.log('1: '+depositHashArray);

        }
        console.log('triggered 4');


        // COMPOUND ONLY LEND 
        if(isPoolTransactSelected['compound'].lend===true  && isPoolTransactSelected['compound'].borrow===false) {
            if(poolAddressArray.indexOf(poolAddresses['compound'])===-1) 
                poolAddressArray.push(poolAddresses['compound']);
            const lendValue = Number(lendAmts['compound'])*Math.pow(10,18);
            const depositHash = getDepositHashCompoundAave(web3, lendValue);
            depositHashArray.push(depositHash);
            // console.log('2: '+depositHashArray);
        }

        // AAVE LEND AND STREAM
        if(isPoolTransactSelected['aave'].lend===true && isPoolTransactSelected['aave'].borrow===true) {
            if(poolAddressArray.indexOf(poolAddresses['aave'])===-1)
                poolAddressArray.push(poolAddresses['aave']);
            const lendValue = Number(lendAmts['aave'])*Math.pow(10,18);
            console.log(lendValue);
            const streamAddress= borrowAmts['aave'];
            console.log(streamAddress);
            const depositAndStreamHash = getDepositAndStreamAaveHash(web3, lendValue, streamAddress);
            console.log(depositAndStreamHash);
            depositHashArray.push(depositAndStreamHash);
        }

        // AAVE ONLY LEND
        if(isPoolTransactSelected['aave'].lend===true && isPoolTransactSelected['aave'].borrow===false) {
            if(poolAddressArray.indexOf(poolAddresses['aave'])===-1) 
                poolAddressArray.push(poolAddresses['aave']);
            const lendValue = Number(lendAmts['aave'])*Math.pow(10,18);
            const depositHash = getDepositHashCompoundAave(web3, lendValue);
            depositHashArray.push(depositHash);
            // console.log('3: '+depositHashArray);

        }

        if(isPoolTransactSelected['uniswap'].lend===true && isPoolTransactSelected['uniswap'].borrow===true) {
            if(poolAddressArray.indexOf(poolAddresses['uniswap'])===-1)
                poolAddressArray.push(poolAddresses['uniswap']);
            // '0xCC2f880f977d96b7DE75aD64Fc25696cC5b549d0'
            const swapValue = Number(lendAmts['uniswap'])*Math.pow(10,18);
            const toToken = borrowAmts['uniswap'];
            const swapHash = getUniswapSwapHash(web3, swapValue, toToken);
            depositHashArray.push(swapHash);
        }
        
        console.log(poolAddressArray);
        console.log(depositHashArray);
        await wallet.methods.execute([...poolAddressArray], [...depositHashArray]).send({ from: window.ethereum.selectedAddress, value: Number((totalLendAmt*Math.pow(10,18))).toString() });
    }

    return <Fragment>
                <NavBar isWalletConnected={isWalletConnected}
                        setIsWalletConnected={setIsWalletConnected}
                        isRegistered={isRegistered}
                        setIsRegistered={setIsRegistered}
                        registryContract={registryContract}
                        setRegistryContract={setRegistryContract}
                        setPersonalWalletAddress={setPersonalWalletAddress}                         
                />
                <UserInfo address={address} balance={balance} />
                <div id="select-pools">Select Pools to Deposit/Borrow from</div>
                <div id="supported-pools"> 
                    {supportedPools.map((pool, index) => 
                        <div className="pool" 
                            key={index}
                            style={poolStyles(pool)}
                            onClick={() => updateSelectedPools(pool)}
                            
                        >
                            <img className="pool-img" src={poolIcons[pool]} alt={pool} />
                        </div>
                    )}
                </div>
                <div id="selected-pool-container">
                    {selectedPools.map( (pool, index) => {
                        return <div className="selected-pool" key={index} >
                                    <img className="pool-img" src={poolIcons[pool]} alt={pool} />
                                    <div>
                                        {/* Material-UI switch start */}
                                        <FormControl component="fieldset">
                                        <FormLabel component="legend"
                                                   style={{color:'#fff', fontSize:'18px', marginBottom:'12px'}}
                                        >
                                            Select Transaction(s)
                                        </FormLabel>
                                        <FormGroup>
                                            <FormControlLabel control={<Switch checked={isPoolTransactSelected[pool].lend} onChange={e => handleIsPoolTransactSelected(e, pool)} name="lend" />}
                                                label={<span style={{color:'#fff', fontSize:'20px' }}>Lend</span>}
                                            />
                                            {isPoolTransactSelected[pool].lend && 
                                                <input type="number" min={0}
                                                       className="lend-borrow-amt-input"
                                                       onChange={e => handleLendAmtChange(e, pool)}
                                                       value={lendAmts[pool]}
                                                />
                                            }
                                            {/* {lendAmts[pool]} */}
                                            <FormControlLabel
                                                control={<Switch checked={isPoolTransactSelected[pool].borrow} onChange={e => handleIsPoolTransactSelected(e, pool)} name="borrow" />}
                                                label={<span style={{color:'#fff', fontSize:'20px' }}>Borrow</span>}
                                            />
                                            {isPoolTransactSelected[pool].borrow && 
                                                <input type="text"
                                                       className="lend-borrow-amt-input"
                                                       onChange={e => handleBorrowAmtChange(e,pool)}
                                                       value={borrowAmts[pool]}
                                                />
                                            }
                                            {/* {borrowAmts[pool]} */}
                                        </FormGroup>
                                        <FormHelperText style={{color:'#fff', fontSize:'12px'}}>Choose one or both</FormHelperText>
                                        </FormControl>
                                        {/* Material-UI switch end */}
                                        
                                    </div>
                                </div>
                        
                    })}
                </div>
                <div style={{color:'red', fontSize:'20px'}}>{lendError}</div>
                <div style={{textAlign:'center', margin:'50px 0 100px 0'}}>
                        <button className="deposit-btn"
                                onClick={initiateTransaction}
                        >
                            Transact
                        </button>
                </div>
                <Footer />
           </Fragment>
}

export default TransactionDashboard;