import { expect, test } from "@playwright/test";
import { conceptProjects } from "../../src/data/conceptProjects";
import { publishedProjects } from "../../src/data/projects";
import { archiveCategory, workCategories } from "../../src/lib/projectStatus";
import { wheelScrollUnits } from "../../src/lib/worksWheel";

const routes = ["/", "/work", "/work/demo-local-service"];

test("wheel opens 01 fully, holds, and keeps selection stable across midpoint jitter", async ({
  page,
}) => {
  test.setTimeout(90_000);
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width === 1920 ? 1080 : 900 });
    await page.goto("/");
    await page.locator(".works-wheel-stage").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const scene = page.locator(".works-wheel");
    await expect(scene).toHaveAttribute("id", "work");
    expect(await scene.locator("section").count()).toBe(0);
    expect(
      await scene.locator(".works-wheel-stage").evaluate((el) => {
        const section = el.parentElement!;
        return (
          el.clientWidth === section.clientWidth &&
          el.clientHeight === section.clientHeight &&
          getComputedStyle(el).overflow === "visible" &&
          getComputedStyle(el).transform === "none"
        );
      }),
    ).toBe(true);
    const bounds = await scene.evaluate((el) => {
      const spacer = el.parentElement!;
      return {
        start: spacer.getBoundingClientRect().top + scrollY - 72,
        distance: parseFloat(getComputedStyle(spacer).paddingBottom),
      };
    });
    const cards = await page.locator(".works-wheel-card").elementHandles();
    expect(cards).toHaveLength(7);
    const travelTo = async (travel: number) => {
      await page.evaluate(
        (top) => {
          window.scrollTo({ top, behavior: "instant" });
          window.dispatchEvent(new Event("portfolio:scroll-restored"));
        },
        bounds.start + (bounds.distance * travel) / wheelScrollUnits(7),
      );
      await page.waitForTimeout(650);
      await expect(page.locator(".works-wheel-title")).toHaveCSS("opacity", "1");
      await expect(page.locator(".works-wheel-ring-label")).toHaveCount(1);
      if (travel === 0)
        await expect(page.locator(".works-wheel-ring-label")).toHaveCSS("opacity", "1");
      if (travel >= 0.2)
        await expect(page.locator(".works-wheel-ring-label")).toHaveCSS("opacity", "0");
      expect(
        await page.locator(".works-wheel-card").evaluateAll(
          (cards) =>
            cards.length === 7 &&
            cards.every((card) => {
              const face = card.firstElementChild as HTMLElement;
              return [card, face].every((el) => {
                const style = getComputedStyle(el);
                return (
                  style.opacity === "1" &&
                  style.visibility === "visible" &&
                  style.display !== "none" &&
                  el.style.opacity === "" &&
                  el.style.visibility === "" &&
                  el.style.display === "" &&
                  el.style.pointerEvents === ""
                );
              });
            }),
        ),
      ).toBe(true);
      for (const card of cards) expect(await card.evaluate((el) => el.isConnected)).toBe(true);
    };
    await travelTo(0);
    for (const travel of [0.49, 0.51]) {
      await travelTo(travel);
    }
    let frontTransform = "";
    for (const travel of [1.05, 1.3, 1.6]) {
      await travelTo(travel);
      await expect(page.locator(".works-wheel-title h3")).toHaveText(
        "GoHighLevel Lead Follow-Up Automation",
      );
      await expect(page.locator(".works-wheel-index button").first()).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      const card = page.locator(".works-wheel-card").first();
      // Chromium reports a subpixel 0.9999995 ratio for a fully visible 3D face.
      await expect(card.locator(".works-wheel-face")).toBeInViewport({ ratio: 0.99 });
      await expect.poll(() => card.evaluate((el) => el.style.transform)).toContain("rotateX(0deg)");
      await expect
        .poll(() => card.locator(".works-wheel-face").evaluate((el) => el.style.transform))
        .toBe("scale(1.22)");
      const transform = await card.evaluate((el) => el.style.transform);
      expect(transform).toContain("rotateX(0deg)");
      expect(await card.locator(".works-wheel-face").evaluate((el) => el.style.transform)).toBe(
        "scale(1.22)",
      );
      if (frontTransform) expect(transform).toBe(frontTransform);
      frontTransform = transform;
    }
    // Forward activation at 0.6, reversal only below 0.4; midpoint noise is inert.
    for (const [position, expected] of [
      [0.61, 1],
      [0.51, 1],
      [0.49, 1],
      [0.41, 1],
      [0.39, 0],
      [0.51, 0],
      [0.59, 0],
      [0.61, 1],
    ]) {
      await travelTo(1.65 + position);
      await expect(page.locator(".works-wheel-index button").nth(expected)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
    for (const card of cards) expect(await card.evaluate((el) => el.isConnected)).toBe(true);
    for (const travel of [3.65, 4.65, 7.8, 3.65, 1.3, 0]) await travelTo(travel);
  }
});

