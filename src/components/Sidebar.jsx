import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{ padding: "20px", background: "#002233" }}>
      <Link to="/">Users</Link> | {""}
      <Link to="/">Products</Link> | {""}
      <Link to="/">Orders</Link> | {""}
    </div>
  );
}

export default Sidebar;
