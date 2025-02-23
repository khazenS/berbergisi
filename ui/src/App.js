import AdminPage from "./pages/AdminPage";
import MainPage from "./pages/MainPage";
import { Routes, Route, HashRouter } from "react-router-dom";
import NoPage from "./pages/NoPage";
import AdminEntryPage from "./pages/AdminEntryPage.js";

import '@fontsource/kanit/300.css';
import '@fontsource/kanit/400.css';
import '@fontsource/kanit/500.css';
import '@fontsource/kanit/700.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/adminLogin" element={<AdminEntryPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;