test("concept archive filters and every conceptual case route retain truthful sections", async ({
  page,
}) => {
  for (const category of workCategories) {
    await page.goto(`/work?category=${category}`);
    const expected = publishedProjects.filter((project) => archiveCategory(project) === category);
    await expect(page.locator(".project-card")).toHaveCount(expected.length);
    await expect(
      page
        .getByRole("navigation", { name: "Filter projects by category" })
        .getByRole("link", { name: new RegExp(`^${category}`) }),
    ).toHaveAttribute("aria-current", "page");
  }
  for (const project of conceptProjects) {
    const response = await page.request.get(`/work/${project.slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    for (const heading of [
      "Business Problem",
      "Proposed Solution",
      "Implementation Plan",
      "What this concept demonstrates",
    ]) {
      expect(html).toContain(`<h2>${heading}</h2>`);
    }
    expect(html).toContain("PROPOSED ARCHITECTURE / NOT BUILT OR TESTED");
    expect(html).toContain("NOT YET IMPLEMENTED, TESTED OR DELIVERED");
    for (const emptyProof of [
      "VIDEO WALKTHROUGH",
      "A CLOSER LOOK",
      "EXPLORE THE PROJECT",
      "DESKTOP PREVIEW",
      "MOBILE PREVIEW",
    ]) {
      expect(html).not.toContain(`<h2>${emptyProof}</h2>`);
    }
  }
  await page.goto("/work/missed-call-recovery");
  await expect(page.locator("main h1")).toHaveText("Missed Call Recovery System");
  await page
    .getByRole("link", { name: "Next project: Appointment Reminder + No-Show Recovery" })
    .click();
  await expect(page).toHaveURL(/\/work\/appointment-no-show-recovery#main$/);
});

test("homepage wheel supports page scroll, keyboard/index selection and case-study navigation", async ({
  page,
}) => {
  await page.goto("/");
  const wheel = page.getByRole("group", { name: "SELECTED WORK project wheel" });
  await wheel.scrollIntoViewIfNeeded();
  await wheel.focus();
  await wheel.press("ArrowDown");
  await page.locator(".works-wheel-index button").first().click();
  // Pointer stays outside the canvas: ordinary page input must advance the wheel.
  await page.mouse.move(8, 200);
  await page.mouse.wheel(0, 700);
  await expect(page.locator(".works-wheel-title h3")).toHaveText(
    "CRM Pipeline & Lead Routing System",
  );
  const sceneHeading = page.locator("#work h2");
  const archiveLink = page.locator("#work").getByRole("link", { name: "Explore all work" });
  await expect(sceneHeading).toBeInViewport({ ratio: 1 });
  await expect(archiveLink).toBeInViewport({ ratio: 1 });
  const project = "GoHighLevel + Make Integration";
  await page
    .locator(".works-wheel-index")
    .getByRole("button", { name: new RegExp(project.replace("+", "\\+")) })
    .click();
  await expect(page.locator(".works-wheel-title h3")).toHaveText(project);
  await expect(sceneHeading).toBeInViewport({ ratio: 1 });
  await expect(archiveLink).toBeInViewport({ ratio: 1 });
  const card = wheel.getByRole("link", { name: `View case study: ${project}`, exact: true });
  await expect(card).toBeInViewport();
  await card.click();
  await expect(page).toHaveURL(/\/work\/demo-make-integration$/);
  await expect(page.locator("main h1")).toHaveText(project);
});

for (const route of routes) {
  test(`${route} loads`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page).toHaveTitle(/Josri|Local Service/i);
  });
}

test("archive navigation opens a case study and browser Back returns to the archive", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  const caseLink = page.getByRole("link", {
    name: "View case study: Local Service Lead-Generation Website",
    exact: true,
  });
  await caseLink.scrollIntoViewIfNeeded();
  await caseLink.click();
  await expect(page).toHaveURL(/\/work\/demo-local-service$/);
  await expect(page.locator("main h1")).toContainText("Local Service");
  await page.goBack();
  await expect(page).toHaveURL(/\/work$/);
  await expect(caseLink).toBeInViewport();
});

test("mobile menu supports Escape and navigation; public routes have no body overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: /^(Menu \+|Close −)$/ });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
            window.innerWidth,
        ),
      )
      .toBeLessThanOrEqual(1);
  }
});
