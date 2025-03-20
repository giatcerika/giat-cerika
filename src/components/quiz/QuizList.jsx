// components/quiz/QuizList.jsx
import { useState, useEffect } from 'react';
import { getAllQuizzes } from '../../services/quizService';
import { Pencil, Trash2 } from 'lucide-react';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await getAllQuizzes();
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {quiz.questions?.length || 0} Questions
            </span>
            <div className="flex gap-2">
              <button className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                <Pencil size={18} />
              </button>
              <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizList;