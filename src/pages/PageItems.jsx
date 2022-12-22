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

import image from '../assets/flyer_1.jpg'


const PageItems = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const shop = query.get('shop');
    const catelog = query.get('catelog');
    const page = query.get('page')
    const [pageData, setPageData] = useState(null)
    const [modal, setModal] = useState(false)
    const [pageItem, setPageItem] = useState({
        shop_id: shop,
        catelog_book_id: catelog,
        catelog_page_id: page,
        product_name: '',
        product_catergory: '',
        product_description: '',
        item_index: 0,
        crop_id: 0,
        quantity: 0,
        unit_price: 0,
        product_image: image, //SET THIS IN IMAGE PROCESSOR
        demensions: null
    })

    useEffect(() => {
        fetchData(page).then(res => {
            setPageData(res?.data)
        }).catch(error => {
            // TODO
            console.log(error)
        })
    }, [])

    async function fetchData(pageId) {
        return axios.get(`http://apidev.marriextransfer.com/v1/api/catelog/page/find/${pageId}`);
    }

    const toggleModal = () => {
        setModal(!modal)
    }

    const onSave = async () => {
        try {
    
          console.log('on save')
    
        } catch (error) {
          console.log(error)
        }
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
                    
                    <AddPageItems pageItem={pageItem} setPageItem={setPageItem} />

                    </Modal>
                }

                <Card>

                    <ImageProcessor imgSrc={pageData.page_image} onClick={toggleModal}/>

                </Card>

            </Content>}
        </div>
    )
}

export default PageItems