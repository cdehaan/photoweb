import React, { useEffect } from 'react';
import './Photos.css';


function Photos(props) {
    useEffect(() => {
        const logoutEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `pullPhotoList.php`;
        const logoutData = {username: 'chris', token: 'wrong'};

        async function PullPhotoList() {
            const response = await fetch(logoutEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logoutData)
            });
          
            const json = await response.json();
        
            if(json.error === true) {
                console.log(json.errorMessage);
                //document.getElementById('LoginError').innerHTML = json.errorMessage;
                return;
            }    
        }
    }, []); // run once at "mount"

    return(
        <div className='Header'>
            <div className='HeaderLogo'>
                <span>Photos</span>
            </div>
        </div>
    )
}

export default Photos;