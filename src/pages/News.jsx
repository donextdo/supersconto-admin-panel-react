import React, { useState, useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import { FaTrash } from 'react-icons/fa'
import { PencilAltIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { RiAddCircleLine } from 'react-icons/ri'
import { ButtonNormal } from '../components/shared/Button'
import Modal from '../components/shared/Modal'
import TextInput from '../components/shared/TextInput'
import Fileinput from '../components/shared/Fileinput'
import baseUrl from '../utils/baseUrl'
import Textarea from '../components/shared/Textarea'
import Alert from '../components/shared/Alert'
import Confirm from '../components/shared/Confirm'
import { ToastContainer, toast } from 'react-toastify';
import CustomTooltip from '../components/shared/Tooltip'
import { MdArrowDropDown } from "react-icons/md";


const News = () => {
  const [confirm, setConfirm] = useState(false)
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    title: '',
    expiredDate: '',
    content: '',
    image: '',

  })
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)

  const onDelete = (id) => {
    sessionStorage.setItem('id', id)
    setConfirm(true)
  }
  const [alertMessage, setAlertMessage] = useState(false)
  const [alertError, setAlertError] = useState(false)

  const [alertTitle, setAlertTitle] = useState(null)
  const toggleAlert = (title) => {

    setAlertTitle(title)
    setAlertMessage(!alertMessage)
    setTimeout(setAlertMessage, 1000, false)
  }
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    fetchData();
  }, [page, search, itemsPerPage]);

  const setbodyFormData = (formData) => {
    var bodyFormData = new FormData();
    bodyFormData.append('title', formData.title);
    bodyFormData.append('expiredDate', formData.expiredDate);
    bodyFormData.append('status', true);
    bodyFormData.append('description', formData.content);
    bodyFormData.append('images', formData.image);
    bodyFormData.append('created_at', new Date());
    bodyFormData.append('updated_at', new Date());


    return bodyFormData
  }


  async function fetchData() {
    try {
      const res = await axios.get(`${baseUrl}/news/getall`, {
        params: {
          page,
          search,
          itemsPerPage,
        },
      });
      console.log(res)
      setData(res.data.news);
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.log(err);
    }
  }

  const updateImg = (e) => {
    console.log(e.target.files[0])
    setFormData(prevState => {
      return { ...prevState, 'image': e.target.files[0] }
    });

  }
  const update = (name, e) => {
    setFormData(prevState => {
      return { ...prevState, [name]: e.target.value }
    });
  }

  const onSave = async () => {
    const bodyFormData = setbodyFormData(formData)
    console.log(bodyFormData)
    await axios({
      method: "post",
      url: `${baseUrl}/news`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log(response.data)
        setAlertError(false)
        fetchData()
        return toast.success('Data inserted Successfully')
      })
      .catch(function (error) {
        console.log(error);
        setAlertError(true)
        console.log(error);
        return toast.error(error.message)
      });
    toggleModal()
    //  toggleAlert('Data inserted Successfully')

  }
  const onUpdate = async () => {
    const bodyFormData = setbodyFormData(formData)
    console.log(bodyFormData)
    await axios({
      method: "patch",
      url: `${baseUrl}/news/${sessionStorage.getItem('id')}`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log(response.data)
        setAlertError(false)
        fetchData()
        return toast.success('Data Updated Successfully')

      })
      .catch(function (error) {
        console.log(error);
        setAlertError(true)
        console.log(error);
        return toast.error('Something went Wrong')
      });
    toggleModal()
    //  toggleAlert('Data inserted Successfully')

  }

  const toDelete = async (id) => {
    await axios({
      method: "delete",
      url: `${baseUrl}/news/${sessionStorage.getItem('id')}`,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log(response.data)
        setAlertError(false)
        fetchData()
        return toast.success('Data Deleted Successfully')

      })
      .catch(function (error) {
        console.log(error);
        setAlertError(true)
        console.log(error);
        return toast.error(error.message)
      });
    setConfirm(false)

    //  toggleAlert('Data inserted Successfully')

  }
  const toggleModal = () => {
    setIsEdit(false)
    setFormData({})
    setModal(!modal)
  }

  const onCancel = () => {
    setModal(!modal)
  }

  const toUpdate = (data) => {
    setIsEdit(true)
    setFormData({
      'title': data.title,
      'expiredDate': data.expiredDate,
      'content': data.description,
      'image': data.image,
    }

    );
    sessionStorage.setItem('id', data._id)
    setModal(!modal)

  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
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


  return (
    <div>
      {/* <Sidebar />
        <Navbar />

        <Content> */}
      <>
        <ToastContainer />
        {confirm &&
          <Confirm
            onSave={toDelete}
            onCancel={() => setConfirm(false)}
            onClose={() => setConfirm(false)}

          >
          </Confirm>}
        {alertMessage &&
          <Alert
            title={alertTitle}
            error={alertError}
            width='60%'
          >
          </Alert>}
        {modal &&
          <Modal
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={isEdit ? onUpdate : onSave}
            title='Add News'
            width='w-1/2'
          >
            <div className='grid grid-rows-4 grid-flow-col gap-1'>
              <TextInput
                label='News title'
                border
                borderColor='border-gray-600'
                value={formData.title} onChange={(e) => update("title", e)}

              />
              <TextInput
                label='Expired Date'
                border
                type='date'
                borderColor='border-gray-600'
                value={formData.expiredDate} onChange={(e) => update("expiredDate", e)}
                min={new Date().toISOString().split("T")[0]}

              />
              <Textarea
                label='Content'
                border
                borderColor='border-gray-600'
                value={formData.content} onChange={(e) => update("content", e)}

              />
              <Fileinput
                label='Image'
                border
                borderColor='border-gray-600'
                value={formData.image} onChange={(e) => updateImg(e)}

              />
            </div>

          </Modal>
        }
        <Card>
          <div className="w-full py-4 flex justify-between items-center">
            <div className="py-4 flex gap-6">
              <ButtonNormal onClick={toggleModal}>
                <RiAddCircleLine className="w-5 h-5" />
                <span>Add</span>
              </ButtonNormal>
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
                value={itemsPerPage}
                onChange={(event) => setItemsPerPage(event.target.value)}
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
              <TH title={'Id'} />
              <TH title={'Title'} />
              <TH title={'Expired Date'} />
              <TH title={'Description'} />
              <TH title={'Images'} />
              <TH title={'Actions'} />
            </THead>

            <TBody>

              {data.map(d => {
                return (
                  <Row key={d._id}>
                    <TD>
                      {d._id}
                    </TD>
                    <TD>
                      {d.title}
                    </TD>

                    <TD>
                      {d.expiredDate}
                    </TD>
                    <TD>
                      {d.description}
                    </TD>
                    <TD>
                      <img src={d.image} className='w-1/2 h-1/2'></img>
                    </TD>
                    <TD>
                      <div className='w-full h-full flex items-center justify-center gap-4'>
                        <CustomTooltip content="Delete">
                          <FaTrash onClick={() => onDelete(d._id)} className='w-3 h-3 fill-red-500 cursor-pointer' />
                        </CustomTooltip>
                        <CustomTooltip content="Edit">
                          <PencilAltIcon onClick={() => toUpdate(d)} className='w-4 h-4 fill-blue-500 cursor-pointer' />
                        </CustomTooltip>
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

export default News