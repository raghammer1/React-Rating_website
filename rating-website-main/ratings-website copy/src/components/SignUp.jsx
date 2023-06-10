import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { userSetter } from '../features/userSlice';
import { useLocation, Navigate } from 'react-router-dom';

const SignUp = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  function closeModal() {
    setOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      });
      const data = await response.json();
      setMessage(data.status);
      setOpen(true);
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage('Please try again');
    }
    // await fetch(
    //   `http://localhost:3000/signin?username=${user.username}&password=${user.password}`
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (!data.userFound) {
    //       console.log('No user found');
    //       setOpen(true);
    //     } else {
    //       const userUsername = user.username;
    //       const userWatchlist = data?.userDets[0]?.watchlist;
    //       const userId = data?.userDets[0]?._id;
    //       dispatch(userSetter({ userUsername, userWatchlist, userId }));
    //       navigate('/home/1', { state: { from: location }, replace: true });
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };
  const changeUser = (e) => {
    const name = e.target.value;
    const field = e.target.name;
    setUser({ ...user, [field]: name });
  };
  return (
    <div>
      <div className="form-container">
        <form className="my-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <label className="form-label">
            Name:
            <input
              className="form-input"
              type="text"
              value={user.username}
              onChange={changeUser}
              name="username"
            />
          </label>
          <label className="form-label">
            Password:
            <input
              className="form-input"
              type="password"
              value={user.password}
              onChange={changeUser}
              name="password"
            />
          </label>
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>

      {open && (
        <Modal open={open} onClose={closeModal} center animationDuration={300}>
          <p style={{ color: 'black' }}>{message}</p>
          {/* <Link to={'/signin'}>
            <button className="watchlist-button">Sign In</button>
          </Link> */}
        </Modal>
      )}
    </div>
  );
};
export default SignUp;
