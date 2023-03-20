const { createContext, useState } = require('react')

export const CategoryContext = createContext()

/**
 * Context provider responsible on holding the categories data to be used by users and books as they are dependent
 * on the data
 */
const CategoryContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([])

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryContextProvider
