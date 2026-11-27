import { describe, expect, it } from "vitest";
import {
  addApplication,
  createInitialWorkspace,
  filterOpportunities,
  initialOpportunities,
  updateStatus,
  type Application,
} from "@/lib/bridgepath/model";
const application: Application = {
  id: "app-1",
  opportunityId: "opp-1",
  status: "Applied",
  message: "I built a Python dashboard for my community.",
  date: "2026-11-27T10:00:00Z",
  notes: [],
};
describe("BridgePath workspace rules", () => {
  it("starts with at least six realistic opportunities covering all three pathways", () => {
    expect(initialOpportunities.length).toBeGreaterThanOrEqual(6);
    expect(new Set(initialOpportunities.map((o) => o.category))).toEqual(
      new Set(["Fellowship", "Mentorship", "Paid Returnship"]),
    );
  });
  it("filters by category", () => {
    expect(
      filterOpportunities(initialOpportunities, "", "Paid Returnship", "All").map((o) => o.id),
    ).toEqual(["opp-3", "opp-6"]);
  });
  it("filters by practical skill", () => {
    expect(filterOpportunities(initialOpportunities, "", "All", "Cloud").map((o) => o.id)).toEqual([
      "opp-4",
    ]);
  });
  it("searches local context while combining filters", () => {
    expect(
      filterOpportunities(initialOpportunities, "garissa", "Paid Returnship", "Python").map(
        (o) => o.id,
      ),
    ).toEqual(["opp-6"]);
  });
  it("lets candidates apply and starts the tracker at Applied", () => {
    const result = addApplication(createInitialWorkspace(), application);
    expect(result.applications).toEqual([application]);
    expect(result.applications[0]?.status).toBe("Applied");
  });
  it("does not let mentor / partners submit candidate applications", () => {
    const state = createInitialWorkspace();
    state.role = "partner";
    expect(addApplication(state, application).applications).toHaveLength(0);
  });
  it("prevents duplicate requests for the same opportunity", () => {
    const state = addApplication(createInitialWorkspace(), application);
    expect(addApplication(state, { ...application, id: "app-2" }).applications).toHaveLength(1);
  });
  it("supports advancing to active and completed while preserving notes", () => {
    const state = addApplication(createInitialWorkspace(), {
      ...application,
      notes: [{ id: "note-1", text: "First mentor session completed.", date: application.date }],
    });
    const active = updateStatus(state, "app-1", "Matched / Trial Active");
    expect(active.applications[0]?.status).toBe("Matched / Trial Active");
    const completed = updateStatus(active, "app-1", "Completed");
    expect(completed.applications[0]?.status).toBe("Completed");
    expect(completed.applications[0]?.notes[0]?.text).toBe("First mentor session completed.");
  });
});
