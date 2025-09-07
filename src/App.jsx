import "./App.css";
import Header from "./components/header";
import ProductCard from "./components/productCard";

function App() {
  return (
    <>
      <Header name="ashan" price="1000" description="yoyo" />

      <ProductCard></ProductCard>
    </>
  );
}

export default App;
