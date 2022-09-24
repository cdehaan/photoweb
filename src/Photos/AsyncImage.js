import React, { useEffect, useState } from 'react';

const AsyncImage = (props) => {
    const index = props.index;
    const username = props.username;
    const token = props.token;
    const fullPath = props.fullPath;
    const filename = fullPath?.split('\\').pop().split('/').pop();

    const [loaded, setLoaded] = useState(false);
    const [imgUrl, setImgUrl] = useState(null);

    useEffect(() => {
        setLoaded(false);
        async function PullPhoto() {
            if(!fullPath) { return; }
            if(!token) { return; }
            const pullPhotoEndpoint = (process.env.NODE_ENV === 'development' ? "http://localhost/photoweb/public/" : "") + `pullPhoto.php`;
            const pullPhotoData = {fullPath: fullPath, username: username, token: token};

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
    }, [fullPath, token]);

    if (loaded === true) {
        return (
            <>
                <img className='ThumbnailImg' src={imgUrl} index={index} alt="" />
                <a href={imgUrl} download={filename} index={index} />
            </>
        );
    }
    return <img alt="loading" />;
};

export default AsyncImage;