import React from 'react';
import './CustomToasts.css';
import parcelIcon from '../../../icons/parcelIcon.png';


const SwitchToKovanToast = () => <div className="toast-div">
                                    <p className="toast-title">
                                    <img src={parcelIcon} alt="parcel-logo"/>
                                    <span style={{color:'red'}}>Please switch to Kovan network</span>
                                    </p>
                                 </div>

const TxInitiatedToast = () => <div className="toast-div">
                                    <p className="toast-title">
                                    <img src={parcelIcon} alt="parcel-logo"/>
                                    <span>Tx initiated</span>
                                    </p>
                                </div>

const TxSentToast = ({txHash}) => <div className="toast-div">
                            <p className="toast-title">
                                <img src={parcelIcon} alt="parcel-logo"/>
                                <span>Tx sent. Awaiting confirmation</span>
                            </p>
                            <p className="tx-link-para">
                                <a href={`https://kovan.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                                    View on etherscan
                                </a>
                            </p>
                         </div>

const TxSuccessToast = ({txHash}) => <div className="toast-div">
                                        <p className="toast-title">
                                            <img src={parcelIcon} alt="parcel-logo" />
                                            <span>Tx confirmed</span>
                                        </p>
                                        <p className="tx-link-para">
                                            <a href={`https://kovan.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                                                View on etherscan
                                            </a>
                                        </p>
                                     </div>
                                             
const TxFailedToast = ({txHash}) => <div className="toast-div">
                                        <p className="toast-title">
                                            <img src={parcelIcon} alt="parcel-logo" />
                                            <span>Tx failed to process</span>
                                        </p>
                                        <p className="tx-link-para">
                                            <a href={`https://kovan.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                                                View on etherscan
                                            </a>
                                        </p>
                                    </div>

export { SwitchToKovanToast, TxInitiatedToast ,TxSentToast, TxSuccessToast, TxFailedToast };