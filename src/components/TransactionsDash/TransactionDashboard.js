import React, { Fragment } from 'react';
import NavBar from '../core/Navbar/NavBar';
import UserInfo from '../core/UserInfo/UserInfo';

function TransactionDashboard() {
    return <Fragment>
                <NavBar />
                <UserInfo />
                <div>Transaction Dash here</div>
           </Fragment>
}

export default TransactionDashboard;