import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/homepage/HomePage";
import Layout from "../layout/Layout";
import ErrorPage from "../pages/error/ErrorPage";
import GamePage from "../pages/gamepage/GamePage";
import GenrePage from "../pages/genrepage/GenrePage";
import SearchPage from "../pages/searchpage/SearchPage";
import RegisterPage from "../pages/register/RegisterPage";
import LoginPage from "../pages/login/LoginPage";
import AccountPage from "../pages/account/AccountPage"




export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/games/:genre" element={<GenrePage />} />
          <Route path="/games/:slug/:id" element={<GamePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/account" element={<AccountPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
