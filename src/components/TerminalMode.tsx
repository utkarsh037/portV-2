import React, { useState, useEffect, useRef, useCallback } from "react";
import "./TerminalMode.css";

// ── Data ──────────────────────────────────────────────────────────────────
const BOOT_SEQUENCE = [
  "█▓▒░ UtkarshOS v3.0 ░▒▓█",
  "Initializing kernel modules...",
  "[OK] Loading filesystem",
  "[OK] Mounting neural networks",
  "[OK] Connecting to blockchain nodes",
  "[OK] AI subsystems online",
  "[OK] All systems nominal",
  "─────────────────────────────────────",
  "Welcome, operator. Type 'help' to begin.",
  "─────────────────────────────────────",
];

const HELP_TEXT = `
╔══════════════════════════════════════════════════╗
║           UtkarshOS Command Reference            ║
╠══════════════════════════════════════════════════╣
║  ABOUT                                           ║
║   whoami      → About Utkarsh                    ║
║   skills      → Tech stack                       ║
║   education   → Academic background              ║
║   experience  → Work history                     ║
║                                                  ║
║  PORTFOLIO                                       ║
║   projects    → View all projects                ║
║   project <n> → Project details (1-4)            ║
║   blog        → Latest blog posts                ║
║   resume      → Download resume                  ║
║                                                  ║
║  CONTACT                                         ║
║   contact     → Contact info                     ║
║   social      → Social media links               ║
║   email <msg> → Send quick message               ║
║                                                  ║
║  FUN & TOOLS                                     ║
║   funfact     → Random space fact                ║
║   quote       → Dev wisdom                       ║
║   joke        → Programmer joke                  ║
║   ascii       → ASCII art gallery                ║
║   matrix      → Enter the Matrix                 ║
║   hack        → Hacker simulation                ║
║   weather     → Bengaluru weather                ║
║   calc <expr> → Calculator  (e.g. calc 2+2)      ║
║   countdown   → Days to goals                    ║
║   time        → World clocks                     ║
║   date        → Current date/time                ║
║                                                  ║
║  SYSTEM                                          ║
║   theme <opt> → dark/light/matrix/retro/cyber    ║
║   neofetch    → System info                      ║
║   history     → Command history                  ║
║   clear       → Clear terminal                   ║
║   reboot      → Restart terminal                 ║
╚══════════════════════════════════════════════════╝
  Tip: Use ↑↓ arrows for history, Tab to autocomplete
`;

const PROJECTS = [
  {
    name: "Food Delivery Optimization",
    tech: "React, Node.js, ML",
    desc: "AI-powered route optimization reducing delivery time by 40%",
    status: "✅ Live",
    link: "github.com/utkarsh037",
  },
  {
    name: "Blockchain Voting System",
    tech: "Solidity, Web3.js, React",
    desc: "Tamper-proof decentralized voting on Ethereum",
    status: "✅ Live",
    link: "github.com/utkarsh037",
  },
  {
    name: "AI Research Chatbot",
    tech: "Python, TensorFlow, FastAPI",
    desc: "NLP chatbot trained on academic papers",
    status: "🚧 In Progress",
    link: "github.com/utkarsh037",
  },
  {
    name: "Earthquake Detection System",
    tech: "Python, IoT, ML",
    desc: "Real-time seismic data analysis with 92% accuracy",
    status: "✅ Live",
    link: "github.com/utkarsh037",
  },
];

const SKILLS_TREE = `
UtkarshOS Skills Tree
├── Frontend
│   ├── React ████████░░ 80%
│   ├── TypeScript ███████░░░ 70%
│   └── Three.js ██████░░░░ 60%
├── Backend
│   ├── Node.js ████████░░ 80%
│   ├── Express ████████░░ 80%
│   └── Python ███████░░░ 70%
├── Blockchain
│   ├── Solidity ███████░░░ 70%
│   ├── Web3.js ██████░░░░ 65%
│   └── Motoko ██████░░░░ 60%
├── AI/ML
│   ├── TensorFlow ██████░░░░ 60%
│   └── NLP █████░░░░░ 50%
└── Tools
    ├── Git ████████░░ 85%
    ├── Docker ██████░░░░ 65%
    └── AWS ████░░░░░░ 45%
`;

