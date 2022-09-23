import React, { useEffect, useState } from 'react';
import PhotoList from './PhotoList';
import Thumbnails from './Thumbnails';
import './Photos.css';

function Photos(props) {
    const [photoData, setPhotoData] = useState({});
    const [currentDirectory, setCurrentDirectory] = useState(null);
    const [openFile, setOpenFile] = useState(null);

    useEffect(() => {
        setCurrentDirectory(null);

        async function PullPhotoList() {
            const photoListEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `pullPhotoList.php`;
            const photoListData = {token: props.userData.token, environment: (process.env.NODE_ENV === 'development' ? 'development' : 'production')};
    
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
    }, [props.userData]); // run at "mount", and if user changes

    function closeDirectory() {
        setCurrentDirectory(null);
    }

    return(
        <div className='Photos'>
            <span className='PhotosHeader'>Photos</span>
            {
            (Object.keys(photoData).length === 0) ? null :
            (currentDirectory === null) ? <PhotoList photoData={photoData} setCurrentDirectory={setCurrentDirectory} /> :
            (openFile === null) ? <Thumbnails userData={props.userData} currentDirectory={currentDirectory} closeDirectory={closeDirectory} /> :
            <div>An image</div>
            }
        </div>
    )
}

export default Photos;