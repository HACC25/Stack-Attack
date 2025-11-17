import './App.css'

import { AppChat } from './components/chat'
import Layout from '@/components/layout'
import { AuthProvider } from '@/contexts/auth-context'
import { AuthGate } from '@/components/auth-gate'

function App() {
  return (
    <AuthProvider>
      <AuthGate>
          <Layout>
            <AppChat />
          </Layout>
      </AuthGate>
    </AuthProvider>
  );
}

export default App
