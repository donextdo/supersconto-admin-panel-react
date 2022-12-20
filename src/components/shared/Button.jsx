export const ButtonSuccess = ({disabled, children, padding, wfull, id, type, onClick}) => {
    return (
      <button 
          className={`${padding ? padding : 'py-2 px-6'} 
              ${wfull && 'w-full'} 
              bg-blue-600 text-white text-sm font-medium flex items-center justify-center gap-3
              hover:bg-blue-800`} 
              id={id} 
              type={type ? type : "button"} 
              onClick={onClick}
              disabled={disabled}>
  
              {children}
  
      </button>
    )
  }
  
  export const ButtonDanger = ({disabled, children, padding, wfull, id, type, onClick}) => {
      return (
        <button 
          className={`${padding ? padding : 'py-2 px-6'} 
          ${wfull && 'w-full'} 
          bg-red-600 text-white text-sm font-medium flex items-center justify-center gap-3
          hover:bg-red-800`} 
          id={id} 
          type={type ? type : "button"} 
          onClick={onClick}
          disabled={disabled}>
  
                {children}
  
        </button>
      )
  }
  
  export const Button = ({disabled, children, styleClass, id, type, onClick}) => {
      return (
        <button 
          className={styleClass} 
          id={id} 
          type={type ? type : "button"} 
          onClick={onClick}
          disabled={disabled}>
  
                {children}
        </button>
      )
  }
  
  export const ButtonSave = ({disabled, children, padding, wfull, id, type, onClick}) => {
      return (
        <button 
          className={`${padding ? padding : 'py-2 px-6'} 
          ${wfull && 'w-full'} 
          bg-green-600 text-white text-sm font-medium flex items-center justify-center gap-3
          hover:bg-green-800`} 
          id={id} 
          type={type ? type : "button"} 
          onClick={onClick}
          disabled={disabled}>
  
                {children}
  
        </button>
      )
  }
  
  export const ButtonNormal = ({disabled, children, padding, wfull, id, type, onClick}) => {
      return (
        <button 
          className={`${padding ? padding : 'py-2 px-6'} 
          ${wfull && 'w-full'} 
          bg-gray-600 text-white text-sm font-medium flex items-center justify-center gap-3
          hover:bg-gray-900`} 
          id={id} 
          type={type ? type : "button"} 
          onClick={onClick}
          disabled={disabled}>
  
                {children}
                
        </button>
      )
  }