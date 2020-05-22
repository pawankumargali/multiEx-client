import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { initWeb3, initUser, initContract } from './contractInterfaces/init';
import { registry, checkRegistry } from './contractInterfaces/registry';
import { uniswap } from './contractInterfaces/uniswap';
// import config from './contractInterfaces/config';
import Home from './components/Home/Home';
import SwapDashboard from './components/SwapDash/SwapDashboard';
import TransactionDashboard from './components/TransactDash/TransactionDashboard';


/* Wallet => Metamask wallet Registry => Personal Wallet */
function App() {

  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [registryContract, setRegistryContract] = useState(null);
  const [uniSwapContract, setUniswapContract] = useState(null);
  const [personalWalletAddress, setPersonalWalletAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  // window.ethereum.on('accountsChanged', async () => {
  //   try {
  //     if(web3) {
  //       const [add,bal] = await initUser(web3);
  //       setAddress(add);
  //       setBalance(web3.utils.fromWei(bal, 'ether'));
  //       let personalWalletAdd = await checkRegistry(registryContract);
  //       if(personalWalletAdd==="0x0000000000000000000000000000000000000000") {
  //         setIsRegistered(false);
  //         setPersonalWalletAddress(null);
  //       }
  //       else {
  //         setIsRegistered(true);
  //         setPersonalWalletAddress(personalWalletAdd);
  //       }
  //     }
  //   }
  //   catch(err) {
  //     setIsWalletConnected(false);
  //     setAddress("");
  //     setBalance(0);
  //   }
  // });

  const runInit = async () => {
    try {
      const web3Obj = await initWeb3();
      setWeb3(web3Obj);
      // console.log(web3Obj); 
      setTimeout(async () => {
        const [add, bal] = await initUser(web3Obj);
        setAddress(add);
        setBalance(web3Obj.utils.fromWei(bal,'ether'));
        const registryContractObj = initContract(web3Obj, registry.contract.abi, registry.contract.address);
        setRegistryContract(registryContractObj);
        const uniswapContractObj = initContract(web3Obj, uniswap.contract.abi, uniswap.contract.address);
        setUniswapContract(uniswapContractObj);
        const result=await uniswapContractObj.methods.getAmount(["0xd0A1E359811322d97991E03f863a0C30C2cF029C", "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"], "100000000000000000").call();
        console.log(result);
      }, 1000);
    }
    catch(err) {
      console.log(err);
      setIsWalletConnected(false);
      setAddress("");
      setBalance(0);
      setRegistryContract(null);
    }
  }

  useEffect(() => {
    if(window.ethereum.selectedAddress) setIsWalletConnected(true);
    if(isWalletConnected) runInit();
    if(personalWalletAddress) setIsRegistered(true);
  }, [isWalletConnected, isRegistered, registryContract, personalWalletAddress]);

  return  <Router>
              <Switch>
                <Route path='/' exact 
                  render={ () =>  <Home
                                    web3={web3}
                                    setAddress={setAddress}
                                    setBalance={setBalance}
                                    setIsWalletConnected={setIsWalletConnected}
                                    isRegistered={isRegistered}
                                    setIsRegistered={setIsRegistered}
                                    registryContract={registryContract}
                                    setRegistryContract={setRegistryContract}
                                    setPersonalWalletAddress={setPersonalWalletAddress}
                  />}
                />
                <Route path='/swap' exact 
                  render={() => <SwapDashboard
                                    web3={web3}
                                    address={address}
                                    balance={balance}
                                    setIsWalletConnected={setIsWalletConnected}
                                    isRegistered={isRegistered}
                                    registryContract={registryContract}
                                    setIsRegistered={setIsRegistered}
                                    setRegistryContract={setRegistryContract}
                                    setPersonalWalletAddress={setPersonalWalletAddress}        
                  />}
                />
                <Route path="/transact" exact 
                  render={() => <TransactionDashboard
                                  web3={web3}
                                  address={address}
                                  balance={balance}
                                  setIsWalletConnected={setIsWalletConnected}
                                  isRegistered={isRegistered}
                                  setIsRegistered={setIsRegistered}
                                  registryContract={registryContract}
                                  setRegistryContract={setRegistryContract}
                                  personalWalletAddress={personalWalletAddress}
                                  setPersonalWalletAddress={setPersonalWalletAddress}
                  />}   
                />
              </Switch>
          </Router>
}

export default App;



