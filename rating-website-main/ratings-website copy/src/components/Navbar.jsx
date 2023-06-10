import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const userData = useSelector((store) => store.users);
  const { username, watchlist, isSignedIn } = userData;
  return (
    <div className="navbar-container">
      <div className="navbar">
        <div>
          {isSignedIn ? (
            <h5 className="navbar-greeting">Hello {username}</h5>
          ) : (
            <>
              <Link to="/signin">
                <button className="navbar-button navbar-signin">Sign In</button>
              </Link>
              <Link to="/signup">
                <button className="navbar-button navbar-signin">Sign Up</button>
              </Link>
            </>
          )}
        </div>
        <div>
          <Link to="/home/1">
            <button className="navbar-button">Home</button>
          </Link>
          <Link to="/watchlist">
            <button className="navbar-button">Watchlist</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
