import React from 'react';

function PhotoList(props) {
    function DirectoryList(data, depth) {
        if(Object.keys(data).length === 0)  { return []; }
        if(Object.values(data)[0] === null) { return []; }
        const currentList = [];
        const directoryPath = Object.keys(data)[0];
        const directoryName = directoryPath.slice(0, -1).substring(directoryPath.slice(0, -1).lastIndexOf('/')+1);
        const fileCount = Object.values(data)[0].filter(value => {return (!(typeof value === 'object'))}).length;

        currentList.push(<div key={directoryPath} className="DirectoryName" style={{"paddingLeft": `${depth}rem`, background: `hsla(0, 50%, 50%, ${depth*0})`}}><span className={`${fileCount > 0 ? "DirectoryLink" : ""}`} onClick={fileCount > 0 ? () => OpenDirectory(directoryPath) : null}>{directoryName}</span> ({fileCount})</div>);
        Object.values(data).forEach(value => {
            if(Array.isArray(value)) {
                value.forEach(path => {
                    if(typeof path === 'string') {
                        //currentList.push(<div>filename: {path}</div>);
                    }
                    else if(typeof path === 'object') {
                        currentList.push(DirectoryList(path, depth+1));
                    }
                });
            }
        });
        return currentList;
    }

    const photoList = <div className='PhotoList'>{DirectoryList(props.photoData, 0)}</div>

    function OpenDirectory(directoryPath) {
        props.setCurrentDirectory(directoryPath);
        console.log(directoryPath);
    }
    
    return(photoList);
}


export default PhotoList;