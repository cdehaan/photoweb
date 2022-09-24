import React, { useEffect, useState } from 'react';
import AsyncImage from './AsyncImage';

function Thumbnails(props) {
    const token = props.userData.token;
    const username = props.userData.username;
    const currentDirectory = props.currentDirectory;

    const [thumbnailsData, setThumbnailsData] = useState([]);
    const [thumbnailSize, setThumbnailSize] = useState(10); // vmax
    const [selectedImages, setSelectedImages] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        async function PullThumbnails() {
            const thumbnailsEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `pullThumbnails.php`;
            const photoListData = {username: username, token: token, currentDirectory: currentDirectory};
    
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
        setSelectedImages(previousSelectedFiles => {
            if(previousSelectedFiles.includes(index)) {
                return previousSelectedFiles.filter(file => {return (file !== index)});
            } else {
                return previousSelectedFiles.concat([index]);
            }
        });
    }

    function DownloadPhoto() {
        if(openIndex === null) { return; }
        const href = document.querySelector(`a[index="${openIndex}"]`);
        href.click();
    }

    function DownloadPhotos() {
        const checkedPhotos = [...document.querySelector(".Thumbnails").querySelectorAll(".ThumbnailCheckbox[download]")];
        checkedPhotos.forEach(photo => {
            const href = photo.closest(".ThumbnailWrapper").querySelector("a");
            href.click();
        });    
    }

    const thumbnails = thumbnailsData?.images?.map((thumbnail, index) => {
        const selected = selectedImages.includes(index);
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
                <AsyncImage fullPath={thumbnail.fullPath} username={username} token={token} index={index} />
                <div className='ThumbnailCover' onClick={() => {setOpenIndex(index)}}></div>
                <div className='ThumbnailCheckbox' download={selected} style={{opacity: (selected ? 1 : 0.75)}} onClick={() => {CheckboxToggle(index)}}>{(selected ? "✔" : "")}</div>
            </div>
        )
    });

    // If a directory name is given, use that. Otherwise, pull the top folder name
    const directoryName = thumbnailsData?.name || currentDirectory.split("/").filter(text => {return text.length > 0}).slice(-1)[0];

    // Only show left/right arrows if there's more than 1 picture ❮❯
    const openImageArrows = (thumbnailsData.images?.length > 1) &&
        <>
            <div className='OpenImageButton NextImage' onClick={() => {setOpenIndex(previousOpenIndex => { return ((previousOpenIndex+1)%thumbnailsData.images.length)})}}></div>
            <div className='OpenImageButton PreviousImage' onClick={() => {setOpenIndex(previousOpenIndex => { return ((previousOpenIndex+thumbnailsData.images.length-1)%thumbnailsData.images.length)})}}></div>
        </>

    const openImageUrl = (openIndex !== null) ? document.querySelector(`.ThumbnailImg[index="${openIndex}"]`)?.src : null;
    const openImage = (openImageUrl !== null) ?
    <div className='OpenImageWrapper'>
        <div className='OpenImageHeader'>
            <div className='ThumbnailsButton DownloadButton' onClick={DownloadPhoto}></div>
            <div className='ThumbnailsButton CloseImage' onClick={() => {setOpenIndex(null)}}></div>
        </div>
        {openImageArrows}
        <img className='OpenImage' src={openImageUrl} />
    </div>
    : null;

    //"⇊" : "↓"
    return(
        <>
            <div className='ThumbnailsHeader'>
                <div className='ThumbnailsInfo'>{directoryName}</div>
                <div className='ThumbnailsButtons'>
                    {(selectedImages.length > 0) ? <div className='ThumbnailsButton DownloadButton' onClick={DownloadPhotos}>{(selectedImages.length > 1) ? "" : ""}</div> : null}
                    <div className='ThumbnailsButton CloseImage' onClick={props.closeDirectory}></div>
                </div>
            </div>
            <div className='Thumbnails'>
                {thumbnails}
            </div>
            {openImage}
            
        </>
    )
}

export default Thumbnails;