const NEOFETCH = `
    ██╗   ██╗████████╗██╗  ██╗
    ██║   ██║╚══██╔══╝██║ ██╔╝     OS: UtkarshOS v3.0
    ██║   ██║   ██║   █████╔╝      Host: Portfolio Machine
    ██║   ██║   ██║   ██╔═██╗      Kernel: React 18.3
    ╚██████╔╝   ██║   ██║  ██╗     Shell: tsx v1.0
     ╚═════╝    ╚═╝   ╚═╝  ╚═╝     Resolution: ∞ × ∞
                                   Theme: Cyberpunk
  ───────────────────────────────  CPU: Brain @ 3.0GHz
  OS      UtkarshOS 3.0            Memory: Coffee-powered
  Uptime  Since 2022               Disk: 1TB of ambition
  Pkgs    npm (420 packages)       Battery: Plugged in ⚡
  Shell   tsx                      
  Editor  VSCode                   ████████████████████
  ───────────────────────────────  UTKARSH BHARTI
`;

const JOKES = [
  "Why do programmers prefer dark mode?\n  → Because light attracts bugs! 🐛",
  "A SQL query walks into a bar, walks up to two tables and asks...\n  → 'Can I JOIN you?' 🍺",
  "Why do Java developers wear glasses?\n  → Because they don't C#! 👓",
  "How many programmers does it take to change a light bulb?\n  → None. That's a hardware problem! 💡",
  "Why did the developer go broke?\n  → Because he used up all his cache! 💸",
  "What's a programmer's favorite hangout place?\n  → Foo Bar! 🍻",
  "I would tell you a UDP joke...\n  → but you might not get it. 📦",
];

const FUN_FACTS = [
  "🌌 Space smells like burnt steak and gunpowder!",
  "🚀 A day on Venus is longer than its year.",
  "🛰️ The ISS travels at 28,000 km/h — circling Earth 16x/day!",
  "🌠 Neutron stars can spin 600 times per second.",
  "💎 55 Cancri e is a planet literally made of diamond.",
  "🧠 Your brain generates ~23 watts of power — enough to power an LED!",
  "🌊 We've explored only 5% of Earth's oceans.",
  "⚡ Lightning strikes Earth 100 times per second.",
  "🔬 There are more atoms in a grain of sand than stars in the observable universe.",
  "🦠 Your body has more bacterial cells than human cells.",
];

const QUOTES = [
  '"Code is like humor. When you have to explain it, it\'s bad." – Cory House',
  '"Talk is cheap. Show me the code." – Linus Torvalds',
  '"Programs must be written for people to read, and only incidentally for machines." – Abelson',
  '"First, solve the problem. Then, write the code." – John Johnson',
  '"The best code is no code at all." – Jeff Atwood',
  '"Make it work, make it right, make it fast." – Kent Beck',
  '"Simplicity is the soul of efficiency." – Austin Freeman',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." – Martin Fowler',
];

const ASCII_ARTS = [
  `
  ╔═══════════════════╗
  ║  UTKARSH BHARTI   ║
  ║  Full Stack Dev   ║
  ║  ◈ Blockchain     ║
  ║  ◈ AI/ML         ║
  ╚═══════════════════╝`,
  `
    (\\(\\
   ( -.-)   < Hello World!
   o_(")(")`,
  `
   /\\_____/\\
  (  o   o  )
  (  =   =  )   < meow.js
   (m\_m\_m)`,
  `
  ┌─────────────────┐
  │ > DEPLOY TO PROD│
  │   ARE YOU SURE? │
  │  [Y]es  [N]o   │
  │                 │
  │  (sweating)     │
  └─────────────────┘`,
  `
     __
    /  \\
   | () |   Git push origin main
    \\__/    And pray to the demo gods
     ||
    _||_`,
];

