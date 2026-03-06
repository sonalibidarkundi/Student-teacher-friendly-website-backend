import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ReceiverHome = () => {
  const [user, setUser] = useState(null);
  const [studentId, setStudentId] = useState(null);

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

          // Fetch student ID
          const studentResponse = await fetch('http://localhost:5000/api/clerk/getStudentId', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
          });

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            setStudentId(studentData.studentId);
          } else {
            console.error('Error fetching student ID:', await studentResponse.text());
          }
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
              {studentId && (
                <li className="nav-item">
                  <Link className="nav-link" to={`/stud/DownloadFiles?studentId=${studentId}`}style={{color:"white"}}>Show Notes</Link>
                </li>               
                
              )}

              
            </ul>
          </div>
        </div>
      </nav>
      <div className="content">
        {/* Content will go here */}
      </div>
      <div >


       <img src="/images/image.png" alt="" style={{height:"30%",width:"30%",marginLeft:"-100px",marginTop:"50px"}}/>

       <img src="/images/26.jpeg" alt="" style={{height:"30%",width:"30%",marginLeft:"50px",marginTop:"50px"}}/>
       <img src="/images/27.jpeg" alt="" style={{height:"30%",width:"30%",marginLeft:"50px",marginTop:"50px"}}/><br></br>
       <img src="/images/28.jpeg" alt="" style={{height:"30%",width:"30%",marginLeft:"-100px",marginTop:"50px"}}/>
       <img src="/images/29.jpeg" alt="" style={{height:"30%",width:"30%",marginLeft:"50px",marginTop:"50px"}}/>
       <img src="/images/30.jpeg" alt="" style={{height:"250px",width:"30%",marginLeft:"50px",marginTop:"50px"}}/>

        
      </div>
    </div>
  );
};

export default ReceiverHome;
