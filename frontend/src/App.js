// import React, { useState } from 'react';
// import LandingPage from './pages/LandingPage';
// import SignIn from './pages/SignIn';
// import Dashboard from './components/Dashboard';

// const App = () => {
//   const [page, setPage] = useState('landing'); // 'landing' | 'signin' | 'dashboard'
//   const [user, setUser] = useState(null);

//   const handleLogin = (email, password) => {
//     if (email === 'admin@psu' && password === 'admin') {
//       setUser({ email });
//       setPage('dashboard');
//     } else {
//       alert('Invalid credentials. Try: admin@psu.edu.ph / admin123');
//     }
//   };


//   return (
//     <>
//       {page === 'landing' && <LandingPage onSignIn={() => setPage('signin')} />}
//       {page === 'signin' && <SignIn onLogin={handleLogin} onBack={() => setPage('landing')} />}
//       {page === 'dashboard' && <Dashboard user={user} onLogout={() => setPage('landing')} />}
//     </>
//   );
// };

// export default App;

import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);

  const { loginUser, logoutUser } = useAuth();

  const handleLogin = async (email, password) => {
    const { user, error } = await loginUser(email, password);

    if (error) {
      alert(error);
      return false;
    }

    setUser(user);
    setPage('dashboard');
    return true;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setPage('landing');
  };

  return (
    <>
      {page === 'landing' && <LandingPage onSignIn={() => setPage('signin')} />}

      {page === 'signin' && (
        <SignIn onLogin={handleLogin} onBack={() => setPage('landing')} />
      )}

      {page === 'dashboard' && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
