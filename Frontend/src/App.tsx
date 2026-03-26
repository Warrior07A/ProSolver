import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";

import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <ThemeProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} ></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}
