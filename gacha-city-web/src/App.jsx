import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Guide from "./pages/Guide";
import News from "./pages/News.jsx";

import { getNavbar } from "./api/strapi";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/huong-dan'
          element={<Guide />}
        />
        <Route
          path='/tin-tuc'
          element={<News />}
        />
      </Routes>
    </BrowserRouter>
  );
}
