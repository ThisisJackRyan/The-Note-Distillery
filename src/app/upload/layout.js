import AuthCheck from "../components/authCheck";

export default function Layout({ children }) {
    return (
        <div>
            <AuthCheck>
                {children}
            </AuthCheck>
        </div>
    );
}