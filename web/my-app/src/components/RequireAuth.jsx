import { useLocation, Navigate, Outlet } from "react-router-dom";
import PropTypes from 'prop-types'; 

const RequireAuth = ({ allowedRoles }) => {
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);

    const location = useLocation();

    const isRoleAllowed = user?.role && allowedRoles.includes(user.role);

    const isUserLoggedIn = !!user;

    return (
        isRoleAllowed
            ? <Outlet />
            : !isUserLoggedIn
                ? <Navigate to="/login" state={{ from: location }} replace />
                : <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
}

RequireAuth.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RequireAuth;
