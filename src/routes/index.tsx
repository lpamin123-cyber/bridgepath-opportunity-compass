import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Compass,
  MapPin,
  Network,
  Sprout,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpportunityCard } from "@/components/bridgepath/opportunity-card";
import { PartnerAction } from "@/components/bridgepath/shell";
import { useWorkspace } from "@/lib/bridgepath/store";
import workspaceImage from "@/assets/bridgepath-workspace.png.asset.json";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BridgePath — Your next local opportunity" },
      {
        name: "description",
        content:
          "Connect verified skills with local mentorships, fellowships, and paid returnships across East Africa.",
      },
      { property: "og:title", content: "BridgePath — Your next local opportunity" },
      {
        property: "og:description",
        content:
          "Build local experience and a professional network. Skills-first opportunities for displaced talent in East Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});
function Overview() {
  const { state } = useWorkspace();
  const matching = state.opportunities.filter((o) =>
    o.skills.some((s) => state.profile.skills.includes(s)),
  );
  const recommendations = (matching.length ? matching : state.opportunities).slice(0, 3);
  const matched = state.applications.filter((a) => a.status === "Matched / Trial Active").length;
  const trials = state.applications.filter(
    (a) =>
      a.status === "Matched / Trial Active" &&
      state.opportunities.find((o) => o.id === a.opportunityId)?.category === "Paid Returnship",
  ).length;
  const pillars = [
    {
      Icon: Target,
      title: "Skills-first matching",
      body: "Your projects and practical skills open doors. Not just your certificates.",
      value: matching.length,
      label: "opportunities fit your skills",
      tone: "teal",
    },
    {
      Icon: Users,
      title: "Mentor & fellowship tracks",
      body: "Find your people. Build local connections with guidance that matters.",
      value: state.opportunities.filter((o) => o.category !== "Paid Returnship").length,
      label: "mentors & fellowships",
      tone: "amber",
    },
    {
      Icon: BriefcaseBusiness,
      title: "Paid returnship trials",
      body: "Real work. Fair pay. A supported path to your next professional role.",
      value: state.opportunities.filter((o) => o.category === "Paid Returnship").length,
      label: "paid trials available",
      tone: "slate",
    },
  ];
  return (
    <div className="page-enter">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
            YOUR NEXT CHAPTER STARTS HERE
          </p>
          <h1 className="page-heading">
            {state.role === "candidate"
              ? `Welcome back, ${state.profile.name.split(" ")[0]}.`
              : "Make room for remarkable talent."}
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {state.role === "candidate"
              ? "Your skills have a place. Let’s find your next local opportunity."
              : "Build meaningful pathways through mentorship and paid local experience."}
          </p>
        </div>
        <PartnerAction />
        {state.role === "candidate" && (
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin size={14} />
            {state.profile.location}
          </span>
        )}
      </div>
      <section className="hero">
        <img
          src={workspaceImage.url}
          className="hero-image"
          alt="East African professionals collaborating on a laptop in a bright Nairobi workspace"
        />
        <div className="hero-content">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-hero-foreground/25 bg-hero-foreground/10 px-2.5 py-1 text-[9px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-hero-muted" />
            LOCAL EXPERIENCE. LASTING CONNECTIONS.
          </span>
          <h2 className="hero-heading">
            Bridge Local Experience.
            <br />
            Turn Verified Skills
            <br />
            Into Real Roles.
          </h2>
          <p className="hero-copy mt-4">
            A new place shouldn’t mean starting from zero. Connect with local mentors, fellowships,
            and paid returnships in Nairobi, Turkana, and Garissa—and let your skills lead the way.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <Button asChild variant="hero" className="h-10 text-xs">
              <Link to="/opportunities">
                Explore opportunities
                <ArrowUpRight size={15} />
              </Link>
            </Button>
            <Link
              to="/profile"
              className="flex items-center gap-1.5 text-[11px] font-medium text-hero-foreground"
            >
              Build your skills profile
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {pillars.map(({ Icon, title, body, value, label, tone }) => (
          <article className="rounded-lg border bg-card p-5" key={title}>
            <div className="mb-3 flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-md tone-${tone}`}>
                <Icon size={18} strokeWidth={1.7} />
              </span>
              <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
            <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="text-lg font-bold text-foreground">{value}</span>
              {label}
              <ArrowUpRight className="ml-auto" size={14} />
            </p>
          </article>
        ))}
      </section>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">A little progress. A bigger future.</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Every connection is a step toward your next chapter.
              </p>
            </div>
            <Link
              to="/tracker"
              className="flex items-center gap-1 text-[11px] font-semibold text-primary"
            >
              View tracker
              <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-3 border-y py-5">
            <div className="border-r pr-3">
              <span className="text-2xl font-bold">
                {state.applications.length}
                <span className="ml-2 inline-flex text-muted-foreground">
                  <SendIcon />
                </span>
              </span>
              <p className="mt-2 text-[11px] text-muted-foreground">Applications sent</p>
            </div>
            <div className="border-r pl-6">
              <span className="text-2xl font-bold">
                {matched}
                <Users className="ml-2 inline-block text-amber" size={17} />
              </span>
              <p className="mt-2 text-[11px] text-muted-foreground">Active matches</p>
            </div>
            <div className="pl-6">
              <span className="text-2xl font-bold">
                {trials}
                <BriefcaseBusiness className="ml-2 inline-block text-primary" size={17} />
              </span>
              <p className="mt-2 text-[11px] text-muted-foreground">Trials in progress</p>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Sprout size={15} className="text-primary" />
            {state.applications.length
              ? "You’ve taken the first step. Keep your progress up to date in Tracker."
              : "Your first connection is waiting. Start with an opportunity below."}
          </p>
        </section>
        <aside className="border-l-2 border-primary bg-secondary/50 px-5 py-4">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-primary">
            <Compass size={14} />
            YOUR NEXT STEP
          </span>
          <h3 className="mt-3 text-sm font-semibold">Let your work speak for you.</h3>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            A strong skills profile helps mentors and partners see what you bring to the table.
          </p>
          <Link
            to="/profile"
            className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-primary"
          >
            Review your profile
            <ArrowRight size={13} />
          </Link>
        </aside>
      </div>
      <section className="mt-9">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Opportunities for your next chapter</h2>
              <span className="category-badge tone-teal">
                {matching.length ? "Based on your skills" : "Explore pathways"}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              A few places where your experience can make a difference.
            </p>
          </div>
          <Link
            to="/opportunities"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary"
          >
            View all opportunities
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendations.map((o) => (
            <OpportunityCard opportunity={o} key={o.id} />
          ))}
        </div>
      </section>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-primary" />
          Skills first, always
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} className="text-primary" />
          Locally rooted networks
        </span>
        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness size={12} className="text-primary" />
          Paid work. Real experience.
        </span>
      </div>
    </div>
  );
}
function SendIcon() {
  return <ArrowUpRight size={17} />;
}
