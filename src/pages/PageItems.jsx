import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import {Content, Card} from '../components/shared/Utils';
import axios from "axios";
import ImageProcessor from "../components/page/ImageProcessor.jsx";
import Modal from '../components/shared/Modal'
import AddPageItems from '../components/page_items/AddPageItems'
import baseUrl from '../utils/baseUrl'

import image from '../assets/flyer_1.jpg'


const PageItems = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const shop = query.get('shop');
    const catelog = query.get('catelog');
    const page = query.get('page')
    const [pageData, setPageData] = useState(null)
    const [exCoordinates, setExCoordinates] = useState([])
    const [modal, setModal] = useState(false)
    const [pageItem, setPageItem] = useState({
        shop_id: shop,
        catelog_book_id: catelog,
        catelog_page_id: page,
        product_name: '',
        product_category: '',
        product_description: '',
        item_index: 0,
        crop_id: 0,
        quantity: 0,
        unit_price: 0,
        online_sell: false,
        product_image: image, //SET THIS IN IMAGE PROCESSOR
        coordinates: null
    })

    useEffect(() => {
        console.log('api-call')
        fetchData(page).then(res => {
            setPageData(res?.data)
            setExCoordinates(res?.data?.items.map(it => it.coordinates).flatMap(a => a) ?? [])
        }).catch(error => {
            // TODO
            console.log(error)
        })
    }, [])

    async function fetchData(pageId) {
        return axios.get(`${baseUrl}/catelog/page/find/${pageId}`);
    }

    const toggleModal = () => {
        setModal(!modal)
    }

    const handleSave = async (payload) => {
        const {croppedImages, index, crop} = payload
        console.log({payload})
        setPageItem(prevState => ({...prevState, product_image: croppedImages[index], coordinates: crop}))
        toggleModal()
    }

    const onSave = async () => {
        try {
            const {product_image, ...rest} = pageItem
            const formData = new FormData();
            formData.append('product_image', await blobToFile(product_image, `${pageItem.product_name}.jpeg`))
            formData.append('data', JSON.stringify(rest))
            console.log({formData, product_image, rest})
            const {data} = await axios.post(`${baseUrl}/catelog/item`, formData)
            toggleModal()

        } catch (error) {
            console.log(error)
        }
    }

    async function blobToFile(theBlob, fileName) {

        const response = await fetch(theBlob);
        const blob = await response.blob();
        return new File([blob], fileName);
        // return new File([theBlob], fileName, {lastModified: new Date().getTime(), type: theBlob.type})
    }

    const onCancel = () => {
        toggleModal()
    }


    console.log('page-items-rendered', {pageData})
    return (
        <div>
            <Navbar screen/>
            <Sidebar minimize/>

            {pageData && <Content expand>

                {modal &&
                    <Modal
                        width='w-[60vw]'
                        onClose={toggleModal}
                        onCancel={onCancel}
                        onSave={onSave}
                        title='Add page product'>

                        <AddPageItems pageItem={pageItem} setPageItem={setPageItem}/>

                    </Modal>
                }

                <Card>

                    <ImageProcessor
                        imgSrc={pageData.page_image}
                        exCoordinates={exCoordinates}
                        onClick={handleSave}
                    />

                </Card>

            </Content>}
        </div>
    )
}

export default PageItems