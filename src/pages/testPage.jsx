export default function TestPage() {
  let count = 0;
  return (
    <div className="w-full h-screen  flex justify-center items-center">
      <div className="w-[450px] h-[250px] bg-green-400 flex justify-center items-center">
        <button
          onClick={() => {
            console.log("- Clicked");
          }}
          className="bg-blue-600 text-white font-bold text-center w-[100px] h-[100px] text-[20px] mx-[20px] cursor-pointer"
        >
          -
        </button>
        <span>{count}</span>
        <button
          onClick={() => {
            console.log("+ Clicked");
          }}
          className="bg-blue-600 text-white font-bold text-center w-[100px] h-[100px] text-[20px] mx-[20px] cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
