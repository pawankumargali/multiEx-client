import React, { Fragment } from 'react';
import NavBar from '../core/Navbar/NavBar';
import { Link } from 'react-router-dom';
import ServiceInfo from  '../ServiceInfo/ServiceInfo';
import Footer from '../core/Footer/Footer';
import './Home.css';

function Home({web3, tokenAddresses, setAddress, setBalances, setMetamaskAdd, setMetamaskBal, isWalletConnected, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract, setPersonalWalletAddress}) {

    return <Fragment>
                <NavBar isWalletConnected={isWalletConnected}
                        setIsWalletConnected={setIsWalletConnected} 
                        isRegistered={isRegistered}
                        setIsRegistered={setIsRegistered}
                        web3={web3}
                        registryContract={registryContract}
                        setRegistryContract={setRegistryContract}
                        setPersonalWalletAddress={setPersonalWalletAddress}
                        setAddress={setAddress}
                        setBalances={setBalances}
                        tokenAddresses={tokenAddresses}
                        setMetamaskAdd={setMetamaskAdd}
                        setMetamaskBal={setMetamaskBal}

                />
                <section id="landing">
                    <div id="title">Parcel multiple transactions into one. Save on Gas</div>
                    <div id="description">
                        Send multiple tokens to multiple addresses. Invest in and
                        Borrow from and swap Ether simultaneously from popular DeFi portals. All in one Transaction. Reduce
                        the number of transactions involved and save Eth on gas.
                    </div>
                    <div id="tail">
                    <Link to='/parcel'>
                        <button style={{backgroundColor:'#03265b'}}>Go To App</button>
                    </Link>
                    </div>
                </section> 
                
                <section id="steps-container"> 
                    <ServiceInfo 
                            serviceIconName={'parcel'}
                            serviceName={'P2P transfers'}
                            serviceDesc={'Make multiple Peer to peer transfers in one transaction'}
                            bgColor='#FF3D67'
                    />
                    <ServiceInfo 
                        serviceIconName={'compound'}
                        serviceName={'Lend/Borrow'}
                        serviceDesc={'Lend ETH and Borrow DAI.'}
                        bgColor='#03265b'
                    />
                    <ServiceInfo 
                        serviceIconName={'aave'}
                        serviceName={'Lend/Stream'}
                        serviceDesc={'Lend ETH and stream interest to any address.'}
                        bgColor='#3fbda6'
                    />
                    <ServiceInfo 
                        serviceIconName={'uniswap'}
                        serviceName={'Swap Tokens'}
                        serviceDesc={'Choose from list of supported tokens, select quantities and swap ETH.'}
                        bgColor='#BBA8FF'
                    />
                </section> 
                <Footer /> 
           </Fragment>
}

export default Home;