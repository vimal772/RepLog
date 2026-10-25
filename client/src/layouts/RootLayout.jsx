import { Outlet } from 'react-router';

import Navbar from "../components/NavBar.jsx";

export default function RootLayout() {
    return (<>
        <Navbar />
        <main>
            <Outlet />
        </main>
    </>)
}

