import { useState, useEffect } from 'react';
import QuizForm from '../components/quiz/QuizForm';
import QuizPreview from '../components/quiz/QuizPreview'; 
import { getAllQuizzes, deleteQuiz } from '../services/quizService';
import { Plus, Pencil, Trash2, X, Eye } from 'lucide-react';

const QuizPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [previewQuiz, setPreviewQuiz] = useState(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await getAllQuizzes();
      setQuizzes(response.data.data); // Ambil array quiz dari response.data.data
      setError(null);
    } catch (err) {
      setError('Gagal memuat data quiz');
      console.error('Error loading quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handlePreviewQuiz = (quiz) => {
    setPreviewQuiz(quiz);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus quiz ini?')) {
      try {
        await deleteQuiz(id);
        await loadQuizzes();
      } catch (err) {
        console.error('Error deleting quiz:', err);
        setError('Gagal menghapus quiz');
      }
    }
  };

  const handleQuizSubmit = async () => {
    setIsModalOpen(false);
    await loadQuizzes();
  };

  return (
    <div className="p-6 bg-[#FFF8DC] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#497D74]">Manajemen Quiz</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#497D74] text-white px-4 py-2 rounded-lg hover:bg-[#5c8f86]"
        >
          <Plus size={20} />
          <span>Tambah Quiz</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Quiz List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#497D74]"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2 text-[#497D74]">{quiz.title}</h3>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {quiz.questions?.length || 0} Pertanyaan
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePreviewQuiz(quiz)}
                    className="p-2 text-[#497D74] hover:bg-[#497D74] hover:text-white rounded transition-colors"
                    title="Preview"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => handleEditQuiz(quiz)}
                    className="p-2 text-[#497D74] hover:bg-[#497D74] hover:text-white rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal dengan QuizForm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-[#497D74]">
                {selectedQuiz ? 'Edit Quiz' : 'Tambah Quiz Baru'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <QuizForm 
                initialData={selectedQuiz}
                onSuccess={handleQuizSubmit}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-[#497D74]">Preview Quiz</h2>
              <button
                onClick={() => setPreviewQuiz(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <QuizPreview quiz={previewQuiz} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;