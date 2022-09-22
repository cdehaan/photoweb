import logo from './logo.svg';
import React from 'react';
import './Header.css';


function Header(props) {
    async function Logout() {
        const logoutEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `logout.php`;
        const logoutData = {username: props.userStatus.username, token: props.userStatus.token};

        const response = await fetch(logoutEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logoutData)
        });
      
        const json = await response.json();
    
        if(json.error === true) {
            console.log(json.errorMessage);
            document.getElementById('LoginError').innerHTML = json.errorMessage;
            return;
        }
    
        props.setUserStatus(previousStatus => {
            const newStatus = {...previousStatus, username: null, token: null, loggedin: false};
            return newStatus;
        });
    }

    const logout = props.userStatus.loggedin ? <div className='HeaderLogout'>{props.userStatus.username}<span className='LogoutButton' onClick={Logout}>ログアウト</span></div> : '';
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