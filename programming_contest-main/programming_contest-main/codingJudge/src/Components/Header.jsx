import PropTypes from "prop-types";
import Drawer from "./Drawer";
import Navbar from "./Navbar";

const Header = ({ children }) => {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <Navbar></Navbar>
        {/* Page content here */}
        {children}
      </div>
      <Drawer></Drawer>
    </div>
  );
};

export default Header;

Header.propTypes = {
  children: PropTypes.node,
};
