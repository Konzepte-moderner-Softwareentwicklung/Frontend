import { Routes, Route } from "react-router-dom";
import Home from "@/components/pages/Home.tsx";
import Drives from "@/components/pages/Drives.tsx";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Drives" element={<Drives/>} />
        </Routes>
    );
};
