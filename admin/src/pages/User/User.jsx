import { useEffect, useState } from "react"
import api from "../../services/api"
import "./User.css"
import { toast } from "react-toastify";
import Pagination from '../../components/Panigation/Panigation';
import '../../components/Panigation/Panigation.css'
import Swal from 'sweetalert2'
import { useMemo } from "react";

function User() {
    const [search, setSearch] = useState("")
    const [users, setUsers] = useState([])
    const [sortField, setSortField] = useState("")
    const [sortOrder, setSortOrder] = useState("asc")
    
    const filteredUsers = useMemo(() => {   
        const keyword = search.trim().toLowerCase()

        return users.filter(user => {
            const fullName = `${user.firstname || ""} ${user.lastname || ""}`.toLowerCase()

            return (
                fullName.includes(keyword) ||
                (user.firstname || "").toLowerCase().includes(keyword) ||
                (user.lastname || "").toLowerCase().includes(keyword) ||
                (user.email || "").toLowerCase().includes(keyword)
            )
        })
    }, [users, search])

    const sortedUsers = useMemo(() => {
        const sorted = [...filteredUsers]

        if (!sortField) return sorted

        sorted.sort((a, b) => {
            let aValue = a[sortField] || ""
            let bValue = b[sortField] || ""

            if (typeof aValue === "string") aValue = aValue.toLowerCase()
            if (typeof bValue === "string") bValue = bValue.toLowerCase()

            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
            return 0
        })

        return sorted
    }, [filteredUsers, sortField, sortOrder])

    const [page, setPage] = useState(1)
    const userPerPage = 20
    const totalPages = Math.ceil(sortedUsers.length / userPerPage)

    const start = (page - 1) * userPerPage
    const end = start + userPerPage

    const currentUsers = sortedUsers.slice(start, end)

    useEffect(() => {
    const loadUsers = async () => {
        try {
            const res = await api.get("/admin/users")
            setUsers(res.data)
        } catch (err) {
            console.log(err)
        }
    }

        loadUsers()
    }, [])

    useEffect(() => {
        setPage(1)
    }, [search])

    useEffect(() => {
        document.title = 'Quản lý người dùng - Admin'
    }, [])

    // delete user
    const deleteUser = async (id) => {

        const result = await Swal.fire({
            title: "Bạn chắc chắn?",
            text: "User này sẽ bị xoá vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Xoá",
            cancelButtonText: "Huỷ"
        })

        if (!result.isConfirmed) return

        try {
            await api.delete(`/admin/user/${id}`)

            setUsers(prev => prev.filter(user => user._id !== id))

            toast.success("Đã xoá user thành công")

        } catch (err) {
            console.log(err)
            toast.error("Xoá user thất bại")
        }
    }

    // doi role
    const toggleRole = async (id, currentRole) => {
        try {

            const result = await Swal.fire({
                title: "Đổi role người dùng?",
                text: currentRole
                    ? "User này sẽ trờ thành 'User' "
                    : "User này sẽ trở thành 'Admin' ",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Huỷ"
            })

            if (!result.isConfirmed) return

            const _res = await api.put(`/admin/user/${id}/role`, {isAdmin: !currentRole})

            setUsers(prev => prev.map(user => user._id === id ? {...user, isAdmin: !currentRole} : user))

            toast.success("Cập nhật role thành công")
        } catch (error) {
            console.log(error)
            toast.error("Cập nhật role thất bại")
        }
    }

    //func sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    //lastActivate func
    const getLastActivityStatus = (user) => {
        if (!user.lastActivate) return "Chưa hoạt động"

        // eslint-disable-next-line react-hooks/purity
        const diff = Date.now() - new Date(user.lastActivate)

        if (diff < 60 * 1000) return "Online"
        if (diff < 5 * 60 * 1000) return "Activate"
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff/60000)} phút trước`
        if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff/3600000)} giờ trước`
    }

    useEffect(() => {
        const interval = setInterval(() => {
            api.get("/ping") 
        }, 30000) // 30s

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="users-page">
            <div className="users-header">
                <h2>Quản lý người dùng</h2>

                <input type="text" placeholder="Tìm kiếm theo tên hay email..." value={search} onChange={(e) => setSearch(e.target.value)} className="user-search" />
            </div>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>#</th>

                        <th onClick={() => handleSort('firstname')} className="sortable">
                            Họ tên {sortField === 'firstname' && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>

                        <th onClick={() => handleSort("email")} className="sortable">
                            Email {sortField === 'email' && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>

                        <th>Location</th>

                        <th onClick={() => handleSort("isAdmin")} className="sortable">
                            Role {sortField === 'isAdmin' && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>

                        <th> Activity </th>

                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6">Không có user</td>
                        </tr>
                    ) : (
                        currentUsers.map((user, index) => (
                            <tr key={user._id} className={user.isAdmin ? "admin-row" : ""}> 
                                <td>{start + index + 1}</td>
                                <td>{user.firstname} {user.lastname}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.city && user.country
                                        ? `${user.city}, ${user.country}`
                                        : "Unknown"}
                                </td>
                                
                                <td>
                                    <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`} onClick={() => toggleRole(user._id, user.isAdmin)} >
                                        {user.isAdmin ? "Admin" : "User"}
                                    </span>
                                </td>

                                <td>
                                    <span className={
                                        // eslint-disable-next-line react-hooks/purity
                                        Date.now() - new Date(user.lastActive) < 60000
                                            ? "online"
                                            : "offline"
                                    }>
                                        {getLastActivityStatus(user)}
                                    </span>
                                </td>
                                
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteUser(user._id)}>
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            <p className="users-count">
                Showing {start + 1} - {Math.min(end, filteredUsers.length)} trong tổng {filteredUsers.length} users
            </p>
        </div>
    )
}

export default User