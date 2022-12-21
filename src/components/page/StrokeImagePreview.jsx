import React from 'react';

function StrokeImagePreview({strokeImageUrl}) {
    return (
        <div>
            {strokeImageUrl &&
                <img alt="Crop" src={strokeImageUrl}/>}
        </div>
    );
}

export default StrokeImagePreview;