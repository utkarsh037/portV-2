import React from "react";
import "./Skills.css";
import { FaStar, FaReact, FaNodeJs, FaBitcoin, FaBrain, FaTools } from "react-icons/fa";

const skillsData = [
  {
    title: "Full Stack Development",
    rating: 4.8,
    icons: [<FaReact />, <FaNodeJs />],
    keywords: ["MERN Stack", "REST APIs", "Scalability"],
  },
  {
    title: "Blockchain Development",
    rating: 4.7,
    icons: [<FaBitcoin />],
    keywords: ["Smart Contracts", "Web3", "Decentralized Apps"],
  },
  {
    title: "AI & Machine Learning",
    rating: 4.6,
    icons: [<FaBrain />],
    keywords: ["TensorFlow", "NLP", "Deep Learning"],
  },
  {
    title: "Civil Engineering",
    rating: 4.5,
    icons: [<FaTools />],
    keywords: ["AutoCAD", "Structural Analysis", "CFD Simulations"],
  },
];

const Skills = () => {
  return (
    <section className="skills-section">
      <h2 className="section-title">My Skills</h2>
      <div className="skills-grid">
        {skillsData.map((skill, index) => (
          <div className="skill-card" key={index}>
            <div className="skill-header">
              <h3>{skill.title}</h3>
              <div className="skill-icons">
                {skill.icons.map((icon, i) => (
                  <span key={i}>{icon}</span>
                ))}
              </div>
            </div>
            <div className="rating">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar key={i} color={i < skill.rating ? "#ffc107" : "#333"} />
              ))}
              <span className="rating-score">{skill.rating.toFixed(1)}</span>
            </div>
            <div className="keywords">
              {skill.keywords.map((keyword, idx) => (
                <span key={idx} className="keyword-chip">{keyword}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
