import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceInfo.css';
import swapIcon from '../../icons/swap.svg';
import transactionIcon from '../../icons/transaction.svg'
function ServiceInfo({serviceIconName, serviceName, serviceDesc, bgColor,btnColor}) {
    const imageSource = serviceIconName==='swap' ? swapIcon : transactionIcon;
    return  <div className="steps-item" style={{backgroundColor:bgColor}}>
                <div className="steps-icon"><img src={imageSource} alt="service-img"/></div>
                <div className="steps-title">{serviceName}</div>
                <div className="steps-description">{serviceDesc}</div>
                <Link to={`/${serviceIconName}`}><button style={{backgroundColor:btnColor}}>{serviceIconName.toUpperCase()}</button></Link>
            </div> 
}

export default ServiceInfo;