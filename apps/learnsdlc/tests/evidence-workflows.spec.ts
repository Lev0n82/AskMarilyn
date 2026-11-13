import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import superjson from "superjson";
import {
  fixture,
  learner,
  admin,
  stranger,
} from "../server/evidence/test-store";
const courses = JSON.parse(
  readFileSync(
    new URL("../course-content/evidence-desk/courses.json", import.meta.url),
    "utf8"
  )
);
const resources = JSON.parse(
  readFileSync(
    new URL("../course-content/evidence-desk/resources.json", import.meta.url),
    "utf8"
  )
);
// HTTP bridge calls the real service; synthetic keys test UI behavior only. No production DB writes.
async function isolated(page: Page, actor = learner) {
  const f = fixture(true);
  f.release.courses = courses;
  f.release.assets = resources.assets;
  f.release.matrices = resources.matrices;
  for (const c of courses)
    for (const t of c.topics)
      f.release.questions[`topic:${c.course_id}:${t.topic_id}`] =
        t.quiz.questions.map((q: any) => ({
          ...q,
          correct_option: "A",
          explanation: "Isolated UI test fixture explanation",
          options: q.options.map((o: any) => ({
            ...o,
            rationale: "Isolated test misconception rationale",
          })),
        }));
  await page.route("**/api/trpc/**", async route => {
    const req = route.request(),
      url = new URL(req.url());
    const names = url.pathname.split("/api/trpc/")[1].split(",");
    const encoded =
      req.method() === "POST"
        ? JSON.parse(req.postData() ?? "{}")
        : JSON.parse(url.searchParams.get("input") ?? "{}");
    const results = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i],
        raw =
          names.length === 1 && !url.searchParams.has("batch")
            ? encoded
            : (encoded[String(i)] ?? {});
      const input = raw.json !== undefined ? superjson.deserialize(raw) : {};
      try {
        let value: any;
        if (name === "auth.me")
          value = {
            ...actor,
            name: "Isolated test learner",
            email: "isolated@example.org",
            createdAt: new Date(),
            updatedAt: new Date(),
            lastSignedIn: new Date(),
          };
        else if (name.startsWith("evidenceDesk.")) {
          const method = name.split(".")[1];
          if (method === "catalog") value = await f.service.catalog();
          else if (method === "course")
            value = await f.service.course((input as any).courseId);
          else if (method === "topic")
            value = await f.service.topic(
              (input as any).courseId,
              (input as any).topicId
            );
          else if (method === "resources") value = await f.service.resources();
          else if (method === "progress")
            value = await f.service.progress(actor);
          else if (method === "submissions")
            value = await f.service.submissions(actor);
          else if (method === "queue") value = await f.service.queue(actor);
          else value = await (f.service as any)[method](actor, input);
        } else value = [];
        results.push({ result: { data: superjson.serialize(value) } });
      } catch (e: any) {
        results.push({
          error: {
            json: {
              message: e.message,
              code: -32000,
              data: {
                code: e.code ?? "BAD_REQUEST",
                httpStatus: 400,
                path: name,
              },
            },
          },
        });
      }
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        url.searchParams.has("batch") ? results : results[0]
      ),
    });
  });
  return f;
}
test("saves a draft, reloads the same form, then displays full authorized quiz feedback", async ({
  page,
}) => {
  const f = await isolated(page);
  await page.goto("/evidence-desk/v3/courses/C01/topics/1.1");
  await page
    .getByRole("button", { name: "Start or resume topic quiz", exact: true })
    .click();
  const fieldsets = page.locator("#topic-quiz fieldset");
  await expect(fieldsets).toHaveCount(3);
  await fieldsets.nth(0).getByRole("radio").nth(0).check();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(
    page.getByText(
      "Draft saved. Start/resume reopens this exact form and answers."
    )
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Start or resume topic quiz", exact: true })
    .click();
  await expect(
    page.locator("#topic-quiz fieldset").nth(0).getByRole("radio").nth(0)
  ).toBeChecked();
  for (let i = 1; i < 3; i++)
    await page
      .locator("#topic-quiz fieldset")
      .nth(i)
      .getByRole("radio")
      .nth(0)
      .check();
  await page
    .getByRole("checkbox", {
      name: "I have reviewed my answers and want to submit this attempt.",
    })
    .check();
  await page
    .getByRole("button", { name: "Submit final answers", exact: true })
    .click();
  await expect(
    page.getByText("Approved — knowledge check passed", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("Isolated UI test fixture explanation").first()
  ).toBeVisible();
  expect((await f.service.progress(learner)).courses[0].verified).toBe(0);
});
test("records rejected then accepted real-service evidence revisions without self-approval", async ({
  page,
}) => {
  const f = await isolated(page);
  await page.goto("/evidence-desk/v3/portfolio?course=C01&topic=1.1");
  await page
    .getByLabel("Truthful connection mode")
    .selectOption("authentic_export");
  await page
    .getByLabel("Permission-controlled evidence reference")
    .fill("https://example.org/permission-controlled-test-reference");
  await page
    .getByLabel("Evidence index, source boundary and reviewer-access notes")
    .fill(
      "Isolated browser fixture: source boundary and changed-scope evidence"
    );
  await page
    .getByRole("button", { name: "Submit evidence reference", exact: true })
    .click();
  await expect(
    page.getByText(
      "Evidence reference submitted. It is awaiting an actual review, not automatically verified."
    )
  ).toBeVisible();
  const sub = (await f.service.submissions(learner))[0];
  await f.service.judge(admin, {
    submissionId: sub.id,
    levels: [1],
    gates: {
      truthful: true,
      authorized: true,
      reconciled: true,
      accessible: true,
      authentic: true,
    },
    reason: "Repair the source boundary",
  });
  await page.reload();
  await expect(page.getByText("Instructor requested repair")).toBeVisible();
  await page
    .getByLabel("Truthful connection mode")
    .selectOption("authentic_export");
  await page
    .getByLabel("Permission-controlled evidence reference")
    .fill("https://example.org/permission-controlled-test-reference-v2");
  await page
    .getByLabel("Evidence index, source boundary and reviewer-access notes")
    .fill("Repaired changed-scope source index");
  await page
    .getByLabel("Previous submission ID, only for a corrected revision")
    .fill(sub.id);
  await page
    .getByRole("button", { name: "Submit evidence reference", exact: true })
    .click();
  await expect(page.getByText("Evidence reference submitted. It is awaiting an actual review, not automatically verified.")).toBeVisible();
  const revised = (await f.service.submissions(learner)).find(
    (s: any) => s.data.parentId === sub.id
  )!;
  await f.service.judge(admin, {
    submissionId: revised.id,
    levels: [2],
    gates: {
      truthful: true,
      authorized: true,
      reconciled: true,
      accessible: true,
      authentic: true,
    },
    reason: "Accepted correction",
  });
  await page.reload();
  await expect(
    page.getByText("Instructor accepted this revision")
  ).toBeVisible();
});
test("mobile topic mounts once, uses keyboard-visible navigation, and has no broad horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await isolated(page);
  await page.goto("/evidence-desk/v3/courses/C01/topics/1.1");
  await expect(page.locator("#C01-T1-PREDICTION")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Course introduction", exact: true })
    .focus();
  await expect(
    page.getByRole("link", { name: "Course introduction", exact: true })
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Reader’s dilemma", exact: true })
  ).toBeVisible();
  const widths = await page.evaluate(() => ({
    body: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 2);
});
test("midpoint entertainment is optional, pausible, skippable and disabled by reduced motion", async ({
  page,
}) => {
  const f = await isolated(page);
  await f.store.put("learning", {
    id: "11:3.0",
    ownerId: 11,
    version: "3.0",
    data: {
      topics: {},
      revision: 0,
      milestones: [{ id: "C01", text: "Isolated verified midpoint fixture" }],
    },
  });
  await page.goto("/evidence-desk/v3/progress");
  await page
    .getByRole("button", {
      name: "Play optional 60-second celebration",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause celebration", exact: true })
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pause celebration", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Resume celebration", exact: true })
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", {
      name: "Play optional 60-second celebration",
      exact: true,
    })
  ).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", {
      name: "Play optional 60-second celebration",
      exact: true,
    })
  ).toBeDisabled();
  expect((await f.service.progress(learner)).milestones).toHaveLength(1);
});
