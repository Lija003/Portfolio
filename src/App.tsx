import React, { useEffect, useMemo, useState, useRef } from "react";
import "./App.css";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaCode,
} from "react-icons/fa";

import { Routes, Route, useNavigate } from "react-router-dom";

import AboutTab from "./tabs/AboutTab";
import SkillsTab from "./tabs/SkillsTab";
import ProjectsTab from "./tabs/ProjectTab";
import CodingTab from "./tabs/CodingTab";
import AchievementsTab from "./tabs/AchievementsTab";
import EducationTab from "./tabs/EducationTab";

type TabKey =
  | "about"
  | "skills"
  | "projects"
  | "coding"
  | "achievements"
  | "education";

type Social = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number }>;
};

type PortfolioData = {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  avatarUrl: string;
  logoUrl: string;
  logoLink: string;
  socials: Social[];
  tabs: Record<TabKey, { title: string; content: React.ReactNode }>;
};

function StarrySkyBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    type Star = {
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      alpha: number;
      twinkleSpeed: number;
      phase: number;
    };

    type Dust = {
      x: number;
      y: number;
      r: number;
      alpha: number;
      speed: number;
    };

    const stars: Star[] = [];
    const dust: Dust[] = [];

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      w = window.innerWidth;
      h = window.innerHeight;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initStars = () => {
      stars.length = 0;
      dust.length = 0;

      const starCount = Math.floor((w * h) / 2200);
      const dustCount = Math.floor((w * h) / 9000);

      for (let i = 0; i < starCount; i++) {
        const yBias = Math.pow(Math.random(), 1.6);

        stars.push({
          x: rand(0, w),
          y: yBias * h * 0.85,
          r: Math.random() > 0.94 ? rand(1.3, 2.2) : rand(0.35, 1.15),
          baseAlpha: rand(0.35, 0.95),
          alpha: rand(0.35, 0.95),
          twinkleSpeed: rand(0.012, 0.035),
          phase: rand(0, Math.PI * 2),
        });
      }

      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: rand(0, w),
          y: rand(0, h * 0.75),
          r: rand(0.4, 1.2),
          alpha: rand(0.05, 0.16),
          speed: rand(0.03, 0.12),
        });
      }
    };

    const drawBackground = () => {
      /**
       * Starry-sky color reference:
       * top    = almost black navy
       * middle = deep blue
       * bottom = ocean horizon blue
       */
      const bg = ctx.createLinearGradient(0, 0, 0, h);

      bg.addColorStop(0, "#020817");
      bg.addColorStop(0.32, "#041a36");
      bg.addColorStop(0.68, "#063c68");
      bg.addColorStop(1, "#020817");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      /**
       * Soft horizon glow like the image
       */
      const horizon = ctx.createLinearGradient(0, h * 0.55, 0, h);
      horizon.addColorStop(0, "rgba(32, 132, 205, 0)");
      horizon.addColorStop(0.45, "rgba(43, 145, 215, 0.22)");
      horizon.addColorStop(1, "rgba(0, 6, 18, 0.35)");

      ctx.fillStyle = horizon;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);
    };

    const drawMilkyWay = () => {
      ctx.save();

      ctx.translate(w * 0.46, h * 0.2);
      ctx.rotate(-0.22);

      const cloud = ctx.createRadialGradient(
        0,
        0,
        20,
        0,
        0,
        Math.max(w, h) * 0.42
      );

      cloud.addColorStop(0, "rgba(140, 205, 255, 0.18)");
      cloud.addColorStop(0.25, "rgba(70, 150, 220, 0.11)");
      cloud.addColorStop(0.55, "rgba(35, 90, 160, 0.06)");
      cloud.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.scale(1.9, 0.34);
      ctx.fillStyle = cloud;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(w, h) * 0.42, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawStars = (time: number) => {
      for (const star of stars) {
        star.alpha =
          star.baseAlpha +
          Math.sin(time * star.twinkleSpeed + star.phase) * 0.25;

        const opacity = Math.max(0.15, Math.min(1, star.alpha));

        ctx.beginPath();
        ctx.fillStyle = `rgba(225, 245, 255, ${opacity})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();

        if (star.r > 1.4) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(225, 245, 255, ${opacity * 0.28})`;
          ctx.lineWidth = 0.8;

          ctx.moveTo(star.x - star.r * 3, star.y);
          ctx.lineTo(star.x + star.r * 3, star.y);

          ctx.moveTo(star.x, star.y - star.r * 3);
          ctx.lineTo(star.x, star.y + star.r * 3);

          ctx.stroke();
        }
      }
    };

    const drawDust = () => {
      for (const p of dust) {
        p.x += p.speed;

        if (p.x > w + 10) {
          p.x = -10;
          p.y = rand(0, h * 0.75);
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(160, 215, 255, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawVignette = () => {
      const vignette = ctx.createRadialGradient(
        w * 0.5,
        h * 0.38,
        120,
        w * 0.5,
        h * 0.38,
        Math.max(w, h)
      );

      vignette.addColorStop(0, "rgba(255,255,255,0.02)");
      vignette.addColorStop(1, "rgba(0,0,0,0.56)");

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    };

    const draw = (time: number) => {
      drawBackground();
      drawMilkyWay();
      drawDust();
      drawStars(time);
      drawVignette();

      raf = requestAnimationFrame(draw);
    };

    resize();
    initStars();
    draw(0);

    const onResize = () => {
      resize();
      initStars();
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="bgCanvas" aria-hidden="true" />;
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modalRoot" role="dialog" aria-modal="true">
      <button className="modalBackdrop" onClick={onClose} aria-label="Close" />
      <div className="modalCard">
        <div className="modalHeader">
          <h2>{title}</h2>
          <button className="iconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}

function PortfolioHome() {
  const navigate = useNavigate();

  // My home section
  const data: PortfolioData = useMemo(
    () => ({
      name: "Lija Moni",
      title: "Web Developer",
      subtitle: "Department of CSE, The University of Barishal",
      email: "lija.cse9.bu@gmail.com",
      phone: "+8801764341505",
      avatarUrl: "/p3.png",
      logoUrl: "/logo.png",
      logoLink: "/Surprise-page",
      socials: [
        {
          label: "Facebook",
          href: "https://www.facebook.com/adrita.tasfia.9",
          Icon: FaFacebookF,
        },
        {
          label: "CodeForces",
          href: "https://codeforces.com/profile/Lija.cse",
          Icon: FaCode,
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/lija-moni-886107410/",
          Icon: FaLinkedinIn,
        },
        {
          label: "GitHub",
          href: "https://github.com/Lija003",
          Icon: FaGithub,
        },
      ],
      tabs: {
        about: { title: "About Me", content: <AboutTab /> },
        skills: { title: "Skills", content: <SkillsTab /> },
        projects: { title: "Projects", content: <ProjectsTab /> },
        coding: { title: "Coding", content: <CodingTab /> },
        achievements: { title: "Achievements", content: <AchievementsTab /> },
        education: { title: "Education", content: <EducationTab /> },
      },
    }),
    []
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: "about", label: "About" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "coding", label: "Coding" },
    { key: "achievements", label: "Achievements" },
    { key: "education", label: "Education" },
  ];

  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [contactPopup, setContactPopup] = useState<
    null | "phone" | "email" | "logo"
  >(null);

  return (

    <div className="page">
      <StarrySkyBackground />
      <header className="topBar">
        <button
          className="logoBtn"
          onClick={() => navigate("/Surprise-page")}
          aria-label="Open surprise page"
          title="Open surprise page"
        >
          <img className="Doit" src={data.logoUrl} alt="Logo" />
        </button>

        <nav className="topNav">
          {tabs.map((t) => (
            <button
              key={t.key}
              className="tabBtn"
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <a className="cvBtn" href="/Resume of Md Mahruf Alam.pdf" download>
          Download Resume
        </a>
      </header>

      <main className="layout">
        <section className="hero">
          <div className="avatarRow">
            <div className="avatarWrap">
              <img className="avatar" src={data.avatarUrl} alt="Profile" />
            </div>
          </div>

          <h1 className="name">{data.name}</h1>
          <div className="role">{data.title}</div>

          <div className="meta">
            <div>
              Email:{" "}
              <button
                className="linkLike"
                onClick={() => setContactPopup("email")}
                aria-label="Mail me"
              >
                {data.email}
              </button>{" "}
              | Phone:{" "}
              <button
                className="linkLike"
                onClick={() => setContactPopup("phone")}
                aria-label="Call me"
              >
                {data.phone}
              </button>
            </div>
            <div className="muted">{data.subtitle}</div>
          </div>
        </section>

        <section className="emptySpace" aria-hidden="true" />
      </main>

      <aside className="socialRail">
        {data.socials.map((s) => (
          <a
            key={s.label}
            className="socialBtn"
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            title={s.label}
          >
            <s.Icon size={36} />
          </a>
        ))}
      </aside>

      <Modal
        open={activeTab !== null}
        title={activeTab ? data.tabs[activeTab].title : ""}
        onClose={() => setActiveTab(null)}
      >
        {activeTab ? data.tabs[activeTab].content : null}
      </Modal>

      <Modal
        open={contactPopup === "phone"}
        title="Call me?"
        onClose={() => setContactPopup(null)}
      >
        <p>Do you want to call this number?</p>
        <p className="muted">{data.phone}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <a className="actionBtn" href={`tel:${data.phone}`}>
            Call now
          </a>
          <button className="actionBtn secondary" onClick={() => setContactPopup(null)}>
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        open={contactPopup === "email"}
        title="Mail me?"
        onClose={() => setContactPopup(null)}
      >
        <p>Do you want to send an email?</p>
        <p className="muted">{data.email}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <a className="actionBtn" href={`mailto:${data.email}`}>
            Email now
          </a>
          <button className="actionBtn secondary" onClick={() => setContactPopup(null)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route path="*" element={<PortfolioHome />} />
    </Routes>
  );
}