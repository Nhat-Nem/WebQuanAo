import { Outlet } from "react-router-dom";
import './AdminLayout.css'
import Sidebar from "../components/Sidebar/sidebar";

function AdminLayout() {
    return (
        <>
            <div className="admin-layout">
                <Sidebar />
                <div className="outlet">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default AdminLayout;