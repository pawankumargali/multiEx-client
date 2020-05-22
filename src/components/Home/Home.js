import React, { Fragment } from 'react';
import NavBar from '../core/Navbar/NavBar';
import ServiceInfo from  '../ServiceInfo/ServiceInfo';
import Footer from '../core/Footer/Footer';
import './Home.css';
// import { registry } from '../../contractInterfaces/registry';
// import UserInfo from '../core/UserInfo/UserInfo';

function Home({web3, isWalletConnected, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract, setPersonalWalletAddress}) {

    return <Fragment>
                <NavBar isWalletConnected={isWalletConnected}
                        setIsWalletConnected={setIsWalletConnected} 
                        isRegistered={isRegistered}
                        setIsRegistered={setIsRegistered}
                        web3={web3}
                        registryContract={registryContract}
                        setRegistryContract={setRegistryContract}
                        setPersonalWalletAddress={setPersonalWalletAddress}

                />
                {/* {address && <UserInfo address={address}
                          balance={balance}
                />} */}
                <section id="landing">
                    <div id="title">Parcel multiple transactions into one. Save on Gas</div>
                    <div id="description">
                        Select and swap multiple tokens with Ethereum. Invest in and
                        Borrow simultaneously from popular DeFi portals. All in one Transaction. Reduce
                        the number of transactions involved and save Eth on gas.
                    </div>
                </section> 
                <section id="steps-container"> 
                    <ServiceInfo 
                        serviceIconName={'swap'}
                        serviceName={'Swap Tokens'}
                        serviceDesc={'Choose from list of supported tokens, select quantities and swap at once'}
                        bgColor='#03265b'
                        btnColor="#3fbda6"
                    />
                    <ServiceInfo 
                        serviceIconName={'transact'}
                        serviceName={'Lend/Borrow from DeFi portals'}
                        serviceDesc={'Choose from list of DeFi portal, select lend or/and borrow transactions, enter quantities and transact at once'}
                        bgColor='#3fbda6'
                        btnColor="#03265b"
                    />
                </section> 
                <Footer /> 
           </Fragment>
}

export default Home;