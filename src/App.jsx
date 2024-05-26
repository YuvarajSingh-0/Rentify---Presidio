import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import checkUserLoggedIn from './utils/checkUserLoggedIn';
import Register from './pages/Register';
import Property from './pages/Property';
import NewPropertyPage from './pages/NewPropertyPage';

function App() {
  function ProtectedRoutes({ children }) {
    const [userState, setUserState] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const user = await checkUserLoggedIn();
          console.log(user)
          setUserState(user);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      };
      checkLoginStatus();

    }, []);

    if (loading) {
      return <h1>Loading...</h1>;
    }

    if (!userState) {
      return <>
        <h1 className='text-4xl font-bold mb-10'>NOT ALLOWED</h1>;
        <a className='text-blue-500' href="/login">Login</a>
      </>
    }
    if (React.Children.count(children) === 1) {
      return React.cloneElement(children, { userState });
    }

    // If there are multiple children, map over them and clone each one
    return React.Children.map(children, child => {
      return React.cloneElement(child, { userState });
    });
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<Property />} />
          <Route
            path="/auth/*"
            element={
              <ProtectedRoutes>
                <Navbar />
                <div className="main">
                  <Routes>
                    <Route path="/home" element={
                      <ProtectedRoutes>
                        <Home />
                      </ProtectedRoutes>
                    } />
                    <Route path="/add-property" element={
                      <ProtectedRoutes>
                        <NewPropertyPage />
                      </ProtectedRoutes>}
                    />
                    {/* <Route path="/issues" element={<Issues />} /> */}
                    {/* <Route path="/payments" element={<Payments />} /> */}
                    <Route path="/profile" element={
                      <ProtectedRoutes>
                        <Profile />
                      </ProtectedRoutes>
                    }
                    />
                  </Routes>
                </div>
              </ProtectedRoutes>
            }
          />
          <Route path="/*" element={<h1>NOT FOUND</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
