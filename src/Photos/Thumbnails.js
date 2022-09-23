import React, { useEffect, useState } from 'react';

function Thumbnails(props) {
    const [thumbnailsData, setThumbnailsData] = useState([]);

    async function PullThumbnails() {
        const thumbnailsEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "../") + `pullThumbnails.php`;
        const photoListData = {token: props.userData.token, currentDirectory: props.currentDirectory};

        const response = await fetch(thumbnailsEndpoint, {
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

        setThumbnailsData(responseJson);
    }

    useEffect(() => {
        PullThumbnails();
    }, []);

    const thumbnails = thumbnailsData.map(thumbnail => {
        const pixels = [];
        for(let x=0; x < 3; x++) {
            for(let y=0; y < 3; y++) {
                const colors = thumbnail.thumbnailRGB.find(pixel => pixel.x === x && pixel.y === y).colors;
                const background = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`;
                pixels.push(<div key={`x${x}y${y}`} style={{backgroundColor: background}} ></div>)
            }    
        }
        const width = Math.round(thumbnail.width / thumbnail.height * 100);
        return(
            <div key={thumbnail.filename} className="ThumbnailWrapper" style={{height: 100, width: width}}>
                <div className='Thumbnail'>
                    {pixels}
                </div>
                <div className='ThumbnailSpinner'></div>
            </div>
        )
    });

    return(
        <>
            <div key='ThumbnailsHeader'>Thumbnails for {props.currentDirectory?.slice(3)}</div>
            <div key='ThumbnailsClose' onClick={props.closeDirectory}>X</div>
            <div className='Thumbnails'>
                {thumbnails}
            </div>
        </>
    )
}

export default Thumbnails;
