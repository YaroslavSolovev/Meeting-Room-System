import { AppRouter } from './router'
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  useWebSocket();
  return (
    <AppRouter />
  )
}

export default App