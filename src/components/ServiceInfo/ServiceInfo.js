import React from 'react';
import './ServiceInfo.css';

function ServiceInfo({serviceIconClass, serviceName, serviceDesc, bgColor}) {

    return  <div className="steps-item" style={{backgroundColor:bgColor}}>
                <div className="steps-icon"><img src={serviceIconClass} alt="service-item-img"/></div>
                <div className="steps-title">{serviceName}</div>
                <div className="steps-description">{serviceDesc}</div>
            </div> 
}

export default ServiceInfo;