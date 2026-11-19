
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/learninghub.css";

const topics = [
  {
    title: "Waste Segregation",
    category: "Basics",
    icon: "♻️",
    description: "Learn how to separate waste correctly at home.",
    content: [
      "Wet Waste: Vegetable peels, leftover food, fruit waste and tea leaves. These can be composted.",
      "Dry Waste: Paper, cardboard, plastic bottles, metal cans and clean packaging. Keep these clean and dry for recycling.",
      "E-Waste: Old phones, chargers, batteries and electronic devices. Take them to authorized e-waste collection centres.",
      "Hazardous Waste: Paint, chemicals, and certain cleaning products. Dispose of them through appropriate collection facilities."
    ]
  },
  {
    title: "Home Composting",
    category: "Practical Guide",
    icon: "🌱",
    description: "Turn kitchen waste into useful natural compost.",
    content: [
      "Choose a container with small air holes for ventilation.",
      "Add vegetable peels, fruit scraps and other suitable organic waste.",
      "Cover wet waste with dry leaves, shredded paper or cocopeat.",
      "Mix the contents regularly and keep them moist, not soggy.",
      "After decomposition, the compost can be used to enrich garden soil."
    ]
  },
  {
    title: "E-Waste Management",
    category: "Environment",
    icon: "🔋",
    description: "Understand why electronic waste needs special care.",
    content: [
      "E-waste includes discarded phones, computers, batteries and electronic accessories.",
      "Some electronic components contain materials that can harm the environment if dumped carelessly.",
      "Never burn electronic waste or throw batteries into regular household bins.",
      "Reuse working devices where possible and hand over unwanted electronics to authorized collection centres."
    ]
  },
  {
    title: "Reduce Plastic Pollution",
    category: "Sustainable Living",
    icon: "🌍",
    description: "Simple ways to reduce everyday plastic waste.",
    content: [
      "Carry a reusable water bottle and shopping bag.",
      "Avoid unnecessary single-use plastic items.",
      "Choose products with recyclable or minimal packaging.",
      "Reuse containers whenever it is safe and practical.",
      "Separate recyclable plastic and send it to appropriate recycling facilities."
    ]
  },
  {
    title: "Paper and Cardboard Recycling",
    category: "Recycling",
    icon: "📦",
    description: "Learn how paper products can be reused and recycled.",
    content: [
      "Keep paper and cardboard clean and dry.",
      "Remove plastic wrapping, tape and other non-paper materials when possible.",
      "Reuse one-sided sheets for rough work and notes.",
      "Flatten cardboard boxes to save storage space before recycling."
    ]
  },
  {
    title: "Save Water and Energy",
    category: "Sustainable Living",
    icon: "💧",
    description: "Build small habits that conserve natural resources.",
    content: [
      "Turn off taps while brushing your teeth.",
      "Fix leaking taps and avoid unnecessary water wastage.",
      "Switch off lights, fans and electronic devices when not in use.",
      "Use natural daylight whenever possible.",
      "Prefer energy-efficient appliances and responsible daily habits."
    ]
  }
];

const videos = [
  {
    title: "Waste Segregation at Home",
    description: "Understand wet, dry and household waste separation.",
    search: "waste segregation at home educational video"
  },
  {
    title: "How to Make Compost at Home",
    description: "Learn the basics of turning kitchen waste into compost.",
    search: "how to make compost at home for beginners"
  },
  {
    title: "Understanding E-Waste",
    description: "Discover the importance of responsible e-waste disposal.",
    search: "e waste management awareness educational video"
  },
  {
    title: "Reduce Plastic Waste",
    description: "Explore practical ways to reduce single-use plastic.",
    search: "how to reduce plastic waste educational video"
  }
];

const tips = [
  "Carry a reusable water bottle instead of buying disposable plastic bottles.",
  "Keep separate bins for wet and dry waste at home.",
  "Reuse old jars and containers for storage.",
  "Avoid wasting food and compost suitable kitchen scraps.",
  "Switch off lights and fans when leaving a room.",
  "Donate or recycle old clothes instead of throwing them away.",
  "Use both sides of paper before recycling it.",
  "Dispose of batteries and electronic items through proper collection channels."
];

const questions = [
  {
    question: "Which of the following belongs in wet waste?",
    options: ["Plastic bottle", "Vegetable peels", "Metal can", "Glass jar"],
    answer: 1,
    explanation: "Vegetable peels are biodegradable organic waste and can be composted."
  },
  {
    question: "Where should old batteries be disposed of?",
    options: ["Regular dustbin", "Water bodies", "Authorized e-waste collection", "Open ground"],
    answer: 2,
    explanation: "Batteries should be handed over to authorized collection or recycling facilities."
  },
  {
    question: "What is composting?",
    options: [
      "Burning plastic",
      "Converting organic waste into nutrient-rich material",
      "Mixing all waste together",
      "Dumping waste in rivers"
    ],
    answer: 1,
    explanation: "Composting is the natural decomposition of organic waste into useful compost."
  },
  {
    question: "Which action helps reduce plastic pollution?",
    options: [
      "Using disposable bags",
      "Burning plastic",
      "Using reusable shopping bags",
      "Throwing plastic on roads"
    ],
    answer: 2,
    explanation: "Reusable bags reduce the need for single-use plastic bags."
  },
  {
    question: "Which item is generally considered dry recyclable waste?",
    options: ["Leftover food", "Fruit peels", "Clean cardboard", "Tea leaves"],
    answer: 2,
    explanation: "Clean and dry cardboard can be collected for paper recycling."
  }
];

