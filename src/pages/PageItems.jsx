import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import {Content, Card} from "../components/shared/Utils";
import axios from "axios";
import ImageProcessor from "../components/page/ImageProcessor.jsx";
import Modal from "../components/shared/Modal";
import AddPageItems from "../components/page_items/AddPageItems";
import baseUrl from "../utils/baseUrl";
import {FaAngleLeft} from "react-icons/fa";

import image from "../assets/flyer_1.jpg";

const PageItems = (props) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const shop = query.get("shop");
    const catelog = query.get("catelog");
    const page = query.get("page");
    const [pageData, setPageData] = useState(null);
    const [exCoordinates, setExCoordinates] = useState([]);
    const [modal, setModal] = useState(false);
    const [pageItem, setPageItem] = useState({
        shop_id: shop,
        catelog_book_id: catelog,
        catelog_page_id: page,
        product_name: "",
        product_category: "",
        product_sub_category: "",
        product_description: "",
        item_index: 0,
        crop_id: 0,
        quantity: 0,
        unit_price: 0,
        online_sell: false,
        product_image: image, //SET THIS IN IMAGE PROCESSOR
        coordinates: null,
    });
    const [formError, setFormError] = useState('');


    const navigate = useNavigate();
    useEffect(() => {
        console.log("api-call");
        fetchData(page)
            .then((res) => {
                setPageData(res?.data);
                setExCoordinates(
                    res?.data?.items
                        .map((it) => ({...it.coordinates, id: it._id}))
                        .flatMap((a) => a) ?? []
                );
            })
            .catch((error) => {
                // TODO
                console.log(error);
            });
    }, []);

    async function fetchData(pageId) {
        return axios.get(`${baseUrl}/catelog/page/find/${pageId}`);
    }

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleSave = async (payload) => {
        const {crop} = payload;
        let extra;
        console.log({payload});
        if (crop.id) {
            console.log("crop has id", pageData.items);
            extra = {...crop, ...pageData?.items.find((it) => it._id === crop.id)};
        }
        console.log({crop});
        setPageItem((prevState) => ({
            ...prevState,
            product_image: crop.croppedImageUrl,
            coordinates: crop,
            ...extra,
        }));
        toggleModal();
    };

    const handleSaveProduct = async (rest) => {
        try {
            const res = await axios.post(`${baseUrl}/product/insert`, rest);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const onSave = async () => {
        if (pageItem.product_name=="" || pageItem.unit_price ==0 || pageItem.quantity==0) {
            setFormError('Please fill in the required field marked with an asterisk (*).');
        }else{
            setFormError('');
            try {
                const {product_image, ...rest} = pageItem;
                const formData = new FormData();
                formData.append(
                    "product_image",
                    await blobToFile(product_image, `${pageItem.product_name}.jpeg`)
                );
                formData.append("data", JSON.stringify(rest));
                console.log({formData, product_image, rest});
    
                handleSaveProduct(rest);
    
                if (!rest.id) {
                    axios
                        .post(`${baseUrl}/catelog/item`, formData)
                        .then(() => {
                            fetchData(page)
                                .then((res) => {
                                    setPageData(res?.data);
                                    setExCoordinates(
                                        res?.data?.items
                                            .map((it) => ({
                                                ...it.coordinates,
                                                id: it._id,
                                            }))
                                            .flatMap((a) => a) ?? []
                                    );
                                })
                                .catch((error) => {
                                    // TODO
                                    console.log(error);
                                });
                        })
    
                        .catch((error) => {
                            // TODO
                            console.log(error);
                        });
                } else {
                    axios
                        .patch(`${baseUrl}/catelog/item/${rest.id}`, rest)
                        .then(() => {
                            fetchData(page)
                                .then((res) => {
                                    setPageData(res?.data);
                                    setExCoordinates(
                                        res?.data?.items
                                            .map((it) => ({
                                                ...it.coordinates,
                                                id: it._id,
                                            }))
                                            .flatMap((a) => a) ?? []
                                    );
                                })
                                .catch((error) => {
                                    // TODO
                                    console.log(error);
                                });
                        })
    
                        .catch((error) => {
                            // TODO
                            console.log(error);
                        });
                }
    
                toggleModal();
            } catch (error) {
                console.log(error);
            }
        }
        
    };

    async function blobToFile(theBlob, fileName) {
        const response = await fetch(theBlob);
        const blob = await response.blob();
        return new File([blob], fileName);
        // return new File([theBlob], fileName, {lastModified: new Date().getTime(), type: theBlob.type})
    }

    const onCancel = () => {
        toggleModal();
    };

    console.log("page-items-rendered", {pageData, pageItem});
    return (
        <div>
            {/* <Navbar screen/>
            <Sidebar minimize/> */}

            <button
                className="text-4xl pl-20 fixed z-50 left-6 top-4"
                onClick={() => navigate(-1)}
            >
                <FaAngleLeft/>
            </button>

            {pageData && (
                <div>
                    {modal && (
                        <Modal
                            width="w-[60vw]"
                            height="h-[40vw]"
                            onClose={toggleModal}
                            onCancel={onCancel}
                            onSave={onSave}
                            title="Add page product"
                        >
                            <AddPageItems pageItem={pageItem} setPageItem={setPageItem}/>

                            {formError && <div className='text-red-500'>{formError}</div>}

                        </Modal>
                    )}

                    <Card>
                        <ImageProcessor
                            imgSrc={pageData.page_image}
                            exCoordinates={exCoordinates}
                            onClick={handleSave}
                        />
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PageItems;
