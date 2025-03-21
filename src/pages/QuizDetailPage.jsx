// pages/QuizDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, getQuizAttemptsByQuizId } from '../services/quizService';
import { ArrowLeft, CheckCircle, XCircle, Award, Users, FileQuestion, Clock, ChevronRight } from 'lucide-react';

const QuizDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('questions');
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch quiz details
                const quizResponse = await getQuizById(id);
                setQuiz(quizResponse.data);

                // Fetch attempts for this quiz
                const attemptsResponse = await getQuizAttemptsByQuizId(id);
                setAttempts(attemptsResponse.data);
            } catch (err) {
                console.error('Error fetching quiz data:', err);
                setError('Failed to load quiz data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAttemptSelect = (attempt) => {
        setSelectedAttempt(attempt);
    };

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-32 bg-[#FFF8DC] min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#497D74]"></div>
                <p className="mt-4 text-[#497D74] font-medium">Loading quiz data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-[#FFF8DC] min-h-screen">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-md mb-6">
                    <div className="flex items-center space-x-2">
                        <XCircle size={24} />
                        <span className="font-medium">Error loading quiz data</span>
                    </div>
                    <p className="mt-2">{error}</p>
                </div>
                <button
                    onClick={() => navigate('/quiz')}
                    className="flex items-center text-[#497D74] hover:text-[#5c9e92] transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Quiz List
                </button>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="p-6 bg-[#FFF8DC] min-h-screen">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-lg shadow-md mb-6">
                    <div className="flex items-center space-x-2">
                        <XCircle size={24} />
                        <span className="font-medium">Quiz tidak ditemukan</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/quiz')}
                    className="flex items-center text-[#497D74] hover:text-[#5c9e92] transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Quiz List
                </button>
            </div>
        );
    }

    const avgScore = attempts.length
        ? Math.round(attempts.reduce((sum, att) => sum + att.score, 0) / attempts.length)
        : 0;

    return (
        <div className="p-6 bg-[#FFF8DC] min-h-screen">
            {/* Navigation */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/quiz')}
                    className="flex items-center text-[#497D74] hover:underline font-medium"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back to Quiz List
                </button>
            </div>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[#e8e1c8] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#497D74] opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#497D74] opacity-10 rounded-full -ml-12 -mb-12"></div>

                <h2 className="text-3xl font-bold text-[#497D74] mb-3">{quiz.title}</h2>
                {quiz.description && <p className="text-gray-600 mb-5 max-w-3xl">{quiz.description}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <div className="bg-[#f2f9f7] p-4 rounded-lg border border-[#e1efe9] flex items-center">
                        <div className="bg-[#497D74] p-2 rounded-lg mr-3">
                            <FileQuestion size={20} className="text-white" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Questions</span>
                            <p className="font-bold text-lg text-[#497D74]">{quiz.questions.length}</p>
                        </div>
                    </div>

                    <div className="bg-[#f2f9f7] p-4 rounded-lg border border-[#e1efe9] flex items-center">
                        <div className="bg-[#497D74] p-2 rounded-lg mr-3">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Attempts</span>
                            <p className="font-bold text-lg text-[#497D74]">{attempts.length}</p>
                        </div>
                    </div>

                    <div className="bg-[#f2f9f7] p-4 rounded-lg border border-[#e1efe9] flex items-center">
                        <div className="bg-[#497D74] p-2 rounded-lg mr-3">
                            <Award size={20} className="text-white" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Avg. Score</span>
                            <p className="font-bold text-lg text-[#497D74]">{avgScore}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-6 bg-white rounded-lg shadow-sm p-1 border border-[#e8e1c8]">
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`flex-1 py-3 px-4 font-medium rounded-md transition-colors ${activeTab === 'questions'
                            ? 'bg-[#497D74] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <span className="flex items-center justify-center space-x-2">
                        <FileQuestion size={18} />
                        <span>Pertanyaan Quiz</span>
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('attempts')}
                    className={`flex-1 py-3 px-4 font-medium rounded-md transition-colors ${activeTab === 'attempts'
                            ? 'bg-[#497D74] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <span className="flex items-center justify-center space-x-2">
                        <Users size={18} />
                        <span>Hasil Pengerjaan</span>
                    </span>
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'questions' ? (
                <div className="bg-white rounded-xl shadow-md p-0 border border-[#e8e1c8] overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {quiz.questions.map((question, index) => (
                            <div key={index} className={`transition-all duration-200 ${expandedQuestion === index ? 'bg-[#f0f8f6]' : 'hover:bg-gray-50'}`}>
                                <div
                                    className="p-5 cursor-pointer"
                                    onClick={() => toggleQuestion(index)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-[#497D74] text-white rounded-full min-w-7 h-7 flex items-center justify-center flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-800">{question.text}</h3>
                                        </div>
                                        <ChevronRight
                                            size={20}
                                            className={`text-gray-400 transition-transform ${expandedQuestion === index ? 'rotate-90' : ''}`}
                                        />
                                    </div>
                                </div>

                                {expandedQuestion === index && (
                                    <div className="px-5 pb-5 pt-0">
                                        {question.image && question.image.url && (
                                            <div className="mb-4 p-2 bg-white rounded-lg border border-gray-200">
                                                <img
                                                    src={question.image.url}
                                                    alt={`Question ${index + 1}`}
                                                    className="rounded-lg max-h-64 mx-auto object-contain"
                                                />
                                            </div>
                                        )}

                                        <h4 className="text-sm font-medium text-gray-500 mb-3 mt-4">Opsi Jawaban:</h4>
                                        <ul className="space-y-2">
                                            {question.options.map((option, optIndex) => (
                                                <li
                                                    key={optIndex}
                                                    className={`p-3 rounded-lg border transition-all ${option.isCorrect
                                                            ? 'bg-green-50 border-green-200 shadow-sm'
                                                            : 'bg-white border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{option.text}</span>
                                                        {option.isCorrect && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <CheckCircle size={14} className="mr-1" /> Jawaban Benar
                                                            </span>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* List Attempts */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-[#e8e1c8]">
                            <h3 className="font-bold text-lg mb-4 text-[#497D74] flex items-center">
                                <Users size={18} className="mr-2" /> Daftar Pengerjaan
                            </h3>

                            {attempts.length === 0 ? (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-700 text-center">
                                    <p className="font-medium">Belum ada yang mengerjakan quiz ini.</p>
                                    <p className="text-sm mt-1">Hasil akan muncul setelah siswa mengerjakan quiz.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
                                    {attempts.map((attempt) => (
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

                    {/* Attempt Details */}
                    <div className="md:col-span-2">
                        {selectedAttempt ? (
                            <div className="bg-white rounded-xl shadow-md border border-[#e8e1c8] overflow-hidden">
                                <div className="p-6 border-b border-gray-200 bg-[#f2f9f7]">
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

                                <div className="p-6">
                                    <h4 className="font-bold text-lg mb-4 text-[#497D74] flex items-center">
                                        <FileQuestion size={18} className="mr-2" /> Detail Jawaban
                                    </h4>

                                    <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
                                        {selectedAttempt.answers.map((answer, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-lg border-l-4 ${answer.isCorrect
                                                        ? 'border-l-green-500 bg-green-50/50'
                                                        : 'border-l-red-500 bg-red-50/50'
                                                    } shadow-sm transition-all hover:shadow-md`}
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
                            <div className="bg-white rounded-xl shadow-md p-10 border border-[#e8e1c8] flex flex-col items-center justify-center h-full text-center">
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
            )}
        </div>
    );
};

export default QuizDetailPage;