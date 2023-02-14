import React from 'react';

function CroppedItemsPreview({cropImageUrl, handleRemove}) {

    return (
        <div>
            <div className="previewer">{cropImageUrl.length > 0 && cropImageUrl.map((url, index) =>
                (
                    <img key={`prev ${index}`} alt="Crop" style={{maxWidth: '250px', minWidth: '100px'}} src={url.croppedImageUrl} onClick={() =>handleRemove(url.index)}/>
                )
            )}</div>
        </div>
    );
}

export default CroppedItemsPreview;