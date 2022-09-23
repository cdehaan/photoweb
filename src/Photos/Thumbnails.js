import React, { useEffect, useState } from 'react';
import AsyncImage from './AsyncImage';

function Thumbnails(props) {
    const token = props.userData.token;
    const currentDirectory = props.currentDirectory;
    const [thumbnailsData, setThumbnailsData] = useState([]);
    const [thumbnailSize, setThumbnailSize] = useState(10); // vmax
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        async function PullThumbnails() {
            const thumbnailsEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `pullThumbnails.php`;
            const photoListData = {token: token, currentDirectory: currentDirectory};
    
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

        PullThumbnails();
    }, [token, currentDirectory]);

    function CheckboxToggle(index) {
        setSelectedFiles(previousSelectedFiles => {
            if(previousSelectedFiles.includes(index)) {
                return previousSelectedFiles.filter(file => {return (file !== index)});
            } else {
                return previousSelectedFiles.concat([index]);
            }
        });
    }

    const thumbnails = thumbnailsData.map((thumbnail, index) => {
        const pixels = [];
        const thumbnailX = Math.max(...thumbnail.thumbnailRGB.map(o => o.x));
        const thumbnailY = Math.max(...thumbnail.thumbnailRGB.map(o => o.y));
        for(let x=0; x < thumbnailX; x++) {
            for(let y=0; y < thumbnailY; y++) {
                const colors = thumbnail.thumbnailRGB.find(pixel => pixel.x === x && pixel.y === y).colors;
                const background = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`;
                pixels.push(<div key={`x${x}y${y}`} style={{backgroundColor: background}} ></div>);
            }
        }

        const width = Math.round(thumbnail.width / thumbnail.height * thumbnailSize) + "vmax";

        return(
            <div key={thumbnail.filename} className="ThumbnailWrapper" style={{height: `${thumbnailSize}vmax`, width: width}} index={index}>
                <div className='Thumbnail' style={{gridTemplateColumns: `repeat(${thumbnailX}, 1fr)`, gridTemplateRows: `repeat(${thumbnailY}, 1fr)`}}>{pixels}</div>
                <div className='ThumbnailSpinner'></div>
                <AsyncImage src={thumbnail.fullPath} token={token} />
                <div className='ThumbnailCheckbox' style={{opacity: (selectedFiles.includes(index) ? 1 : 0.75)}} onClick={() => {CheckboxToggle(index)}}>{(selectedFiles.includes(index) ? "✔" : "")}</div>
            </div>
        )
    });

    const directoryToShow = (process.env.NODE_ENV === 'development' ? currentDirectory?.slice(3) : currentDirectory);

    return(
        <>
            <div className='ThumbnailsHeader'>
                <div className='ThumbnailsInfo'>{directoryToShow}</div>
                <div className='ThumbnailsButtons'>
                    {(selectedFiles.length > 0) ? <div className='ThumbnailsButton'>↓</div> : null}
                    <div className='ThumbnailsButton' onClick={props.closeDirectory}>✖</div>
                </div>
            </div>
            <div className='Thumbnails'>
                {thumbnails}
            </div>
        </>
    )
}

export default Thumbnails;
