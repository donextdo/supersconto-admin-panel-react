import React, {useEffect, useState} from 'react';
import Modal from "../components/shared/Modal.jsx";
import Slider from "react-slick";
import SingleItemPreview from "../components/page/SingleItemPreview.jsx";

function PageSlider({catalogs, showModal, setShowModal}) {
    const [pages, setPages] = useState([])
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2
    };


    useEffect(() => {
        if (catalogs?.length > 0) {

            // const pop = catalogs.map(cat => {
            //     const newCat = {...cat};
            //     getMeta(cat.page_image, (w, h) => {
            //         console.log({w, h})
            //         newCat.imageWidth = w
            //         newCat.imageHeight = h
            //
            //         return newCat
            //     })
            //     return newCat
            // })

            setPages(catalogs)
        }
    }, [catalogs])


    function getMeta(url, callback) {
        const img = new Image();
        img.src = url;
        img.onload = function () {
            callback(this.width, this.height);
        }
    }

    // console.log({catalogs, pages})
    return (
        <div className="page-slider">
            {showModal &&
                <Modal
                    onClose={() => setShowModal(false)}
                    onCancel={() => setShowModal(false)}
                    title='All Pages'
                    width='full-width'
                >


                    <Slider {...settings}>
                        {
                            pages.length > 0 && pages.map((item, index) => (
                                <div key={`page-slider-${index}`}>
                                    <SingleItemPreview
                                        coordinates={item.items.map(it => it.coordinates).flatMap(a => a)}
                                        strokeImageUrl={item.page_image}
                                        height={300}
                                        width={200}
                                        handleSelection={({crop, index}) => {
                                            console.log(item)
                                        }}
                                        imageHeight={item?.items[0]?.coordinates?.imageHeight} imageWidth={item?.items[0]?.coordinates?.imageWidth}/>
                                </div>
                            ))
                        }
                    </Slider>
                </Modal>
            }
        </div>
    );
}

export default PageSlider;