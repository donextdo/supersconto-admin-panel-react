import React, {useEffect, useRef} from 'react';

function SingleItemPreview({strokeImageUrl, coordinates, imageWidth, imageHeight, handleSelection, width, height}) {

    console.log({width, height, imageWidth, imageHeight, coordinates})
    return (
        <div style={{position: "relative", maxWidth: width, height}}>
            {strokeImageUrl && <>
                <img alt="Crop" src={strokeImageUrl} style={{maxWidth: width, height}}/>
                {coordinates.map((crop, index) => {
                    const scaleX = width / imageWidth;
                    const scaleY = height / imageHeight;
                    return (
                        <div className={`selection-div ${crop?.id ? 'active' : ''}`} key={`interactive-div-${index}`}
                             style={{
                                 width: crop.width * scaleX,
                                 height: crop.height * scaleY,
                                 transform: `translate(${crop.x * scaleX}px, ${crop.y * scaleY}px)`
                             }}
                             onClick={() => handleSelection({
                                 crop: {...crop, imageWidth, imageHeight},
                                 index,
                                 imageWidth,
                                 imageHeight
                             })}>
                        </div>
                    )
                })}
            </>}
        </div>
    );
}

export default SingleItemPreview;