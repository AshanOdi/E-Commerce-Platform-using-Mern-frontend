import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// "loading" | "success" | "error"
export default function AdminUsersPage() {
  const { user: me } = useAuth(); // to identify (and lock) the admin's own row
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setUsers(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function patchUser(userId, path, body, successMsg) {
    const token = localStorage.getItem("token");
    setBusyId(userId);
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BACKEND_URL + "/api/user/" + userId + path,
        body,
        { headers: { Authorization: "Bearer " + token } }
      );
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data.user : u)));
      toast.success(successMsg);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-[70px] h-[70px] border-[5px] border-gray-500 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-700">Could not load users</h1>
        <p className="text-gray-500">Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white overflow-y-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users ({users.length})</h1>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Email</th>
            <th className="py-2">Name</th>
            <th className="py-2">Role</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isMe = u._id === me?.id;
            const busy = busyId === u._id;
            return (
              <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 text-gray-800">
                  {u.email} {isMe && <span className="text-gray-400">(you)</span>}
                </td>
                <td className="py-3 text-gray-600">
                  {u.firstName} {u.lastName}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="py-3">
                  {isMe ? (
                    <span className="text-gray-400 text-xs">—</span>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        disabled={busy}
                        onClick={() =>
                          patchUser(
                            u._id,
                            "/role",
                            { role: u.role === "admin" ? "customer" : "admin" },
                            u.role === "admin" ? "Demoted to customer" : "Promoted to admin"
                          )
                        }
                        className="px-3 py-1 rounded-md text-white text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {u.role === "admin" ? "Make customer" : "Make admin"}
                      </button>
                      <button
                        disabled={busy}
                        onClick={() =>
                          patchUser(
                            u._id,
                            "/block",
                            { isBlocked: !u.isBlocked },
                            u.isBlocked ? "User unblocked" : "User blocked"
                          )
                        }
                        className={`px-3 py-1 rounded-md text-white text-xs disabled:opacity-50 ${
                          u.isBlocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
