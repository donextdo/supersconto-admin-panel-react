import Switch from "react-switch";


const MySwitch = ({
    label, 
    error, 
    errorMessage,  
    value, 
    Styles, 
    onChange,
    border, 
    borderColor,
}) => {

const customStyles = {
    control: (styles) => ({
        ...styles,
        border: '1px solid rgb(75 85 99)',
        borderRadius: '0',
        width: '100%',
        fontSize: '0.875rem',
        paddingLeft: '1rem',
        fontWeight: 500
    })
}

return (
<div className='flex w-full flex-col gap-2 items-start'>

    {label && 
        <label className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-900'}`}>
            {label}
        </label>
    }
             <Switch 
             checked={value}
             className={`${Styles ? Styles : 'text-sm font-medium bg-white'} w-full px-6 py-2 focus:outline-none ${border && 'border'} ${border && error ? 'border-red-600': borderColor} `}
             onChange={onChange} />
    {error && 
        <small className="text-xs text-red-600">
            { errorMessage }
        </small>
    }
    
</div>
)
}


export default MySwitch