import './App.css';
import Login from './Login/Login';
import Header from './Header';
import Photos from './Photos/Photos';
import { useEffect, useState } from 'react';
import spinner from './spinner.svg';

function App() {
  const [userData, setUserData] = useState({username: null, loggedin: null, token: null});

  async function Signin(username, password) {
    document.getElementById('LoginError').innerHTML = null;
    const credentials = {username: username, password: password};    

    const responseJson = await Authenticate(credentials);

    if(responseJson.error === true) {
      console.log(responseJson.errorMessage);
      document.getElementById('LoginError').innerHTML = responseJson.errorMessage;
      DeleteCookies();
      return;
    }

    const date = new Date();
    date.setDate(date.getDate() + 1);
    document.cookie = `username=${username};        expires=${date.toGMTString()}, SameSite=Lax; Secure`;
    document.cookie = `token=${responseJson.token}; expires=${date.toGMTString()}, SameSite=Lax; Secure`;

    setUserData(previousStatus => {
      const newStatus = {...previousStatus, username: username, token: responseJson.token, loggedin: true};
      return newStatus;
    })
  }

  useEffect(() => {
    if(userData.loggedin !== true) {
      if(cookieUsername !== undefined && cookieToken !== undefined) {
        CheckToken(cookieUsername, cookieToken);
      } else {
        setUserData(previousStatus => {
          const newStatus = {...previousStatus, loggedin: false};
          return newStatus;
        })    
      }
    } 
  }, []);

  async function CheckToken(username, token) {
    const credentials = {username: username, token: token};
    const responseJson = await Authenticate(credentials);
    if(responseJson.error === false) {
      setUserData(previousStatus => {
        const newStatus = {...previousStatus, username: username, token: token, loggedin: true};
        return newStatus;
      })  
    } else {
      console.log(responseJson.errorMessage);

      const date = new Date();
      document.cookie = `username=; expires=${date.toGMTString()}, SameSite=Lax; Secure`;
      document.cookie = `token=;    expires=${date.toGMTString()}, SameSite=Lax; Secure`;

      setUserData(previousStatus => {
        const newStatus = {...previousStatus, username: null, token: null, loggedin: false};
        return newStatus;
      })  
    }
  }

  async function Authenticate(credentials) {
    const authenticationEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `signin.php`;

    const response = await fetch(authenticationEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const responseText = await response.text();
    return JSON.parse(responseText);
  }

  const cookieUsername = document.cookie.split('; ').find((row) => row.startsWith('username='))?.split('=')[1];
  const cookieToken    = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1];

  function DeleteCookies() {
    const date = new Date();
    document.cookie = `username=; expires=${date.toGMTString()}, SameSite=Lax; Secure`;
    document.cookie = `token=;    expires=${date.toGMTString()}, SameSite=Lax; Secure`;
  }

  return (
    <>
      <Header userData={userData} setUserData={setUserData}/>
      {(userData.loggedin === null) ? <div className='LoadingCover'><img src={spinner} alt="spinner" />Loading</div> :
       (userData.loggedin === true) ? <Photos userData={userData} /> :
       <Login Signin={Signin} />}
    </>
  );
}

export default App;
