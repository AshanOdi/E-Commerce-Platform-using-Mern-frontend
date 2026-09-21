import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <div className="w-[70px] h-[70px] border-[5px] border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold text-foreground">Could not load users</h1>
        <p className="text-muted-foreground">Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-6">
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Users ({users.length})
      </h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const isMe = u._id === me?.id;
            const busy = busyId === u._id;
            return (
              <TableRow key={u._id}>
                <TableCell className="text-foreground">
                  {u.email} {isMe && <span className="text-muted-foreground">(you)</span>}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.firstName} {u.lastName}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      u.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.isBlocked
                        ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                        : "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                    }`}
                  >
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </TableCell>
                <TableCell>
                  {isMe ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          patchUser(
                            u._id,
                            "/role",
                            { role: u.role === "admin" ? "customer" : "admin" },
                            u.role === "admin" ? "Demoted to customer" : "Promoted to admin"
                          )
                        }
                      >
                        {u.role === "admin" ? "Make customer" : "Make admin"}
                      </Button>
                      <Button
                        size="sm"
                        variant={u.isBlocked ? "default" : "destructive"}
                        disabled={busy}
                        onClick={() =>
                          patchUser(
                            u._id,
                            "/block",
                            { isBlocked: !u.isBlocked },
                            u.isBlocked ? "User unblocked" : "User blocked"
                          )
                        }
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
