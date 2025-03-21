// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MateriPage from './pages/MateriPage';
import VideoPage from './pages/VideoPage';
import QuizPage from './pages/QuizPage';
import QuizDetailPage from './pages/QuizDetailPage'; // Import halaman baru

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materi" element={<MateriPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:id" element={<QuizDetailPage />} /> {/* Tambahkan route ini */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;