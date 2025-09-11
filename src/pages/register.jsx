import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const navigate = useNavigate();

  async function handleRegister() {
    if (pw !== confirmPw) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user",
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: pw,
          // role and image are not sent — backend default will be used
        }
      );

      toast.success("Registration Successful");
      console.log(response.data);

      // Optionally auto-login or redirect after register:
      navigate("/login");
    } catch (e) {
      console.log(e?.response?.data?.message || e.message);
      toast.error(e?.response?.data?.message || "Registration Failed");
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/loginpage.jpg')] bg-center bg-cover flex flex-row justify-center items-center">
      <div className="w-[50%] h-full  "></div>
      <div className="w-[500px] h-[700px] backdrop-blur-md flex flex-col justify-center items-center rounded-[20px] shadow-xl">
        <input
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          type="text"
          placeholder="First Name"
          className="w-[400px] h-[50px] bg-[#c3efe9] my-3 rounded-[5px] px-3"
        />

        <input
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          type="text"
          placeholder="Last Name"
          className="w-[400px] h-[50px] bg-[#c3efe9] my-3 rounded-[5px] px-3"
        />

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          className="w-[400px] h-[50px] bg-[#c3efe9] my-3 rounded-[5px] px-3"
        />

        <input
          onChange={(e) => setPw(e.target.value)}
          value={pw}
          type="password"
          placeholder="Password"
          className="w-[400px] h-[50px] bg-[#4e5c5a] my-3 rounded-[5px] px-3"
        />

        <input
          onChange={(e) => setConfirmPw(e.target.value)}
          value={confirmPw}
          type="password"
          placeholder="Confirm Password"
          className="w-[400px] h-[50px] bg-[#4e5c5a] my-3 rounded-[5px] px-3"
        />

        <button
          onClick={handleRegister}
          className="w-[150px] h-[50px] cursor-pointer bg-[#d8d811] my-3 rounded-[5px]"
        >
          Register
        </button>
      </div>
    </div>
  );
}
