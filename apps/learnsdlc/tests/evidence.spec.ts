import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const navigation = JSON.parse(
  readFileSync(
    new URL("../course-content/evidence-desk/navigation.json", import.meta.url),
    "utf8"
  )
) as { id: string; title: string; topics: { id: string; title: string }[] }[];
test("new program is discoverable without replacing existing academy courses", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /Evidence Desk.*QA Measurement/i }).first()
  ).toBeVisible();
  await expect(page.locator('a[href="/abt-intro"]').first()).toBeVisible();
});
test("each course introduction has its dilemma, reply, outline and start", async ({
  page,
}) => {
  for (const c of navigation) {
    await page.goto(`/evidence-desk/v3/courses/${c.id}`);
    await expect(
      page.getByRole("heading", { name: c.title, exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Reader’s dilemma", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The reply", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Course outline", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Start this micro-course", exact: true })
    ).toHaveAttribute(
      "href",
      `/evidence-desk/v3/courses/${c.id}/topics/${c.topics[0].id}`
    );
  }
});
test("all forty-three topics have substantive teaching, practical work and practice games", async ({
  page,
}) => {
  for (const c of navigation) {
    for (const t of c.topics) {
      await page.goto(`/evidence-desk/v3/courses/${c.id}/topics/${t.id}`);
      await expect(
        page.getByRole("heading", { name: t.title, exact: true })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Guided tool build", exact: true })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Your turn", exact: true })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: "Topic knowledge check",
          exact: true,
        })
      ).toBeVisible();
      await expect(page.locator("[data-practice-game]")).toHaveCount(2);
    }
  }
});
test("public payloads do not contain instructor keys or rationales", async ({
  request,
}) => {
  for (const name of ["catalog", "resources"]) {
    const response = await request.get(`/api/trpc/evidenceDesk.${name}`);
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).not.toContain("correct_option");
    expect(body).not.toContain("rationale");
  }
});
test("unsigned-in learners cannot start a protected assessment", async ({
  request,
}) => {
  const response = await request.post("/api/trpc/evidenceDesk.start", {
    data: { json: { kind: "program" } },
  });
  expect(response.status()).toBe(401);
});
