import React from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";

import LoginPage from "./components/views/LoginPage/LoginPage";

import RegisterPage from "./components/views/RegisterPage/RegisterPage";

import Auth from "./hoc/auth";


export default function App() {

return (

<Router>

<div>

<nav>

<ul>

<li>

<Link to="/">LandingPage</Link>

</li>

<li>

<Link to="/login">Login</Link>

</li>

<li>

<Link to="/register">Join</Link>

</li>

</ul>

</nav>

<Routes>

<Route exact path="/" element={<LandingPage/>}></Route>

<Route exact path="/login" element={<LoginPage/>}></Route>

<Route exact path="/register" element={<RegisterPage/>}

></Route>

</Routes>

</div>

</Router>

);

}
//Auth(LandingPage, null, true )
//Auth(LoginPage), false 
//Auth(RegisterPage), false