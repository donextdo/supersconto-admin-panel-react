import { RiFileAddFill } from 'react-icons/ri'

const Fileinput = ({
    label,  
    name,
    color,
    rounded,
    multiple,
    onChange
}) => {
return (
<div className='flex flex-col gap-2 items-start'>

    <label 
    htmlFor='fileinput'
    className={`px-4 py-3 flex items-center gap-2 text-white text-sm font-medium ${rounded && rounded} ${color ? color : 'bg-blue-500'} cursor-pointer`}>
        <RiFileAddFill className='w-4 h-4 fill-white' />
        <span>{label}</span>
    </label>

    <input
        id='fileinput'
        type="file"
        multiple={multiple}
        name={name}
        onChange={onChange}
        className='hidden'
    />
    
</div>
)
}


export default Fileinput