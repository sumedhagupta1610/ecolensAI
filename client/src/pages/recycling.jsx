
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../styles/recycling.css";

const yearlyData = [
  { year: "2021", recycled: 42, unprocessed: 58 },
  { year: "2022", recycled: 48, unprocessed: 52 },
  { year: "2023", recycled: 55, unprocessed: 45 },
  { year: "2024", recycled: 63, unprocessed: 37 },
  { year: "2025", recycled: 70, unprocessed: 30 },
];

const wasteData = [
  { name: "Plastic", value: 25 },
  { name: "Paper", value: 30 },
  { name: "Food Waste", value: 20 },
  { name: "Metal", value: 10 },
  { name: "Glass", value: 10 },
  { name: "Other", value: 5 },
];

const COLORS = [
  "#31966a",
  "#75b84c",
  "#e9ad45",
  "#4c91bd",
  "#8b79c9",
  "#9ba6a0",
];

const articles = [
  {
    icon: "♻️",
    category: "RECYCLING BASICS",
    title: "Why Is Recycling Important?",
    description:
      "Understand how recycling reduces landfill waste, saves natural resources and helps protect our environment.",
    points: [
      "Reduces the amount of waste sent to landfills.",
      "Saves energy and valuable natural resources.",
      "Helps reduce pollution and environmental damage.",
    ],
  },
  {
    icon: "🥤",
    category: "PLASTIC WASTE",
    title: "How to Recycle Plastic Properly",
    description:
      "Learn how to identify recyclable plastic and prepare plastic containers before putting them in recycling bins.",
    points: [
      "Empty and rinse plastic containers.",
      "Separate caps when local guidelines require it.",
      "Avoid mixing contaminated plastic with clean recyclables.",
    ],
  },
  {
    icon: "🍃",
    category: "SUSTAINABLE LIVING",
    title: "Composting at Home",
    description:
      "Turn everyday kitchen waste into useful compost and reduce the amount of organic waste you throw away.",
    points: [
      "Collect fruit and vegetable scraps.",
      "Mix green waste with dry leaves or paper.",
      "Keep the compost moist and allow it to decompose.",
    ],
  },
  {
    icon: "📦",
    category: "PAPER WASTE",
    title: "Give Paper a Second Life",
    description:
      "Discover how paper and cardboard can be reused and recycled instead of being thrown away.",
    points: [
      "Keep paper clean and dry.",
      "Flatten cardboard boxes before recycling.",
      "Reuse one-sided sheets for rough work.",
    ],
  },
  {
    icon: "🔋",
    category: "E-WASTE",
    title: "Dispose of E-Waste Safely",
    description:
      "Old electronics and batteries need special handling. Learn why they should not be mixed with household waste.",
    points: [
      "Never throw batteries into regular bins.",
      "Use authorised e-waste collection points.",
      "Donate or repair working electronic devices.",
    ],
  },
  {
    icon: "🌍",
    category: "ECO FRIENDLY HABITS",
    title: "Simple Ways to Reduce Daily Waste",
    description:
      "Small everyday choices can help reduce waste and make your lifestyle more sustainable.",
    points: [
      "Carry reusable shopping bags and bottles.",
      "Avoid unnecessary single-use packaging.",
      "Repair, reuse and donate items whenever possible.",
    ],
  },
];

function Recycling() {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = React.useState(null);

  return (
    <div className="recycling-page">
      <button
        className="recycling-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back
      </button>

      <div className="recycling-header">
        <div>
          <span className="recycling-eyebrow">ECO LIVING • LEARN • ACT</span>
          <h1>Recycling & Awareness</h1>
          <p>
            Explore recycling knowledge, understand waste trends and
            discover simple ways to build a greener future.
          </p>
        </div>
      </div>

      <section className="recycling-hero">
        <div className="hero-content">
          <span className="hero-tag">MAKE EVERY WASTE COUNT</span>
          <h2>Small Actions. Big Environmental Impact.</h2>
          <p>
            Recycling is more than just putting waste into a bin.
            It is about conserving resources, reducing pollution and
            creating a sustainable future for everyone.
          </p>
          <a href="#recycling-insights">Explore Recycling Insights ↓</a>
        </div>
        <div className="hero-illustration">🌱</div>
      </section>

      <section className="recycling-overview">
        <div className="overview-card">
          <span className="overview-icon">♻️</span>
          <div>
            <h3>Reduce</h3>
            <p>Minimise waste generation</p>
          </div>
        </div>
        <div className="overview-card">
          <span className="overview-icon">🔄</span>
          <div>
            <h3>Reuse</h3>
            <p>Give products another life</p>
          </div>
        </div>
        <div className="overview-card">
          <span className="overview-icon">🌍</span>
          <div>
            <h3>Recycle</h3>
            <p>Convert waste into resources</p>
          </div>
        </div>
      </section>

      <section className="recycling-section" id="recycling-insights">
        <div className="section-heading">
          <div>
            <span className="section-label">DATA & INSIGHTS</span>
            <h2>Understand Waste Through Data</h2>
            <p>
              Explore sample visualisations showing recycling trends
              and the composition of waste.
            </p>
          </div>
        </div>

        <div className="recycling-charts">
          <div className="chart-card">
            <div className="chart-heading">
              <div>
                <h3>Recycling Progress</h3>
                <p>Illustrative waste processing trend (%)</p>
              </div>
              <span className="chart-icon">📊</span>
            </div>

            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearlyData}
                  margin={{ top: 12, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#68766d", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#68766d", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e3ebe4",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="recycled"
                    name="Recycled"
                    stackId="a"
                    fill="#31966a"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="unprocessed"
                    name="Not processed"
                    stackId="a"
                    fill="#e8b65e"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-note">
              Sample data for demonstration only; not official national statistics.
            </p>
          </div>

          <div className="chart-card">
            <div className="chart-heading">
              <div>
                <h3>Waste Composition</h3>
                <p>Illustrative distribution by material</p>
              </div>
              <span className="chart-icon">🍃</span>
            </div>

            <div className="pie-area">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    outerRadius="78%"
                    innerRadius="48%"
                    paddingAngle={3}
                  >
                    {wasteData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e3ebe4",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={45}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-note">
              Illustrative composition; actual waste composition varies by location.
            </p>
          </div>
        </div>
      </section>

      <section className="recycling-section">
        <div className="section-heading">
          <div>
            <span className="section-label">LEARN SOMETHING NEW</span>
            <h2>Recycling Knowledge & Blogs</h2>
            <p>
              Read practical guides and learn how to manage different
              types of waste responsibly.
            </p>
          </div>
        </div>

        <div className="recycling-articles">
          {articles.map((article) => (
            <article className="recycling-article" key={article.title}>
              <div className="article-icon">{article.icon}</div>
              <span className="article-category">{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <button onClick={() => setSelectedArticle(article)}>
                Read More <span>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="recycling-bottom-tip">
        <div className="tip-icon">💡</div>
        <div>
          <h3>Did You Know?</h3>
          <p>
            Recycling works best when waste is separated correctly.
            Keep recyclable materials clean and dry, and always follow
            your local waste collection guidelines.
          </p>
        </div>
      </section>

      {selectedArticle && (
        <div
          className="article-modal-overlay"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="article-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedArticle(null)}
            >
              ×
            </button>
            <span className="article-category">
              {selectedArticle.category}
            </span>
            <h2>
              {selectedArticle.icon} {selectedArticle.title}
            </h2>
            <p>{selectedArticle.description}</p>
            <h3>What You Can Do</h3>
            <ul>
              {selectedArticle.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <button
              className="modal-done"
              onClick={() => setSelectedArticle(null)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recycling;
