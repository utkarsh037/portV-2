import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Blogs.css";

// ── Seed Data ─────────────────────────────────────────────────────────────
const INITIAL_BLOGS = [
  {
    id: 1,
    title: "Why I Switched from Civil Engineering to Code",
    date: "March 1, 2026",
    category: "Life",
    readTime: "4 min read",
    excerpt: "Everyone thought I was crazy. A civil engineer abandoning AutoCAD for VSCode...",
    content: `Everyone thought I was crazy. A civil engineer abandoning AutoCAD for VSCode. But here's what nobody tells you about switching careers late — it's the best decision I ever made.

I spent 2 years calculating load-bearing walls and stress coefficients. Don't get me wrong, civil engineering is noble work. But I kept thinking: *what if I could build something millions of people use from a laptop?*

The moment I wrote my first React component and watched it render in a browser, I felt something I never felt staring at a blueprint. That instant feedback loop — write code, see result — is addictive.

Fast forward to today: I'm building full-stack apps, exploring blockchain, and diving deep into AI. No regrets. Just momentum.`,
    likes: 24,
    comments: [
      { id: 1, author: "Rahul M.", text: "This is exactly my story too! Civil to dev 🙌", time: "2 days ago", likes: 5 },
      { id: 2, author: "Priya S.", text: "Super inspiring. How long did it take you to get job-ready?", time: "1 day ago", likes: 3 },
    ],
  },
  {
    id: 2,
    title: "Building My First Smart Contract on Ethereum",
    date: "Feb 20, 2026",
    category: "Blockchain",
    readTime: "6 min read",
    excerpt: "Solidity looked like gibberish at first. Then everything clicked on day 12...",
    content: `Solidity looked like gibberish at first. Then everything clicked on day 12.

I started with the classic "Hello World" of blockchain — an ERC-20 token. Nothing special, just getting my hands dirty with the Remix IDE and understanding how the EVM works.

The mind-bending part? Once you deploy a smart contract, *it lives forever on the blockchain*. There's no "undo". That forces you to write code differently — carefully, defensively, with intention.

Key things I learned:
- Gas optimization matters more than you think
- Always audit for reentrancy attacks
- Test on testnets religiously before mainnet

The web3 space moves fast. But the fundamentals — immutability, decentralization, trustlessness — those are permanent.`,
    likes: 18,
    comments: [
      { id: 1, author: "Dev K.", text: "Great intro! Have you tried Hardhat yet?", time: "5 days ago", likes: 7 },
    ],
  },
  {
    id: 3,
    title: "What I Learned Training My First Neural Network",
    date: "Feb 10, 2026",
    category: "AI/ML",
    readTime: "5 min read",
    excerpt: "Loss: 2.34. Loss: 2.31. Loss: 2.30. Watching those numbers drop is pure dopamine...",
    content: `Loss: 2.34. Loss: 2.31. Loss: 2.30. Watching those numbers drop is pure dopamine.

My first neural network was a simple image classifier trained on CIFAR-10. 32x32 pixel images of cats, trucks, and airplanes. Nothing groundbreaking. But the process taught me more than any tutorial.

Here's what nobody tells you:
**Data preprocessing eats 80% of your time.** Not model architecture. Not hyperparameter tuning. *Data.*

I also learned that overfitting is the enemy you don't see coming. My model hit 99% training accuracy and 51% validation accuracy. Classic. Two weeks of learning packed into one humbling afternoon.

Now I'm exploring transformers and NLP. The rabbit hole goes deep — and I love it.`,
    likes: 31,
    comments: [],
  },
];

const CATEGORIES = ["All", "Life", "Blockchain", "AI/ML", "Web Dev"];

const REACTIONS = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "💡", label: "Insightful" },
  { emoji: "❤️", label: "Love" },
  { emoji: "🚀", label: "Rocket" },
];

// ── Admin password (change this!) ─────────────────────────────────────────
const ADMIN_PASSWORD = "utkarsh2026";

