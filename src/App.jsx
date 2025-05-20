import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import JobPage from "./pages/JobsPage.jsx";
import NotFoundPage from "./pages/NotFoundpage.jsx";
import Login from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow ">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobPage />} />
            {/* <Route path="/jobs/:id" element={<JobDetailPage />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
            <Route path="*" element={<UnauthorizedPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
