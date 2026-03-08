import React, { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";
import { motion, AnimatePresence } from "framer-motion";
import "./Contact.css";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — fill these in
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_m572hoe";
const EMAILJS_TEMPLATE_ID = "template_q8bomk6";
const EMAILJS_PUBLIC_KEY  = "Y1swNxPvAlR1fs_D3";
const INBOX_PASSWORD      = "utkarsh2026"; // change this!

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function saveMessage(msg) {
  const existing = JSON.parse(localStorage.getItem("contact_inbox") || "[]");
  localStorage.setItem("contact_inbox", JSON.stringify([msg, ...existing]));
}

function loadMessages() {
  return JSON.parse(localStorage.getItem("contact_inbox") || "[]");
}

function deleteMessage(id) {
  const msgs = loadMessages().filter(m => m.id !== id);
  localStorage.setItem("contact_inbox", JSON.stringify(msgs));
}

function markRead(id) {
  const msgs = loadMessages().map(m => m.id === id ? { ...m, read: true } : m);
  localStorage.setItem("contact_inbox", JSON.stringify(msgs));
}

// ─────────────────────────────────────────────────────────────────────────────
// Particle background
// ─────────────────────────────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,240,255,0.35)";
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,240,255,${0.08 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="contact-particles" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inbox Modal
// ─────────────────────────────────────────────────────────────────────────────
function InboxModal({ onClose }) {
  const [messages, setMessages]   = useState(loadMessages());
  const [selected, setSelected]   = useState(null);
  const [password, setPassword]   = useState("");
  const [unlocked, setUnlocked]   = useState(false);
  const [pwError,  setPwError]    = useState(false);
  const [filter,   setFilter]     = useState("all");

  const handleUnlock = () => {
    if (password === INBOX_PASSWORD) { setUnlocked(true); setPwError(false); }
    else { setPwError(true); }
  };

  const handleDelete = (id) => {
    deleteMessage(id);
    setMessages(loadMessages());
    if (selected?.id === id) setSelected(null);
  };

  const handleSelect = (msg) => {
    markRead(msg.id);
    setMessages(loadMessages());
    setSelected(msg);
  };

  const filtered = messages.filter(m =>
    filter === "all"    ? true :
    filter === "unread" ? !m.read :
    filter === "read"   ? m.read : true
  );

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <motion.div className="inbox-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="inbox-modal" initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }} onClick={e => e.stopPropagation()}>

        {!unlocked ? (
          /* Password gate */
          <div className="inbox-lock">
            <div className="inbox-lock-icon">🔐</div>
            <h3>Admin Inbox</h3>
            <p>Enter your password to access messages</p>
            <input
              type="password"
              className="inbox-pw-input"
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && handleUnlock()}
              autoFocus
            />
            {pwError && <p className="pw-error">⚠️ Incorrect password</p>}
            <button className="inbox-unlock-btn" onClick={handleUnlock}>Unlock Inbox →</button>
            <button className="inbox-cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        ) : (
          /* Inbox UI */
          <div className="inbox-layout">
            {/* Sidebar */}
            <div className="inbox-sidebar">
              <div className="inbox-sidebar-header">
                <h3>📬 Inbox</h3>
                {unreadCount > 0 && <span className="inbox-unread-badge">{unreadCount}</span>}
                <button className="inbox-close-btn" onClick={onClose}>✕</button>
              </div>

              {/* Filter tabs */}
              <div className="inbox-filter-tabs">
                {["all", "unread", "read"].map(f => (
                  <button key={f} className={`inbox-filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Message list */}
              <div className="inbox-list">
                {filtered.length === 0 ? (
                  <div className="inbox-empty">
                    <span>📭</span>
                    <p>No messages yet</p>
                  </div>
                ) : filtered.map(msg => (
                  <div
                    key={msg.id}
                    className={`inbox-list-item ${selected?.id === msg.id ? "selected" : ""} ${!msg.read ? "unread" : ""}`}
                    onClick={() => handleSelect(msg)}
                  >
                    <div className="inbox-item-top">
                      <span className="inbox-item-name">{msg.name}</span>
                      <span className="inbox-item-time">{msg.timestamp}</span>
                    </div>
                    <div className="inbox-item-email">{msg.email}</div>
                    <div className="inbox-item-preview">{msg.message.slice(0, 60)}...</div>
                    {!msg.read && <div className="inbox-unread-dot" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Message detail */}
            <div className="inbox-detail">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="inbox-detail-header">
                    <div className="inbox-detail-avatar">{selected.name[0].toUpperCase()}</div>
                    <div className="inbox-detail-meta">
                      <h4 className="inbox-detail-name">{selected.name}</h4>
                      <a href={`mailto:${selected.email}`} className="inbox-detail-email">
                        📧 {selected.email}
                      </a>
                      <span className="inbox-detail-time">🕐 {selected.timestamp}</span>
                      {selected.phone && <span className="inbox-detail-phone">📞 {selected.phone}</span>}
                      {selected.subject && <span className="inbox-detail-subject">📋 {selected.subject}</span>}
                    </div>
                    <div className="inbox-detail-actions">
                      <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your message"}`} className="inbox-reply-btn">
                        ↩ Reply
                      </a>
                      <button className="inbox-delete-btn" onClick={() => handleDelete(selected.id)}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                  <div className="inbox-detail-body">
                    <p>{selected.message}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="inbox-detail-empty">
                  <span>💌</span>
                  <p>Select a message to read</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Contact Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status,  setStatus]  = useState("idle"); // idle | sending | success | error
  const [showInbox, setShowInbox] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [focused,   setFocused]   = useState("");
  const formRef = useRef(null);

  const unreadCount = loadMessages().filter(m => !m.read).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Save to local inbox first (always works)
    const msg = {
      id:        Date.now(),
      ...form,
      timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      read:      false,
    };
    saveMessage(msg);

    // Send via EmailJS
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY);
      setStatus("success");
    } catch {
      // Still saved locally even if EmailJS fails
      setStatus("success");
    }

    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setCharCount(0);
    setTimeout(() => setStatus("idle"), 5000);
  };

  const SUBJECTS = ["Freelance Project", "Full-time Opportunity", "Collaboration", "Feedback", "Just saying hi 👋"];

  return (
    <section className="contact-section">
      <Particles />

      {/* Section header */}
      <motion.div className="contact-header" initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="contact-eyebrow">// get in touch</p>
        <h2 className="contact-title">Let's Build Something<br /><span className="contact-title-accent">Extraordinary</span></h2>
        <p className="contact-subtitle">Have a project in mind? An opportunity? Or just want to chat about tech?<br />I read every message personally.</p>

        {/* Inbox button */}
        <button className="inbox-access-btn" onClick={() => setShowInbox(true)}>
          📬 My Inbox
          {unreadCount > 0 && <span className="inbox-badge-pill">{unreadCount} new</span>}
        </button>
      </motion.div>

      <div className="contact-layout">
        {/* Left — info cards */}
        <motion.div className="contact-info" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <h3 className="contact-info-title">Contact Info</h3>

          {[
            { icon: "📧", label: "Email", value: "bhartiutkarsh180@gmail.com", href: "mailto:bhartiutkarsh180@gmail.com" },
            { icon: "📞", label: "Phone", value: "+91 7979788219", href: "tel:+917979788219" },
            { icon: "📍", label: "Location", value: "Bengaluru, India", href: null },
            { icon: "🌐", label: "Website", value: "utkarsh037.github.io", href: "https://utkarsh037.github.io/portV-2" },
          ].map((item, i) => (
            <motion.div key={item.label} className="contact-info-card"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ x: 6 }}
            >
              <span className="info-card-icon">{item.icon}</span>
              <div>
                <div className="info-card-label">{item.label}</div>
                {item.href
                  ? <a href={item.href} className="info-card-value">{item.value}</a>
                  : <div className="info-card-value">{item.value}</div>
                }
              </div>
            </motion.div>
          ))}

          {/* Social links */}
          <div className="contact-socials">
            {[
              { label: "GitHub",    icon: "🐙", href: "https://github.com/utkarsh037" },
              { label: "LinkedIn",  icon: "💼", href: "https://linkedin.com/in/utkarshbharti" },
              { label: "Twitter",   icon: "🐦", href: "https://twitter.com/utkarsh_codes" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </a>
            ))}
          </div>

          {/* Availability badge */}
          <div className="availability-badge">
            <span className="avail-dot" />
            <span>Available for freelance & full-time</span>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div className="contact-form-wrapper" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="success" className="contact-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                <div className="success-icon">🚀</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
                <button className="send-another-btn" onClick={() => setStatus("idle")}>Send another →</button>
              </motion.div>
            ) : (
              <motion.form key="form" ref={formRef} className="contact-form" onSubmit={handleSubmit} initial={{ opacity: 1 }}>
                <h3 className="form-title">Send a Message</h3>

                {/* Row 1: name + email */}
                <div className="form-row">
                  <div className={`form-field ${focused === "name" ? "focused" : ""}`}>
                    <label>Full Name <span className="required">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} onFocus={() => setFocused("name")} onBlur={() => setFocused("")} placeholder="Rahul Sharma" required />
                  </div>
                  <div className={`form-field ${focused === "email" ? "focused" : ""}`}>
                    <label>Email Address <span className="required">*</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} onFocus={() => setFocused("email")} onBlur={() => setFocused("")} placeholder="rahul@example.com" required />
                  </div>
                </div>

                {/* Row 2: phone + subject */}
                <div className="form-row">
                  <div className={`form-field ${focused === "phone" ? "focused" : ""}`}>
                    <label>Phone <span className="optional">(optional)</span></label>
                    <input name="phone" value={form.phone} onChange={handleChange} onFocus={() => setFocused("phone")} onBlur={() => setFocused("")} placeholder="+91 98765 43210" />
                  </div>
                  <div className={`form-field ${focused === "subject" ? "focused" : ""}`}>
                    <label>Subject <span className="required">*</span></label>
                    <select name="subject" value={form.subject} onChange={handleChange} onFocus={() => setFocused("subject")} onBlur={() => setFocused("")} required>
                      <option value="">Select a topic...</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className={`form-field ${focused === "message" ? "focused" : ""}`}>
                  <label>
                    Message <span className="required">*</span>
                    <span className="char-count">{charCount}/500</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused("")}
                    placeholder="Tell me about your project, idea, or just say hello..."
                    maxLength={500}
                    rows={5}
                    required
                  />
                </div>

                {/* Submit */}
                <button type="submit" className={`contact-submit-btn ${status === "sending" ? "sending" : ""}`} disabled={status === "sending"}>
                  {status === "sending" ? (
                    <><span className="btn-spinner" /> Sending...</>
                  ) : (
                    <>Send Message <span className="btn-arrow">→</span></>
                  )}
                </button>

                <p className="form-note">💾 Messages are saved privately in your browser inbox</p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Inbox modal */}
      <AnimatePresence>
        {showInbox && <InboxModal onClose={() => setShowInbox(false)} />}
      </AnimatePresence>
    </section>
  );
}