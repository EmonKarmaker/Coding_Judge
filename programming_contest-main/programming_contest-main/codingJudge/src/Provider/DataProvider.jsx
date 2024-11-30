import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const DataContext = createContext()

const DataProvider = ({children}) => {

  const [dark, setDark] = useState(false)

  const handleTheme = () => {
    setDark(!dark)
    const theme = document.getElementById('theme')
    if(!dark){
      theme.setAttribute("data-theme", "dark")
    }
    else{
      theme.setAttribute("data-theme", "retro")
    }
  }

  const data = {
    dark,
    handleTheme
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

DataProvider.propTypes = {
  children : PropTypes.node
}