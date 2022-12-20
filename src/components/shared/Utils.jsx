export const Content = ({ children }) => {
  return (
    <div className="content">
        { children }
    </div>
  )
}

export const Card = ({ children, title }) => {
  return (
    <div className="w-full px-6 py-7 bg-white shadow-md">

      { title && 
        <h3 className="text-lg font-semibold text-gray-800">
          { title }
      </h3>
      }

      { children }
    </div>
  )
}