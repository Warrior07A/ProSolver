import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";

export default function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
              <Route path="/dashboard" element={<Dashboard/>} ></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}
  