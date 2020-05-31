import React, { Fragment } from 'react';
import logo from './icons/logo.png';
function GetMetamaskPage() {
    const logoDivStyles={padding:'18px 24px', display:'flex', alignItems:'center', justifyContent:'flex-start', backgroundColor:'#fff', boxShadow:'2px 2px #ccc'};
    const logoImgStyles={width:'150px', padding:'12px, 24px'};
    const containerStyles = {height:'85vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}
    const headingStyles = {color:'red', fontSize:'24px', fontWeight:'bold', margin:'0', padding:'0'};
    const linkImgStyles = {width:'200px'}
    return  <Fragment>
                <div style={logoDivStyles}>
                    <img style={logoImgStyles} src={logo} alt="parcel-logo" />
                </div>
                <div style={containerStyles}>
                <h3 style={headingStyles}>Metamask wallet is required to access portal</h3>
                <p>Please install Metamask browser extension wallet by clicking below</p>
                <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer">
                    <img style={linkImgStyles} src="https://metamask.io/images/mm-logo.svg" alt="metamask-icon"/>
                </a>
            </div>
           </Fragment>;
}

export default GetMetamaskPage;