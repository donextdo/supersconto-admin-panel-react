import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import {Content, Card} from '../components/shared/Utils';
import axios from "axios";
import ImageProcessor from "../components/page/ImageProcessor.jsx";


const PageItems = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const shop = query.get('shop');
    const catelog = query.get('catelog');
    const page = query.get('page')
    const [pageData, setPageData] = useState(null)

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

    console.log('page-items-rendered', {pageData})
    return (
        <div>
            <Navbar screen/>
            <Sidebar minimize/>

            {pageData && <Content expand>

                <Card>

                    <ImageProcessor imgSrc={pageData.page_image}/>
                    <h1>crop part here</h1>

                    <code>shop id = {shop}</code>
                    <code>catelog id = {catelog}</code>
                    <code>catelog page id = {page}</code>

                </Card>

            </Content>}
        </div>
    )
}

export default PageItems