import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";
import { useAuth } from "../../context/AuthContext";

// "loading" | "success" | "error"
export default function ProfilePage() {
  const { login } = useAuth(); // re-issues a fresh token after a save
  const [status, setStatus] = useState("loading");
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const authHeader = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user/me", authHeader)
      .then((res) => {
        const u = res.data;
        setEmail(u.email);
        setRole(u.role);
        setFirstName(u.firstName || "");
        setLastName(u.lastName || "");
        setPhone(u.phone || "");
        setAddress(u.address || "");
        setImage(u.image || "");
        setStatus("success");
      })
      .catch(() => setStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = image;
      if (newImageFile) {
        imageUrl = await mediaUpload(newImageFile);
      }

      const res = await axios.patch(
        import.meta.env.VITE_BACKEND_URL + "/api/user/me",
        { firstName, lastName, phone, address, image: imageUrl },
        authHeader
      );

      login(res.data.token); // refresh AuthContext so the header/checkout see the new name/image immediately
      setImage(imageUrl);
      setNewImageFile(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || err.toString?.() || "Could not update profile");
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl font-semibold text-foreground">Could not load your profile</h1>
        <p className="text-muted-foreground">Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <main className="w-full max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            src={newImageFile ? URL.createObjectURL(newImageFile) : image}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover bg-muted"
          />
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">Profile photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImageFile(e.target.files[0] || null)}
              className="text-sm"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            value={email}
            disabled
            className="border border-border bg-muted rounded-lg px-3 py-2 text-muted-foreground"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Role</span>
          <input
            value={role}
            disabled
            className="border border-border bg-muted rounded-lg px-3 py-2 text-muted-foreground capitalize"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">First Name</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-border bg-background text-foreground rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Last Name</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-border bg-background text-foreground rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0771234567"
            className="border border-border bg-background text-foreground rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Address</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            maxLength={300}
            className="border border-border bg-background text-foreground rounded-lg px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium py-3 rounded-lg mt-2"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
