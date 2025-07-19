import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

const StyleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What's your lifestyle like?",
      options: [
        { id: 'a', text: 'Professional and busy', image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { id: 'b', text: 'Creative and artistic', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { id: 'c', text: 'Active and outdoorsy', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { id: 'd', text: 'Social and outgoing', image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
      ]
    },
    {
      id: 2,
      question: "Which colors do you gravitate towards?",
      options: [
        { id: 'a', text: 'Neutral tones (black, white, beige)', color: '#000000' },
        { id: 'b', text: 'Bold and bright colors', color: '#FF6B6B' },
        { id: 'c', text: 'Earth tones (brown, green, rust)', color: '#8B4513' },
        { id: 'd', text: 'Pastels and soft colors', color: '#FFB6C1' }
      ]
    },
    {
      id: 3,
      question: "What's your ideal shopping experience?",
      options: [
        { id: 'a', text: 'Quick and efficient - I know what I want' },
        { id: 'b', text: 'Browsing and discovering new pieces' },
        { id: 'c', text: 'Online shopping from home' },
        { id: 'd', text: 'Shopping with friends for advice' }
      ]
    },
    {
      id: 4,
      question: "How do you want your clothes to make you feel?",
      options: [
        { id: 'a', text: 'Confident and powerful' },
        { id: 'b', text: 'Creative and unique' },
        { id: 'c', text: 'Comfortable and relaxed' },
        { id: 'd', text: 'Elegant and sophisticated' }
      ]
    },
    {
      id: 5,
      question: "What's your biggest fashion challenge?",
      options: [
        { id: 'a', text: 'Finding clothes that fit well' },
        { id: 'b', text: 'Mixing and matching pieces' },
        { id: 'c', text: 'Staying within budget' },
        { id: 'd', text: 'Keeping up with trends' }
      ]
    }
  ];

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    // Simple scoring system based on answers
    const scores = { a: 0, b: 0, c: 0, d: 0 };
    Object.values(answers).forEach(answer => {
      scores[answer]++;
    });

    const maxScore = Math.max(...Object.values(scores));
    const dominantStyle = Object.keys(scores).find(key => scores[key] === maxScore);

    const styleProfiles = {
      a: {
        name: 'Classic Professional',
        description: 'You prefer timeless, well-tailored pieces that exude confidence and sophistication.',
        colors: ['Navy', 'Black', 'White', 'Gray'],
        recommendations: ['Blazers', 'Tailored pants', 'Button-down shirts', 'Classic pumps']
      },
      b: {
        name: 'Creative Bohemian',
        description: 'You love expressing your artistic side through unique patterns, textures, and bold choices.',
        colors: ['Jewel tones', 'Rich purples', 'Deep greens', 'Warm oranges'],
        recommendations: ['Flowy dresses', 'Statement jewelry', 'Textured fabrics', 'Unique prints']
      },
      c: {
        name: 'Casual Comfort',
        description: 'You prioritize comfort and practicality while maintaining a put-together appearance.',
        colors: ['Earth tones', 'Soft blues', 'Warm browns', 'Sage green'],
        recommendations: ['Comfortable jeans', 'Soft knits', 'Sneakers', 'Casual dresses']
      },
      d: {
        name: 'Elegant Romantic',
        description: 'You gravitate towards feminine, sophisticated pieces that highlight your graceful nature.',
        colors: ['Soft pinks', 'Cream', 'Lavender', 'Rose gold'],
        recommendations: ['Flowing skirts', 'Delicate blouses', 'Elegant heels', 'Soft cardigans']
      }
    };

    return styleProfiles[dominantStyle];
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const selectedAnswer = answers[question.id];

    return (
      <div className="glass-effect rounded-3xl p-8 max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-purple-300 font-medium">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-gray-400">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{question.question}</h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(question.id, option.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover-lift ${
                selectedAnswer === option.id
                  ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                  : 'border-gray-600/50 bg-white/5 hover:border-purple-400/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold text-lg">{option.text}</span>
                {selectedAnswer === option.id && (
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              {option.image && (
                <img 
                  src={option.image} 
                  alt={option.text}
                  className="w-full h-32 object-cover rounded-xl"
                />
              )}
              
              {option.color && (
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-gray-300">Sample color</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={!selectedAnswer}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const results = calculateResults();

    return (
      <div className="glass-effect rounded-3xl p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Your Style Profile</h2>
          <h3 className="text-2xl font-semibold text-purple-300 mb-4">{results.name}</h3>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">{results.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Your Colors */}
          <div className="bg-white/10 rounded-2xl p-6">
            <h4 className="text-xl font-semibold text-white mb-4">Your Perfect Colors</h4>
            <div className="flex flex-wrap gap-3">
              {results.colors.map((color, index) => (
                <span key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium">
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white/10 rounded-2xl p-6">
            <h4 className="text-xl font-semibold text-white mb-4">Key Pieces for You</h4>
            <ul className="space-y-2">
              {results.recommendations.map((item, index) => (
                <li key={index} className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            <span>Explore Your Recommendations</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass-effect backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Style Quiz</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!showResults ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-6">Discover Your Style</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Answer a few questions to unlock personalized fashion recommendations tailored just for you
              </p>
            </div>
            {renderQuestion()}
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-6">Congratulations!</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We've analyzed your preferences and created your personalized style profile
              </p>
            </div>
            {renderResults()}
          </>
        )}
      </main>
    </div>
  );
};

export default StyleQuiz;