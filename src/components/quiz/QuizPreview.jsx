import React from 'react';

// components/quiz/QuizPreview.jsx
const QuizPreview = ({ quiz }) => {
  // Helper function untuk handle image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Pastikan path dimulai dengan https://giat-cerika-backend.vercel.app//
    if (imagePath.startsWith('/uploads')) {
      return `https://giat-cerika-backend.vercel.app/${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
        <p className="text-gray-600">{quiz.description}</p>
      </div>

      <div className="space-y-8">
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="border-b pb-6">
            <div className="mb-4">
              <h4 className="font-medium mb-2">
                Pertanyaan {qIndex + 1}: {question.text}
              </h4>
              {question.image?.url && (
                <img
                  src={getImageUrl(question.image.url)}
                  alt={`Question ${qIndex + 1}`}
                  className="max-w-full h-auto mb-4 rounded"
                />
              )}
            </div>

            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className={`p-3 border rounded-lg 
                      ${option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                >
                  {option.text}
                  {option.isCorrect && (
                    <span className="ml-2 text-green-500 text-sm">(Jawaban Benar)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizPreview;