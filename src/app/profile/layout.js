import AuthCheck from "../components/authCheck";

export default function ProfileLayout({ children }) {
  return (
    <div>
      <AuthCheck>
        <main>{children}</main>
      </AuthCheck>
    </div>
  );
}
