import React, { useEffect, useState } from 'react';
import PhotoList from './PhotoList';
import Thumbnails from './Thumbnails';
import './Photos.css';

function Photos(props) {
    const [photoData, setPhotoData] = useState({});
    const [currentDirectory, setCurrentDirectory] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [openFile, setOpenFile] = useState(null);

    useEffect(() => {
        setCurrentDirectory(null);
        setSelectedFiles([]);

        async function PullPhotoList() {
            const logoutEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "../") + `pullPhotoList.php`;
            const logoutData = {token: props.userData.token};
    
            const response = await fetch(logoutEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logoutData)
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
    }, [props.userData]); // run at "mount", and if user changes

    function closeDirectory() {
        setCurrentDirectory(null);
    }

    return(
        <div className='PhotoList'>
            <span>Photos{ currentDirectory !== null ? currentDirectory : null}</span>
            {
            (Object.keys(photoData).length > 0 && currentDirectory === null) ? <PhotoList photoData={photoData} setCurrentDirectory={setCurrentDirectory} /> :
            (openFile === null) ? <Thumbnails currentDirectory={currentDirectory} closeDirectory={closeDirectory} /> :
            <div>An image</div>
            }
        </div>
    )
}

export default Photos;