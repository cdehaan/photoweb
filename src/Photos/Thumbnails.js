import React from 'react';

function Thumbnails(props) {
    async function PullThumbnails() {
        const logoutEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "../") + `pullThumbnails.php`;

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

    useEffect(() => {
        setCurrentDirectory(null);
        setSelectedFiles([]);

        PullThumbnails();
    }, []); // run once at "mount"

    return(
        <>
            <div>Thumbnails for {props.currentDirectory}</div>
            <div onClick={props.closeDirectory}>X</div>
        </>
    )
}

export default Thumbnails;