const THEMES = {
  dark:   { bg: "#000000", text: "#00ff00", prompt: "#00ff00", secondary: "#008800" },
  light:  { bg: "#f0f0f0", text: "#003300", prompt: "#006600", secondary: "#009900" },
  matrix: { bg: "#000000", text: "#00ff41", prompt: "#00ff41", secondary: "#003b00" },
  retro:  { bg: "#1a0a00", text: "#ff8c00", prompt: "#ffb700", secondary: "#8b4513" },
  cyber:  { bg: "#050518", text: "#00f0ff", prompt: "#ff00ff", secondary: "#7c3aed" },
};

const WORLD_CLOCKS = [
  { city: "Bengaluru", tz: "Asia/Kolkata" },
  { city: "New York",  tz: "America/New_York" },
  { city: "London",    tz: "Europe/London" },
  { city: "Tokyo",     tz: "Asia/Tokyo" },
  { city: "Sydney",    tz: "Australia/Sydney" },
];

const ALL_COMMANDS = [
  "help","whoami","skills","education","experience","projects","project",
  "blog","resume","contact","social","email","funfact","quote","joke",
  "ascii","matrix","hack","weather","calc","countdown","time","date",
  "neofetch","theme","history","clear","reboot",
];

// ── Helpers ───────────────────────────────────────────────────────────────
function evalCalc(expr: string): string {
  try {
    // safe simple math only
    const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, "");
    // eslint-disable-next-line no-eval
    const result = Function(`"use strict"; return (${sanitized})`)();
    return `= ${result}`;
  } catch {
    return "❌ Invalid expression";
  }
}

function applyTheme(name: string) {
  const t = THEMES[name as keyof typeof THEMES];
  if (!t) return false;
  document.documentElement.style.setProperty("--term-bg",        t.bg);
  document.documentElement.style.setProperty("--term-text",      t.text);
  document.documentElement.style.setProperty("--term-prompt",    t.prompt);
  document.documentElement.style.setProperty("--term-secondary", t.secondary);
  return true;
}

