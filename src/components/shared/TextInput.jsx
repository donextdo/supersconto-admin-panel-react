import {useEffect} from "react";

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
                       onChange,
                       max,
                       min,
                       required,
                       handleWheelEvent
                   }) => {

    useEffect(() => {
        // Add the wheel event listener with { passive: false }
        document.addEventListener('wheel', handleWheelEvent ?? handleWheelLocal, { passive: false });

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('wheel', handleWheelEvent ?? handleWheelLocal);
        };
    }, []);
    const handleWheelLocal = (event) => {
        // Prevent scrolling while the input is focused
        if (document.activeElement.type === 'number') {
            event.preventDefault();
        }
    };
    return (
        <div className='flex flex-col gap-2 items-start'>

            {label &&
                <label className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-900'}`}>
                    {label}
                </label>
            }

            <input
                type={type ? type : 'text'}
                value={value ?? undefined}
                name={name}
                className={`${Styles ? Styles : 'text-sm font-medium bg-white'} w-full h-10 bg-gray-100 rounded-md px-6 focus:outline-none shadow-xs ${border && 'border border-gray-300'} ${border && error ? 'border-red-600' : borderColor} `}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                max={max}
                min={min}
            />

            {error &&
                <small className="text-xs text-red-600">
                    {errorMessage}
                </small>
            }

        </div>
    )
}


export default TextInput