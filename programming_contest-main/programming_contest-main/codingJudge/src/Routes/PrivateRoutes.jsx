import PropTypes from "prop-types";

import { Navigate, useLocation } from "react-router-dom";
import Loading from "../Pages/Loading/Loading";
import useAuth from "../Hooks/useAuth"


const PrivateRoutes = ({children}) => {

  const location = useLocation()

  const {user, loading} = useAuth()

  if (loading) {
    return <Loading></Loading>;
  }

  if (user) {
    return children;
  }

  return <Navigate state={location?.pathname} to={"/login"}></Navigate>;
};

export default PrivateRoutes;

PrivateRoutes.propTypes = {
  children: PropTypes.node.isRequired
}