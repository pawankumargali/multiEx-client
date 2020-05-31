import React, { useState, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {initWeb3, initContract} from '../../../contractInterfaces/init';
import { registry, initRegistry, checkRegistry } from '../../../contractInterfaces/registry';
import {balanceAbi} from '../../../contractInterfaces/balance';
import Modal from 'react-modal';
import './NavBar.css';
import brandLogo from '../../../icons/logo.png';
import swapIcon from '../../../icons/swap.svg'
import transactionIcon from '../../../icons/transaction.svg'

Modal.setAppElement('#root');

function NavBar({tokenAddresses, setAddress, setBalances, setMetamaskAdd, setMetamaskBal, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract}) {
   let [showPersonalWalletConnectModal, setShowPersonalWalletConnectModal] = useState(false);

    const initiateConnect = async () => {   
        try {
            const web3Obj = await initWeb3();
            if(web3Obj) {
                setTimeout(async () => {
                    const add = window.ethereum.selectedAddress;
                    const bal = await web3Obj.eth.getBalance(add)/Math.pow(10,18);
                    setMetamaskAdd(add);
                    setMetamaskBal(bal);
                    const registryContractObj = initContract(web3Obj, registry.contract.abi, registry.contract.address);
                    setRegistryContract(registryContractObj);
                    const personalWalletAdd = await checkRegistry(registryContractObj);
                    if(personalWalletAdd==="0x0000000000000000000000000000000000000000") {
                        setShowPersonalWalletConnectModal(true);
                        setIsRegistered(false);
                        setAddress(null);
                    }
                    else {
                        setAddress(personalWalletAdd);
                        const currentBalances = {'ETH':0, 'DAI':0, 'MKR':0, 'cETH':0, 'aETH':0};
                        const ETHbal = await web3Obj.eth.getBalance(personalWalletAdd);
                        currentBalances['ETH']=Math.round((Number(ETHbal)/(Math.pow(10,18)))*10000)/10000;
                        for(const token in currentBalances) {
                            if(token!=='ETH') {
                                const balanceContract = initContract(web3Obj, balanceAbi, tokenAddresses[token]);
                                const result=await balanceContract.methods.balanceOf(personalWalletAdd).call();
                                currentBalances[token]=Math.round((Number(result)/(Math.pow(10,18)))*10000)/10000;
                            }
                        }
                        setBalances(currentBalances);
                        setIsRegistered(true);
                    }   
                },1000);
            }
        }
        catch(err) {
            console.log(err);
            setIsWalletConnected(false);
            setMetamaskAdd("");
            setMetamaskBal(0);
            setRegistryContract(null);
            setAddress("");
            setBalances({'ETH':0, 'DAI':0, 'MKR':0, 'cETH':0, 'aETH':0});
            setIsRegistered(false);
        }
    }

    const createPersonalWallet = async () => {
        setShowPersonalWalletConnectModal(false);
        const personalWalletAdd = await initRegistry(registryContract);
        if(personalWalletAdd==="0x0000000000000000000000000000000000000000" || !personalWalletAdd) {
            setIsRegistered(false);
            setAddress(null);
        }
        else {
            setIsRegistered(true);
            setAddress(personalWalletAdd);
        }
    }

   const modalStyles = {
        content: {
            top: '30vh',
            left: '20vw',
            right:'20vw',
            height:'150px',
            backgroundColor:'#fff',
            boxShadow:'2px 1.5px #999'
        }
   };

    return <Fragment>
                <header>
                    <Link className="nav-link" id="logo" to="/">
                        <img src={brandLogo} alt="parcel-logo"/>
                    </Link>
                    <nav>
                            <Link className="nav-link" to="/parcel"> 
                                <img src={swapIcon} alt="swap-icon"/>
                                <span>Parcel</span>
                            </Link>
                        
                            <Link className="nav-link" to="/defi">
                                <img src={transactionIcon} alt="transactionIcon" />
                                <span>DeFi Protocols</span>
                                
                            </Link>
                           
                            {isRegistered ? 
                                <button>Connected</button> :
                                <button onClick={initiateConnect}>Connect</button>
                            }
                            
                    </nav>
                </header>
                <Modal
                    isOpen={showPersonalWalletConnectModal}
                    onRequestClose={() => setShowPersonalWalletConnectModal(false)}
                    style={modalStyles}
                >
                    <h1 id="modal-title">Create Personal Wallet</h1>
                    <div id="modal-body">
                        <img style={{width:'150px'}} src={brandLogo} alt="metamask" />
                        <div>
                            <h3>Parcel Wallet</h3>
                            Parcel protocol requires for you to create a personal wallet
                        </div>
                            <button onClick={createPersonalWallet}>Create Wallet</button>
                    </div>                 
                </Modal>
           </Fragment>;
}

export default withRouter(NavBar);