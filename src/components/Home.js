import React, { Fragment } from 'react';
import NavBar from './core/Navbar/NavBar';
import UserInfo from './core/UserInfo/UserInfo';

function Home({address, balance, setIsWalletConnected}) {
    return <Fragment>
                <NavBar setIsWalletConnected={setIsWalletConnected} />
                <UserInfo address={address}
                          balance={balance}
                />
           </Fragment>
}

export default Home;