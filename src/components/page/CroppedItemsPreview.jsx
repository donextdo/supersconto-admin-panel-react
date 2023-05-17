import React from 'react';
import Slider from "react-slick";

function CroppedItemsPreview({cropImageUrl, handleRemove}) {
    const settings = {
        dots: true,
        arrows: false,
        infinite: false,
        swipe: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    return (
        <div className="previewer">
            {cropImageUrl.length > 0 ?
                <Slider {...settings}>
                    {
                        cropImageUrl.map((url, index) =>
                            (
                                <div key={`prev ${index}`}>
                                    <img alt="Crop" style={{maxWidth: '250px', minWidth: '100px'}}
                                         src={url.croppedImageUrl} onClick={() => handleRemove(url.index)}/>
                                </div>
                            )
                        )}

                </Slider>
                : <p className="m-auto text-center opacity-50">No items</p>

            }

        </div>
    );
}

export default CroppedItemsPreview;