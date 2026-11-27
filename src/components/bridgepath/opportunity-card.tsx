import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  CircleCheck,
  Clock3,
  MapPin,
  Users,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/bridgepath/store";
import type { Opportunity } from "@/lib/bridgepath/model";
export function CategoryBadge({ opportunity }: { opportunity: Opportunity }) {
  const Icon =
    opportunity.category === "Fellowship"
      ? Sprout
      : opportunity.category === "Mentorship"
        ? Users
        : BriefcaseBusiness;
  return (
    <span className={`category-badge tone-${opportunity.color}`}>
      <Icon size={11} />
      {opportunity.category}
    </span>
  );
}
export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { state, toggleSaved, select, ready } = useWorkspace();
  const applied = state.applications.some((a) => a.opportunityId === opportunity.id);
  const saved = state.saved.includes(opportunity.id);
  return (
    <article className="opportunity-card">
      <div className="flex items-center justify-between gap-2">
        <CategoryBadge opportunity={opportunity} />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground"
          title={saved ? "Remove saved opportunity" : "Save opportunity"}
          aria-label={`${saved ? "Unsave" : "Save"} ${opportunity.title}`}
          aria-pressed={saved}
          disabled={!ready}
          onClick={() => toggleSaved(opportunity.id)}
        >
          <Bookmark className={saved ? "fill-primary text-primary" : ""} size={16} />
        </Button>
      </div>
      <div className="mb-4 mt-5 flex items-center gap-3">
        <div className={`org-avatar tone-${opportunity.color}`}>{opportunity.initials}</div>
        <div className="min-w-0">
          <p className="text-xs font-semibold">{opportunity.organization}</p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin size={11} />
            {opportunity.location}
          </p>
        </div>
      </div>
      <h3 className="mb-3 text-base font-bold leading-snug">{opportunity.title}</h3>
      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {opportunity.description}
      </p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {opportunity.skills.map((skill) => (
          <span className="skill-tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-[11px]">
        <span className="font-semibold">{opportunity.terms}</span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock3 size={12} />
          {opportunity.duration}
        </span>
      </div>
      <Button
        variant={applied ? "secondary" : "outline"}
        className="mt-4 h-9 w-full text-xs"
        disabled={!ready}
        onClick={() => select(opportunity)}
      >
        {state.role === "partner"
          ? "View opportunity"
          : applied
            ? "Request sent"
            : opportunity.category === "Mentorship"
              ? "Request a match"
              : "View & apply"}
        {applied && state.role === "candidate" ? <CircleCheck /> : <ArrowUpRight />}
      </Button>
    </article>
  );
}
