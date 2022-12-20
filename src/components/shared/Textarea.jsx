const Textarea = ({
    label, 
    error, 
    errorMessage, 
    name,
    value, 
    Styles, 
    border, 
    borderColor, 
    onChange
}) => {
return (
<div className='flex flex-col gap-2 items-start'>

    {label && 
        <label className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-900'}`}>
            {label}
        </label>
    }

    <textarea
        value={value}
        name={name}
        rows='4'
        className={`${Styles ? Styles : 'text-sm font-medium bg-white'} w-full px-6 py-2 focus:outline-none ${border && 'border'} ${border && error ? 'border-red-600': borderColor} `}
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


export default Textarea