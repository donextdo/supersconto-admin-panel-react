import React from 'react';

function CroppedItemsPreview({cropImageUrl, handleRemove}) {

    return (
        <div>
            <div className="previewer">{cropImageUrl.length > 0 && cropImageUrl.map((url, index) =>
                (
                    <img key={`prev ${index}`} alt="Crop" style={{maxWidth: '50%', minWidth: '50%'}} src={url} onClick={() =>handleRemove(index)}/>
                )
            )}</div>
        </div>
    );
}

export default CroppedItemsPreview;