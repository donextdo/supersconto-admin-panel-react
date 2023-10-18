import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Card} from '../components/shared/Utils'
import {Row, Table, TBody, TD, TH, THead} from '../components/shared/Table'
import {FaTrash} from 'react-icons/fa'
import {ClipboardCopyIcon, PencilAltIcon, XCircleIcon, XIcon} from '@heroicons/react/solid'
import {MdArrowDropDown, MdPreview} from "react-icons/md";
import axios from 'axios'
import {ButtonDanger, ButtonSuccess} from '../components/shared/Button'
import {RiAddCircleLine, RiFilter2Fill, RiPagesFill,} from 'react-icons/ri'
import Modal from '../components/shared/Modal'
import Form from '../components/catelog/Form'
import {convertToTitleCase, normalizeDate} from '../utils/functions'
import {Link} from 'react-router-dom'
import baseUrl, {clientAppUrl} from '../utils/baseUrl'
import {toast, ToastContainer} from 'react-toastify';
import CustomTooltip from '../components/shared/Tooltip'
import Swal from "sweetalert2";
import DropdownComponent from "../components/advanced-filter/DropdownComponent.jsx";

const Catalog = () => {

  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [updateMode, setUpdateMode] = useState(false)
  const [catelog, setCatelog] = useState({
    _id: '',
    shops: [],
    title: '',
    description: '',
    expiredate: '',
    startdate:'',
    flyer: false,
    active: false,
  })
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entries, setEntries] = useState(10);
  const [showClonePopup, setShowClonePopup] = useState(false)
  const [shops, setShops] = useState([])
  const [cloneData, setCloneData] = useState({catalog: null, shops:[]})

  // shop
  const [filterData, setFilterData] = useState({})
  const [filterData2, setFilterData2] = useState({})
  const [filterOptions, setFilterOptions] = useState([])
  const [itemsPerPageShop, setItemsPerPageShop] = useState(20);
  const [totalPagesShop, setTotalPagesShop] = useState(1);
  const [pageShop, setPageShop] = useState(1);
  const [dataShop, setDataShop] = useState([])
  const [loadingShop, setLoadingShop] = useState(false)

  const observer = useRef();


  const userData = sessionStorage.getItem("user") ? JSON.parse(atob(sessionStorage.getItem("user"))) : null
  const token = localStorage.getItem("token") ? localStorage.getItem("token") : null
  console.log({ userData })
  const isAdmin = userData?.userType === 0;

  useEffect(() => {
    fetchData();
  }, [page, search, entries]);

  useEffect(() => {
    setDataShop([])
  }, [filterData2])

  useEffect(() => {
    let cancel
    setLoadingShop(true)
    async function fetchData() {
      let res
      try {

        if (userData) {
          if (isAdmin) {
            res = await axios.post(`${baseUrl}/shop/apply-filters`, {
              filterData:filterData2,
              params: {
                page,
                search,
                itemsPerPageShop,
              },
            },{
              cancelToken: new axios.CancelToken(c => cancel = c)
            });
          } else {
            res = await axios.post(`${baseUrl}/shop/apply-filters-vendor`, {
              filterData: {...filterData2, vendorId: userData?._id},
              params: {
                page,
                search,
                itemsPerPageShop,
              },
            },{
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`,
                'Accept': "application/json"
              },
              cancelToken: new axios.CancelToken(c => cancel = c)
            });
          }
        }
        const filtersRes = await axios.get(`${baseUrl}/shop/filters`);
        console.log(res.data)
        setFilterOptions(filtersRes.data)
        setDataShop(prev => [...prev,...res.data.shops]);
        // setDataShop(prev => [...prev,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops,...res.data.shops]);
        setTotalPagesShop(res.data.totalPages)
        setLoadingShop(false)
      } catch (err) {
        setLoadingShop(false)
        console.log(err);
      }
    }

    fetchData();

    return () => cancel()
  }, [pageShop, itemsPerPageShop,filterData2]);


  const lastShopElement = useCallback((node) => {
    if (loadingShop) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      console.log("IntersectionObserver", entries[0].isIntersecting)

      if (entries[0].isIntersecting && (page < totalPagesShop)) {
        console.log("updates")
        setPageShop(prevState => prevState + 1)
      }
    })
    if (node) observer.current.observe(node)
  },[loadingShop, totalPagesShop])


  async function fetchData() {
    try {
      let res = []
      if (userData) {
        if (userData?.userType === 0) {
          console.log("fetching admin")
          res = await axios.get(`${baseUrl}/catelog/book/getall`,{
            params: {
                page,
                search,
                entries,
            },
        });
        } else {
          console.log("fetching vendor")
          res = await axios.get(`${baseUrl}/catelog/book/by-vendor/${userData?._id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Authorization': `Bearer ${token}`,
              'Accept': "application/json"
            }
          });
        }
      }
      setData(res.data.catelogBooks);
      setTotalPages(res.data.pagination.totalPages)
      console.log("data : ", res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const toggleModal = () => {
    setModal(!modal)
    setCatelog({
      _id: '',
      shops: [],
      title: '',
      description: '',
      expiredate: '',
      startdate:'',
      flyer: false,
      active: false


    })
    setUpdateMode(false)
    setCloneData({catalog: null, shops:[]})
    resetFilter()

  }

  const onSave = async () => {
    console.log(catelog)
    if (catelog.shops.length === 0 || catelog.title === '' || catelog.expiredate === '') {
      setFormError('Please fill in the required field marked with an asterisk (*).');
    } else {

      setFormError('');

      try {

        const { _id, ...catalogData } = catelog

        if (!updateMode) {
          await axios.post(`${baseUrl}/catelog/book`, catalogData)
        }
        else {
          const {shops,...sendData} = catalogData
          sendData.shop_id = shops[0]
          await axios.patch(`${baseUrl}/catelog/book/${catelog._id}`, sendData)
        }

        fetchData()

        setCatelog({
          _id: '',
          shops: [],
          title: '',
          description: '',
          expiredate: '',
          startdate:'',
          flyer: false,
          active: false


        })

        setModal(!modal)
        return toast.success('Data saved successfully')

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }


  }

  const onCancel = () => {
    toggleModal()
  }

  const onDelete = async (id) => {
    try {
      Swal.fire({
        title: 'Delete',
        text: 'Are you sure you want to delete this catelog page?',
        icon: 'warning',
        showCancelButton: true, // Add this line to show the cancel button
        confirmButtonText: 'Done',
        cancelButtonText: 'Cancel', // Add this line to set the cancel button text
        confirmButtonColor: '#8DC14F',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await axios.delete(`${baseUrl}/catelog/book/${id}`)
          console.log(res.data)

          fetchData()
          toast.success('Data deleted successfully')
        }
      });
      // const res = await axios.delete(`${baseUrl}/catelog/book/${id}`)
      // console.log(res.data)

      // fetchData()
      // return toast.success('Data deleted successfully')


    } catch (error) {
      toast.error(error.message)
    }
  }

  const onUpdate = async (d) => {
    setModal(true)
    setCatelog({
      _id: d._id,
      shops: [d.shop_id._id],
      title: d.title,
      description: d.description,
      expiredate: d.expiredate,
      flyer: d.flyer,
      active: d.active,
      startdate: d.startdate ? d.startdate : '',
    })
    setUpdateMode(true)
    console.log(d)
    console.log(catelog)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPageButtons = () => {
    const maxVisibleButtons = 5; // Adjust as needed
    const buttons = [];

    if (totalPages <= maxVisibleButtons) {
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            buttons.push(
                <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`py-1 px-2 text-white  ${page === pageNum ? 'border-2 border-black bg-gray-400' : 'bg-gray-400 border'}`}
                >
                    {pageNum}
                </button>
            );
        }
    } else {
        const startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        if (startPage > 1) {
            buttons.push(
                <button key="1" onClick={() => handlePageChange(1)}>
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(<span key="ellipsis-start">...</span>);
            }
        }

        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
            buttons.push(
                <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`py-1 px-2 text-white  ${page === pageNum ? 'border-2 border-black bg-gray-400' : 'bg-gray-400 border'}`}

                >
                    {pageNum}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="ellipsis-end">...</span>);
            }
            buttons.push(
                <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </button>
            );
        }
    }

    return buttons;
}

  const onCloneDataSubmit = () => {
    console.log({cloneData})

    if(cloneData.shops.length === 0) {
      toast.error('No shops are selected')
    }
    else {
      Swal.fire({
        title: 'Clone',
        text: `Are you sure you want clone ${cloneData.catalog.title} to selected shops ?`,
        icon: 'info',
        showCancelButton: true, // Add this line to show the cancel button
        confirmButtonText: 'Clone',
        cancelButtonText: 'Cancel', // Add this line to set the cancel button text
        confirmButtonColor: '#8DC14F',
      }).then(async (result) => {
        if (result.isConfirmed) {

          axios.post(`${baseUrl}/catelog/book/clone`, {
            shops: cloneData.shops.map(shop => shop.value),
            catalogId: cloneData.catalog._id
          }).then(res => {
            toast.success('Catalog cloned successfully')
          }).catch((error) => {
            toast.error('Catalog cloned failed')
          }).finally(() => {
            fetchData()
            setCloneData({catalog: null, shops:[]})
            setShowClonePopup(false)
          })
        }
      });
    }
  }

  const handleFilterClick = (filter,value) => {
    console.log({filter, value})
    setFilterData(prevState => ({...prevState, [filter]:value}))
  }

  console.log(filterData)
  const applyFilter = async () => {
    setFilterData2(filterData)
    setPageShop(1)
  }

  const resetFilter = () => {
    setFilterData({})
    setFilterData2({})
  }

  console.log({dataShop, cloneData, catelog})
  return (
    <div>
      {/* <Sidebar />
        <Navbar />

        <Content> */}
      <>

        <ToastContainer />
        {modal &&
            <Modal
                onClose={toggleModal}
                onCancel={onCancel}
                onSave={onSave}
                title={updateMode ? "Update Catalog" : "Add Catalog"}
                styleClass={!updateMode ? "max-h-[80vh] w-full": ""}
                width={!updateMode ? 'w-[80vw]': ""}
            >

              <Form
                  catelog={catelog}
                  setCatelog={setCatelog}
              >
                <DropdownComponent topic="Shop Filter" styleClass="advanced-filter" bodyStyleClass="flex gap-4 flex-wrap">
                  <>
                    <div className="selected-filters flex flex-wrap items-center w-full gap-4 pt-2">
                      {Object.keys(filterData).map((data, index) => (
                          <div className="flex flex-1 items-center justify-between border-2 basis-1/5 max-w-[250px]"
                               key={`${data}-${index}`}>
                            <span className="truncate">{convertToTitleCase(data)} : {filterData[data]}</span>
                            <span className="remove-filter cursor-pointer  flex-shrink-0" onClick={() => {
                              const updatedFilterData = {...filterData};
                              delete updatedFilterData[data];
                              setFilterData(updatedFilterData);
                            }}><XIcon className='w-4 h-4 fill-blue-500  flex-shrink-0 pointer-events-none'/></span>

                          </div>
                      ))}
                      <ButtonSuccess onClick={applyFilter}>
                        <RiFilter2Fill className="w-5 h-5"/>
                        <span>Apply filter</span>
                      </ButtonSuccess>
                      <ButtonDanger onClick={resetFilter}>
                        <XCircleIcon className="w-5 h-5"/>
                        <span>Reset</span>
                      </ButtonDanger>
                    </div>

                    {Object.keys(filterOptions).map((topic, index) => {

                      return (

                          <DropdownComponent key={`${topic}-${index}`} topic={topic} styleClass="filter-item">
                            <ul>
                              {
                                filterOptions[topic].map((item, index) => (
                                    <li key={`${item}-${index}`}
                                        onClick={() => handleFilterClick(topic, item)}>{item}</li>
                                ))
                              }
                            </ul>
                          </DropdownComponent>
                      )
                    })}

                  </>

                </DropdownComponent>

                <ul className="overflow-y-auto max-h-[200px]">
                  {dataShop.length > 0 && dataShop.map((d, index) => {
                    if (dataShop.length === index + 1) {
                      return (
                          <li ref={lastShopElement} key={`${d.shop_name} ${index}`}>
                            <label>
                              <input
                                  className="m-2 ml-0"
                                  type="checkbox"
                                  checked={catelog?.shops?.some(shop => shop === d._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setCatelog(prev => ({...prev, shops: updateMode ? [d._id] : [...prev.shops, d._id]}))
                                    }
                                    else {
                                      setCatelog(prev => ({
                                        ...prev,
                                        shops: prev.shops.filter(shop => shop !== d._id)
                                      }));
                                    }

                                  }}
                              />
                              {`${d.shop_name} - ${d.address.address ? d.address.address : ''} ${d.address.state ? d.address.state : ''} ${d.address.postal_code ? d.address.postal_code : ''}`}
                            </label>
                          </li>
                      )
                    } else {
                      return (
                          <li key={`${d.shop_name} ${index}`}>
                            <label>
                              <input
                                  className="m-2 ml-0"
                                  type="checkbox"
                                  checked={catelog?.shops?.some(shop => shop === d._id)}
                                  onChange={(e) => {
                                    if (e.target.checked)
                                      setCatelog(prev => ({...prev, shops: updateMode ? [d._id] : [...prev.shops, d._id]}))
                                    else
                                      setCatelog(prev => ({
                                        ...prev,
                                        shops: prev.shops.filter(shop => shop !== d._id)
                                      }));
                                  }}
                              />
                              {`${d.shop_name} - ${d.address.address ? d.address.address : ''} ${d.address.state ? d.address.state : ''} ${d.address.postal_code ? d.address.postal_code : ''}`}
                            </label>
                          </li>
                      )
                    }
                  })}
                </ul>

              </Form>
              {formError && <div className='text-red-500'>{formError}</div>}

            </Modal>
        }

        {showClonePopup && <Modal
            onClose={() => {
              setShowClonePopup(false)
              setCloneData({catalog: null, shops:[]})
              resetFilter()
            }}
            onCancel={() => {
              setShowClonePopup(false)
              setCloneData({catalog: null, shops:[]})
              resetFilter()
            }}
            onSave={onCloneDataSubmit}
            styleClass="max-h-[80vh] w-full"
            width={'w-full'}
            title="Clone Catalog">

          <DropdownComponent topic="Shop Filter" styleClass="advanced-filter" bodyStyleClass="flex gap-4 flex-wrap">
            <>
              <div className="selected-filters flex flex-wrap items-center w-full gap-4 pt-2">
                {Object.keys(filterData).map((data, index) => (
                    <div className="flex flex-1 items-center justify-between border-2 basis-1/5 max-w-[250px]"
                         key={`${data}-${index}`}>
                      <span className="truncate">{convertToTitleCase(data)} : {filterData[data]}</span>
                      <span className="remove-filter cursor-pointer  flex-shrink-0" onClick={() => {
                        const updatedFilterData = {...filterData};
                        delete updatedFilterData[data];
                        setFilterData(updatedFilterData);
                      }}><XIcon className='w-4 h-4 fill-blue-500  flex-shrink-0 pointer-events-none'/></span>

                    </div>
                ))}
                <ButtonSuccess onClick={applyFilter}>
                  <RiFilter2Fill className="w-5 h-5"/>
                  <span>Apply filter</span>
                </ButtonSuccess>
                <ButtonDanger onClick={resetFilter}>
                  <XCircleIcon className="w-5 h-5"/>
                  <span>Reset</span>
                </ButtonDanger>
              </div>


              {Object.keys(filterOptions).map((topic, index) => {

                return (

                    <DropdownComponent key={`${topic}-${index}`} topic={topic} styleClass="filter-item">
                      <ul>
                        {
                          filterOptions[topic].map((item, index) => (
                              <li key={`${item}-${index}`}
                                  onClick={() => handleFilterClick(topic, item)}>{item}</li>
                          ))
                        }
                      </ul>
                    </DropdownComponent>
                )
              })}</>


          </DropdownComponent>

          <ul className="overflow-y-auto max-h-1/5">
            {dataShop.length > 0 && dataShop.map((d, index) => {
              if (dataShop.length === index + 1) {
                return (
                    <li ref={lastShopElement} key={`${d.shop_name} ${index}`}>
                      <label>
                        <input
                            className="m-2 ml-0"
                            type="checkbox"
                            checked={cloneData?.shops?.some(shop => shop === d._id)}
                            onChange={(e) => {
                              if (e.target.checked)
                                setCloneData(prev => ({...prev, shops: [...prev.shops, d._id]}))
                              else
                                setCloneData(prev => ({
                                  ...prev,
                                  shops: prev.shops.filter(shop => shop !== d._id)
                                }));

                            }}
                        />
                        {`${d.shop_name} - ${d.address.address ? d.address.address : ''} ${d.address.state ? d.address.state : ''} ${d.address.postal_code ? d.address.postal_code : ''}`}
                      </label>
                    </li>
                )
              } else {
                return (
                    <li key={`${d.shop_name} ${index}`}>
                      <label>
                        <input
                            className="m-2 ml-0"
                            type="checkbox"
                            checked={cloneData?.shops?.some(shop => shop === d._id)}
                            onChange={(e) => {
                              if (e.target.checked)
                                setCloneData(prev => ({...prev, shops: [...prev.shops, d._id]}))
                              else
                                setCloneData(prev => ({
                                  ...prev,
                                  shops: prev.shops.filter(shop => shop !== d._id)
                                }));

                            }}
                        />
                        {`${d.shop_name} - ${d.address.address ? d.address.address : ''} ${d.address.state ? d.address.state : ''} ${d.address.postal_code ? d.address.postal_code : ''}`}
                      </label>
                    </li>
                )
              }
            })}
          </ul>

        </Modal>}

        <Card>

          <div className="w-full py-4 flex justify-between items-center">
            <div className="py-4 flex gap-6">
            <ButtonSuccess onClick={toggleModal}>
                <RiAddCircleLine className='w-5 h-5'/>
                <span>Add Catelog</span>
              </ButtonSuccess>
              <div>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search"
                  className="border py-2 px-4 rounded-md"
                />
              </div>
            </div>

            <div className="relative">
              <select
                id="shop"
                value={entries}
                onChange={(event) => setEntries(event.target.value)}
                className="w-20 px-6 py-2 border bg-white border-slate-400 text-gray-600 text-sm font-semibold focus:outline-none appearance-none"
              >

                {[
                  10,
                  25,
                  50,
                  100,
                ].map((option, index) => (
                  <option key={index} value={option} className="text-sm font-semibold text-gray-500 appearance-none">
                    {option}
                  </option>
                ))}
              </select>
              <MdArrowDropDown className="text-gray-600 text-lg absolute right-4 top-0 bottom-0 my-auto cursor-pointer pointer-events-none" />
            </div>

          </div>

          <Table>

              <THead>
                <TH title={'Id'}/>
                <TH title={'Title'}/>
                <TH title={'Shop'}/>
                <TH title={'Expired Date'}/>
                <TH title={'Display Date'}/>
                <TH title={'Actions'}/>
              </THead>

            <TBody>

              {data.map(d => {
                return (
                  <Row key={d?._id}>
                    <TD>
                      {d?._id}
                    </TD>
                    <TD>
                      {d.title}
                    </TD>
                    <TD>
                      {d.shop_id?.shop_name ? d.shop_id?.shop_name : '-'}
                    </TD>
                      <TD>
                        { normalizeDate(d.expiredate) }
                      </TD>
                      <TD>
                        { normalizeDate(d.createdAt) }
                      </TD>
                      <TD>
                        <div className='w-full h-full flex items-center justify-center gap-4'>
                        <CustomTooltip content="Add Pages">
                          <Link to={{ pathname: '/catelog/pages', search: `shop=${d.shop_id?._id}&catelog=${d?._id}` }}>
                            <RiPagesFill className='w-4 h-4 fill-emerald-500 cursor-pointer' />
                          </Link>
                        </CustomTooltip>
                        <CustomTooltip content="Preview">
                          <a href={`${clientAppUrl}/catalog-preview/${d?._id}`} target="_blank" rel="noopener noreferrer">
                            <MdPreview className='w-4 h-4 fill-green-500 cursor-pointer' />
                          </a>
                        </CustomTooltip>
                        <CustomTooltip content="Delete">
                          <FaTrash onClick={() => onDelete(d._id)} className='w-3 h-3 fill-red-500 cursor-pointer' />
                        </CustomTooltip>
                        <CustomTooltip content="Edit">
                          <PencilAltIcon onClick={() => onUpdate(d)} className='w-4 h-4 fill-blue-500 cursor-pointer' />
                        </CustomTooltip>
                        {isAdmin &&
                          <CustomTooltip content="Clone">
                            <ClipboardCopyIcon onClick={() => {
                              setShowClonePopup(true)
                              setCloneData(prev => ({...prev, catalog:d}))
                            }}
                                           className='w-4 h-4 fill-blue-500 cursor-pointer'/>
                          </CustomTooltip>}

                      </div>
                    </TD>
                  </Row>
                )
              })

              }

            </TBody>

          </Table>

          <div className="flex mt-2">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className={`py-1 px-2  text-white ${page === 1 ? "bg-black opacity-10 text-gray-100" : "bg-green-900"}`}
            >
              Previous
            </button>
            {renderPageButtons()}
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className={`py-1 px-2  text-white ${page === totalPages ? "bg-black opacity-10 text-gray-100" : "bg-green-900"}`}

            >
              Next
            </button>
          </div>
        </Card>
      </>
      {/* </Content> */}
    </div>
  )
}

export default Catalog