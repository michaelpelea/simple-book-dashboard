const { createContext, useState } = require('react')

export const CategoryContext = createContext()

const CategoryContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([])

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryContextProvider
