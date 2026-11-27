import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpportunityCard } from "@/components/bridgepath/opportunity-card";
import { PartnerAction } from "@/components/bridgepath/shell";
import { useWorkspace } from "@/lib/bridgepath/store";
import {
  categories,
  filterOpportunities,
  skills,
  type Category,
  type Skill,
} from "@/lib/bridgepath/model";
export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities & Mentors — BridgePath" },
      {
        name: "description",
        content:
          "Find skills-first fellowships, local mentors, and paid returnship trials in Nairobi, Turkana, and Garissa.",
      },
      { property: "og:title", content: "Opportunities & Mentors — BridgePath" },
      {
        property: "og:description",
        content: "Find your next local connection, fellowship, or paid trial across East Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Opportunities,
});
function Opportunities() {
  const { state } = useWorkspace();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [skill, setSkill] = useState<Skill | "All">("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const items = filterOpportunities(state.opportunities, query, category, skill).filter(
    (o) => !savedOnly || state.saved.includes(o.id),
  );
  return (
    <div className="page-enter">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
            CONNECTIONS THAT OPEN DOORS
          </p>
          <h1 className="page-heading">Opportunities & Mentors</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Find local experience, people in your corner, and a place to put your skills to work.
          </p>
        </div>
        <PartnerAction />
      </div>
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1 basis-64">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={17} />
          <input
            className="field-input search-input"
            aria-label="Search opportunities"
            placeholder="Search opportunities, organizations, or locations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X />
            </Button>
          )}
        </div>
        <label className="flex items-center gap-2 rounded-md border bg-card px-3">
          <SlidersHorizontal size={15} className="text-muted-foreground" />
          <select
            className="h-10 max-w-40 bg-card text-xs outline-none"
            aria-label="Filter by skill"
            value={skill}
            onChange={(e) => {
              const found = skills.find((s) => s === e.target.value);
              setSkill(found ?? "All");
            }}
          >
            <option value="All">All skills</option>
            {skills.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <Button
          variant={savedOnly ? "secondary" : "outline"}
          className="h-[42px] text-xs"
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly(!savedOnly)}
        >
          <Bookmark />
          Saved<span className="text-muted-foreground">{state.saved.length}</span>
        </Button>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "ghost"}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === "All" ? "All opportunities" : c}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "opportunity" : "opportunities"}
        </p>
      </div>
      {items.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-semibold">No opportunities found</h2>
          <p className="mb-5 mt-2 text-xs text-muted-foreground">
            Try another skill, location, or opportunity type.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setSkill("All");
              setCategory("All");
              setSavedOnly(false);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      <p className="mt-6 text-center text-[10px] text-muted-foreground">
        Sample pathways for exploration · New opportunities you post appear here instantly.
      </p>
    </div>
  );
}
