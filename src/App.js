import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { initWeb3, initUser, initContract } from './init';
import config from './config';
import Home from './components/Home/Home';
import SwapDashboard from './components/SwapDash/SwapDashboard';
import TransactionDashboard from './components/TransactDash/TransactionDashboard';

function App() {

  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [contract, setContract] = useState(null);

  window.ethereum.on('accountsChanged', async () => {
    try {
      if(web3) {
        const [add,bal] = await initUser(web3);
        setAddress(add);
        setBalance(web3.utils.fromWei(bal, 'ether'));
      }
    }
    catch(err) {
      setIsWalletConnected(false);
      setAddress("");
      setBalance(0);
    }
  });

  const runInit = async () => {
    try {
      const web3Obj = await initWeb3();
      setWeb3(web3Obj);
      setTimeout( async () => {
        console.log('Web3Obj: '+web3Obj);
        const [add, bal] = await initUser(web3Obj);
        setAddress(add);
        setBalance(web3Obj.utils.fromWei(bal,'ether'));
        const contractObj = initContract(web3Obj, config.contract.abi, config.contract.address);
        console.log(contractObj);
        setContract(contractObj);
      },1000);
    }
    catch(err) {
       setIsWalletConnected(false);
       setAddress("");
       setBalance(0);
    }
  } 
  
  
  useEffect(() => {
    if(window.ethereum.selectedAddress) setIsWalletConnected(true);
    if(isWalletConnected) runInit();
    if(!isWalletConnected) {
      setAddress("");
      setBalance(0);
    }
  }, [isWalletConnected]);

  return  <Router>
              <Switch>
                <Route path='/' exact 
                  render={ () => <Home
                                    // address={address}
                                    setAddress={setAddress}
                                    setBalance={setBalance}
                                    // balance={balance}
                                    isWalletConnected={isWalletConnected}
                                    setIsWalletConnected={setIsWalletConnected}
                  />}
                />
                <Route path='/swap' exact 
                  render={() => <SwapDashboard
                                    web3={web3}
                                    contract={contract}  
                                    address={address}
                                    setAddress={setAddress}
                                    balance={balance}
                                    setBalance={setBalance}
                                    isWalletConnected={isWalletConnected}
                                    setIsWalletConnected={setIsWalletConnected}                        
                  />}
                />
                <Route path="/transactions" exact 
                  render={() => <TransactionDashboard
                                  web3={web3}
                                  contract={contract}
                                  address={address}
                                  setAddress={setAddress}
                                  balance={balance}
                                  setBalance={setBalance}
                                  isWalletConnected={isWalletConnected}
                                  setIsWalletConnected={setIsWalletConnected} 
                  />}   
                />
              </Switch>
          </Router>
}

export default App;



