import React, { useState,useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import { FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { RiAddCircleLine } from 'react-icons/ri'
import { ButtonNormal} from '../components/shared/Button'
import Modal from '../components/shared/Modal'
import TextInput from '../components/shared/TextInput'
import baseUrl from '../utils/baseUrl'
import { ToastContainer, toast } from 'react-toastify';
import Dropdown from '../components/shared/Dropdown'


const Category = () => {
  
  let [options,setOptions]=useState([{value:'none',label:'none'}])
  const [data, setData] =useState([])
  const [modal, setModal] = useState(false)
  const formData={name:null,mainCategoryName:null}
  const [selected, setSelected] =useState([])
  useEffect( () => {
      async function fetchData() {
          try {
            const categories=[]
              const res = await axios.get(baseUrl+'/category/categories'); 
             
              setOptions([{value:'none',label:'none'}])
              res.data.mainCategories.forEach(assign)
              res.data.subCategories.forEach(assign)
              setData(categories);
              function assign(val){
                categories.push(val)

                if(!options.includes({value:val.name,label:val.name}))
                {
                  setOptions(prevItems => [...prevItems,{value:val.name,label:val.name}]);
                }
              }
       
              console.log(options)
          } catch (err) {
              console.log(err);
          }
      }
      fetchData();
  }, []);


  const toggleModal = () => {
    setModal(!modal)
  }
  const update = (e) => {
    formData.name=e.target.value
  }

  const updateSelect=(option)=>{
   setSelected(option)
  }
  const onSave = async() => {
  if(selected.value=='none' || !selected.value)
  {
    await  axios({
      method: "post",
      url: `${baseUrl}/category/main-categories`,
      data: formData,
  })
      .then((response) => {
          setAlertError(false)

          console.log(response.data)
          fetchData()
          return toast.success('Data inserted successfully')
      })
      .catch(function (error) {
          console.log(error);
          return toast.error(error.message)

      });
  }
    else{
      await  axios({
        method: "post",
        url: `${baseUrl}/category/sub-categories`,
        data: formData,
    })
        .then((response) => {
            setAlertError(false)
  
            console.log(response.data)
            fetchData()
            return toast.success('Data inserted successfully')
        })
        .catch(function (error) {
            console.log(error);
            return toast.error(error.message)
  
        });
    }
  }

  const onCancel = () => {
    alert('oncancel clicked')
  }


  return (
    <div>
        {/* <Sidebar />
        <Navbar />

        <Content> */}
        <>
        <ToastContainer/>
        {modal && 
            <Modal 
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={onSave}
            title='Categories'
            width='w-1/2'
            height='h-2/3'
            > 
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <Dropdown 
                    label='Main Category' 
                    border
                    value={selected?selected:options[0]}
                    borderColor='border-gray-600'
                    options={options}
                    onChange={updateSelect}
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Sub Category/Category Name' 
                    border
                    borderColor='border-gray-600'
                    value={formData.name} onChange={(e) => update(e)}
                  />
                </div>
              </div>
            </Modal>
          }
          <Card>
            <div className='w-full py-4 flex gap-6'>
                <ButtonNormal onClick={toggleModal}>
                  <RiAddCircleLine className='w-5 h-5'/>
                  <span>Add</span>
                </ButtonNormal>
            </div>
            <Table>

              <THead>
                <TH title={'Name'}/>
               
                {/* <TH width={'w-[20px]'} title={'Actions'}/> */}
              </THead>

              <TBody>

                {data.map(d => {
                  return (
                    <Row key={d._id}>
                      <TD>
                        { d.name }
                      </TD>
                      {/* <TD>
                        <div className='w-full h-full flex items-center justify-center gap-4'>
                          <FaTrash className='w-3 h-3 fill-red-500 cursor-pointer'/>
                        </div>  
                      </TD> */}
                    </Row>
                  )
                })

                }

              </TBody>

            </Table>

          </Card>
        </>
        {/* </Content> */}
    </div>
  )
}

export default Category