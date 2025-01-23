import React, { useEffect, useState } from 'react';
import "./index.css";
import Login from './components/Login';
import Signup from './components/Signup';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import Home from './components/user/Home';
import Dashboard from './components/admin/Dashboard';
import MemberHome from './components/member/MemberHome';
import Verification from './Verification';
import Membership from './components/user/Membership';
import { checkAuth } from './middleware/auth';

 // Update auth context when login is successful
 const handleLoginSuccess = (user) => {
  setAuthState({
    isAuthenticated: true,
    user,
    isCheckingAuth: false,
    error: null
  });
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children, authState }) => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  if (authState.isCheckingAuth) {
    return <div>Loading...</div>;
  }
  
  if (authState.isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  return children;
};
const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isCheckingAuth: true, // Start true since we check on load
    user: null,
    error: null
  });
   const [memberData, setMemberData] = useState(null);
   const ProtectedRoute = ({ children, authState, allowedRoles = [] }) => {
    const location = useLocation();
  
    if (authState.isCheckingAuth) {
      return <div>Loading...</div>;
    }
  
    if (!authState.isAuthenticated) {
      // Redirect to login while saving the attempted location
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(memberData)) {
      
      return <Navigate to="/" replace />;
    }
    
    return children;
  };
    // Protected Route Component
  useEffect(() => {
    checkAuth(setAuthState);
  }, []);
  
  const checkMember = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/check-member`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch member data: ${response.statusText}`);
      }
      
      const data = await response.json();
      const member = data.user.role      
      setMemberData(member)
    return member
   } catch (error) {
      console.error('Member check error:', error);

    }
  };
  useEffect(() => {
    checkMember();
  }, []);

  return (
    <Router>




      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute authState={authState}>
              <Login onLoginSuccess={handleLoginSuccess} />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/signup" 
          element={
            <PublicRoute authState={authState}>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/member-registration" 
          element={
              <Membership />
          } 
        />
        
        <Route 
          path="/" 
          element={
            <publicRoute authState={authState}>
              <Home />
            </publicRoute>
          } 
        />
        <Route 
          path="/verification" 
          element={
            <publicRoute authState={authState}>
              <Verification />
            </publicRoute>
          } 
        />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute authState={authState} allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/member" 
          element={
            <ProtectedRoute authState={authState} allowedRoles={['Member']}>
              <MemberHome />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;