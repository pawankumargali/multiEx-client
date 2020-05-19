import React, {useState, Fragment} from 'react';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import './NavBar.css';
import metamaskIcon from '../../../icons/metamask.svg'
import swapIcon from '../../../icons/swap.svg'
import transactionIcon from '../../../icons/transaction.svg'

Modal.setAppElement('#root');

function NavBar({setWeb3, setAddress, setBalance, setIsWalletConnected}) {

   const [showModal, setShowModel] = useState(false); 
   
   
    const connectWallet = () => {
        setShowModel(false);
        setIsWalletConnected(true); 
    }
    

   const modalStyles = {
        content: {
            top: '30vh',
            left: '25vw',
            right:'25vw',
            height:'150px',
            backgroundColor:'#fff',
            boxShadow:'2px 1.5px #999'
        }
   };

    return <Fragment>
                <header>
                    <Link className="nav-link" id="logo" to="/">Multiex</Link>
                    <nav>
                            <Link className="nav-link" to="/swap"> 
                                <img src={swapIcon} alt="swap-icon"/>
                                <span>Swap</span>
                            </Link>
                        
                            <Link className="nav-link" to="/transactions">
                                <img src={transactionIcon} alt="transactionIcon" />
                                <span>Transactions</span>
                                
                            </Link>
                        <button onClick={() => setShowModel(true)}> Connect Wallet</button>
                    </nav>
                </header>
                <Modal 
                    isOpen={showModal}
                    onRequestClose={() => setShowModel(false)}
                    style={modalStyles}
                >
                    <h1 id="modal-title">Connect Ethereum Wallet</h1>
                    <div id="modal-body">
                        <img src={metamaskIcon} alt="metamask" />
                        <div>
                            <h3>Metamask</h3>
                            Self custodial browser extension based wallet
                        </div>
                        <button onClick={connectWallet}>Connect</button>
                        
                    </div>
                        
                </Modal>
           </Fragment>;
}

export default withRouter(NavBar);