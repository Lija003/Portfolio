import React, { useEffect, useMemo, useState } from "react";
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
function RainFallBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;

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

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    type RainDrop = {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      thickness: number;
      wind: number;
    };

    type Splash = {
      x: number;
      y: number;
      r: number;
      life: number;
      maxLife: number;
    };

    const rainDrops: RainDrop[] = [];
    const splashes: Splash[] = [];

    const initRain = () => {
      rainDrops.length = 0;

      const count = Math.floor((w * h) / 6500);

      for (let i = 0; i < count; i++) {
        rainDrops.push({
          x: rand(-w * 0.2, w * 1.2),
          y: rand(-h, h),
          length: rand(18, 42),
          speed: rand(8, 16),
          opacity: rand(0.22, 0.58),
          thickness: rand(0.7, 1.5),
          wind: rand(-1.8, -0.6),
        });
      }
    };

    const createSplash = (x: number, y: number) => {
      if (splashes.length > 35) return;

      splashes.push({
        x,
        y,
        r: rand(2, 6),
        life: 0,
        maxLife: rand(14, 26),
      });
    };

    const drawBackground = () => {
      /**
       * Color reference from your image:
       * top    = deep navy night sky
       * middle = ocean blue
       * bottom = darker beach/water tone
       */
      const sky = ctx.createLinearGradient(0, 0, 0, h);

      sky.addColorStop(0, "#04101f");
      sky.addColorStop(0.35, "#06294a");
      sky.addColorStop(0.65, "#07436b");
      sky.addColorStop(1, "#020914");

      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      /**
       * Soft ocean-like horizon glow
       */
      const horizon = ctx.createLinearGradient(0, h * 0.42, 0, h * 0.75);
      horizon.addColorStop(0, "rgba(37, 129, 190, 0.18)");
      horizon.addColorStop(0.5, "rgba(20, 92, 150, 0.14)");
      horizon.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = horizon;
      ctx.fillRect(0, h * 0.38, w, h * 0.4);

      /**
       * Small star/noise particles like the reference image
       */
      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      for (let i = 0; i < 90; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h * 0.42;
        const size = Math.random() > 0.92 ? 1.6 : 0.8;

        ctx.fillRect(x, y, size, size);
      }

      /**
       * Dark vignette
       */
      const vignette = ctx.createRadialGradient(
        w * 0.5,
        h * 0.35,
        80,
        w * 0.5,
        h * 0.35,
        Math.max(w, h)
      );

      vignette.addColorStop(0, "rgba(255,255,255,0.03)");
      vignette.addColorStop(1, "rgba(0,0,0,0.5)");

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    };

    const drawRain = () => {
      ctx.lineCap = "round";

      for (const drop of rainDrops) {
        ctx.beginPath();

        ctx.strokeStyle = `rgba(190, 225, 255, ${drop.opacity})`;
        ctx.lineWidth = drop.thickness;

        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.wind * 5, drop.y + drop.length);

        ctx.stroke();

        drop.x += drop.wind;
        drop.y += drop.speed;

        if (drop.y > h + drop.length) {
          createSplash(drop.x, h - rand(20, 90));

          drop.x = rand(-w * 0.2, w * 1.2);
          drop.y = rand(-160, -20);
          drop.length = rand(18, 42);
          drop.speed = rand(8, 16);
          drop.opacity = rand(0.22, 0.58);
          drop.thickness = rand(0.7, 1.5);
          drop.wind = rand(-1.8, -0.6);
        }

        if (drop.x < -100) {
          drop.x = w + rand(20, 120);
        }
      }
    };

    const drawSplashes = () => {
      for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];

        splash.life += 1;

        const progress = splash.life / splash.maxLife;
        const opacity = 1 - progress;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(180, 225, 255, ${0.32 * opacity})`;
        ctx.lineWidth = 1;

        ctx.arc(
          splash.x,
          splash.y,
          splash.r + progress * 12,
          0,
          Math.PI * 2
        );

        ctx.stroke();

        if (splash.life >= splash.maxLife) {
          splashes.splice(i, 1);
        }
      }
    };

    const drawMist = () => {
      const mist = ctx.createLinearGradient(0, h * 0.62, 0, h);
      mist.addColorStop(0, "rgba(120, 190, 255, 0)");
      mist.addColorStop(0.5, "rgba(120, 190, 255, 0.06)");
      mist.addColorStop(1, "rgba(255, 255, 255, 0.05)");

      ctx.fillStyle = mist;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);
    };

    const draw = () => {
      drawBackground();
      drawMist();
      drawRain();
      drawSplashes();

      raf = requestAnimationFrame(draw);
    };

    resize();
    initRain();
    draw();

    const onResize = () => {
      resize();
      initRain();
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
      <RainFallBackground />
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