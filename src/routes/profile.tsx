import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  Github,
  Globe2,
  MapPin,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillPicker } from "@/components/bridgepath/skill-picker";
import { useWorkspace } from "@/lib/bridgepath/store";
export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Talent Profile — BridgePath" },
      {
        name: "description",
        content:
          "Build a practical skills-first profile with your projects, competencies, languages, and career goals.",
      },
      { property: "og:title", content: "Talent Profile — BridgePath" },
      {
        property: "og:description",
        content: "Let your skills and real projects tell your professional story.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});
function ProfilePage() {
  const { state, saveProfile, ready } = useWorkspace();
  const [draft, setDraft] = useState(state.profile);
  useEffect(() => {
    setDraft(state.profile);
  }, [state.profile]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(state.profile);
  const update = (
    key: "name" | "location" | "targetRole" | "languages" | "portfolio" | "github" | "bio",
    value: string,
  ) => setDraft((p) => ({ ...p, [key]: value }));
  function save(e: FormEvent) {
    e.preventDefault();
    saveProfile({
      ...draft,
      name: draft.name.trim(),
      location: draft.location.trim(),
      targetRole: draft.targetRole.trim(),
    });
  }
  return (
    <div className="page-enter">
      <div className="mb-8">
        <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
          MORE THAN A CERTIFICATE
        </p>
        <h1 className="page-heading">Your talent. Your story.</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Show what you can do, the work you’ve built, and where you want to go next.
        </p>
      </div>
      <div className="grid gap-9 lg:grid-cols-[300px_1fr]">
        <aside>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-primary">
            {state.profile.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <h2 className="mt-5 text-xl font-bold">{state.profile.name}</h2>
          <p className="mt-1 font-medium text-primary">{state.profile.targetRole}</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={13} />
            {state.profile.location}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {state.profile.skills.map((s) => (
              <span key={s} className="skill-tag">
                {s}
              </span>
            ))}
          </div>
          <p className="mt-5 text-xs leading-loose text-muted-foreground">{state.profile.bio}</p>
          <div className="mt-6 space-y-3 border-t pt-5">
            <p className="flex items-center gap-2 text-xs">
              <Globe2 size={15} className="text-primary" />
              {state.profile.languages}
            </p>
            {state.profile.github && (
              <a
                className="flex items-center gap-2 text-xs text-primary"
                href={safeUrl(state.profile.github)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} />
                GitHub
                <ExternalLink size={12} />
              </a>
            )}
            {state.profile.portfolio && (
              <a
                className="flex items-center gap-2 text-xs text-primary"
                href={safeUrl(state.profile.portfolio)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowUpRight size={15} />
                Portfolio
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div className="mt-7 border-l-2 border-primary bg-secondary/50 p-4">
            <Sparkles className="mb-2 text-primary" size={18} />
            <h3 className="text-xs font-semibold">Experience comes in many forms.</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Community projects, volunteer work, and self-directed learning all belong in your
              story.
            </p>
          </div>
        </aside>
        <div>
          <form onSubmit={save} className="space-y-5">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-semibold">Edit your skills profile</h2>
              <span className="text-[10px] text-muted-foreground">
                {dirty ? "Unsaved changes" : "Profile up to date"}
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="form-field">
                Full name
                <input
                  className="field-input"
                  required
                  pattern=".*\S.*"
                  maxLength={80}
                  value={draft.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </label>
              <label className="form-field">
                Location
                <input
                  className="field-input"
                  required
                  pattern=".*\S.*"
                  maxLength={100}
                  value={draft.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </label>
              <label className="form-field">
                Target role
                <input
                  className="field-input"
                  required
                  pattern=".*\S.*"
                  maxLength={100}
                  value={draft.targetRole}
                  onChange={(e) => update("targetRole", e.target.value)}
                />
              </label>
              <label className="form-field">
                Languages
                <input
                  className="field-input"
                  required
                  value={draft.languages}
                  onChange={(e) => update("languages", e.target.value)}
                />
              </label>
            </div>
            <div className="form-field">
              Practical skills
              <SkillPicker
                value={draft.skills}
                onChange={(skills) => setDraft((p) => ({ ...p, skills }))}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="form-field">
                Portfolio URL
                <input
                  className="field-input"
                  type="url"
                  pattern="https?://.*"
                  value={draft.portfolio}
                  onChange={(e) => update("portfolio", e.target.value)}
                />
              </label>
              <label className="form-field">
                GitHub URL
                <input
                  className="field-input"
                  type="url"
                  pattern="https?://.*"
                  value={draft.github}
                  onChange={(e) => update("github", e.target.value)}
                />
              </label>
            </div>
            <label className="form-field">
              Bio & practical experience
              <textarea
                className="field-input min-h-36"
                required
                maxLength={2000}
                value={draft.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
            </label>
            <div className="flex gap-3 border-t pt-5">
              <Button type="submit" disabled={!ready || !dirty}>
                <Save size={15} />
                Save profile
              </Button>
              {dirty && (
                <Button type="button" variant="ghost" onClick={() => setDraft(state.profile)}>
                  Discard changes
                </Button>
              )}
            </div>
          </form>
          <section className="mt-9 border-t pt-6">
            <h2 className="mb-4 text-base font-semibold">Projects & practical competencies</h2>
            <div className="space-y-5">
              <div className="flex gap-3">
                <Code2 size={20} className="mt-1 shrink-0 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold">Community health dashboard</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Cleaned community health data with Python and built an interactive dashboard to
                    help volunteers identify gaps in access.
                  </p>
                  <p className="mt-2 text-[10px] text-primary">
                    Data cleaning · Python · Data visualization
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Globe2 size={20} className="mt-1 shrink-0 text-amber" />
                <div>
                  <h3 className="text-sm font-semibold">Water access tracking tool</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Created a lightweight reporting tool for water access points, combining
                    practical research with a mobile-friendly web interface.
                  </p>
                  <p className="mt-2 text-[10px] text-primary">
                    Web development · Community research · Problem solving
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
function safeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
