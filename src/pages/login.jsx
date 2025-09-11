import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const navigate = useNavigate();

  async function handleLogin() {
    console.log(email);
    console.log(pw);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/login",
        {
          email: email,
          password: pw,
        }
      );
      toast.success("Login Successful");
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      // const token = localStorage.getItem("token");

      if (response.data.role === "admin") {
        // window.location.href = "/admin";
        navigate("/admin");
      } else {
        // window.location.href = "/";
        navigate("/");
      }
    } catch (e) {
      console.log(e.response.data.message);
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/loginpage.jpg')] bg-center bg-cover flex flex-row justify-center items-center">
      <div className="w-[50%] h-full  "></div>
      <div className="w-[500px] h-[650px] backdrop-blur-md flex flex-col justify-center items-center rounded-[20px] shadow-xl">
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          type="email"
          className="w-[400px] h-[50px] bg-[#c3efe9] my-3 rounded-[5px]"
        />

        <input
          onChange={(e) => {
            setPw(e.target.value);
          }}
          value={pw}
          type="password"
          className="w-[400px] h-[50px] bg-[#4e5c5a] my-3 rounded-[5px]"
        />

        <button
          onClick={handleLogin}
          className="w-[150px] h-[50px] cursor-pointer bg-[#d8d811] my-3 rounded-[5px]"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
