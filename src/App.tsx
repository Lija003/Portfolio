import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaCode,
} from "react-icons/fa";

import { Routes, Route, Link, useNavigate } from "react-router-dom";

import AboutTab from "./tabs/AboutTab";
import SkillsTab from "./tabs/SkillsTab";
import ProjectsTab from "./tabs/ProjectsTab";
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
 

type Social={
    label:string;
    href:string;
    Icon:React.ComponentType<{size?:number}>
}
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
function PortfolioHome(){
  const navigate = useNavigate();

  //My home section
  const data: PortfolioData = useMemo(
    () => ({
      name: "Lija Moni",
      title: "Web Developer",
      subtitle: "Department of CSE, The University of Barishal",
      email: "lija.cse9.bu@gmail.com",
      phone: "+8801764341505",
      avatarUrl: "/public/p3.png",
      logoUrl: "/loyo5.png",
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

  return(<div className="page">
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
      </div>
  );
  
}
