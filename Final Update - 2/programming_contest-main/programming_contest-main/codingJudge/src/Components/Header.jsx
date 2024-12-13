import PropTypes from "prop-types"; // Importing PropTypes for type-checking props
import Drawer from "./Drawer"; // Importing the Drawer component (sidebar)
import Navbar from "./Navbar"; // Importing the Navbar component (top navigation bar)

const Header = ({ children }) => {
  return (
    <div className="drawer"> {/* Container div with the 'drawer' class to implement sidebar functionality */}
      {/* The checkbox is used to toggle the drawer's visibility. 'drawer-toggle' is likely controlling the drawer state */}
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 

      {/* Main content area (flex container to display navbar and children components */}
      <div className="drawer-content flex flex-col">
        {/* Rendering the Navbar component at the top of the page */}
        <Navbar></Navbar> 
        {/* The children prop is used to display the content passed from the parent component */}
        {children} {/* The content wrapped inside this Header component will be displayed here */}
      </div>

      {/* The Drawer component is placed outside the main content. It represents the sidebar */}
      <Drawer></Drawer> 
    </div>
  );
};

export default Header; // Exporting the Header component so it can be used in other parts of the app

// Defining prop types for the Header component to ensure that 'children' is a valid React node (elements, text, etc.)
Header.propTypes = {
  children: PropTypes.node, // 'children' can be any type of React node (string, element, etc.)
};
