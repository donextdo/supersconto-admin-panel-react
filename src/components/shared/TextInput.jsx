const TextInput = ({
    label, 
    error, 
    errorMessage, 
    type, 
    name,
    value, 
    Styles, 
    border, 
    borderColor, 
    placeholder, 
    onChange
}) => {
return (
<div className='flex flex-col gap-2 items-start'>

    {label && 
        <label className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-900'}`}>
            {label}
        </label>
    }

    <input
        type={type ? type : 'text'}
        value={value}
        name={name}
        className={`${Styles ? Styles : 'text-sm font-medium bg-white'} w-full px-6 py-2 focus:outline-none ${border && 'border'} ${border && error ? 'border-red-600': borderColor} `}
        placeholder={placeholder}
        onChange={onChange}
    />

    {error && 
        <small className="text-xs text-red-600">
            { errorMessage }
        </small>
    }
    
</div>
)
}


export default TextInput