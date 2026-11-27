import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronDown,
  Globe2,
  LayoutDashboard,
  Network,
  Plus,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/bridgepath/store";
import { WorkspaceDialogs } from "./workspace-dialogs";
import { type ReactNode } from "react";
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { state, setRole, setPosting, ready } = useWorkspace();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigation = [
    { to: "/" as const, label: "Overview", Icon: LayoutDashboard },
    { to: "/opportunities" as const, label: "Opportunities & Mentors", Icon: Users },
    { to: "/profile" as const, label: "Talent Profile", Icon: UserRound },
    { to: "/tracker" as const, label: "Tracker", Icon: ChartNoAxesCombined },
  ];
  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="app-container flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="BridgePath home" className="flex items-center gap-2.5">
              <span className="brand-mark">
                <Network size={23} strokeWidth={1.8} />
              </span>
              <span className="text-[23px] font-bold">
                BridgePath<span className="text-primary">.</span>
              </span>
            </Link>
            <span className="ml-3 hidden rounded-md border bg-muted px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground lg:inline-flex">
              Track 3 <span className="mx-1.5">•</span> SDGs 8, 10 & 17
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="flex items-center rounded-full border bg-muted p-1"
              aria-label="Workspace role"
            >
              <Button
                disabled={!ready}
                size="sm"
                variant={state.role === "candidate" ? "default" : "ghost"}
                className="rounded-full text-[11px]"
                aria-pressed={state.role === "candidate"}
                onClick={() => setRole("candidate")}
              >
                <UserRound size={13} />
                Candidate
              </Button>
              <Button
                disabled={!ready}
                size="sm"
                variant={state.role === "partner" ? "default" : "ghost"}
                className="rounded-full text-[11px]"
                aria-pressed={state.role === "partner"}
                onClick={() => setRole("partner")}
              >
                <BriefcaseBusiness size={13} />
                Mentor / Partner
              </Button>
            </div>
            <Link
              to="/profile"
              className="hidden h-9 w-9 items-center justify-center rounded-full border bg-amber-soft text-xs font-semibold text-amber sm:flex"
              title="Your talent profile"
            >
              {state.profile.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </Link>
          </div>
        </div>
        <div className="app-container flex justify-between">
          <nav className="workspace-nav">
            {navigation.map(({ to, label, Icon }) => (
              <Link to={to} key={to} className="nav-item" activeOptions={{ exact: true }}>
                <Icon size={16} />
                {label}
                {to === "/tracker" && state.applications.length > 0 && (
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-primary">
                    {state.applications.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground lg:flex">
            <Globe2 size={13} />
            East Africa
          </span>
        </div>
      </header>
      <main className="app-container py-8 md:py-9">{children}</main>
      <footer className="app-container mt-3 flex flex-wrap items-center justify-between gap-4 border-t py-6 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-2">
          <Network size={14} />
          BridgePath · Skills without borders. Opportunity without barriers.
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Built around SDGs 8, 10 & 17
        </span>
      </footer>
      <WorkspaceDialogs />
    </div>
  );
}
export function PartnerAction() {
  const { state, setPosting, ready } = useWorkspace();
  return state.role === "partner" ? (
    <Button disabled={!ready} onClick={() => setPosting(true)} className="text-xs">
      <Plus size={15} />
      Post opportunity
    </Button>
  ) : null;
}
