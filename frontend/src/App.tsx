import './App.css'

import { AppChat } from './components/chat'
import Layout from '@/components/layout'
import { AuthGuard } from './components/auth-guard'
import { AuthProvider } from "@/contexts/auth-context";
import { AuthCallback } from './components/auth-callback';

function App() {
  if (window.location.pathname === "/auth/callback") {
    return (
      <AuthProvider>
        <AuthCallback />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <Layout>
          <AppChat />
        </Layout>
      </AuthGuard>
    </AuthProvider>
  );
}

export default App
