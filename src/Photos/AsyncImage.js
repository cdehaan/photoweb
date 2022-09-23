import React, { useEffect, useState } from 'react';

const AsyncImage = (props) => {
    const src = props.src;
    const token = props.token;
    const [loaded, setLoaded] = useState(false);
    const [imgUrl, setImgUrl] = useState(null);

    useEffect(() => {
        setLoaded(false);
        async function PullPhoto() {
            if(!src) { return; }
            if(!token) { return; }
            const pullPhotoEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "../") + `pullPhoto.php`;
            const pullPhotoData = {src: src, token: token};

            const response = await fetch(pullPhotoEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pullPhotoData)
            });

            if (response.status === 200) {
                const responseBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(responseBlob);
                setImgUrl(imageObjectURL);
                setLoaded(true);
            }
        }

        PullPhoto();

    }, [src, token]);

    if (loaded === true) {
        return (
            <img className='ThumbnailImg' src={imgUrl} alt="" />
        );
    }
    return <img alt="loading" />;
};

export default AsyncImage;