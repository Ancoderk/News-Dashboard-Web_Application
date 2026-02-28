import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">NewsDash AI</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/saved">My Summaries</Link>
      </div>
     
    </nav>
  );
};

export default Navbar;