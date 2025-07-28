import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import BoardView from "@/components/pages/BoardView";
import ArchiveView from "@/components/pages/ArchiveView";
import SettingsView from "@/components/pages/SettingsView";

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BoardView />} />
          <Route path="archive" element={<ArchiveView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default App;