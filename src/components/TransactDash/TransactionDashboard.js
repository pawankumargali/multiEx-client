import React, { useState, Fragment } from 'react';
import Navbar from '../core/Navbar/NavBar';
import UserInfo from '../core/UserInfo/UserInfo';
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

function TransactionDashboard({web3, contract, address, balance, isWalletConnected, setIsWalletConnected}) {
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
        // const hash = web3.eth.abi.encodeFunctionCall({
        
        //         "constant": false,
        //         "inputs": [
        //             {
        //                 "internalType": "address[]",
        //                 "name": "path",
        //                 "type": "address[]"
        //             },
        //             {
        //                 "internalType": "uint256",
        //                 "name": "amountInEth",
        //                 "type": "uint256"
        //             }
        //         ],
        //         "name": "swap",
        //         "outputs": [],
        //         "payable": true,
        //         "stateMutability": "payable",
        //         "type": "function"

        // }, [["0xd0A1E359811322d97991E03f863a0C30C2cF029C","0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"], "100000000000000000"]);
        // const hash = web3.eth.abi.encodeFunctionCall({
        //     name: 'deposit',
        //     type: 'function',
        //     inputs: []
        // }, []);
        // console.log(hash);
    }

    return <Fragment>
                <Navbar isWalletConnected={isWalletConnected}
                        setIsWalletConnected={setIsWalletConnected}         
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