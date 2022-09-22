import React from 'react';
import './Login.css';

function Login(props) {
    function LoginClick(event) {
        const idInput = document.getElementById("LoginId");
        const passwordInput = document.getElementById("LoginPassword");

        const loginId = idInput.value;
        const loginPassword = passwordInput.value;

        if(loginId === "") { idInput.focus(); return; }
        if(loginPassword === "") { passwordInput.focus(); return; }
        props.Authenticate(loginId, loginPassword);
    }

    return(
        <>
        <div className='LoginDescription'>ゴールデンウィーク 2022</div>
        <div className='Login'>
            <span  className='LoginTitle'>フォトサイトログイン</span>
            <div   className='LoginLine'></div>
            <div   className='LoginGrid'>
                <span  className='LoginHeader'>ログインID</span><input className='LoginInput' id='LoginId' type='text'></input>
                <span  className='LoginHeader'>パスワード</span><input className='LoginInput' id='LoginPassword' type='password'></input>
                <div className='LoginButton' onClick={LoginClick}>ログイン</div>
                <div className='LoginError' id='LoginError'></div>
            </div>
        </div>
        </>
        )
}

export default Login;