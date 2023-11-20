import Select from 'react-select'


const Dropdown = ({
    label, 
    error, 
    errorMessage,  
    value, 
    options,
    onChange,
    isMulti,
    customDropFilter,
    defaultValue,
    borderColor
}) => {

const customStyles = {
    control: (styles) => ({
        ...styles,
        border: borderColor ?`1px solid ${borderColor}`: '1px solid rgb(75 85 99)',
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

        <Select
            value={value}
            isMulti={isMulti}
            onChange={onChange}
            options={options}
            defaultValue={defaultValue}
            styles={customStyles}
            className='w-full text-black'
            filterOption={customDropFilter}
        />

    {error && 
        <small className="text-xs text-red-600">
            { errorMessage }
        </small>
    }
    
</div>
)
}


export default Dropdown