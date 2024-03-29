import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom';
import {Link} from 'react-router-dom';
import axios from 'axios'
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import {Content, Card} from '../components/shared/Utils';
import {RiTableFill, RiLayoutGridFill} from 'react-icons/ri';
import Fileinput from '../components/shared/Fileinput'
import ImagePreview from '../components/shared/ImagePreview'
import {dataURLtoFile} from '../utils/functions';
import {Table, THead, TBody, TH, Row, TD} from '../components/shared/Table'
import {FaTrash} from 'react-icons/fa'
import {PencilAltIcon} from '@heroicons/react/solid'
import {RiShoppingBag3Fill} from 'react-icons/ri'
import PageSlider from "./PageSlider.jsx";
import baseUrl from '../utils/baseUrl'
import {FaAngleLeft} from 'react-icons/fa'


const Pages = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const shop = query.get('shop');
    const catelog = query.get('catelog');

    const [pages, setPages] = useState([])
    const [table, setTable] = useState(false)
    const [imagePreviews, setImagePreviews] = useState([]);
    const [showImagePreview, setShowImagePreview] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [progress, setProgress] = useState(0);
    const [progressImage, setProgressImage] = useState(0)
    const [progressImageLength, setProgressImageLength] = useState(0)
    const [curUpImg, setCurUpImg] = useState("")


    useEffect(() => {
        fetchData(catelog).then(res => {
            setPages(res?.data)
        }).catch(error => {
            // TODO
            console.log(error)
        })
    }, [])

    async function fetchData(catelog) {
        return axios.get(`${baseUrl}/catelog/page?catelog=${catelog}`)
    }


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

        console.log(files)
        for (let i = 0; i < files.length; i++) {

            const file = files[i];
            const reader = new FileReader();

            reader.onloadend = () => {
                newImages.push(reader.result);
                if (newImages.length === files.length) {
                    setImagePreviews(newImages);
                    setProgressImageLength(newImages.length)
                    setProgressImage(0)
                    setProgress(0);
                }
            }
            reader.readAsDataURL(file);
        }

        toggleImagePreview()
    }


    const onUpload = async () => {
        try {
            const currentPageNo = pages.length > 0 ? pages.length : 0
            console.log({pl: pages.length, ipl: imagePreviews.length})
            const promises = imagePreviews.map(async (img, index) => {

                const dimensions = await getImageDimensions(img)
                const page_no = currentPageNo + 1 + index
                console.log({dimensions, currentPageNo, page_no})

                const pageDto = new FormData()
                console.log({img})
                pageDto.append('shop_id', shop)
                pageDto.append('catelog_book_id', catelog)
                pageDto.append('page_no', page_no)
                pageDto.append('dimensions', JSON.stringify(dimensions))
                pageDto.append('page_image', dataURLtoFile(img, 'page_1'))


                /* axios.post(`${baseUrl}/catelog/page`, pageDto, {
                     onUploadProgress: progressEvent => {
                         console.log(progressEvent);
                         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);

                         setCurUpImg(`Uploading image - ${index}`)
                         if (progressEvent.loaded === progressEvent.total) {
                             setProgressImage(prevState => prevState + 1)
                         }
                         setProgress(progress);
                     }
                 }).then(res => {
                     console.log({add: res})
                     // setProgress(0);
                     // setProgressImage(prevState => prevState + 1)
                     fetchData(catelog).then(res => {
                         setPages(res?.data)
                         console.log({pages: res})
                     }).catch(error => {
                         // TODO
                         console.log(error)
                     })
                 })*/

                return await axios.post(`${baseUrl}/catelog/page`, pageDto, {
                    onUploadProgress: progressEvent => {
                        console.log(progressEvent);
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);

                        setCurUpImg(`Uploading image - ${index + 1}`)
                        if (progressEvent.loaded === progressEvent.total) {
                            setProgressImage(prevState => prevState + 1)
                            setCurUpImg(`Image - ${index + 1} Successfully Uploaded`)
                        }
                        setProgress(progress);
                    }
                })

            })

            Promise.all(promises).then(res => {
                fetchData(catelog).then(res => {
                    setPages(res?.data)
                    console.log({pages: res})
                }).catch(error => {
                    // TODO
                    console.log(error)
                })
            }).catch(error => {
                // TODO
                console.log(error)
            })

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

            const res = await axios.delete(`${baseUrl}/catelog/page/${id}`)
            console.log(res.data)

            const {data} = await fetchData(catelog)
            setPages(data)

        } catch (error) {
            console.log(error)
        }
    }

    const getImageDimensions = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = function () {
                const width = img.width;
                const height = img.height;

                resolve({width, height});
            };

            img.onerror = function () {
                reject(new Error('Failed to load image'));
            };

            img.src = url;
        });
    };

    console.log("render pages", {pages, imagePreviews})
    return (
        <div>
            {/* <Navbar screen/>
            <Sidebar minimize/> */}

            <Link to="/catelog">
                <button className="text-4xl pl-20 fixed z-50 left-6 top-4"><FaAngleLeft/></button>
            </Link>

            {progressImageLength > 0 && <>
                <div className="flex justify-between items-center gap-2">
                    <progress value={progress} max="100" className="flex-1"/>
                    <div>{progress}%</div>
                    <div>{progressImage}/{progressImageLength}</div>
                </div>
                <div className="">{progressImage === progressImageLength ? "All images uploaded" : curUpImg}</div>

            </>}

            {/* <Content expand> */}
            <>
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
                            <button onClick={() => setShowModal(true)}>
                                <RiShoppingBag3Fill className={`w-6 h-6 ${table ? 'fill-blue-400' : 'fill-gray-500'}`}/>
                            </button>

                        </div>

                    </div>

                    {pages.length === 0 &&
                        <div className='w-full h-48 grid place-items-center'>
                            <Fileinput
                                label={'Add pages'}
                                multiple
                                onChange={handleChange}
                            />
                        </div>
                    }

                    {table && pages.length > 0 &&
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
                                                {page._id}
                                            </TD>
                                            <TD>
                                                {page.page_no}
                                            </TD>

                                            <TD>

                                                <img src={page.page_image} alt={page.page_id}
                                                     className='w-40 h-32 object-contain'/>

                                            </TD>
                                            <TD>
                                                <div className='w-full h-full flex items-center justify-center gap-4'>

                                                    <Link to={{
                                                        pathname: '/catelog/pages/items',
                                                        search: `shop=${page.shop_id}&catelog=${page.catelog_book_id}&page=${page._id}`
                                                    }}>
                                                        <RiShoppingBag3Fill
                                                            className='w-6 h-6 fill-emerald-500 cursor-pointer'/>
                                                    </Link>
                                                    <FaTrash onClick={() => onDelete(page._id)}
                                                             className='w-3 h-3 fill-red-500 cursor-pointer'/>
                                                    <PencilAltIcon className='w-4 h-4 fill-blue-500 cursor-pointer'/>

                                                </div>
                                            </TD>
                                        </Row>
                                    )
                                })

                                }

                            </TBody>

                        </Table>
                    }

                    {!table && pages.length > 0 &&
                        <div className='w-full grid grid-cols-5 gap-2'>
                            {
                                pages.map((page) => (
                                    <div key={page._id} className='w-full aspect-square bg-gray-200 relative'>
                                        <Link to={{
                                            pathname: '/catelog/pages/items',
                                            search: `shop=${page.shop_id}&catelog=${page.catelog_book_id}&page=${page._id}`
                                        }}>
                                            <img src={page.page_image} alt={page._id}
                                                 className='w-full h-full object-contain'/>
                                        </Link>
                                        <div className='bg-white w-6 h-6 shadow-lg top-4 right-4'>
                                            <FaTrash onClick={() => onDelete(page._id)}
                                                     className='w-5 h-5 fill-red-500 cursor-pointer absolute top-4 right-4 m-1 bg-white p-1 rounded-full'/>
                                        </div>
                                        <Link to={{
                                            pathname: '/catelog/pages/items',
                                            search: `shop=${page.shop_id}&catelog=${page.catelog_book_id}&page=${page._id}`
                                        }} className='absolute left-4 top-4'>
                                            <RiShoppingBag3Fill className='w-6 h-6 fill-emerald-500 cursor-pointer'/>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                    }
                    <PageSlider showModal={showModal} setShowModal={setShowModal} catalogs={pages}/>


                </Card>
            </>
            {/* </Content> */}
        </div>
    )
}

export default Pages