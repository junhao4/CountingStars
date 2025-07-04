import "./App.css";
import Header from "./components/overlays/Header.tsx";
import Message from "./components/overlays/Message.tsx";
import Sidebar from "./components/overlays/Sidebar.tsx";
import MainRoutes from "./routes/MainRoutes.tsx";

function App() {
  return (
    <main>
      <Header />
      <Message />
      <div className="app-div">
        <Sidebar />
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginRight: '4rem' }}>
          <MainRoutes />
        </div>
      </div>
    </main>
  );
}

export default App;
