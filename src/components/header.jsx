import { Link } from "react-router-dom";

export default function Header(props) {
  console.log(props);
  return (
    <div className="bg-red-500">
      <h1 className="font-bold">Lunara Cosmetics</h1>
      <Link to="/">Home</Link>
      <Link to="/login">login</Link>
      <Link to="/signup">signup</Link>
    </div>
  );
}