function LearningHub() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("learn");
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    if (index === questions[currentQuestion].answer) {
      setScore((previous) => previous + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setQuizFinished(true);
    } else {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer(null);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="learning-hub">

      {/* Back Button */}
      <button
        className="lh-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back
      </button>

      <div className="lh-hero">
        <div>
          <span className="lh-eyebrow">ECOLENS AI • LEARNING HUB</span>
          <h1>Learn Today, Save Tomorrow 🌍</h1>
          <p>
            Explore environmental topics, discover sustainable habits and
            test your knowledge to make a positive impact.
          </p>
        </div>
        <div className="lh-hero-icon">🌱</div>
      </div>

      <div className="lh-tabs">
        <button className={activeTab === "learn" ? "active" : ""} onClick={() => setActiveTab("learn")}>
          📚 Learn
        </button>
        <button className={activeTab === "watch" ? "active" : ""} onClick={() => setActiveTab("watch")}>
          ▶ Watch
        </button>
        <button className={activeTab === "quiz" ? "active" : ""} onClick={() => setActiveTab("quiz")}>
          🧠 Quiz
        </button>
        <button className={activeTab === "tips" ? "active" : ""} onClick={() => setActiveTab("tips")}>
          💡 Eco Tips
        </button>
      </div>

      {activeTab === "learn" && (
        <section className="lh-section">
          <div className="lh-section-heading">
            <div>
              <h2>Explore Learning Topics</h2>
              <p>Build your environmental knowledge one topic at a time.</p>
            </div>
            <span className="lh-count">{topics.length} Topics</span>
          </div>

          <div className="lh-topic-grid">
            {topics.map((topic, index) => (
              <article className="lh-topic-card" key={topic.title}>
                <div className="lh-topic-top">
                  <span className="lh-topic-icon">{topic.icon}</span>
                  <span className="lh-category">{topic.category}</span>
                </div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <button
                  className="lh-text-btn"
                  onClick={() =>
                    setExpandedTopic(expandedTopic === index ? null : index)
                  }
                >
                  {expandedTopic === index ? "Close Guide ↑" : "Read Guide →"}
                </button>

                {expandedTopic === index && (
                  <div className="lh-topic-content">
                    <h4>What you should know</h4>
                    <ul>
                      {topic.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "watch" && (
        <section className="lh-section">
          <div className="lh-section-heading">
            <div>
              <h2>Watch & Learn</h2>
              <p>Explore educational videos on sustainability and waste management.</p>
            </div>
          </div>

          <div className="lh-video-grid">
            {videos.map((video) => (
              <article className="lh-video-card" key={video.title}>
                <div className="lh-video-icon">▶</div>
                <div>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.search)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="lh-watch-btn"
                  >
                    Find Videos on YouTube ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="lh-video-note">
            Videos open on YouTube so you can choose an available educational tutorial.
          </p>
        </section>
      )}

      {activeTab === "quiz" && (
        <section className="lh-section">
          <div className="lh-section-heading">
            <div>
              <h2>Test Your Eco Knowledge</h2>
              <p>Answer these questions and check how much you have learned.</p>
            </div>
            <span className="lh-count">
              {quizFinished ? "Completed" : `${currentQuestion + 1} / ${questions.length}`}
            </span>
          </div>

          <div className="lh-quiz-card">
            {!quizFinished ? (
              <>
                <div className="lh-progress-track">
                  <div
                    className="lh-progress-fill"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <span className="lh-question-number">QUESTION {currentQuestion + 1}</span>
                <h3>{questions[currentQuestion].question}</h3>

                <div className="lh-options">
                  {questions[currentQuestion].options.map((option, index) => {
                    let className = "lh-option";
                    if (selectedAnswer !== null && index === questions[currentQuestion].answer) {
                      className += " correct";
                    } else if (selectedAnswer === index) {
                      className += " incorrect";
                    }

                    return (
                      <button
                        key={option}
                        className={className}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <span>{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div className="lh-explanation">
                    <strong>
                      {selectedAnswer === questions[currentQuestion].answer
                        ? "Correct! 🎉"
                        : "Not quite! Keep learning."}
                    </strong>
                    <p>{questions[currentQuestion].explanation}</p>
                  </div>
                )}

                <button
                  className="lh-primary-btn"
                  onClick={nextQuestion}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion === questions.length - 1 ? "See My Result" : "Next Question →"}
                </button>
              </>
            ) : (
              <div className="lh-quiz-result">
                <div className="lh-result-icon">🏆</div>
                <h2>Quiz Completed!</h2>
                <p>Your Eco Knowledge Score</p>
                <div className="lh-score">{score} / {questions.length}</div>
                <p>
                  {score === questions.length
                    ? "Excellent! You are an Eco Champion!"
                    : score >= 3
                    ? "Great work! Keep learning and growing."
                    : "Good try! Explore the Learn section and try again."}
                </p>
                <button className="lh-primary-btn" onClick={restartQuiz}>
                  Try Again ↻
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "tips" && (
        <section className="lh-section">
          <div className="lh-section-heading">
            <div>
              <h2>Small Steps, Big Impact</h2>
              <p>Simple habits that can make everyday life more sustainable.</p>
            </div>
          </div>

          <div className="lh-tips-grid">
            {tips.map((tip, index) => (
              <div className="lh-tip-card" key={index}>
                <span>{["💧", "♻️", "🫙", "🌱", "💡", "👕", "📄", "🔋"][index]}</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default LearningHub;
