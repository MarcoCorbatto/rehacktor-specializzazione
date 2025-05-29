import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/homepage";
import Layout from "../layout/Layout";
import ErrorPage from "../pages/error";

export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
