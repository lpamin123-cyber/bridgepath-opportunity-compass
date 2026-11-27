import { useState, type FormEvent } from "react";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryBadge } from "./opportunity-card";
import { SkillPicker } from "./skill-picker";
import { useWorkspace } from "@/lib/bridgepath/store";
import { categories, type Category, type Skill } from "@/lib/bridgepath/model";
import { Link } from "@tanstack/react-router";
export function WorkspaceDialogs() {
  const { selected, select, posting, setPosting } = useWorkspace();
  return (
    <>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) select(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] w-[calc(100%-32px)] overflow-y-auto rounded-lg sm:max-w-xl">
          {selected && <ApplicationForm key={selected.id} />}
        </DialogContent>
      </Dialog>
      <Dialog open={posting} onOpenChange={setPosting}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-32px)] overflow-y-auto rounded-lg sm:max-w-xl">
          {posting && <PostForm />}
        </DialogContent>
      </Dialog>
    </>
  );
}
function ApplicationForm() {
  const { selected, state, apply, select } = useWorkspace();
  const [message, setMessage] = useState("");
  if (!selected) return null;
  const applied = state.applications.some((a) => a.opportunityId === selected.id);
  return (
    <>
      <DialogHeader>
        <div className="mb-3">
          <CategoryBadge opportunity={selected} />
        </div>
        <DialogTitle className="text-xl leading-snug">{selected.title}</DialogTitle>
        <DialogDescription>{selected.organization}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {selected.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock3 size={14} />
          {selected.duration}
        </span>
      </div>
      <p className="text-sm leading-relaxed">{selected.description}</p>
      <div className="rounded-md bg-muted p-4">
        <p className="text-sm font-semibold">{selected.terms}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {selected.category === "Mentorship"
            ? "Structured guidance, practical feedback, and local introductions."
            : "A defined learning plan, regular feedback, and a local professional reference."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {selected.skills.map((s) => (
          <span className="skill-tag" key={s}>
            {s}
          </span>
        ))}
      </div>
      {state.role === "partner" ? (
        <Button variant="outline" onClick={() => select(null)}>
          Close opportunity
        </Button>
      ) : applied ? (
        <div className="border-t pt-4">
          <p className="mb-4 flex items-center gap-2 font-semibold text-primary">
            <CheckCircle2 size={18} />
            Your request has been sent
          </p>
          <Button asChild className="w-full" onClick={() => select(null)}>
            <Link to="/tracker">
              View in Tracker
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            apply(selected.id, message.trim());
          }}
          className="space-y-4 border-t pt-4"
        >
          <div className="flex items-center gap-3">
            <div className="org-avatar tone-teal">
              {state.profile.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <p className="text-sm font-semibold">{state.profile.name}</p>
              <p className="text-xs text-muted-foreground">
                {state.profile.targetRole} · {state.profile.location}
              </p>
            </div>
          </div>
          <label className="form-field">
            Why is this a good next step for you?
            <textarea
              className="field-input"
              required
              minLength={10}
              maxLength={1500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share a project, your interests, or what you hope to learn…"
            />
          </label>
          <p className="text-xs text-muted-foreground">
            Your skills profile will be included with your request.
          </p>
          <Button type="submit" className="w-full">
            <Send size={15} />
            {selected.category === "Mentorship" ? "Send match request" : "Submit application"}
          </Button>
        </form>
      )}
    </>
  );
}
function PostForm() {
  const { post, state } = useWorkspace();
  const [category, setCategory] = useState<Category>("Fellowship");
  const [selectedSkills, setSkills] = useState<Skill[]>([]);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.role !== "partner") return;
    if (!selectedSkills.length) {
      toast.error("Choose at least one skill.");
      return;
    }
    const data = new FormData(e.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const organization = value("organization");
    post({
      title: value("title"),
      organization,
      initials: organization
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      category,
      location: value("location"),
      terms: value("terms"),
      duration: value("duration"),
      skills: selectedSkills,
      description: value("description"),
      color: category === "Fellowship" ? "teal" : category === "Mentorship" ? "amber" : "slate",
    });
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>Open a door for local talent</DialogTitle>
        <DialogDescription>Post an opportunity or offer your time as a mentor.</DialogDescription>
      </DialogHeader>
      <form className="space-y-4" onSubmit={submit}>
        <label className="form-field">
          Opportunity type
          <select
            className="field-input"
            value={category}
            onChange={(e) => {
              const c = categories.find((c) => c === e.target.value);
              if (c) setCategory(c);
            }}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="form-field">
          Opportunity title
          <input
            name="title"
            className="field-input"
            required
            maxLength={100}
            placeholder="e.g. Community Data Fellowship"
          />
        </label>
        <label className="form-field">
          Organization or mentor name
          <input
            name="organization"
            className="field-input"
            required
            maxLength={100}
            placeholder="Your organization or full name"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="form-field">
            Location & work mode
            <input
              name="location"
              className="field-input"
              required
              placeholder="Nairobi · Hybrid"
            />
          </label>
          <label className="form-field">
            Duration
            <input name="duration" className="field-input" required placeholder="8 weeks" />
          </label>
        </div>
        <label className="form-field">
          {category === "Mentorship" ? "Session terms" : "Monthly stipend / pay"}
          <input
            name="terms"
            className="field-input"
            required
            placeholder={
              category === "Mentorship" ? "Free · Weekly 1:1 sessions" : "KES 30,000 / month"
            }
          />
        </label>
        <div className="form-field">
          Required skills
          <SkillPicker value={selectedSkills} onChange={setSkills} />
        </div>
        <label className="form-field">
          About the opportunity
          <textarea
            name="description"
            className="field-input"
            required
            minLength={20}
            maxLength={1500}
            placeholder="Describe the work, mentorship, and experience participants will gain."
          />
        </label>
        <Button type="submit" className="w-full">
          <BriefcaseBusiness size={15} />
          Publish opportunity
        </Button>
      </form>
    </>
  );
}
