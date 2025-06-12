import { createContext, useState } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const accessToken = localStorage.getItem("accessToken");
        if (user && accessToken) {
            return { user, accessToken };
        }
        return {};
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
