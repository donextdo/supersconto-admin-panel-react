import React, { useState, useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import { FaTrash } from 'react-icons/fa'
import { PencilAltIcon, ClipboardCopyIcon } from '@heroicons/react/solid'
import { MdPreview } from "react-icons/md";
import axios from 'axios'
import { ButtonSuccess } from '../components/shared/Button'
import { RiAddCircleLine, RiPagesFill, } from 'react-icons/ri'
import Modal from '../components/shared/Modal'
import Form from '../components/catelog/Form'
import { normalizeDate } from '../utils/functions'
import { Link } from 'react-router-dom'
import baseUrl, { clientAppUrl } from '../utils/baseUrl'
import { ToastContainer, toast } from 'react-toastify';
import CustomTooltip from '../components/shared/Tooltip'
import Swal from "sweetalert2";
import { MdArrowDropDown } from "react-icons/md";
import Dropdown from "../components/shared/Dropdown.jsx";

const Catalog = () => {

  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [updateMode, setUpdateMode] = useState(false)
  const [catelog, setCatelog] = useState({
    _id: '',
    shop_id: '',
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
  const [cloneData, setCloneData] = useState(null)

  const userData = sessionStorage.getItem("user") ? JSON.parse(atob(sessionStorage.getItem("user"))) : null
  const token = localStorage.getItem("token") ? localStorage.getItem("token") : null
  console.log({ userData })
  const isAdmin = userData?.userType === 0;

  useEffect(() => {
    fetchData();
  }, [page, search, entries]);

  useEffect(() => {

    async function fetchData() {
      try {

        if (userData) {
          if (userData?.userType === 0) {
            const res = await axios.get(`${baseUrl}/shop`);
            const shopData = res.data.map(d => {
              return {
                value: d._id,
                label: `${d.shop_name} - ${d.address.address ? d.address.address : ''} ${d.address.state ? d.address.state : ''} ${d.address.postal_code ? d.address.postal_code : ''}`
              }
            })
            setShops(shopData);
          }
        }

      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

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
      shop_id: '',
      title: '',
      description: '',
      expiredate: '',
      startdate:'',
      flyer: false,
      active: false


    })
    setUpdateMode(false)
  }

  const onSave = async () => {
    console.log(catelog)
    if (catelog.shop_id == "" || catelog.title == '' || catelog.expiredate == '') {
      setFormError('Please fill in the required field marked with an asterisk (*).');
    } else {

      setFormError('');

      try {

        const { _id, ...catalogData } = catelog

        if (!updateMode) {
          await axios.post(`${baseUrl}/catelog/book`, catalogData)
        }
        else {
          await axios.patch(`${baseUrl}/catelog/book/${catelog._id}`, catalogData)
        }

        fetchData()

        setCatelog({
          _id: '',
          shop_id: '',
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
      shop_id: d.shop_id._id,
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

    Swal.fire({
      title: 'Clone',
      text: `Are you sure you want clone ${cloneData.catalog.title} to ${cloneData.shop.label} ?`,
      icon: 'info',
      showCancelButton: true, // Add this line to show the cancel button
      confirmButtonText: 'Clone',
      cancelButtonText: 'Cancel', // Add this line to set the cancel button text
      confirmButtonColor: '#8DC14F',
    }).then(async (result) => {
      if (result.isConfirmed) {

        axios.post(`${baseUrl}/catelog/book/clone`, {
          shopId: cloneData.shop.value,
          catalogId: cloneData.catalog._id
        }).then(res => {
          toast.success('Catalog cloned successfully')
        }).catch((error) => {
          toast.error('Catalog cloned failed')
        }).finally(() => {
          fetchData()
          setCloneData(null)
          setShowClonePopup(false)
        })
      }
    });
  }

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
            title={updateMode ? "Update Catalog" : "Add Catalog"}>

            <Form
              catelog={catelog}
              setCatelog={setCatelog}
            />
            {formError && <div className='text-red-500'>{formError}</div>}

          </Modal>
        }

        {showClonePopup && <Modal
            onClose={() => {
              setShowClonePopup(false)
              setCloneData(null)
            }}
            onCancel={() => {
              setShowClonePopup(false)
              setCloneData(null)
            }}
            onSave={onCloneDataSubmit}
            styleClass="max-h-[50vh]"
            title="Clone Catalog">
          <Dropdown
              label='Select Shop *'
              value={shops.find(shop => shop.value === cloneData?.shop?.value)}
              options={shops}
              onChange={(data) => {
                setCloneData(prev => ({...prev, shop: data}))
              }}
          />

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