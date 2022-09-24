import React, { useEffect, useState } from 'react';
import PhotoList from './PhotoList';
import Thumbnails from './Thumbnails';
import './Photos.css';

function Photos(props) {
    const userData = props.userData;
    const [photoData, setPhotoData] = useState({});
    const [currentDirectory, setCurrentDirectory] = useState(null);

    useEffect(() => {
        setCurrentDirectory(null);

        async function PullPhotoList() {
            const photoListEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `pullPhotoList.php`;
            const photoListData = {username: userData.username, token: userData.token, environment: (process.env.NODE_ENV === 'development' ? 'development' : 'production')};
    
            const response = await fetch(photoListEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(photoListData)
            });
          
            const responseText = await response.text();
            const responseJson = JSON.parse(responseText);
    
            if(responseJson.error === true) {
                console.log(responseJson.errorMessage);
                return;
            }
    
            setPhotoData(responseJson);
        }

        PullPhotoList();
    }, [userData]); // run at "mount", and if user changes

    function closeDirectory() {
        setCurrentDirectory(null);
    }

    return(
        <div className='Photos'>
            <span className='PhotosHeader'>Photos</span>
            {
            (Object.keys(photoData).length === 0) ? null :
            (currentDirectory === null) ? <PhotoList photoData={photoData} setCurrentDirectory={setCurrentDirectory} /> :
            <Thumbnails userData={userData} currentDirectory={currentDirectory} closeDirectory={closeDirectory} />
            }
        </div>
    )
}

export default Photos;