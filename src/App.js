import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { initWeb3, initContract } from './contractInterfaces/init';
import { balanceAbi } from './contractInterfaces/balance';
import { registry, checkRegistry } from './contractInterfaces/registry';
import Home from './components/Home/Home';
import SendTokenDashboard from './components/SendTokenDash/SendTokenDashboard';
import TransactionDashboard from './components/TransactDash/TransactionDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SwitchToKovanToast } from './components/core/CustomToasts/CustomToasts';



toast.configure();

function App() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState("");
  const [balances, setBalances] = useState({'ETH':0, 'DAI':0, 'MKR':0, 'cETH':0, 'aETH':0});
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [registryContract, setRegistryContract] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [metamaskAdd, setMetamaskAdd] = useState(false);
  const [metamaskBal, setMetamaskBal] = useState(0);
  const tokenAddresses= {
    'DAI':'0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    'MKR': '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD',
    'aETH':'0xD483B49F2d55D2c53D32bE6efF735cB001880F79',
    'cETH' : '0xf92FbE0D3C0dcDAE407923b2Ac17eC223b1084E4'
  };

  const runInit = async () => {
    try {
      const web3Obj = await initWeb3();
      if(web3Obj) {
        setWeb3(web3Obj);
        setTimeout(async () => {
          if(Number(window.ethereum.networkVersion)!==42)
            toast(<SwitchToKovanToast />, {autoClose:false});
          const add = window.ethereum.selectedAddress;
          const bal = await web3Obj.eth.getBalance(add)/Math.pow(10,18);
          setMetamaskAdd(add);
          setMetamaskBal(bal);
          const registryContractObj = initContract(web3Obj, registry.contract.abi, registry.contract.address);
          setRegistryContract(registryContractObj);
          const personalWalletAdd = await checkRegistry(registryContractObj);
          const currentBalances = {'ETH':0, 'DAI':0, 'MKR':0, 'cETH':0, 'aETH':0};
          if(personalWalletAdd!=="0x0000000000000000000000000000000000000000") {
            setAddress(personalWalletAdd);
            const ETHbal = await web3Obj.eth.getBalance(personalWalletAdd);
            currentBalances['ETH']=Math.round((Number(ETHbal)/(Math.pow(10,18)))*10000)/10000;
            for(const token in currentBalances) {
                if(token!=='ETH') {
                    const balanceContract = initContract(web3Obj, balanceAbi, tokenAddresses[token]);
                    const result=await balanceContract.methods.balanceOf(personalWalletAdd).call();
                    currentBalances[token]=Math.round((Number(result)/(Math.pow(10,18)))*10000)/10000;
                }
            }
            setIsRegistered(true);
          }
          else {
            setAddress("");
            setIsRegistered(false);
          }
          setBalances(currentBalances);
        }, 1000);
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

  window.ethereum.on('accountsChanged',  () => runInit());

  useEffect(() => {
    if(isWalletConnected || window.ethereum.selectedAddress) runInit();
    if(address) setIsRegistered(true);
  }, [isWalletConnected, address]);

  return  <Router>
              <Switch>
                <Route path='/' exact 
                  render={ () =>  <Home
                                    web3={web3}
                                    tokenAddresses={tokenAddresses}
                                    setAddress={setAddress}
                                    setBalances={setBalances}
                                    setIsWalletConnected={setIsWalletConnected}
                                    isRegistered={isRegistered}
                                    setIsRegistered={setIsRegistered}
                                    registryContract={registryContract}
                                    setRegistryContract={setRegistryContract}
                                    setMetamaskAdd={setMetamaskAdd}
                                    setMetamaskBal={setMetamaskBal}
                  />}
                />
                <Route path='/parcel' exact 
                  render={() => <SendTokenDashboard
                                    web3={web3}
                                    tokenAddresses={tokenAddresses}
                                    address={address}
                                    balances={balances}
                                    setAddress={setAddress}
                                    setBalances={setBalances}
                                    setIsWalletConnected={setIsWalletConnected}
                                    isRegistered={isRegistered}
                                    setIsRegistered={setIsRegistered}
                                    registryContract={registryContract}
                                    setRegistryContract={setRegistryContract}
                                    metamaskAdd={metamaskAdd}
                                    metamaskBal={metamaskBal}
                                    setMetamaskAdd={setMetamaskAdd}
                                    setMetamaskBal={setMetamaskBal}
                                        
                  />}
                />
                <Route path="/defi" exact 
                  render={() => <TransactionDashboard
                                  web3={web3}
                                  tokenAddresses={tokenAddresses}
                                  address={address}
                                  balances={balances}
                                  setAddress={setAddress}
                                  setBalances={setBalances}
                                  setIsWalletConnected={setIsWalletConnected}
                                  isRegistered={isRegistered}
                                  setIsRegistered={setIsRegistered}
                                  registryContract={registryContract}
                                  setRegistryContract={setRegistryContract}
                                  setMetamaskAdd={setMetamaskAdd}
                                  setMetamaskBal={setMetamaskBal}
                                 
                  />}   
                />
              </Switch>
          </Router>
}

export default App;



