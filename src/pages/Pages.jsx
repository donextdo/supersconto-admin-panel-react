import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import { Content, Card } from '../components/shared/Utils';
import { RiTableFill, RiLayoutGridFill } from 'react-icons/ri';
import Fileinput from '../components/shared/Fileinput'
import ImagePreview from '../components/shared/ImagePreview'
import { dataURLtoFile } from '../utils/functions';
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import { FaTrash } from 'react-icons/fa'
import { PencilAltIcon } from '@heroicons/react/solid'
import { RiShoppingBag3Fill } from 'react-icons/ri'


const Pages = () => {

const location = useLocation();
const query = new URLSearchParams(location.search);
const shop = query.get('shop');
const catelog = query.get('catelog');

const [pages, setPages] = useState([])
const [table, setTable] = useState(false)
const [imagePreviews, setImagePreviews] = useState([]);
const [showImagePreview, setShowImagePreview] = useState(false)

const fetchData = async () => {
    try {
        const { data } = await axios.get(`http://apidev.marriextransfer.com/v1/api/catelog/page?catelog=${catelog}`)

        setPages(data)

    } catch (error) {
        console.log(error)
    }
}

useEffect(() => {
    fetchData()
}, [pages])

const toggleTable = (type) => {
    type == 'table' && setTable(true)
    type == 'grid' && setTable(false)
}

const toggleImagePreview = () => {
    setShowImagePreview(!showImagePreview)
}

const handleChange = (event) => {
    const files = event.target.files;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {

      const file = files[i];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          setImagePreviews(newImages);
        }
      }
      reader.readAsDataURL(file);
    }

    toggleImagePreview()
}


const onUpload = async () => {
    try {

        imagePreviews.forEach(async (img, index) => {
            
            const currentPageNo = pages.length > 0 ? pages[pages.length - 1].page_no : 0
            const page_no = currentPageNo + ++index

            const pageDto = new FormData()

            pageDto.append('shop_id', shop)
            pageDto.append('catelog_book_id', catelog)
            pageDto.append('page_no', page_no)
            pageDto.append('page_image', dataURLtoFile(img, 'page_1'))


            const {data} = await axios.post('http://apidev.marriextransfer.com/v1/api/catelog/page', pageDto)

        })

        fetchData()
        setImagePreviews(null)
        toggleImagePreview()
        

    } catch (error) {
        console.log(error)
    }
}

const onCancel = () => {
    toggleImagePreview()
}

const onDelete = async (id) => {
    try {

        const res = await axios.delete(`http://apidev.marriextransfer.com/v1/api/catelog/page/${id}`)
        console.log(res.data)

        fetchData()

    } catch (error) {
        console.log(error)
    }
}

  return (
    <div>
        <Navbar screen/>
        <Sidebar minimize />
        
        <Content expand>

            {
                showImagePreview && 
                <ImagePreview
                    images={imagePreviews}
                    onClose={toggleImagePreview}
                    onCancel={onCancel}
                    onUpload={onUpload}
                    setImagePreviews={setImagePreviews}
                />
            }

            <Card>

            <div className='w-full py-4 flex gap-6 items-center border-b border-gray-200 mb-4'>

                {pages.length > 0 &&
                    <Fileinput 
                        label={'Add pages'}
                        multiple
                        onChange={handleChange}
                    />
                }

                <div className='ml-auto flex gap-2'>
                    <button onClick={() => toggleTable('table')}>
                        <RiTableFill className={`w-6 h-6 ${table ? 'fill-blue-400' : 'fill-gray-500'}`}/>
                    </button>
                    
                    <button onClick={() => toggleTable('grid')}>
                        <RiLayoutGridFill className={`w-6 h-6 ${!table ? 'fill-blue-400' : 'fill-gray-500'}`}/>
                    </button>
                    
                </div>

            </div>

            { pages.length === 0 &&
                <div className='w-full h-48 grid place-items-center'>
                <Fileinput 
                    label={'Add pages'}
                    multiple
                    onChange={handleChange}
                />
            </div>
            }

            { table && pages.length > 0 &&
            <Table>

            <THead>
                <TH title={'Id'}/>
                <TH title={'Page No'}/>
                <TH title={'Page Image'}/>
                <TH title={'Actions'}/>
            </THead>

            <TBody>

            {pages.map(page => {
                return (
                <Row key={page._id}>
                    <TD>
                    { page._id }
                    </TD>
                    <TD>
                    { page.page_no }
                    </TD>

                    <TD>

                        <img src={page.page_image} alt={page.page_id} className='w-40 h-32 object-contain' />

                    </TD>
                    <TD>
                    <div className='w-full h-full flex items-center justify-center gap-4'>

                        <Link to={{ pathname: '/catelog/pages/items', search: `shop=${page.shop_id}&catelog=${page.catelog_book_id}&page=${page._id}` }}>
                        <RiShoppingBag3Fill className='w-6 h-6 fill-emerald-500 cursor-pointer'/>
                        </Link>
                        <FaTrash onClick={() => onDelete(page._id)} className='w-3 h-3 fill-red-500 cursor-pointer'/>
                        {/* <PencilAltIcon className='w-4 h-4 fill-blue-500 cursor-pointer'/> */}

                    </div>  
                    </TD>
                </Row>
                )
            })

            }

            </TBody>

            </Table>
            }

            { !table && pages.length > 0 && 
                <div className='w-full grid grid-cols-5 gap-2'>
                    {
                        pages.map((page) => (
                            <div key={page._id} className='w-full aspect-square bg-gray-200 relative'>
                                <img src={page.page_image} alt={page._id} className='w-full h-full object-contain' />
                                <FaTrash onClick={() => onDelete(page._id)} className='w-3 h-3 fill-red-500 cursor-pointer absolute top-4 right-4'/>

                                <Link to={{ pathname: '/catelog/pages/items', search: `shop=${page.shop_id}&catelog=${page.catelog_book_id}&page=${page._id}` }} className='absolute left-4 top-4'>
                                    <RiShoppingBag3Fill className='w-6 h-6 fill-emerald-500 cursor-pointer'/>
                                </Link>
                            </div>
                        ))
                    }
                </div>  
            }

            </Card>

        </Content>
    </div>
  )
}

export default Pages