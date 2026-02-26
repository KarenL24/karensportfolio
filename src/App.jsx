import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  Cpu, 
  ExternalLink, 
  ChevronRight, 
  Play, 
  ArrowUpRight, 
  X, 
  Code2, 
  Layers, 
  Bookmark, 
  Box, 
  Database, 
  Infinity, 
  Globe, 
  Zap, 
  Binary, 
  Monitor, 
  Palette, 
  Command,
  Heart,
  Music
} from 'lucide-react';

const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID || "",
  CLIENT_SECRET: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "",
  REFRESH_TOKEN: import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN || ""
};

const getRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase init skipped:', err.message);
}

const ProjectCard = ({ project }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const CardContent = ({ sketchy = false }) => (
    <div className={`flex flex-col h-full ${sketchy ? 'text-[#0033cc]' : ''}`}>
      <div className={`relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 mb-6 border border-black/5`}>
        <img 
          src={project.image} 
          alt={project.title} 
          className={`w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHovering ? 'scale-105' : 'scale-100'}`} 
          style={sketchy ? { filter: 'grayscale(100%) brightness(80%) sepia(100%) hue-rotate(190deg) saturate(800%)' } : {}}
        />
        {project.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm ${sketchy ? 'opacity-40' : ''}`}>
              <Play size={14} fill="black" stroke="black" className="ml-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className={`flex flex-col flex-grow transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHovering ? 'translate-x-1' : 'translate-x-0'}`}>
        <div className="flex justify-between items-baseline mb-2">
          <h3 className={`text-xl font-bold italic tracking-tight`}>
            {project.title}
          </h3>
          <span className="text-[10px] opacity-30 font-bold uppercase tracking-widest">{project.date}</span>
        </div>
        
        <p className={`font-serif text-[13px] tracking-[0.02em] leading-relaxed mb-6 line-clamp-3 ${sketchy ? 'opacity-90' : 'opacity-60'}`}>
          {project.desc}
        </p>

        <div className="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
          <div className="flex flex-wrap gap-4">
            {project.tech.map((t, idx) => (
              <span key={idx} className="text-[9px] font-mono-kbd uppercase tracking-[0.1em] opacity-50">
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 relative z-10 pointer-events-auto">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-100 opacity-40 transition-all"
                onClick={(e) => e.stopPropagation()}
                title="GitHub"
              >
                <Github size={16} />
              </a>
            )}
            {project.devpost && (
              <a 
                href={project.devpost} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-100 opacity-40 transition-all"
                onClick={(e) => e.stopPropagation()}
                title="Devpost"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        group p-6 bg-gray-50 rounded-2xl border border-neutral-500/10
        shadow-[2px_4px_16px_0px_rgba(0,0,0,0.02)_inset]
        relative overflow-hidden flex flex-col h-full transform-gpu
        transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02]
      `}
    >
      <div className="h-full w-full relative">
        <CardContent sketchy={false} />
        
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out"
          style={{ 
            opacity: isHovering ? 1 : 0,
            filter: 'url(#hand-drawn-filter)',
            WebkitMaskImage: `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
          }}
        >
          <CardContent sketchy={true} />
        </div>
      </div>
    </div>
  );
};

const VinylRecord = ({ track }) => {
  return (
    <a 
      href={track.songUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 group cursor-pointer"
    >
      <div className="relative shrink-0 w-full aspect-square">
        <div className="absolute inset-0 rounded-full bg-neutral-900 border-4 border-neutral-800 shadow-2xl overflow-hidden flex items-center justify-center animate-[spin_6s_linear_infinite] opacity-60 transition-opacity duration-300 group-hover:opacity-100">
          
          <div className="absolute inset-0 transition-all duration-500 grayscale group-hover:grayscale-0">
            {track.albumImageUrl ? (
              <img src={track.albumImageUrl} alt="album art" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                 <Music size={24} className="text-white/10" />
              </div>
            )}
          </div>

          <div className="absolute inset-0 rounded-full border-[1px] border-white/5 opacity-20 pointer-events-none"></div>
          <div className="absolute inset-4 rounded-full border-[1px] border-white/5 opacity-10 pointer-events-none"></div>
          <div className="absolute inset-8 rounded-full border-[1px] border-white/5 opacity-10 pointer-events-none"></div>
          
          <div className="w-1.5 h-1.5 rounded-full bg-[#fafaf9] border border-black/10 z-20 shadow-inner"></div>

          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
          
          <div className="absolute top-0 left-1/2 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-[-100%] pointer-events-none"></div>
        </div>
        
        <div className="absolute -top-1 -right-1 bg-white p-1.5 rounded-full shadow-md border border-black/5 group-hover:scale-110 transition-transform z-20">
           <Music size={14} className="text-[#0033cc]" />
        </div>
      </div>
      
      <div className="text-left whitespace-nowrap shrink-0 mt-3" style={{ transform: 'rotate(-2.1deg)' }}>
        <div className="font-serif text-[clamp(5px,1vw,12px)] italic opacity-90 group-hover:opacity-100 transition-opacity" style={{ color: "#0033cc" }}>
          {track.isPlaying ? `listening: ${track.title}` : track.title ? `last play: ${track.title}` : 'currently quiet'}
        </div>
        {track.title && (
          <div className="text-[clamp(4px,0.6vw,8px)] font-serif uppercase tracking-tighter opacity-40 flex items-center gap-1">
            <span>by {track.artist}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-black/20"></span>
            <span>{track.isPlaying ? 'online' : track.timestamp ? getRelativeTime(track.timestamp) : ''}</span>
          </div>
        )}
      </div>
    </a>
  );
};

const App = () => {
  const INK_BLUE = "#0033cc"; 
  const RED_CLIP = "#cc3333";
  
  const [skillFilter, setSkillFilter] = useState('All');
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [track, setTrack] = useState({
    isPlaying: false,
    title: "",
    artist: "",
    songUrl: "https://open.spotify.com",
    albumImageUrl: "",
    timestamp: null
  });
  const scrollingRef = useRef(false);

  const getSpotifyData = async () => {
    if (!SPOTIFY_CONFIG.CLIENT_ID || !SPOTIFY_CONFIG.REFRESH_TOKEN) return;
    try {
      const basic = btoa(`${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`);
      const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: SPOTIFY_CONFIG.REFRESH_TOKEN,
        }),
      });
      const { access_token } = await tokenResponse.json();

      const nowPlayingRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (nowPlayingRes.status === 200) {
        const data = await nowPlayingRes.json();
        if (data.item) {
          setTrack({
            isPlaying: data.is_playing,
            title: data.item.name,
            artist: data.item.artists[0].name,
            songUrl: data.item.external_urls.spotify,
            albumImageUrl: data.item.album.images[0].url,
            timestamp: Date.now()
          });
          return;
        }
      }

      const recentlyPlayedRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (recentlyPlayedRes.status === 200) {
        const data = await recentlyPlayedRes.json();
        const item = data.items?.[0];
        if (item?.track) {
          setTrack({
            isPlaying: false,
            title: item.track.name,
            artist: item.track.artists?.[0]?.name ?? "Unknown",
            songUrl: item.track.external_urls?.spotify ?? "https://open.spotify.com",
            albumImageUrl: item.track.album?.images?.[0]?.url ?? "",
            timestamp: item.played_at ? new Date(item.played_at).getTime() : null
          });
        }
      }
    } catch (err) {
      console.warn("Spotify fetch error:", err.message);
    }
  };

  useEffect(() => {
    getSpotifyData();
    const interval = setInterval(getSpotifyData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.warn('Auth failed:', err.message);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const logVisit = async () => {
      try {
        await addDoc(collection(db, 'visits'), {
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          screenResolution: `${window.screen.width}x${window.screen.height}`
        });
      } catch (err) {
        // Silent failure
      }
    };
    logVisit();
  }, [user]);

  useEffect(() => {
    const onScroll = () => {
      if (scrollingRef.current) return;
      const sections = ['contact', 'projects', 'about', 'home'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection('home');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id) => {
    scrollingRef.current = true;
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => { scrollingRef.current = false; }, 1000);
  };

  const projects = [
    {
      id: "PROJ_01",
      title: "Reinforcement Learning Snakegame",
      tech: ["PyTorch", "NumPy", "Matplotlib"],
      date: "",
      desc: "Deep Q-Learning Snake agent using experience replay and Bellman reward optimization.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
      isVideo: false,
      github: "https://github.com/KarenL24/self_learning_snakegame/tree/main"
    },
    {
      id: "PROJ_02",
      title: "Custom OS Kernel",
      tech: ["C", "Assembly", "x86"],
      date: "2023",
      desc: "Monolithic kernel supporting preemptive multitasking, virtual memory, and a basic VFS architecture.",
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800",
      isVideo: false,
      github: "#",
      devpost: "#"
    },
    {
      id: "PROJ_03",
      title: "Graphic Design Engine",
      tech: ["C++", "OpenGL", "GLSL"],
      date: "2023",
      desc: "Real-time rendering engine with PBR materials, shadow mapping, and a custom post-processing pipeline.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
      isVideo: true,
      github: "#",
      devpost: "#"
    }
  ];

  const devicon = (name) => <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`} alt="" className="w-5 h-5" />;
  const deviconPlain = (name) => <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-plain.svg`} alt="" className="w-5 h-5" />;

  const skillInventory = [
    { name: "C++/C", type: "Languages", icon: devicon("cplusplus") },
    { name: "Python", type: "Languages", icon: devicon("python") },
    { name: "Java", type: "Languages", icon: devicon("java") },
    { name: "JavaScript", type: "Languages", icon: devicon("javascript") },
    { name: "SQL", type: "Languages", icon: devicon("mysql") },
    { name: "HTML/CSS", type: "Languages", icon: devicon("html5") },
    { name: "PyTorch", type: "Frameworks/Libraries", icon: devicon("pytorch") },
    { name: "Scikit-learn", type: "Frameworks/Libraries", icon: deviconPlain("scikitlearn") },
    { name: "React.js", type: "Frameworks/Libraries", icon: devicon("react") },
    { name: "Spring Boot", type: "Frameworks/Libraries", icon: devicon("spring") },
    { name: "NumPy", type: "Frameworks/Libraries", icon: devicon("numpy") },
    { name: "TailwindCSS", type: "Frameworks/Libraries", icon: devicon("tailwindcss") },
    { name: "Docker", type: "Tools/Other", icon: devicon("docker") },
    { name: "MongoDB", type: "Tools/Other", icon: devicon("mongodb") },
    { name: "Git", type: "Tools/Other", icon: devicon("git") },
    { name: "Azure", type: "Tools/Other", icon: devicon("azure") },
    { name: "Figma", type: "Tools/Other", icon: devicon("figma") },
    { name: "Linux", type: "Tools/Other", icon: devicon("linux") }
  ];

  const filteredSkills = skillFilter === 'All' 
    ? skillInventory 
    : skillInventory.filter(s => s.type === skillFilter);

  const PaperClip = ({ color = RED_CLIP, rotation = "0deg", className = "" }) => (
    <div className={`absolute z-20 pointer-events-none ${className}`} style={{ rotate: rotation }}>
      <div className="w-3 h-10 border border-black/40 rounded-full opacity-60">
        <div className="absolute inset-1 border border-black/40 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] text-black selection:bg-blue-100 relative overflow-x-clip font-serif">
      <svg className="hidden">
        <filter id="hand-drawn-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </svg>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Shadows+Into+Light&family=JetBrains+Mono:wght@400;700&display=swap');
          
          :root { font-family: 'EB Garamond', serif; }
          .font-handwriting { font-family: 'Shadows Into Light', cursive; }
          .font-mono-kbd { font-family: 'JetBrains Mono', monospace; }
          
          .experiences-list li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 1.25rem;
            font-family: 'EB Garamond', serif;
            font-size: 13px;
            letter-spacing: 0.1em;
            font-weight: 400;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .experiences-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            opacity: 0.3;
          }
          .experience-link {
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 4px;
            transition: opacity 0.2s;
          }
          .experience-link:hover {
            opacity: 0.6;
          }
          .experience-logo {
            width: 24px;
            height: 24px;
            object-fit: contain;
            filter: grayscale(100%);
            opacity: 0.8;
            border-radius: 4px;
            background: #f0f0f0;
            padding: 2px;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

      <div className="fixed top-0 left-0 right-0 z-30 bg-[#fafaf9]/90 backdrop-blur-sm w-full">
      <nav className="max-w-6xl mx-auto flex justify-between items-center p-8 text-[13px] tracking-[0.1em] uppercase font-normal">
        <div className="flex gap-8">
          {[
            { id: 'home', label: 'home' },
            { id: 'about', label: 'about me' },
            { id: 'projects', label: 'projects' },
          ].map(({ id, label }) => (
            <button 
              key={id}
              onClick={() => scrollToSection(id)} 
              className="relative overflow-visible hover:italic transition-all"
            >
              {label}
              {activeSection === id && (
                <img 
                  src="/circle.png" 
                  alt="" 
                  className="absolute pointer-events-none select-none"
                  style={{
                    top: '130%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'calc(100% + 160px)',
                    minWidth: '180px',
                    height: 'calc(100% + 85px)',
                  }}
                  draggable={false}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center">
           <button onClick={() => scrollToSection('contact')} className="relative overflow-visible px-4 py-1 text-[11px] transition-all">
             contact me
             {activeSection === 'contact' && (
               <img 
                 src="/circle.png" 
                 alt="" 
                 className="absolute pointer-events-none select-none"
                 style={{
                   top: '95%',
                   left: '50%',
                   transform: 'translate(-50%, -50%)',
                   width: 'calc(100% + 160px)',
                   minWidth: '180px',
                   height: 'calc(100% + 85px)',
                 }}
                 draggable={false}
               />
             )}
           </button>
        </div>
      </nav>
      </div>

      <main className="max-w-6xl mx-auto relative px-4 pt-20">
        
        {/* Landing Section */}
        <section id="home" className="flex flex-col items-center justify-center relative mb-20 -mt-8 pb-8">
          <div className="relative w-full max-w-5xl mx-auto">
            <img 
              src="/landing.png" 
              alt="Hi I'm Karen - postcard landing" 
              className="w-full object-contain select-none pointer-events-none"
              draggable={false}
            />
            <div className="absolute" style={{ left: '24.5%', top: '92%', transform: 'translate(-50%, -50%) rotate(-3deg)', width: '7%' }}>
              <VinylRecord track={track} />
            </div>
          </div>
        </section>

        {/* About Me Section - Tightened internal and bottom spacing */}
        <section id="about" className="mb-24 relative max-w-6xl mx-auto scroll-mt-20">
          <div className="flex justify-between items-end mb-6 border-b border-black/10 pb-4">
            <h2 className="text-3xl italic font-medium tracking-tight">About Me_</h2>
            <div className="text-[10px] tracking-[0.3em] font-bold opacity-30 uppercase"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            <div className="w-full md:w-[35%] pt-4 text-left">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-8 text-black text-left">Experiences</h2>
              <ul className="experiences-list leading-snug">
                <li>
                  <img src="https://avatars.githubusercontent.com/u/54850923?s=280&v=4" alt="Cohere" className="experience-logo" style={{ filter: 'none', width: 36, height: 36 }} />
                  <span>AI Data Trainer @ <span className="experience-link cursor-pointer">Cohere</span></span>
                </li>
                <li>
                  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/University_of_Waterloo_seal.svg/1200px-University_of_Waterloo_seal.svg.png" alt="Waterloo" className="experience-logo" style={{ filter: 'none', width: 36, height: 36 }} />
                  <span>Computer Science @ <span className="experience-link cursor-pointer font-bold italic">University of Waterloo</span></span>
                </li>
              </ul>
            </div>

            <div className="hidden md:block w-px bg-black/10 self-stretch my-4"></div>

            <div className="flex-1 w-full pt-4">
              <div className="mb-8 text-left">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-8 text-black text-left">Skills</h2>
                <div className="flex flex-wrap justify-start gap-4 md:gap-8 text-[11px] font-bold uppercase tracking-widest opacity-40 mb-6">
                  {['All', 'Languages', 'Frameworks/Libraries', 'Tools/Other'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSkillFilter(cat)}
                      className={`transition-all hover:text-black ${skillFilter === cat ? 'text-[#0033cc] italic underline decoration-blue-200 underline-offset-8 opacity-100' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-200/40 p-5 md:p-8 rounded-[20px] border border-neutral-300 shadow-inner">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
                  {filteredSkills.map((skill, idx) => (
                    <kbd 
                      key={idx}
                      style={{ containerType: 'inline-size' }}
                      className="transform-gpu cursor-pointer rounded-[14px] border border-neutral-500/40 bg-neutral-300 shadow-[-6px_0px_10px_rgba(255,255,255,0.8),2px_6px_8px_rgba(0,0,0,0.08)] outline-none transition-all duration-150 active:shadow-none h-16 md:h-20 relative"
                    >
                      <span className="-translate-y-1 z-10 block h-full w-full transform-gpu rounded-[13px] bg-neutral-100 px-2 sm:px-3 py-2 text-neutral-500 shadow-[inset_0px_1.5px_3px_rgba(255,255,255,0.8)] transition-all duration-150 active:translate-y-0 active:shadow-transparent flex flex-col justify-between">
                        <div className="flex justify-between items-start w-full">
                           <span className="text-[8px] font-mono opacity-40 font-bold">{idx.toString(16).toUpperCase()}</span>
                           <div className="opacity-90 transition-transform hover:scale-110">
                              {skill.icon}
                           </div>
                        </div>
                        <div className="mt-auto overflow-hidden w-full">
                          <span className="block truncate font-normal text-[clamp(9px,3cqw,15px)] uppercase tracking-tighter text-neutral-900">
                            {skill.name}
                          </span>
                        </div>
                      </span>
                    </kbd>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-40 px-4 scroll-mt-20">
          <div className="flex justify-between items-end mb-12 border-b border-black/10 pb-4">
            <h2 className="text-3xl italic font-medium tracking-tight">Technical Works_</h2>
            <div className="text-[10px] tracking-[0.3em] font-bold opacity-30 uppercase"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {projects.map((project, i) => (
              <ProjectCard 
                key={i} 
                project={project} 
              />
            ))}
          </div>
        </section>

        <footer id="contact" className="py-16 border-t border-black/10 opacity-60 scroll-mt-20">
          <div className="flex items-center justify-between max-w-6xl mx-auto px-8">
            <div className="flex flex-col gap-6">
              <Github size={20} className="hover:text-blue-700 cursor-pointer transition-colors" />
              <Linkedin size={20} className="hover:text-blue-700 cursor-pointer transition-colors" />
              <Mail size={20} className="hover:text-blue-700 cursor-pointer transition-colors" />
            </div>
            <img 
              src="/contactme.png" 
              alt="Contact me doodle" 
              className="w-64 sm:w-80 md:w-96 select-none pointer-events-none" 
              draggable={false}
            />
          </div>
        </footer>
      </main>

      <div className="fixed bottom-10 -right-12 rotate-90 opacity-10 pointer-events-none hidden xl:block">
        <span className="text-[11px] uppercase tracking-[1.5em] font-bold italic">Doc_Ref_026 // System.IO</span>
      </div>
    </div>
  );
};

export default App;
