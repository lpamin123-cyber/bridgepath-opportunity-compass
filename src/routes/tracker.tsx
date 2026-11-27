import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  MessageSquare,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryBadge } from "@/components/bridgepath/opportunity-card";
import { useWorkspace } from "@/lib/bridgepath/store";
import { statuses, type Application } from "@/lib/bridgepath/model";
export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Application & Milestone Tracker — BridgePath" },
      {
        name: "description",
        content:
          "Follow applications, mentorship matches, and paid returnships. Record progress and celebrate completed milestones.",
      },
      { property: "og:title", content: "Application & Milestone Tracker — BridgePath" },
      {
        property: "og:description",
        content: "Track every connection and milestone on your path to meaningful local work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tracker,
});
function Tracker() {
  const { state, addNote } = useWorkspace();
  const [noteId, setNoteId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const selected = state.applications.find((a) => a.id === noteId);
  const selectedOpportunity = state.opportunities.find((o) => o.id === selected?.opportunityId);
  return (
    <div className="page-enter">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
            SMALL STEPS. REAL MOMENTUM.
          </p>
          <h1 className="page-heading">Your progress, in one place.</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Follow your applications, grow your connections, and capture every milestone.
          </p>
        </div>
        <Button asChild variant="outline" className="text-xs">
          <Link to="/opportunities">
            Explore opportunities
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="mb-8 flex flex-wrap items-center gap-6 border-y py-5">
        <p className="text-xs text-muted-foreground">
          <strong className="mr-2 text-xl text-foreground">{state.applications.length}</strong>Total
          connections
        </p>
        <p className="text-xs text-muted-foreground">
          <strong className="mr-2 text-xl text-primary">
            {state.applications.filter((a) => a.status === "Completed").length}
          </strong>
          Milestones completed
        </p>
      </div>
      {!state.applications.length && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-l-2 border-primary bg-secondary/50 p-5">
          <div>
            <h2 className="text-sm font-semibold">Your next chapter starts with one connection.</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Find a pathway that fits your skills and send your first request.
            </p>
          </div>
          <Button asChild>
            <Link to="/opportunities">
              Find an opportunity
              <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        {statuses.map((status, index) => {
          const items = state.applications.filter((a) => a.status === status);
          const Icon = index === 0 ? Send : index === 1 ? Users : CheckCircle2;
          return (
            <section key={status} className="min-w-0">
              <div className="mb-5 flex items-center gap-2 border-b pb-4">
                <Icon
                  size={16}
                  className={
                    index === 0 ? "text-slate" : index === 1 ? "text-amber" : "text-primary"
                  }
                />
                <h2 className="text-sm font-semibold">{status}</h2>
                <span className="ml-auto rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="space-y-4">
                {items.map((a) => (
                  <TrackerCard
                    key={a.id}
                    application={a}
                    onNote={() => {
                      setNoteId(a.id);
                      setText("");
                    }}
                  />
                ))}
                {!items.length && (
                  <div className="empty-state px-4 py-9">
                    <CircleDashed size={22} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {index === 0
                        ? "Your applications will appear here."
                        : index === 1
                          ? "Your next match is ahead."
                          : "Every finished milestone counts."}
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <Dialog
        open={noteId !== null}
        onOpenChange={(open) => {
          if (!open) setNoteId(null);
        }}
      >
        <DialogContent className="w-[calc(100%-32px)] rounded-lg">
          <DialogHeader>
            <DialogTitle>Add a session or progress note</DialogTitle>
            <DialogDescription>{selectedOpportunity?.title}</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (noteId) {
                addNote(noteId, text);
                setNoteId(null);
              }
            }}
          >
            <label className="form-field">
              What happened?
              <textarea
                className="field-input"
                required
                minLength={3}
                maxLength={1500}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="A mentor session, project update, feedback, or your next step…"
              />
            </label>
            <Button type="submit" className="w-full">
              <Plus />
              Save progress note
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function TrackerCard({ application, onNote }: { application: Application; onNote: () => void }) {
  const { state, changeStatus } = useWorkspace();
  const [expanded, setExpanded] = useState(false);
  const opportunity = state.opportunities.find((o) => o.id === application.opportunityId);
  if (!opportunity) return null;
  return (
    <article className="rounded-lg border bg-card p-5">
      <CategoryBadge opportunity={opportunity} />
      <h3 className="mt-4 text-sm font-semibold leading-relaxed">{opportunity.title}</h3>
      <p className="mt-1 text-[11px] text-muted-foreground">{opportunity.organization}</p>
      <p className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Clock3 size={12} />
        Requested {formatDate(application.date)}
      </p>
      <label className="form-field mt-4">
        Status
        <select
          className="field-input text-xs"
          value={application.status}
          onChange={(e) => {
            const status = statuses.find((s) => s === e.target.value);
            if (status) changeStatus(application.id, status);
          }}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Button size="sm" variant="outline" onClick={onNote}>
          <Plus size={12} />
          Add note
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-[10px]"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <MessageSquare size={12} />
          {application.notes.length} notes
        </Button>
      </div>
      {expanded && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <div>
            <p className="text-[10px] font-semibold text-primary">YOUR APPLICATION</p>
            <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">
              {application.message}
            </p>
          </div>
          {application.notes.map((n) => (
            <div key={n.id}>
              <span className="text-[10px] text-muted-foreground">{formatDate(n.date)}</span>
              <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed">
                {n.text}
              </p>
            </div>
          ))}
          {!application.notes.length && (
            <p className="text-[11px] text-muted-foreground">No progress notes yet.</p>
          )}
        </div>
      )}
    </article>
  );
}
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
