import React, { Fragment } from 'react';
import NavBar from '../core/Navbar/NavBar';
import ServiceInfo from  '../ServiceInfo/ServiceInfo';
import './Home.css';
// import UserInfo from '../core/UserInfo/UserInfo';

function Home({isWalletConnected, setIsWalletConnected}) {

    return <Fragment>
                <NavBar isWalletConnected={isWalletConnected}
                        setIsWalletConnected={setIsWalletConnected} />
                {/* {address && <UserInfo address={address}
                          balance={balance}
                />} */}
                <section id="landing">
                    <div id="title">Conduct Multiple Transactions at Once. Save on Gas</div>
                    <div id="description">
                        Select and swap multiple tokens with Ethereum in one transaction. Invest in and
                        Borrow simultaneously from popular DeFi portals. All in one Transaction. Reduce
                        the number of transactions involved and save Eth on gas.
                    </div>
                </section> 
                <section id="steps-container"> 
                    <ServiceInfo 
                        serviceIconUrl={"https://testurl.com"}
                        serviceName={'Service 01'}
                        serviceDesc={'This is description for Service 01'}
                        bgColor='#91ac41'
                    />
                    <ServiceInfo 
                        serviceIconUrl={"https://testurl.com"}
                        serviceName={'Service 02'}
                        serviceDesc={'This is description for Service 02'}
                        bgColor='#e4b476'
                    />
                </section>   
           </Fragment>
}

export default Home;