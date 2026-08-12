"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Terminal, Layout, Shield, Cpu, Compass } from "lucide-react";
import Link from "next/link";

interface TeamMember {
  name: string;
  role: string;
  avatarBg: string;
  icon: React.ReactNode;
  githubUrl?: string;
  linkedinUrl?: string;
  imageUrl?: string;
}

const team: TeamMember[] = [
  {
    name: "Prof. Jugal Manek",
    role: "Team Mentor",
    avatarBg: "from-blue-500 to-cyan-500",
    icon: <Terminal className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/JUGALJEETENDRA",
    linkedinUrl: "https://www.linkedin.com/in/jugal-jeetendra-manek/",
    imageUrl: "/team/jugal-jeetendra-manek.jpg"
  },
  {
    name: "Jainam Davda",
    role: "Team Member",
    avatarBg: "from-indigo-500 to-purple-500",
    icon: <Layout className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/jainamdavda1-pixel",
    linkedinUrl: "https://www.linkedin.com/in/jainam-davda-a9589a328/",
    imageUrl: "/team/Jainam-Davda.jpg"
  },
  {
    name: "Chinmay Chavan",
    role: "Team Member",
    avatarBg: "from-emerald-500 to-teal-500",
    icon: <Cpu className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/Chinmay741",
    linkedinUrl: "https://www.linkedin.com/in/chinmay-chavan-55b6a6334/",
    imageUrl: "/team/chinmay-chavan-55b6a6334.jpg"
  },
  {
    name: "Sourish Ashtikar",
    role: "Team Member",
    avatarBg: "from-rose-500 to-orange-500",
    icon: <Shield className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/SourishAshtikar",
    linkedinUrl: "https://www.linkedin.com/in/sourishashtikar/",
    imageUrl: "/team/sourishashtikar.jpg"
  },
  {
    name: "Rohan Patil",
    role: "Team Member",
    avatarBg: "from-amber-500 to-yellow-500",
    icon: <Compass className="w-5 h-5 text-white" />,
    githubUrl: "https://github.com/rohanpatil2905",
    linkedinUrl: "https://www.linkedin.com/in/rohan-patil-84b919372/",
    imageUrl: "/team/rohan-patil-84b919372.jpg"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 }
  }
};

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface TeamImageProps {
  src?: string;
  name: string;
}

function TeamImage({ src, name }: TeamImageProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const getFallbacks = (originalSrc: string) => {
    if (!originalSrc) return [];
    const paths = [originalSrc];
    const resolve = (p: string) => (p.startsWith('http') || p.startsWith('data:')) ? p : `${basePath}${p}`;

    const lowercase = originalSrc.toLowerCase();
    if (!paths.includes(lowercase)) paths.push(lowercase);

    const parts = originalSrc.split('/');
    const fileName = parts.pop() || '';
    const capFileName = fileName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
    const capitalized = [...parts, capFileName].join('/');
    if (!paths.includes(capitalized)) paths.push(capitalized);

    const ext = fileName.split('.').pop() || '';
    const lastDotIdx = fileName.lastIndexOf('.');
    const baseName = lastDotIdx !== -1 ? fileName.substring(0, lastDotIdx) : fileName;

    const alternativeExts = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
    for (const altExt of alternativeExts) {
      if (altExt !== ext) {
        const altFile = `${baseName}.${altExt}`;
        const altPath = [...parts, altFile].join('/');
        if (!paths.includes(altPath)) paths.push(altPath);

        const altCapFile = `${capFileName.substring(0, capFileName.lastIndexOf('.'))}.${altExt}`;
        const altCapPath = [...parts, altCapFile].join('/');
        if (!paths.includes(altCapPath)) paths.push(altCapPath);
      }
    }

    return paths.map(resolve);
  };

  const fallbacks = React.useMemo(() => getFallbacks(src || ''), [src]);
  const [fallbackIdx, setFallbackIdx] = React.useState(0);
  const [failed, setFailed] = React.useState(false);

  const handleImgError = () => {
    if (fallbackIdx < fallbacks.length - 1) {
      setFallbackIdx(prev => prev + 1);
    } else {
      setFailed(true);
    }
  };

  const currentSrc = fallbacks[fallbackIdx];

  if (!src || failed || !currentSrc) {
    return (
      <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400 font-bold font-mono text-xl shrink-0 transition-transform duration-300 group-hover:scale-106 select-none">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="w-24 h-24 rounded-2xl border border-slate-200/80 overflow-hidden shrink-0">
      <img
        src={currentSrc}
        alt={name}
        onError={handleImgError}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-106"
      />
    </div>
  );
}

interface TeamCardProps {
  member: TeamMember;
}

function TeamCard({ member }: TeamCardProps) {
  const isMentor = member.role === "Team Mentor";

  return (
    <div className="w-[340px] h-[150px] flex flex-row items-center p-5 bg-white border-2 border-[var(--primary)] rounded-2xl shadow-[5px_5px_0px_var(--primary)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--primary)] hover:border-red-500 group select-none">
      {/* Left: Profile Image */}
      <TeamImage src={member.imageUrl} name={member.name} />

      {/* Right: Name, Role & Social Links */}
      <div className="flex flex-col justify-between h-24 flex-1 min-w-0 pl-3">
        <div className="space-y-1">
          <h3 className="font-bold text-[#18181b] text-base tracking-tight leading-tight truncate" title={member.name}>
            {member.name}
          </h3>
          <div className="flex">
            {isMentor ? (
              <span className="inline-flex items-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] px-2.5 py-0.5 text-[10px] font-bold border border-[var(--accent)]/30 tracking-wide">
                {member.role}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[10px] font-semibold border border-slate-200/80 tracking-wide">
                {member.role}
              </span>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 mt-auto">
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 group-hover:text-slate-500 hover:!text-[var(--primary)] hover:-translate-y-1 opacity-70 group-hover:opacity-100 transition-all duration-300 p-1"
              title={`${member.name}'s GitHub`}
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 group-hover:text-slate-500 hover:!text-blue-600 hover:-translate-y-1 opacity-70 group-hover:opacity-100 transition-all duration-300 p-1"
              title={`${member.name}'s LinkedIn`}
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-8 relative overflow-hidden font-sans">
      {/* Decorative subtle background blueprint overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{
        backgroundImage: `linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 space-y-8">

        {/* Back Link */}
        <div className="mb-2">
          <Link href="/">
            <motion.span
              whileHover={{ x: -3 }}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </motion.span>
          </Link>
        </div>

        {/* Title Area */}
        <div className="text-center space-y-3 max-w-2xl mx-auto py-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-2"
          >
            <Users className="w-6 h-6 text-indigo-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Meet the Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm md:text-base text-slate-555 font-medium"
          >
            The team behind the UTTAM Platform.
          </motion.p>
        </div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 justify-items-center max-w-6xl mx-auto"
        >
          {team.map((member, index) => (
            <motion.div key={index} variants={cardVariants}>
              <TeamCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