// ── Blog Card ─────────────────────────────────────────────────────────────
function BlogCard({ blog, index, onClick, onLike, likedBlogs }) {
  return (
    <motion.div
      className="blog-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={() => onClick(blog)}
    >
      <div className="blog-card-header">
        <span className={`blog-category cat-${blog.category.replace("/", "")}`}>{blog.category}</span>
        <span className="blog-read-time">{blog.readTime}</span>
      </div>
      <h3 className="blog-card-title">{blog.title}</h3>
      <p className="blog-card-excerpt">{blog.excerpt}</p>
      <div className="blog-card-footer">
        <span className="blog-date">{blog.date}</span>
        <div className="blog-card-actions" onClick={e => e.stopPropagation()}>
          <button
            className={`like-btn ${likedBlogs.has(blog.id) ? "liked" : ""}`}
            onClick={() => onLike(blog.id)}
          >
            {likedBlogs.has(blog.id) ? "❤️" : "🤍"} {blog.likes}
          </button>
          <span className="comment-count">💬 {blog.comments.length}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Blog Modal (full read) ────────────────────────────────────────────────
function BlogModal({ blog, onClose, onLike, likedBlogs, onAddComment, onReaction, userReactions }) {
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName]   = useState("");
  const [replyTo, setReplyTo]         = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const commentRef = useRef(null);

  const handleSubmit = () => {
    if (!commentText.trim() || !authorName.trim()) return;
    onAddComment(blog.id, {
      id: Date.now(),
      author: authorName,
      text: replyTo ? `@${replyTo} ${commentText}` : commentText,
      time: "Just now",
      likes: 0,
    });
    setCommentText("");
    setReplyTo(null);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + "#blog-" + blog.id);
    alert("Link copied to clipboard! 📋");
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <span className={`blog-category cat-${blog.category.replace("/", "")}`}>{blog.category}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Title & Meta */}
        <h2 className="modal-title">{blog.title}</h2>
        <div className="modal-meta">
          <span>📅 {blog.date}</span>
          <span>⏱ {blog.readTime}</span>
          <span>✍️ Utkarsh Bharti</span>
        </div>

        {/* Body */}
        <div className="modal-body">
          {blog.content.split("\n").map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          )}
        </div>

        {/* Actions bar */}
        <div className="modal-actions">
          <button
            className={`like-btn-big ${likedBlogs.has(blog.id) ? "liked" : ""}`}
            onClick={() => onLike(blog.id)}
          >
            {likedBlogs.has(blog.id) ? "❤️" : "🤍"} {blog.likes} Likes
          </button>

          {/* Reaction picker */}
          <div className="reaction-wrapper">
            <button className="reaction-trigger" onClick={() => setShowReactions(!showReactions)}>
              {userReactions[blog.id] || "😊"} React
            </button>
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  className="reaction-picker"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {REACTIONS.map(r => (
                    <button key={r.label} className="reaction-option" title={r.label}
                      onClick={() => { onReaction(blog.id, r.emoji); setShowReactions(false); }}>
                      {r.emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="share-btn" onClick={handleShare}>
            🔗 Share
          </button>
        </div>

        {/* Comments */}
        <div className="comments-section" ref={commentRef}>
          <h4 className="comments-title">💬 {blog.comments.length} Comments</h4>

          {blog.comments.length === 0 && (
            <p className="no-comments">Be the first to share your thoughts!</p>
          )}

          {blog.comments.map(c => (
            <div key={c.id} className="comment">
              <div className="comment-avatar">{c.author[0]}</div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-author">{c.author}</span>
                  <span className="comment-time">{c.time}</span>
                </div>
                <p className="comment-text">{c.text}</p>
                <button className="reply-btn" onClick={() => setReplyTo(c.author)}>
                  ↩ Reply
                </button>
              </div>
            </div>
          ))}

          {/* Add comment */}
          <div className="add-comment">
            <h5>Leave a Comment</h5>
            {replyTo && (
              <div className="reply-indicator">
                Replying to <strong>@{replyTo}</strong>
                <button onClick={() => setReplyTo(null)}>✕</button>
              </div>
            )}
            <input
              className="comment-input"
              placeholder="Your name"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
            />
            <textarea
              className="comment-textarea"
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={3}
            />
            <button className="comment-submit" onClick={handleSubmit}>
              Post Comment →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Admin Panel (post new blog) ───────────────────────────────────────────
function AdminPanel({ onPost, onClose }) {
  const [form, setForm] = useState({ title: "", category: "Web Dev", readTime: "3 min read", excerpt: "", content: "" });

  const handlePost = () => {
    if (!form.title || !form.content) return;
    onPost({
      id: Date.now(),
      ...form,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      likes: 0,
      comments: [],
    });
    onClose();
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal-content admin-panel" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ color: "#00f0ff", fontFamily: "Orbitron, sans-serif" }}>✍️ New Blog Post</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <input className="comment-input" placeholder="Blog Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="comment-input" placeholder="Excerpt (one line preview)" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
        <div style={{ display: "flex", gap: "10px" }}>
          <select className="comment-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ flex: 1 }}>
            {["Life", "Blockchain", "AI/ML", "Web Dev"].map(c => <option key={c}>{c}</option>)}
          </select>
          <input className="comment-input" placeholder="Read time" value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} style={{ flex: 1 }} />
        </div>
        <textarea className="comment-textarea" placeholder="Write your blog content here... (use blank lines for paragraphs)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} />
        <button className="comment-submit" onClick={handlePost}>🚀 Publish Blog</button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Blogs Page ───────────────────────────────────────────────────────
export default function Blogs() {
  const [blogs, setBlogs]           = useState(INITIAL_BLOGS);
  const [activeCategory, setActive] = useState("All");
  const [selectedBlog, setSelected] = useState(null);
  const [likedBlogs, setLiked]      = useState(new Set());
  const [userReactions, setReactions] = useState({});
  const [showAdmin, setShowAdmin]   = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const filtered = activeCategory === "All" ? blogs : blogs.filter(b => b.category === activeCategory);

  // Slide navigation
  const scrollToSlide = (idx) => {
    setCurrentSlide(idx);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: idx * sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const handleLike = (id) => {
    setLiked(prev => {
      const next = new Set(prev);
      const isLiked = next.has(id);
      isLiked ? next.delete(id) : next.add(id);
      setBlogs(b => b.map(blog => blog.id === id ? { ...blog, likes: blog.likes + (isLiked ? -1 : 1) } : blog));
      return next;
    });
  };

  const handleAddComment = (blogId, comment) => {
    setBlogs(prev => prev.map(b => b.id === blogId ? { ...b, comments: [...b.comments, comment] } : b));
    setSelected(prev => prev?.id === blogId ? { ...prev, comments: [...prev.comments, comment] } : prev);
  };

  const handleReaction = (blogId, emoji) => {
    setReactions(prev => ({ ...prev, [blogId]: emoji }));
  };

  const handleAdminUnlock = () => {
    if (adminInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setShowAdminPrompt(false);
      setShowAdmin(true);
    } else {
      alert("Wrong password!");
    }
  };

  const handlePost = (blog) => {
    setBlogs(prev => [blog, ...prev]);
  };

  return (
    <div className="blogs-page">
      {/* Background */}
      <div className="blogs-bg" />

      {/* Header */}
      <div className="blogs-header">
        <motion.h1 className="blogs-title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="blogs-title-accent">{"// "}</span>
          BLOGS
        </motion.h1>
        <motion.p className="blogs-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Thoughts on code, life, and building the future.
        </motion.p>

        {/* Admin button */}
        <button className="admin-btn" onClick={() => adminUnlocked ? setShowAdmin(true) : setShowAdminPrompt(true)}>
          {adminUnlocked ? "✍️ Write Post" : "🔐 Admin"}
        </button>
      </div>

      {/* Admin password prompt */}
      <AnimatePresence>
        {showAdminPrompt && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdminPrompt(false)}>
            <motion.div className="admin-prompt" initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}>
              <h4>🔐 Admin Access</h4>
              <input type="password" className="comment-input" placeholder="Enter admin password" value={adminInput} onChange={e => setAdminInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdminUnlock()} />
              <button className="comment-submit" onClick={handleAdminUnlock}>Unlock</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filter */}
      <div className="category-bar">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`cat-filter ${activeCategory === cat ? "active" : ""}`} onClick={() => { setActive(cat); setCurrentSlide(0); }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="slider-wrapper">
        <div className="blog-slider" ref={sliderRef}>
          {filtered.map((blog, i) => (
            <div className="slide" key={blog.id}>
              <BlogCard blog={blog} index={i} onClick={setSelected} onLike={handleLike} likedBlogs={likedBlogs} />
            </div>
          ))}
        </div>

        {/* Slider dots */}
        {filtered.length > 1 && (
          <div className="slider-dots">
            {filtered.map((_, i) => (
              <button key={i} className={`dot ${i === currentSlide ? "dot-active" : ""}`} onClick={() => scrollToSlide(i)} />
            ))}
          </div>
        )}

        {/* Slider arrows */}
        {currentSlide > 0 && (
          <button className="slider-arrow arrow-left" onClick={() => scrollToSlide(currentSlide - 1)}>‹</button>
        )}
        {currentSlide < filtered.length - 1 && (
          <button className="slider-arrow arrow-right" onClick={() => scrollToSlide(currentSlide + 1)}>›</button>
        )}
      </div>

      {/* Grid (below slider) */}
      <div className="blogs-grid">
        {filtered.map((blog, i) => (
          <BlogCard key={blog.id} blog={blog} index={i} onClick={setSelected} onLike={handleLike} likedBlogs={likedBlogs} />
        ))}
      </div>

      {/* Blog modal */}
      <AnimatePresence>
        {selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onClose={() => setSelected(null)}
            onLike={handleLike}
            likedBlogs={likedBlogs}
            onAddComment={handleAddComment}
            onReaction={handleReaction}
            userReactions={userReactions}
          />
        )}
      </AnimatePresence>

      {/* Admin post panel */}
      <AnimatePresence>
        {showAdmin && <AdminPanel onPost={handlePost} onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>
    </div>
  );
}