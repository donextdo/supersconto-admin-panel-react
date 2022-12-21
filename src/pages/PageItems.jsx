import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import { Content, Card } from '../components/shared/Utils';


const PageItems = () => {

const location = useLocation();
const query = new URLSearchParams(location.search);
const shop = query.get('shop');
const catelog = query.get('catelog');
const page = query.get('page')


  return (
    <div>
        <Navbar screen/>
        <Sidebar minimize />
        
        <Content expand>

            <Card>

                {/* TODO */}
                <h1>crop part here</h1>

                <code>shop id = {shop}</code>
                <code>catelog id = {catelog}</code>
                <code>catelog page id = {page}</code>

            </Card>

        </Content>
    </div>
  )
}

export default PageItems