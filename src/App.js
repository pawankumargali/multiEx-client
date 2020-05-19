import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { initWeb3, initUser } from './init';
import Home from './components/Home';
import SwapDashboard from './components/SwapDash/SwapDashboard';
import TransactionDashboard from './components/TransactionsDash/TransactionDashboard';

function App() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if(isWalletConnected) {
       initWeb3().then(web3Obj => {
            setWeb3(web3Obj);
            initUser(web3Obj).then(result =>{
                setAddress(result[0]);
                setBalance(web3Obj.utils.fromWei(result[1],'ether'));
            })
            
        })   
    }
  })

  return  <Router>
              <Switch>
                <Route path='/' exact 
                  render={ () => <Home 
                                    // setWeb3={setWeb3}
                                    address={address}
                                    // setAddress={setAddress}
                                    balance={balance}
                                    // setBalance={setBalance}
                                    setIsWalletConnected={setIsWalletConnected}
                  />}
                />
                <Route path='/swap' exact 
                  render={() => <SwapDashboard  
                                            // setWeb3={setWeb3} 
                                            address={address}
                                            // setAddress={setAddress}
                                            balance={balance}
                                            // setBalance={setBalance}
                                            setIsWalletConnected={setIsWalletConnected}                        
                  />}
                />
                <Route path="/transactions" exact component={TransactionDashboard} />
              </Switch>
          </Router>
}

export default App;