// ── Component ─────────────────────────────────────────────────────────────
const TerminalMode: React.FC = () => {
  const [lines,      setLines]      = useState<{ text: string; type: string }[]>([]);
  const [input,      setInput]      = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIndex,  setHistIndex]  = useState(-1);
  const [booting,    setBooting]    = useState(true);
  const [matrixMode, setMatrixMode] = useState(false);
  const [hackMode,   setHackMode]   = useState(false);
  const [currentTheme, setCurrentTheme] = useState("dark");

  const inputRef   = useRef<HTMLInputElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const matrixRef  = useRef<HTMLCanvasElement>(null);
  const hackInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Boot sequence
  useEffect(() => {
    applyTheme("dark");
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        const text = BOOT_SEQUENCE[i];
        setLines(prev => [...prev, {
          text,
          type: text.startsWith("[OK]") ? "success" : text.startsWith("█") ? "title" : "info",
        }]);
        i++;
      } else {
        clearInterval(interval);
        setBooting(false);
        inputRef.current?.focus();
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  // Matrix canvas
  useEffect(() => {
    if (!matrixMode || !matrixRef.current) return;
    const canvas = matrixRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols  = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF";
    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = "15px monospace";
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [matrixMode]);

  const addLine = (text: string, type = "output") => {
    setLines(prev => [...prev, { text, type }]);
  };

  const addLines = (texts: string[], type = "output") => {
    setLines(prev => [...prev, ...texts.map(text => ({ text, type }))]);
  };

  const processCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    addLine(`$ ${trimmed}`, "input");
    setCmdHistory(prev => [trimmed, ...prev]);
    setHistIndex(-1);

    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd   = parts[0];
    const args  = parts.slice(1).join(" ");

    // Stop matrix/hack if running a real command
    if (cmd !== "matrix" && cmd !== "hack") {
      setMatrixMode(false);
      if (hackInterval.current) { clearInterval(hackInterval.current); setHackMode(false); }
    }

    switch (cmd) {
      case "help":
        addLine(HELP_TEXT, "output");
        break;

      case "whoami":
        addLines([
          "┌─────────────────────────────────────┐",
          "│  👤 UTKARSH BHARTI                  │",
          "│  🎓 Civil Eng → Full Stack Dev      │",
          "│  🌍 Bengaluru, India                │",
          "│  💼 Open to opportunities           │",
          "│  🔗 github.com/utkarsh037           │",
          "│                                     │",
          "│  Passionate about: Blockchain, AI,  │",
          "│  Web3, and building things that     │",
          "│  actually matter. ✨                │",
          "└─────────────────────────────────────┘",
        ], "success");
        break;

      case "skills":
        addLine(SKILLS_TREE, "success");
        break;

      case "education":
        addLines([
          "📚 EDUCATION",
          "─────────────────────────────────────",
          "🎓 B.Tech Civil Engineering",
          "   University Name | 2020 – 2024",
          "   CGPA: [Your CGPA]",
          "",
          "📜 Certifications",
          "   ✅ Full Stack Web Dev – Udemy",
          "   ✅ Blockchain Fundamentals – Coursera",
          "   ✅ Machine Learning – Andrew Ng",
        ]);
        break;

      case "experience":
        addLines([
          "💼 EXPERIENCE",
          "─────────────────────────────────────",
          "🚀 Full Stack Developer (Freelance)",
          "   2023 – Present",
          "   Built 5+ production web applications",
          "",
          "⛓️  Blockchain Developer (Self-taught)",
          "   2022 – Present",
          "   Smart contracts on Ethereum & ICP",
          "",
          "🤖 AI Researcher (Academic)",
          "   2023",
          "   Earthquake detection using ML",
        ]);
        break;

      case "projects":
        addLine("🚀 PROJECTS", "title");
        PROJECTS.forEach((p, i) => {
          addLines([
            `┌─ ${i + 1}. ${p.name} ${p.status}`,
            `│  Tech: ${p.tech}`,
            `│  ${p.desc}`,
            `└─ 🔗 ${p.link}`,
            "",
          ]);
        });
        addLine("Tip: Type 'project 1' for more details on any project.", "info");
        break;

      case "project": {
        const idx = parseInt(args) - 1;
        if (isNaN(idx) || idx < 0 || idx >= PROJECTS.length) {
          addLine(`❌ Invalid project number. Use 1-${PROJECTS.length}`, "error");
        } else {
          const p = PROJECTS[idx];
          addLines([
            `╔══ ${p.name} ══╗`,
            `  Status : ${p.status}`,
            `  Tech   : ${p.tech}`,
            `  Desc   : ${p.desc}`,
            `  Link   : https://${p.link}`,
            `╚${"═".repeat(p.name.length + 6)}╝`,
          ], "success");
        }
        break;
      }

      case "contact":
        addLines([
          "📬 CONTACT",
          "─────────────────────────────────────",
          "📧 Email   : bhartiutkarsh180@gmail.com",
          "📞 Phone   : +91 7979788219",
          "📍 Location: Bengaluru, India",
          "🌐 Website : utkarsh037.github.io/portV-2",
        ], "success");
        break;

      case "social":
        addLines([
          "🔗 SOCIAL LINKS",
          "─────────────────────────────────────",
          "🐙 GitHub   : github.com/utkarsh037",
          "💼 LinkedIn : linkedin.com/in/utkarshbharti",
          "🐦 Twitter  : twitter.com/utkarsh_codes",
          "📸 Instagram: instagram.com/utkarsh_dev",
        ], "success");
        break;

      case "email":
        if (!args) {
          addLine("Usage: email <your message>  e.g. email Hey Utkarsh!", "info");
        } else {
          addLine(`📨 Message queued: "${args}"`, "success");
          addLine("✅ Sent to bhartiutkarsh180@gmail.com", "success");
        }
        break;

      case "blog":
        addLines([
          "📝 LATEST BLOGS",
          "─────────────────────────────────────",
          "1. Why I Switched from Civil Eng to Code",
          "   → Mar 1, 2026 | Life | ❤️ 24",
          "",
          "2. Building My First Smart Contract",
          "   → Feb 20, 2026 | Blockchain | ❤️ 18",
          "",
          "3. Training My First Neural Network",
          "   → Feb 10, 2026 | AI/ML | ❤️ 31",
          "",
          "Visit /Blogs to read full posts.",
        ]);
        break;

      case "resume":
        addLine("📄 Initiating resume download...", "info");
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = "/Utkarsh_Resume.pdf";
          link.download = "Utkarsh_Resume.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          addLine("✅ Resume downloaded!", "success");
        }, 800);
        break;

      case "funfact":
        addLine("🌌 " + FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)], "success");
        break;

      case "quote":
        addLine("💬 " + QUOTES[Math.floor(Math.random() * QUOTES.length)], "success");
        break;

      case "joke":
        addLine("😂 " + JOKES[Math.floor(Math.random() * JOKES.length)], "success");
        break;

      case "ascii":
        addLine(ASCII_ARTS[Math.floor(Math.random() * ASCII_ARTS.length)], "art");
        break;

      case "neofetch":
        addLine(NEOFETCH, "title");
        break;

      case "matrix":
        if (matrixMode) {
          setMatrixMode(false);
          addLine("🟩 Exited the Matrix.", "info");
        } else {
          setMatrixMode(true);
          addLine("🟩 Entering the Matrix... (type 'matrix' again to exit)", "success");
        }
        break;

      case "hack": {
        const hackLines = [
          "Initializing hack sequence...",
          "Bypassing firewall... ████████░░ 80%",
          "Cracking encryption... ██████████ 100%",
          "Accessing mainframe...",
          "Downloading secret files... 1.2GB",
          "Erasing tracks...",
          "HACK COMPLETE. Just kidding 😄 Stay ethical!",
        ];
        setHackMode(true);
        let i = 0;
        hackInterval.current = setInterval(() => {
          if (i < hackLines.length) {
            addLine("⚡ " + hackLines[i], "error");
            i++;
          } else {
            if (hackInterval.current) clearInterval(hackInterval.current);
            setHackMode(false);
          }
        }, 400);
        break;
      }

      case "weather":
        addLines([
          "🌤️  BENGALURU WEATHER",
          "─────────────────────────────────────",
          "  Condition : Partly Cloudy",
          "  Temp      : 26°C / 79°F",
          "  Humidity  : 65%",
          "  Wind      : 12 km/h NE",
          "  UV Index  : Moderate",
          "  Sunrise   : 6:21 AM | Sunset: 6:35 PM",
          "",
          "  (Live weather coming with Firebase!)",
        ], "info");
        break;

      case "calc":
        if (!args) {
          addLine("Usage: calc <expression>  e.g. calc 12 * 8 + 4", "info");
        } else {
          addLine(`🧮 ${args} ${evalCalc(args)}`, "success");
        }
        break;

      case "time":
        addLine("🕐 WORLD CLOCKS", "title");
        WORLD_CLOCKS.forEach(({ city, tz }) => {
          const time = new Date().toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
          const pad = " ".repeat(Math.max(0, 12 - city.length));
          addLine(`  ${city}${pad}: ${time}`);
        });
        break;

      case "date":
        addLines([
          `📅 ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
          `⏰ ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`,
          `🌏 Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
        ], "success");
        break;

      case "countdown":
        addLines([
          "⏳ GOAL COUNTDOWN",
          "─────────────────────────────────────",
          `  🎯 Next deploy   : ${Math.floor(Math.random() * 7) + 1} days`,
          `  🏆 Portfolio v4  : 45 days`,
          `  🚀 Product launch: 90 days`,
          `  🌍 Reach 1k stars: Working on it...`,
        ], "info");
        break;

      case "theme": {
        if (!args || !THEMES[args as keyof typeof THEMES]) {
          addLine(`Usage: theme <name>   Options: ${Object.keys(THEMES).join(", ")}`, "info");
        } else {
          applyTheme(args);
          setCurrentTheme(args);
          document.body.classList.add("glitch");
          setTimeout(() => document.body.classList.remove("glitch"), 400);
          addLine(`🎨 Theme switched to: ${args.toUpperCase()}`, "success");
        }
        break;
      }

      case "history":
        if (cmdHistory.length === 0) {
          addLine("No command history yet.", "info");
        } else {
          addLine("📜 COMMAND HISTORY", "title");
          cmdHistory.slice(0, 20).forEach((c, i) => addLine(`  ${i + 1}. ${c}`));
        }
        break;

      case "clear":
        setLines([]);
        return;

      case "reboot":
        setLines([]);
        setBooting(true);
        setTimeout(() => {
          let i = 0;
          const interval = setInterval(() => {
            if (i < BOOT_SEQUENCE.length) {
              setLines(prev => [...prev, { text: BOOT_SEQUENCE[i], type: i === 0 ? "title" : "info" }]);
              i++;
            } else {
              clearInterval(interval);
              setBooting(false);
            }
          }, 180);
        }, 100);
        return;

      default:
        addLine(`❌ Command not found: '${cmd}'. Type 'help' for commands.`, "error");
        // Suggest close match
        const match = ALL_COMMANDS.find(c => c.startsWith(cmd[0]) && Math.abs(c.length - cmd.length) < 3);
        if (match) addLine(`💡 Did you mean: ${match}?`, "info");
    }
  }, [cmdHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIndex + 1, cmdHistory.length - 1);
      setHistIndex(idx);
      setInput(cmdHistory[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = histIndex - 1;
      setHistIndex(idx);
      setInput(idx < 0 ? "" : cmdHistory[idx]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = ALL_COMMANDS.filter(c => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        addLine("  " + matches.join("  "), "info");
      }
    }
  };

  const getLineClass = (type: string) => {
    switch (type) {
      case "input":     return "line-input";
      case "success":   return "line-success";
      case "error":     return "line-error";
      case "info":      return "line-info";
      case "title":     return "line-title";
      case "art":       return "line-art";
      default:          return "line-output";
    }
  };

  return (
    <div className="terminal-wrapper" onClick={() => inputRef.current?.focus()}>
      {/* Title bar */}
      <div className="terminal-titlebar">
        <div className="titlebar-dots">
          <span className="dot-red" />
          <span className="dot-yellow" />
          <span className="dot-green" />
        </div>
        <span className="titlebar-name">UtkarshOS v3.0 — Terminal</span>
        <span className="titlebar-theme">Theme: {currentTheme}</span>
      </div>

      {/* Matrix canvas overlay */}
      {matrixMode && (
        <canvas
          ref={matrixRef}
          className="matrix-canvas"
          style={{ position: "absolute", top: 40, left: 0, width: "100%", height: "calc(100% - 40px)", zIndex: 1, opacity: 0.85, pointerEvents: "none" }}
        />
      )}

      {/* Output area */}
      <div className="terminal-output">
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line ${getLineClass(line.type)}`}>
            <pre>{line.text}</pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!booting && (
        <form className="terminal-input-row" onSubmit={handleSubmit}>
          <span className="terminal-prompt">
            <span className="prompt-user">utkarsh</span>
            <span className="prompt-at">@</span>
            <span className="prompt-host">portfolio</span>
            <span className="prompt-colon">:</span>
            <span className="prompt-tilde">~</span>
            <span className="prompt-dollar">$</span>
          </span>
          <input
            ref={inputRef}
            className="terminal-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
          <span className="cursor-blink">▋</span>
        </form>
      )}

      {booting && <div className="booting-indicator">◉ Booting...</div>}
    </div>
  );
};

export default TerminalMode;