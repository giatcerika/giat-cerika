import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizForm from '../components/quiz/QuizForm';
import QuizPreview from '../components/quiz/QuizPreview';
import { getAllQuizzes, deleteQuiz, getQuizAttemptsByQuizId } from '../services/quizService';
import {
  Plus, Pencil, Trash2, X, Eye, BarChart, CheckCircle, XCircle, Search, Calendar,
  FileQuestion, Users, Award, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [previewQuiz, setPreviewQuiz] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        await deleteQuiz(id);
        await loadQuizzes();
      } catch (err) {
        console.error('Error deleting quiz:', err);
        setError('Gagal menghapus quiz');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuizSubmit = async () => {
    setIsModalOpen(false);
    await loadQuizzes();
  };

  const handleViewAttempts = async (quiz) => {
    try {
      setIsLoading(true);
      const response = await getQuizAttemptsByQuizId(quiz._id);
      setQuizAttempts({
        quiz,
        attempts: response.data
      });
      setSelectedAttempt(null);
    } catch (err) {
      console.error('Error loading quiz attempts:', err);
      setError('Gagal memuat hasil quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttemptSelect = (attempt) => {
    setSelectedAttempt(attempt);
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 bg-[#FFF8DC] min-h-screen">
      {/* Header with Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-[#e8e1c8]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-[#497D74]">Manajemen Quiz</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#497D74] text-white px-5 py-2.5 rounded-lg hover:bg-[#3c6a62] transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Quiz</span>
          </button>
        </div>

        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari quiz berdasarkan judul atau deskripsi..."
            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#497D74] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm mb-6 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Quiz List */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#497D74]">
          {searchTerm ? `Hasil Pencarian: "${searchTerm}"` : 'Daftar Quiz'}
        </h2>
        <button
          onClick={loadQuizzes}
          className="flex items-center text-[#497D74] hover:text-[#3c6a62] px-3 py-1.5 rounded-md hover:bg-[#f0f8f6] transition-colors"
          disabled={loading}
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#497D74]"></div>
          <p className="mt-4 text-gray-600">Memuat data quiz...</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? 'Tidak ada quiz yang sesuai dengan pencarian' : 'Belum ada quiz tersedia'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? 'Coba gunakan kata kunci lain atau kurangi filter pencarian.'
              : 'Silakan tambahkan quiz baru dengan menekan tombol "Tambah Quiz" di atas.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-[#497D74] text-white px-4 py-2 rounded-lg hover:bg-[#3c6a62] transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-[#e8e1c8]">
              <div className="bg-[#f2f9f7] p-4 border-b border-[#e8e1c8]">
                <h3 className="text-xl font-bold text-[#497D74] line-clamp-1">{quiz.title}</h3>
              </div>

              <div className="p-5">
                <p className="text-gray-600 mb-5 line-clamp-2">{quiz.description || 'No description available'}</p>

                <div className="flex flex-wrap gap-3 mb-5">
                  <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <FileQuestion size={15} className="mr-1.5" />
                    <span>{quiz.questions?.length || 0} Pertanyaan</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Calendar size={15} className="mr-1.5" />
                    <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="text-[#497D74] hover:text-[#3c6a62] font-medium text-sm"
                  >
                    Lihat Detail
                  </button>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleViewAttempts(quiz)}
                      className="p-2 text-[#497D74] hover:bg-[#497D74] hover:text-white rounded-md transition-colors"
                      title="Lihat Hasil"
                      disabled={isLoading}
                    >
                      <BarChart size={18} className={isLoading ? 'opacity-50' : ''} />
                    </button>
                    <button
                      onClick={() => handlePreviewQuiz(quiz)}
                      className="p-2 text-[#497D74] hover:bg-[#497D74] hover:text-white rounded-md transition-colors"
                      title="Preview"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="p-2 text-[#497D74] hover:bg-[#497D74] hover:text-white rounded-md transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                      title="Hapus"
                      disabled={isLoading}
                    >
                      <Trash2 size={18} className={isLoading ? 'opacity-50' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal dengan QuizForm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#e8e1c8]">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-[#f2f9f7]">
              <h2 className="text-xl font-bold text-[#497D74]">
                {selectedQuiz ? 'Edit Quiz' : 'Tambah Quiz Baru'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e8e1c8]">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-[#f2f9f7]">
              <h2 className="text-xl font-bold text-[#497D74]">Preview Quiz</h2>
              <button
                onClick={() => setPreviewQuiz(null)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <QuizPreview quiz={previewQuiz} />
            </div>
          </div>
        </div>
      )}

      {/* Quiz Attempts Modal */}
      {quizAttempts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-[#e8e1c8]">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-[#f2f9f7]">
              <div>
                <h2 className="text-xl font-bold text-[#497D74] mb-1">
                  Hasil Quiz
                </h2>
                <p className="text-gray-600 text-sm">{quizAttempts.quiz.title}</p>
              </div>
              <button
                onClick={() => {
                  setQuizAttempts(null);
                  setSelectedAttempt(null);
                }}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Stats Summary */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-[#f2f9f7] p-4 rounded-lg border border-[#e1efe9] flex items-center">
                    <div className="bg-[#497D74] p-2 rounded-lg mr-3">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Attempts</span>
                      <p className="font-bold text-lg text-[#497D74]">{quizAttempts.attempts.length}</p>
                    </div>
                  </div>

                  {quizAttempts.attempts.length > 0 && (
                    <>
                      <div className="bg-[#f2f9f7] p-4 rounded-lg border border-[#e1efe9] flex items-center">
                        <div className="bg-[#497D74] p-2 rounded-lg mr-3">
                          <Award size={20} className="text-white" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Highest Score</span>
                          <p className="font-bold text-lg text-[#497D74]">
                            {quizAttempts.attempts.length
                              ? Math.max(...quizAttempts.attempts.map(a => a.score))
                              : '-'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#f2f9f7] p-4 rounded-lg border border-[#e1efe9] flex items-center">
                        <div className="bg-[#497D74] p-2 rounded-lg mr-3">
                          <FileQuestion size={20} className="text-white" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Average Score</span>
                          <p className="font-bold text-lg text-[#497D74]">
                            {quizAttempts.attempts.length
                              ? Math.round(quizAttempts.attempts.reduce((sum, att) => sum + att.score, 0) / quizAttempts.attempts.length)
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* List Attempts - 1/3 width on md+ screens */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 text-[#497D74] flex items-center">
                      <Users size={18} className="mr-2" /> Daftar Pengerjaan
                    </h3>

                    {quizAttempts.attempts.length === 0 ? (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-700 text-center">
                        <p className="font-medium">Belum ada yang mengerjakan quiz ini.</p>
                        <p className="text-sm mt-1">Hasil akan muncul setelah siswa mengerjakan quiz.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {quizAttempts.attempts.map((attempt) => (
                          <div
                            key={attempt._id}
                            onClick={() => handleAttemptSelect(attempt)}
                            className={`p-4 rounded-lg cursor-pointer border transition-all hover:shadow-md ${selectedAttempt && selectedAttempt._id === attempt._id
                                ? 'bg-[#497D74] text-white border-[#497D74] shadow-md'
                                : 'bg-white hover:bg-gray-50 border-gray-200'
                              }`}
                          >
                            <div className="font-medium text-lg">{attempt.user?.username || 'Pengguna'}</div>
                            <div className="flex justify-between items-center mt-2">
                              <div className={`text-sm flex items-center ${selectedAttempt && selectedAttempt._id === attempt._id
                                  ? 'text-white/80'
                                  : 'text-gray-500'
                                }`}>
                                <Clock size={14} className="mr-1" />
                                {new Date(attempt.completedAt).toLocaleDateString()}
                              </div>
                              <div className={`font-bold text-lg ${selectedAttempt && selectedAttempt._id === attempt._id
                                  ? 'text-white'
                                  : 'text-[#497D74]'
                                }`}>
                                {attempt.score}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Attempt Details - 2/3 width on md+ screens */}
                <div className="md:col-span-2">
                  {selectedAttempt ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-5 border-b border-gray-200 bg-[#f2f9f7]">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-xl text-[#497D74]">{selectedAttempt.user?.username || 'Pengguna'}</h3>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <Clock size={14} className="mr-1" />
                              {new Date(selectedAttempt.completedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-[#497D74]">{selectedAttempt.score}</div>
                            <div className="text-sm text-gray-500">Skor</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h4 className="font-bold text-lg mb-4 text-[#497D74] flex items-center">
                          <FileQuestion size={18} className="mr-2" /> Detail Jawaban
                        </h4>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                          {selectedAttempt.answers.map((answer, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border-l-4 ${answer.isCorrect
                                  ? 'border-l-green-500 bg-green-50/50'
                                  : 'border-l-red-500 bg-red-50/50'
                                } shadow-sm transition-all hover:shadow-md border border-gray-200`}
                            >
                              <div className="flex items-start gap-3">
                                {answer.isCorrect ? (
                                  <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                                    <CheckCircle size={20} />
                                  </div>
                                ) : (
                                  <div className="bg-red-100 p-1.5 rounded-full text-red-600">
                                    <XCircle size={20} />
                                  </div>
                                )}
                                <div className="flex-grow">
                                  <div className="flex items-center mb-2">
                                    <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">{index + 1}</span>
                                    <p className="font-medium text-gray-800">{answer.question.text}</p>
                                  </div>
                                  <div className={`p-3 rounded-md ${answer.isCorrect
                                      ? 'bg-white border border-green-200 text-gray-800'
                                      : 'bg-white border border-red-200 text-gray-800'
                                    }`}>
                                    <span className="font-medium text-gray-600">Jawaban:</span> {answer.selectedOption.text}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm p-10 border border-gray-200 flex flex-col items-center justify-center h-full text-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <Users size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 max-w-md">
                        Pilih salah satu hasil pengerjaan quiz dari daftar di sebelah kiri untuk melihat detail jawaban.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;