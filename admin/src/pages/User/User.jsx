import { useEffect, useState } from "react"
import api from '../../services/api'
import './User.css'

function User() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await api.get('/admin/users')
                setUsers(res.data)
            } catch (err) {
                console.log(err)
            }
        }

        loadUsers()
    }, [])

    const deleteUsers = async (id) => {
        if (window.confirm('Xoá user này')) {
            await api.delete(`/admin/users/${id}`)
            fetch()
        }
    }

    return (
        <>
            <div className="users-page">
                <h2>Quản lý người dùng</h2>

                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td> {index + 1} </td>
                                <td> {user.firstname} {user.lastname} </td>
                                <td> {user.email} </td>
                                <td> {user.isAdmin ? "Admin" : 'User'} </td>
                                <td>
                                    <button onClick={() => deleteUsers(user._id)}> Xoá </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default User