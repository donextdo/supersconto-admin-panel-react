import React, {useRef} from 'react';

function SingleItemPreview({strokeImageUrl, coordinates, imageWidth, imageHeight, handleSelection}) {
    const imageRef = useRef()

    return (
        <div style={{position: "relative", flexBasis: '50%'}}>
            {strokeImageUrl && <>
                <img alt="Crop" src={strokeImageUrl} ref={imageRef}/>
                {coordinates.map((crop, index) => {
                    if (!isNaN(imageRef.current?.width)) {
                        const scaleX = imageRef.current?.width / imageWidth;
                        const scaleY = imageRef.current?.height / imageHeight;
                        console.log(scaleX, scaleY, imageRef.current?.width, imageWidth)
                        return (
                            <div className="selection-div" key={`interactive-div-${index}`} style={{
                                width: crop.width * scaleX,
                                height: crop.height * scaleY,
                                transform: `translate(${crop.x * scaleX}px, ${crop.y * scaleY}px)`
                            }} onClick={() => handleSelection({crop, index, strokeImageUrl})}>
                            </div>
                        )
                    }
                })}
            </>}
        </div>
    );
}

export default SingleItemPreview;