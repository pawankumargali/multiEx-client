import React, { useState, Fragment } from 'react';
import NavBar from '../core/Navbar/NavBar';
import UserInfo from '../core/UserInfo/UserInfo';
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
    const poolAddresses = {'compound':'0xd55E193F82Bd020FF69A5888ABe2848bF4970bc4' ,'aave':'0x71635A09C3B1Ae1441da3476E1Fc3E94f813C4F9', 'uniswap':'0xF5A7aFC6680806f02e9e17e9BD57211967d3c9b2'};
    const [lendError, setLendError]=useState(false); 

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
        setLendError(false);
        console.log(personalWalletAddress);
        if(!personalWalletAddress) 
            return setLendError("Error: Please connect to portal wallet to initiate any transaction");
        const wallet = new web3.eth.Contract(userWallet.contract.abi, personalWalletAddress);
        const currentPools=[];
        let totalLendAmt=0;
        for(const pool in lendAmts) {
            if(lendAmts[pool]>0) {
                totalLendAmt+=Number(lendAmts[pool]);
                currentPools.push(pool);
            }
        }
        console.log(totalLendAmt);
        console.log(balance);
        if(totalLendAmt>Number(balance)) 
            return setLendError("Error : Lend Amount greater than wallet balance");
        if(totalLendAmt===0)
            return setLendError("Error: Lend amount cannot be zero");
        const poolAddressArray=[];
        const depositHashArray=[];
        for(const pool of currentPools) {
                poolAddressArray.push(poolAddresses[pool]);
                const depositHash=_getFunctionHash('deposit',Number(lendAmts[pool])*Math.pow(10,18));
                depositHashArray.push(depositHash);
        }
        console.log(poolAddressArray);
        console.log(depositHashArray);
        await wallet.methods.execute([...poolAddressArray,"0xF5A7aFC6680806f02e9e17e9BD57211967d3c9b2"], [...depositHashArray,"0xb18834aa0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c0000000000000000000000004f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa"]).send({ from: window.ethereum.selectedAddress, value: Number((totalLendAmt*Math.pow(10,18))+100000000000000000).toString() });
    }

    const _getFunctionHash = (name,tokenValue) => {
        const depositHash = web3.eth.abi.encodeFunctionCall({
            "name":name,
            "type":"function",
            "inputs": [{
                "type": "uint256",
                "name": "msgValue"
              }]
        },[tokenValue.toString()]);
        console.log(depositHash);
        return depositHash;
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
                                                <input type="number" min={0}
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
           </Fragment>
}

export default TransactionDashboard;