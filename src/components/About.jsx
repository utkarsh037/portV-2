import React from "react";
import { motion } from "framer-motion";
import "./About.css";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-image">
          <img src={`${process.env.PUBLIC_URL}/mypic.jpeg`} alt="Utkarsh's Profile" />
        </div>
        <div className="about-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Me
          </motion.h1>

          <motion.p
            className="about-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Hi, I'm <strong>Utkarsh</strong>—a passionate individual blending civil engineering with cutting-edge software development.
          </motion.p>

          <motion.p
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            🚀 As a <strong>full-stack developer</strong>, I love building scalable applications. My enthusiasm lies in Blockchain & AI technologies, always eager to dive deeper into groundbreaking innovations.
          </motion.p>

          <motion.p
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            🌍 My ultimate goal is to collaborate on futuristic projects and leave a meaningful impact on the world.
          </motion.p>

          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            💬 Let’s connect and create something extraordinary together!
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default About;
