import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("Failed");

  return (
    <div className="w-full h-screen  flex justify-center items-center flex-col">
      <div className="w-[450px] h-[250px] bg-green-400 flex justify-center items-center">
        <button
          onClick={() => {
            setCount(count - 1);
          }}
          className="bg-blue-600 text-white font-bold text-center w-[100px] h-[100px] text-[20px] mx-[20px] cursor-pointer"
        >
          -
        </button>
        <span>{count}</span>
        <button
          onClick={() => {
            setCount(count + 1);
          }}
          className="bg-blue-600 text-white font-bold text-center w-[100px] h-[100px] text-[20px] mx-[20px] cursor-pointer"
        >
          +
        </button>
      </div>
      <div className="w-[450px] h-[250px] bg-blue-400 flex justify-center items-center">
        <button
          className="w-[100px] h-[100px] bg-red-400 flex justify-center items-center"
          onClick={() => {
            setValue("Fail");
          }}
        >
          Fail
        </button>
        <span>{value}</span>
        <button
          className="w-[100px] h-[100px] bg-red-400 flex justify-center items-center"
          onClick={() => {
            setValue("Pass");
          }}
        >
          Pass
        </button>
      </div>
    </div>
  );
}
