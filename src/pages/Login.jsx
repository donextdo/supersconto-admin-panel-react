import image from '../assets/login_page.jpg'
import image1 from '../assets/login_page1.jpg'
import { BsFillPersonFill } from "react-icons/bs";
import { Link } from 'react-router-dom'
import Dropdown from '../components/shared/Dropdown'

const Login = () => {
    return (
        <div className="grid grid-cols-2 w-full h-screen">
            <div className='h-full'>
                <img src={image} alt="login image" className='w-full h-full object-cover' />
            </div>
            <div className="bg-gray-900 text-white px-28 flex flex-col justify-center gap-6">

                <div><h3 className="text-4xl font-semibold mb-6">Login</h3></div>
                

                <div className='relative w-full mb-2'>

                    <BsFillPersonFill className='absolute fill-black mt-4 ml-3 text-lg' />
                    <input type="email" placeholder="Email or Username"
                        className="w-full pl-12 pr-6 py-3 border-2 border-black text-gray-600 text-sm font-semibold focus:outline-none bg-white" />

                </div>
                <div className='relative w-full mb-2'>
                    <BsFillPersonFill className='absolute fill-black mt-4 ml-3 text-lg' />
                    <input type="Password" placeholder="Password"
                        className="w-full pl-12 pr-6 py-3 border-2 border-black text-gray-600 text-sm font-semibold focus:outline-none bg-white" />

                </div>
                <div class="flex items-center mb-1">

                    <input type="checkbox"
                        id="checkbox-1"
                        class="w-4 h-4 border-2 border-black text-gray-600 text-sm font-semibold focus:outline-none bg-transparent" />

                    <label for="checkbox-1" class="ml-2 text-sm text-white">
                        Keep me logged in
                    </label>

                </div>

                <div className='space-y-2 '>
                <label>Login as</label>
                <div className='w-52 border-black'><Dropdown /></div>
                </div>

                <button className="bg-blue-600 text-white w-full rounded-lg ml-1 py-2" type="submit">
                    Login
                </button>

                <Link to="#" className='ml-auto'>Forget Password ?</Link>
            </div>
        </div>
    );
}

export default Login;