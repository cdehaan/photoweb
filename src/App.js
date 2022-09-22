import './App.css';
import Login from './Login/Login';
import Header from './Header';
import { useState } from 'react';

function App() {
  const [userStatus, setUserStatus] = useState({username: null, loggedin: false, token: null});

  async function Authenticate(username, password) {
    document.getElementById('LoginError').innerHTML = null;
    const authenticationEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `authenticate.php`;
    const authenticationData = {username: username, password: password};
    console.log(authenticationData);

    const response = await fetch(authenticationEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authenticationData)
    });

    const responseText = await response.text();
    console.log(responseText);
    const responseJson = JSON.parse(responseText);

    if(responseJson.error === true) {
      console.log(responseJson.errorMessage);
      document.getElementById('LoginError').innerHTML = responseJson.errorMessage;
      return;
    }

    setUserStatus(previousStatus => {
      const newStatus = {...previousStatus, username: username, token: responseJson.token, loggedin: true};
      return newStatus;
    })
  }

  return (
    <>
      <Header userStatus={userStatus} setUserStatus={setUserStatus}/>
      {userStatus.loggedin ? "Logged in" : <Login Authenticate={Authenticate} />}
    </>
  );
}

export default App;
