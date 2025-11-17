import './App.css'

import { AppChat } from './components/chat'
import Layout from '@/components/layout'
import { AuthProvider } from '@/contexts/auth-context'
import { AuthGate } from '@/components/auth-gate'
import ConversationProvider from './contexts/conversation-provider'

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <ConversationProvider>
          <Layout>
            <AppChat />
          </Layout>
        </ConversationProvider>
      </AuthGate>
    </AuthProvider>
  );
}

export default App
