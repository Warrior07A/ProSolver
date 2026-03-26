import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <div>
        <BrowserRouter>
          <Routes>
              {/* <Route path = "/Signup" element = {<Signup/>}></Route>
              <Route path = "/Signup" element = {<Signin/>}></Route> */}
              <Route path="/dashboard" element={<Dashboard/>} ></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

  