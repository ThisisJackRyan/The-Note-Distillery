import React from 'react';
import AuthCheck from '../components/authCheck';

const Layout = ({ children }) => {
    return (
        <div>
            <AuthCheck>
                <main>{children}</main>
            </AuthCheck>
        </div>
    );
};

export default Layout;