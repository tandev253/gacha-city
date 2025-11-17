import Home from "./pages/Home";

export default function App() {
  return (
    <div className='layout'>
      {/* khung 16:9 chỉ bọc Hero */}
      <div className='ui-16-9'>
        <Home />
      </div>
    </div>
  );
}
