import "./App.css";
import AlertPopup from "./common/components/AlertPopup.tsx";
import Header from "./common/components/header/Header.tsx";
import Sidebar from "./common/components/sidebar/Sidebar.tsx";
import MainRoutes from "./routes/MainRoutes.tsx";

function App() {
  return (
    <main>
      <Header />
      <AlertPopup />
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
