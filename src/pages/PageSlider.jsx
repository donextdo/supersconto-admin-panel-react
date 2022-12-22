import React, {useState} from 'react';
import Modal from "../components/shared/Modal.jsx";
import Slider from "react-slick";

function PageSlider({items, showModal, setShowModal}) {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2
    };

    console.log(items)
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
                            items.length > 0 && items.map((item,index) => (
                                <div key={`page-slider-${index}`}>
                                   <div className="image-container">
                                       <img className="slider-img" src={item.page_image} alt=""/>
                                   </div>
                                </div>
                            ))}
                    </Slider>
                </Modal>
            }
        </div>
    );
}

export default PageSlider;