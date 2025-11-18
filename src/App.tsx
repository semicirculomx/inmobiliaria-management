import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Home from './pages/Home';
import Budgets from './pages/Budgets';
import Contracts from './pages/Contracts';
import Plans from './pages/Plans';
import Gallery from './pages/Gallery';

type Page = 'home' | 'budgets' | 'contracts' | 'plans' | 'gallery';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
      {currentPage === 'budgets' && <Budgets />}
      {currentPage === 'contracts' && <Contracts />}
      {currentPage === 'plans' && <Plans />}
      {currentPage === 'gallery' && <Gallery />}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
