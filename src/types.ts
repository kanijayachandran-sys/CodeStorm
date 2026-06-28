export type BadgeStyle = 'cyberpunk' | 'obsidian' | 'aurora' | 'terminal';

export interface HackerPass {
  badgeId: string;
  name: string;
  role: string;
  discord: string;
  teamName: string;
  style: BadgeStyle;
  projectTitle?: string;
  joinedAt: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  techStack: string[];
  roadmap: string[];
  aliveEnhancements: string[];
}

export interface LobbyPost {
  id: string;
  author: string;
  discord: string;
  role: string;
  title: string;
  description: string;
  category: string;
  size: number;
  maxMembers: number;
  members: string[];
  createdAt: string;
}
