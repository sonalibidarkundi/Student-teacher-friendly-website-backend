import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StaffHome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await fetch('http://localhost:5000/api/clerk/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Error fetching user data:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <header className="header">
        {user.image && (
          <img src={`http://localhost:5000${user.image}`} alt={user.username} style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
        )}
        <h1>Welcome, {user.username}</h1>
        {user.companyName && <h2>{user.companyName}</h2>}
      </header>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">{user.companyName}</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              {/* Space holder */}
              <li className="nav-item">
                <span className="nav-link"> </span>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to="/staff/uploadNotes"style={{color:"white"}}>Upload Notes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/"style={{color:"white"}}>Log Out</Link>
              </li>
          
              {/* <li className="nav-item">
                <Link className="nav-link" to="/clerk/CreateStudent">Create Student</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/clerk/CreateStaff">Create Satff</Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
      <div className="content">
        {/* Content will go here */}
      </div>
    </div>
  );
};

export default StaffHome;
