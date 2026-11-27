import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  addApplication,
  categories,
  createInitialWorkspace,
  skills,
  statuses,
  storageKey,
  updateStatus,
  type Opportunity,
  type Profile,
  type Role,
  type Status,
  type Workspace,
} from "./model";
const opportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string(),
  initials: z.string(),
  category: z.enum(categories),
  location: z.string(),
  terms: z.string(),
  duration: z.string(),
  skills: z.array(z.enum(skills)),
  description: z.string(),
  color: z.enum(["teal", "amber", "slate"]),
});
const workspaceSchema = z.object({
  role: z.enum(["candidate", "partner"]),
  profile: z.object({
    name: z.string(),
    location: z.string(),
    targetRole: z.string(),
    skills: z.array(z.enum(skills)),
    languages: z.string(),
    portfolio: z.string(),
    github: z.string(),
    bio: z.string(),
  }),
  opportunities: z.array(opportunitySchema),
  applications: z.array(
    z.object({
      id: z.string(),
      opportunityId: z.string(),
      status: z.enum(statuses),
      message: z.string(),
      date: z.string(),
      notes: z.array(z.object({ id: z.string(), text: z.string(), date: z.string() })),
    }),
  ),
  saved: z.array(z.string()),
});
interface Store {
  state: Workspace;
  ready: boolean;
  setRole: (role: Role) => void;
  saveProfile: (profile: Profile) => void;
  toggleSaved: (id: string) => void;
  apply: (id: string, message: string) => void;
  post: (opportunity: Omit<Opportunity, "id">) => void;
  changeStatus: (id: string, status: Status) => void;
  addNote: (id: string, text: string) => void;
  selected: Opportunity | null;
  select: (opportunity: Opportunity | null) => void;
  posting: boolean;
  setPosting: (value: boolean) => void;
}
const Context = createContext<Store | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Workspace>(createInitialWorkspace);
  const [ready, setReady] = useState(false);
  const [selected, select] = useState<Opportunity | null>(null);
  const [posting, setPosting] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = workspaceSchema.safeParse(JSON.parse(raw));
        if (parsed.success) setState(parsed.data);
        else toast.warning("Your saved workspace could not be loaded. A fresh workspace is ready.");
      }
    } catch {
      toast.warning("Saved data is unavailable. You can still use this workspace.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      toast.error(
        "Changes could not be saved on this device. Check your browser storage settings.",
      );
    }
  }, [state, ready]);
  const value: Store = {
    state,
    ready,
    selected,
    select,
    posting,
    setPosting,
    setRole: (role) => {
      setState((s) => ({ ...s, role }));
      select(null);
      setPosting(false);
      toast.success(role === "candidate" ? "Candidate workspace" : "Mentor / Partner workspace");
    },
    saveProfile: (profile) => {
      setState((s) => ({ ...s, profile }));
      toast.success("Your talent profile has been saved.");
    },
    toggleSaved: (id) =>
      setState((s) => ({
        ...s,
        saved: s.saved.includes(id) ? s.saved.filter((v) => v !== id) : [...s.saved, id],
      })),
    apply: (id, message) => {
      setState((s) =>
        addApplication(s, {
          id: crypto.randomUUID(),
          opportunityId: id,
          status: "Applied",
          message,
          date: new Date().toISOString(),
          notes: [],
        }),
      );
      select(null);
      toast.success("Request sent. Follow your next steps in Tracker.");
    },
    post: (opportunity) => {
      setState((s) =>
        s.role === "partner"
          ? {
              ...s,
              opportunities: [{ ...opportunity, id: crypto.randomUUID() }, ...s.opportunities],
            }
          : s,
      );
      setPosting(false);
      toast.success("Your opportunity is now live in the hub.");
    },
    changeStatus: (id, status) => {
      setState((s) => updateStatus(s, id, status));
      toast.success(
        `Status updated to ${status === "Matched / Trial Active" ? "Matched / Trial Active" : status.toLowerCase()}.`,
      );
    },
    addNote: (id, text) => {
      if (!text.trim()) return;
      const note = { id: crypto.randomUUID(), text: text.trim(), date: new Date().toISOString() };
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id ? { ...a, notes: [...a.notes, note] } : a,
        ),
      }));
      toast.success("Progress note added.");
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useWorkspace() {
  const store = useContext(Context);
  if (!store) throw new Error("BridgePath workspace is unavailable");
  return store;
}
