export default function newPage() {
  const [name, setName] = useState("");

  return (
    <div>
      <div>{name}</div>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
