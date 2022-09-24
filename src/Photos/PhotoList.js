import React from 'react';

function PhotoList(props) {
    const photoData = props.photoData;

    function DirectoryList(data, depth) {
        if(Object.keys(data).length === 0)  { return []; }
        const currentList = [];
        const directoryPath = data.directory;
        const directoryName = data.name || directoryPath.slice(0, -1).substring(directoryPath.slice(0, -1).lastIndexOf('/')+1);
        const fileCount = data.contents.filter(value => {return (!(typeof value === 'object'))}).length;

        currentList.push(<div key={directoryPath} className="DirectoryName" style={{"paddingLeft": `${depth}rem`, background: `hsla(0, 50%, 50%, ${depth*0})`}}><span className={`${fileCount > 0 ? "DirectoryLink" : ""}`} onClick={fileCount > 0 ? () => OpenDirectory(directoryPath) : null}>{directoryName}</span> ({fileCount})</div>);
        data.contents.forEach(element => {
            if(typeof element === 'string') {
                //currentList.push(<div>filename: {path}</div>);
            }
            else if(typeof element === 'object') {
                currentList.push(DirectoryList(element, depth+1));
            }
        });
        return currentList;
    }

    const photoList = <div className='PhotoList'>{DirectoryList(photoData, 0)}</div>

    function OpenDirectory(directoryPath) {
        props.setCurrentDirectory(directoryPath);
        console.log(directoryPath);
    }
    
    return(photoList);
}


export default PhotoList;