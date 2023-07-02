import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import image from '../assets/login_page.jpg'
import image1 from '../assets/login_page1.jpg'
import {BsFillPersonFill} from "react-icons/bs";
import {BiShow} from "react-icons/bi";
import {Link} from 'react-router-dom'
import Dropdown from '../components/shared/Dropdown'
import {ToastContainer, toast} from 'react-toastify';
import * as EmailValidator from 'email-validator';
import baseUrl from '../utils/baseUrl'
import axios from 'axios'

const Login = () => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [role, setRole] = useState(0)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const onEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleDropDownChange = async (selectedOption) => {
        setRole(selectedOption.value)
    }

    const login = async () => {
        if (!email) return toast.error('Please enter a email')
        if (!EmailValidator.validate(email)) return toast.error("Please Enter walid Email")
        if (!password) return toast.error('Please enter a password')

        try {
            const {data} = await axios.post(`${baseUrl}/auth/signin`, {
                email,
                password,
                role
            })

            localStorage.setItem('token', data.token)
            sessionStorage.setItem('user', data.user)
            navigate('/')

        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    return toast.error(error.response.data.message)
                }
            }

            toast.error('Something went wrong plase try again later!')
        }

    }

    const passwordShow = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            <div className="grid grid-cols-2 w-full h-screen">
                <div className='h-full'>
                    <img src={image} alt="login image" className='w-full h-full object-cover'/>
                </div>
                <div className="bg-gray-900 text-white px-28 flex flex-col justify-center gap-6">

                    <div><h3 className="text-4xl font-semibold mb-6">Login</h3></div>


                    <div className='relative w-full mb-2'>

                        <BsFillPersonFill className='absolute fill-black mt-4 ml-3 text-lg'/>
                        <input type="email" placeholder="Email or Username"
                               onChange={onEmailChange}
                               className="w-full pl-12 pr-6 py-3 border-2 border-black text-gray-600 text-sm font-semibold focus:outline-none bg-white"/>

                    </div>
                    <div className='relative w-full mb-2'>
                        <BsFillPersonFill className='absolute fill-black mt-4 ml-3 text-lg'/>
                        <input type={showPassword ? "text" : "password"} placeholder="Password"
                               onChange={onPasswordChange}
                               className="w-full pl-12 pr-6 py-3 border-2 border-black text-gray-600 text-sm font-semibold focus:outline-none bg-white"/>
                        <button onClick={passwordShow}><BiShow className='absolute fill-black right-4 top-3 text-2xl'/>
                        </button>

                    </div>
                    <div className="flex items-center mb-1">

                        <input type="checkbox"
                               id="checkbox-1"
                               className="w-4 h-4 border-2 border-black text-gray-600 text-sm font-semibold focus:outline-none bg-transparent"/>

                        <label htmlFor="checkbox-1" className="ml-2 text-sm text-white">
                            Keep me logged in
                        </label>

                    </div>

                    <div className='space-y-2 '>
                        <label>Login as</label>
                        <div className='w-52'>
                            <Dropdown
                                options={[
                                    {value: 0, label: 'ADMIN'},
                                    {value: 1, label: 'VENDOR'}
                                ]}
                                defaultValue={{value: 0, label: 'ADMIN'}}
                                onChange={handleDropDownChange}
                            />
                        </div>
                    </div>

                    <button
                        onClick={login}
                        className="bg-blue-600 text-white w-full rounded-lg py-2" type="submit">
                        Login
                    </button>

                    <Link to="#" className='ml-auto'>Forget Password ?</Link>
                </div>
            </div>

            <ToastContainer/>
        </>

    );
}

export default Login;