export const skills = ["Python", "Web Dev", "Data", "UI/UX", "Product", "Cloud"] as const;
export type Skill = (typeof skills)[number];
export const categories = ["Fellowship", "Mentorship", "Paid Returnship"] as const;
export type Category = (typeof categories)[number];
export type Role = "candidate" | "partner";
export const statuses = ["Applied", "Matched / Trial Active", "Completed"] as const;
export type Status = (typeof statuses)[number];
export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  initials: string;
  category: Category;
  location: string;
  terms: string;
  duration: string;
  skills: Skill[];
  description: string;
  color: "teal" | "amber" | "slate";
}
export interface Profile {
  name: string;
  location: string;
  targetRole: string;
  skills: Skill[];
  languages: string;
  portfolio: string;
  github: string;
  bio: string;
}
export interface Note {
  id: string;
  text: string;
  date: string;
}
export interface Application {
  id: string;
  opportunityId: string;
  status: Status;
  message: string;
  date: string;
  notes: Note[];
}
export interface Workspace {
  role: Role;
  profile: Profile;
  opportunities: Opportunity[];
  applications: Application[];
  saved: string[];
}
export const initialOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Data for Impact Fellowship",
    organization: "Nairobi Civic Lab",
    initials: "NC",
    category: "Fellowship",
    location: "Nairobi · Hybrid",
    terms: "KES 25,000 / month",
    duration: "12 weeks",
    skills: ["Python", "Data"],
    description:
      "Turn community data into meaningful insights. Work with a local civic team on public-service dashboards, with a dedicated mentor and a portfolio-ready project.",
    color: "teal",
  },
  {
    id: "opp-2",
    title: "Your next chapter in product",
    organization: "Amina Hassan · Product Lead",
    initials: "AH",
    category: "Mentorship",
    location: "East Africa · Remote",
    terms: "Free · 1:1 sessions",
    duration: "6 weeks",
    skills: ["Product", "UI/UX"],
    description:
      "Build confidence in product discovery, sharpen your case studies, and get introductions to the Nairobi product community. Two practical sessions each month.",
    color: "amber",
  },
  {
    id: "opp-3",
    title: "Frontend Developer Returnship",
    organization: "Savanna Digital",
    initials: "SD",
    category: "Paid Returnship",
    location: "Nairobi · On-site",
    terms: "KES 45,000 / month",
    duration: "8 weeks",
    skills: ["Web Dev", "UI/UX"],
    description:
      "Join a supportive engineering team to ship accessible web experiences. A paid, structured trial with weekly feedback and a full-time role review at the end.",
    color: "slate",
  },
  {
    id: "opp-4",
    title: "Cloud Career Mentorship",
    organization: "David Otieno · Cloud Engineer",
    initials: "DO",
    category: "Mentorship",
    location: "Garissa · Remote",
    terms: "Free · Weekly sessions",
    duration: "8 weeks",
    skills: ["Cloud", "Python"],
    description:
      "Pair with an experienced cloud engineer to deploy a real application, practice technical interviews, and grow your professional network.",
    color: "teal",
  },
  {
    id: "opp-5",
    title: "Community Tech Fellowship",
    organization: "Turkana Innovation Collective",
    initials: "TI",
    category: "Fellowship",
    location: "Turkana · Hybrid",
    terms: "KES 20,000 / month",
    duration: "10 weeks",
    skills: ["Web Dev", "Product"],
    description:
      "Build digital tools alongside community organizations in Turkana. Gain local references, mentorship, and hands-on experience solving practical challenges.",
    color: "amber",
  },
  {
    id: "opp-6",
    title: "Junior Data Analyst Returnship",
    organization: "Pamoja Analytics",
    initials: "PA",
    category: "Paid Returnship",
    location: "Garissa · Hybrid",
    terms: "KES 35,000 / month",
    duration: "10 weeks",
    skills: ["Data", "Python"],
    description:
      "Bring your analytical skills to a paid trial with a local research team. Clean datasets, share insights, and receive a verified professional reference.",
    color: "slate",
  },
];
export function createInitialWorkspace(): Workspace {
  return {
    role: "candidate",
    profile: {
      name: "Samira Abdi",
      location: "Nairobi, Kenya",
      targetRole: "Data Analyst",
      skills: ["Python", "Data", "Web Dev"],
      languages: "English, Swahili, Somali",
      portfolio: "https://samira.dev",
      github: "https://github.com/samira-abdi",
      bio: "I turn complex data into useful stories. Based in Nairobi, I have built community health dashboards and a Python tool for tracking water access. I am looking for a team where I can contribute, learn, and build meaningful local experience.",
    },
    opportunities: initialOpportunities.map((o) => ({ ...o, skills: [...o.skills] })),
    applications: [],
    saved: [],
  };
}
export function filterOpportunities(
  items: Opportunity[],
  query: string,
  category: Category | "All",
  skill: Skill | "All",
): Opportunity[] {
  const q = query.trim().toLowerCase();
  return items.filter(
    (o) =>
      (category === "All" || o.category === category) &&
      (skill === "All" || o.skills.includes(skill)) &&
      `${o.title} ${o.organization} ${o.location} ${o.skills.join(" ")}`.toLowerCase().includes(q),
  );
}
export function addApplication(state: Workspace, application: Application): Workspace {
  if (
    state.role !== "candidate" ||
    state.applications.some((a) => a.opportunityId === application.opportunityId) ||
    !state.opportunities.some((o) => o.id === application.opportunityId)
  )
    return state;
  return { ...state, applications: [...state.applications, application] };
}
export function updateStatus(state: Workspace, id: string, status: Status): Workspace {
  return {
    ...state,
    applications: state.applications.map((a) => (a.id === id ? { ...a, status } : a)),
  };
}
export const storageKey = "bridgepath-workspace-v1";
