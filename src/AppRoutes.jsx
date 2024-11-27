import React from "react";
import { Routes, Route } from "react-router-dom";
import Item from "./pages/Item";
import Catalogue from "./pages/Catalogue";
import Admin from "./pages/Admin";
import { Ordered } from "./pages/Ordered";

const AppRoutes = ({ type }) => {
    return (
        <Routes>
            <Route path="/" element={<Catalogue type={type} />} />
            <Route path="/item/:id/:code" element={<Item />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/ordered" element={<Ordered />} />
        </Routes>
    );
}

export default AppRoutes;