import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        // Redirect to signup as requested, with message session state
        return <Navigate to="/signup" state={{ from: location, message: "Please sign in to access the dashboard" }} replace />;
    }

    return <>{children}</>;
}
