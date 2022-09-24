import logo from './logo.svg';
import React from 'react';
import './Header.css';


function Header(props) {
    const userData = props.userData;
    const setUserData = props.setUserData;
    async function Logout() {
        const date = new Date();
        document.cookie = `username=; expires=${date.toGMTString()}, SameSite=Lax; Secure`;
        document.cookie = `token=;    expires=${date.toGMTString()}, SameSite=Lax; Secure`;

        const logoutEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `logout.php`;
        const logoutData = {username: userData.username, token: userData.token};

        const response = await fetch(logoutEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logoutData)
        });
      
        const json = await response.json();
    
        if(json.error === true) {
            console.log(json.errorMessage);
            return;
        }

        setUserData(previousStatus => {
            const newStatus = {...previousStatus, username: null, token: null, loggedin: false};
            return newStatus;
        });
    }

    const logout = userData.loggedin ? <div className='HeaderLogout'>{userData.username}<span className='LogoutButton' onClick={Logout}>ログアウト</span></div> : '';
    return(
        <div className='Header'>
            <div className='HeaderLogo'>
                <img src={logo} className="App-logo" alt="logo" />
                <span>Header</span>
            </div>
            {logout}
        </div>
    )
}

export default Header;