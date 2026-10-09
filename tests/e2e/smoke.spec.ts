import { expect, test } from "@playwright/test";
import { conceptProjects } from "../../src/data/conceptProjects";
import { publishedProjects } from "../../src/data/projects";
import { archiveCategory, workCategories } from "../../src/lib/projectStatus";
import { wheelScrollUnits } from "../../src/lib/worksWheel";
import { skillGroups } from "../../src/data/skills";

const routes = ["/", "/work", "/work/demo-local-service"];

test("toolkit index preserves every verified tool and stays readable without motion", async ({
  page,
}) => {
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#tools");
    const section = page.locator("#tools");
    const entries = section.getByRole("article");
    await expect(entries).toHaveCount(skillGroups.length);
    for (const [index, group] of skillGroups.entries()) {
      const entry = entries.nth(index);
      await expect(entry.getByRole("heading", { name: group.title, exact: true })).toBeVisible();
      await expect(entry.getByRole("listitem")).toHaveText([...group.tools]);
      await expect(entry).toHaveCSS("opacity", "1");
      await expect(entry).toHaveCSS("transform", "none");
    }
    const height = (await section.boundingBox())!.height;
    await entries.first().hover();
    expect(Math.abs((await section.boundingBox())!.height - height)).toBeLessThan(1);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(entries.first().locator(".toolkit-ordinal")).toHaveCSS(
      "transition-duration",
      "0s",
    );
    await expect(section.getByRole("listitem")).toHaveCount(
      skillGroups.reduce((total, group) => total + group.tools.length, 0),
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
});

test("process rail reverses without hiding copy or moving the ordered stages", async ({ page }) => {
  test.setTimeout(60_000);
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#hero-title")).toHaveAttribute("data-hero-ready", "true");
    await page.evaluate(() => document.fonts.ready);
    const stages = page.locator(".process-stage");
    await expect(stages).toHaveCount(6);
    const geometry = await page.locator(".process-track").evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.clientHeight,
    }));
    const travel = async (fraction: number) => {
      await page.evaluate(
        (y) => {
          scrollTo({ top: y, behavior: "instant" });
          dispatchEvent(new Event("portfolio:scroll-restored"));
        },
        geometry.top - 585 + (geometry.height + 90) * fraction,
      );
      await page.waitForTimeout(1000);
    };
    await travel(0.5);
    const forward = await stages.evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-process-state")),
    );
    expect(forward.filter((state) => state === "current")).toHaveLength(1);
    await travel(1);
    await expect(stages.last()).toHaveAttribute("data-process-state", "current");
    await travel(0.5);
    expect(
      await stages.evaluateAll((els) => els.map((el) => el.getAttribute("data-process-state"))),
    ).toEqual(forward);
    for (const stage of await stages.all()) {
      await expect(stage).toHaveCSS("transform", "none");
      await expect(stage.locator("h3")).toHaveCSS("opacity", "1");
      await expect(stage.locator("p")).toHaveCSS("opacity", "1");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".process-progress")).toHaveCSS("transform", "none");
    await expect(page.locator(".process-stage[data-process-state]")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
});

test("website showcase switches accessibly without layout shifts or interrupted animation remnants", async ({
  page,
}) => {
  test.setTimeout(60_000);
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#websites");
    const buttons = section.locator(".showcase-select");
    await buttons.first().focus();
    await page.waitForTimeout(1000);
    const height = (await section.boundingBox())!.height;
    const frameSize = await section.locator('[data-active="true"] .showcase-preview').boundingBox();
    for (let index = 0; index < 4; index++) {
      await buttons.nth(index).focus();
      await page.keyboard.press("Enter");
      await expect(buttons.nth(index)).toHaveAttribute("aria-pressed", "true");
      const active = section.locator('[data-showcase-panel][data-active="true"]');
      await expect(active).toHaveCount(1);
      for (let sample = 0; sample < 3; sample++) {
        const frame = active.locator(".showcase-preview");
        await expect(frame).toHaveCSS("clip-path", "none");
        const bounds = (await frame.boundingBox())!;
        expect(Math.abs(bounds.width - frameSize!.width)).toBeLessThan(1);
        expect(Math.abs(bounds.height - frameSize!.height)).toBeLessThan(1);
        expect(
          await active.locator(".showcase-content").evaluate((el) => +getComputedStyle(el).opacity),
        ).toBeGreaterThanOrEqual(0.8);
        await page.waitForTimeout(40);
      }
      await expect(active.getByRole("link", { name: "View case study" })).toBeVisible();
      expect(Math.abs((await section.boundingBox())!.height - height)).toBeLessThan(1);
      for (const inactive of await section.locator('[data-active="false"]').all()) {
        await expect(inactive).toHaveAttribute("inert", "");
        await expect(inactive).toHaveAttribute("aria-hidden", "true");
      }
    }
    await buttons.evaluateAll((elements) => {
      for (const index of [0, 3, 1, 2, 0, 3]) (elements[index] as HTMLButtonElement).click();
    });
    await expect(buttons.last()).toHaveAttribute("aria-pressed", "true");
    await expect(section.locator('[data-active="true"] .showcase-preview')).toHaveCSS(
      "clip-path",
      "none",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await buttons.nth(1).click();
    await expect(section.locator('[data-active="true"] .showcase-preview')).toHaveCSS(
      "clip-path",
      "none",
    );
    await expect(section.locator('[data-active="true"] .showcase-caption')).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(section.locator('[data-active="true"] a')).toHaveAttribute(
      "href",
      "/work/demo-consultation-funnel",
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
});

test("system overview assembles sequentially, reverses and keeps reduced-motion content readable", async ({
  page,
}) => {
  test.setTimeout(60_000);
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#hero-title")).toHaveAttribute("data-hero-ready", "true");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator(".system-overview");
    await expect(section).toHaveClass(/system-cinematic/);
    const bounds = await section.evaluate((el) => ({
      start: el.parentElement!.getBoundingClientRect().top + scrollY - 8,
      distance: parseFloat(getComputedStyle(el.parentElement!).paddingBottom),
    }));
    const travel = async (fraction: number) => {
      await page.evaluate(
        (y) => {
          scrollTo({ top: y, behavior: "instant" });
          dispatchEvent(new Event("portfolio:scroll-restored"));
        },
        bounds.start + bounds.distance * fraction,
      );
      await page.waitForTimeout(1000);
    };
    const nodes = section.locator("[data-system-node]");
    await travel(0.16);
    await expect(nodes.first()).toHaveCSS("opacity", "1");
    await expect(nodes.last()).toHaveCSS("opacity", "0");
    await travel(0.74);
    for (const node of await nodes.all()) await expect(node).toHaveCSS("opacity", "1");
    await travel(0.16);
    await expect(nodes.first()).toHaveCSS("opacity", "1");
    await expect(nodes.last()).toHaveCSS("opacity", "0");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(section).not.toHaveClass(/system-cinematic/);
    for (const node of await nodes.all()) {
      await expect(node).toHaveCSS("opacity", "1");
      await expect(node).toHaveCSS("clip-path", "none");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
});

test("service diagrams respond to scroll, reverse consistently and respect reduced motion", async ({
  page,
}) => {
  test.setTimeout(90_000);
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#hero-title")).toHaveAttribute("data-hero-ready", "true");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const rows = page.locator("#services .service-row");
    const tops = await rows.evaluateAll((elements) =>
      elements.map(
        (el) =>
          el.getBoundingClientRect().top +
          scrollY -
          new DOMMatrix(getComputedStyle(el).transform).m42,
      ),
    );
    for (let i = 0; i < tops.length; i++) {
      const row = rows.nth(i);
      const read = () =>
        row.locator("[data-service-node], [data-service-transfer]").evaluateAll((elements) =>
          elements.flatMap((el) => {
            const style = getComputedStyle(el),
              matrix = new DOMMatrix(style.transform);
            return [+style.opacity, matrix.a, matrix.d, matrix.e, matrix.f];
          }),
        );
      const travel = async (progress: number) => {
        await page.evaluate(
          (y) => {
            scrollTo({ top: y, behavior: "instant" });
            dispatchEvent(new Event("portfolio:scroll-restored"));
          },
          tops[i] - 900 * 0.82 + 900 * 0.74 * progress,
        );
        await page.waitForTimeout(850);
      };
      await travel(0.2);
      const opening = await read();
      await travel(1);
      const completed = await read();
      expect(completed.some((value, index) => Math.abs(value - opening[index]) > 10)).toBe(true);
      for (const node of await row.locator("[data-service-node]").all())
        await expect(node).toHaveCSS("opacity", "1");
      await expect(row.locator("h3")).toHaveCSS("opacity", "1");
      await travel(0.2);
      const reversed = await read();
      expect(
        reversed.every((value, index) => Math.abs(value - opening[index]) < 1),
        JSON.stringify({ width, diagram: i, opening, reversed }),
      ).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const node of await page.locator("[data-service-node], [data-service-transfer]").all()) {
      await expect(node).toHaveCSS("opacity", "1");
      expect(
        await node.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).isIdentity),
      ).toBe(true);
    }
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
});

test("hero editorial wipe preserves registered typography, layout and accessible fallbacks", async ({
  page,
}) => {
  test.setTimeout(60_000);
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width === 1920 ? 1080 : 900 });
    await page.goto("/");
    const heading = page.locator("#hero-title"),
      root = page.locator(".hero-text-reveal"),
      field = page.locator(".hero-reveal-field");
    await expect(heading).toHaveAttribute("data-hero-ready", "true");
    await expect(heading).toHaveAccessibleName(/GOOD LEADS\.\s*BETTER SYSTEMS\./);
    await expect(page.locator("main h1")).toHaveCount(1);
    for (const slice of await page.locator(".hero-shutter-slice").all()) {
      await expect(slice).toHaveCSS("opacity", "0");
      await expect(slice).toHaveCSS("transform", "none");
    }
    const baseline = await heading.boundingBox();
    const box = baseline!;
    for (const fraction of [0.25, 0.8, 0.35, 0.6, 0.98]) {
      await page.mouse.move(box.x + box.width * fraction, box.y + box.height * 0.5);
      await expect
        .poll(async () => +((await root.getAttribute("data-reveal-progress")) ?? 0))
        .toBeCloseTo(fraction >= 0.96 ? 1 : fraction, 2);
      const aligned = await page.locator(".hero-reveal-copy").evaluate((el) => {
        const h = document.querySelector("#hero-title")!;
        const a = el.getBoundingClientRect(),
          b = h.getBoundingClientRect();
        const sa = getComputedStyle(el),
          sb = getComputedStyle(h);
        return {
          deltas: [a.x - b.x, a.y - b.y, a.width - b.width, a.height - b.height],
          font: ["fontFamily", "fontSize", "fontWeight", "letterSpacing", "lineHeight"].every(
            (key) => sa[key as keyof CSSStyleDeclaration] === sb[key as keyof CSSStyleDeclaration],
          ),
        };
      });
      expect(aligned.deltas.every((d) => Math.abs(d) < 1)).toBe(true);
      expect(aligned.font).toBe(true);
      expect(await heading.boundingBox()).toEqual(baseline);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    }
    await expect(field).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(".hero-reveal-copy")).toHaveText(/LESS CHAOS\.MORE CONTROL\./);
    await page.mouse.move(2, 2);
    await expect(root).not.toHaveAttribute("data-reveal-active", "true");
    await expect(heading).not.toHaveAttribute("data-reveal-hover", "true");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(field).toHaveCSS("display", "none");
    await expect(page.locator(".hero-shutter-slices").first()).toHaveCSS("display", "none");
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.locator(".hero-reveal-field")).toHaveCSS("display", "none");
  await page.locator('.hero-copy a[href="/work"]').focus();
  await expect(page.locator('.hero-copy a[href="/work"]')).toBeFocused();
});
test("hero portal reveals What I Build and reverses without changing the later workflow boundary", async ({
  page,
}) => {
  test.setTimeout(90_000);
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width === 1920 ? 1080 : 900 });
    await page.goto("/");
    await expect(page.locator(".glyph-portal")).toHaveAttribute("data-gp-motion", "on");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const portal = page.locator(".glyph-portal");
    await expect(portal).toHaveAttribute("data-gp-focus", "B");
    await expect(portal.locator(".glyph-portal-poster")).toHaveText("BUILD.");
    await expect(portal.locator("#services")).toHaveCount(1);
    await expect(portal.locator(".workflow-section")).toHaveCount(0);
    const bounds = await portal.evaluate((el) => {
      const stage = el.querySelector<HTMLElement>("[data-gp-stage]")!;
      const spacer = stage.parentElement!;
      const wheel = document.querySelector<HTMLElement>("#work")!;
      const hero = document.querySelector<HTMLElement>(".hero")!;
      return {
        start: spacer.getBoundingClientRect().top + scrollY,
        distance: parseFloat(getComputedStyle(spacer).paddingBottom),
        height: stage.clientHeight,
        heroEnd: hero.getBoundingClientRect().bottom + scrollY,
        wheelTop: wheel.getBoundingClientRect().top + scrollY,
      };
    });
    expect(bounds.distance / bounds.height).toBeCloseTo(1.8);
    expect(bounds.start).toBeGreaterThanOrEqual(bounds.heroEnd - 1);
    expect(bounds.start + bounds.distance).toBeLessThan(bounds.wheelTop);
    const travel = async (top: number) => {
      await page.evaluate((y) => {
        scrollTo({ top: y, behavior: "instant" });
        dispatchEvent(new Event("portfolio:scroll-restored"));
      }, top);
      await page.waitForTimeout(120);
    };
    await travel(bounds.start);
    const opening = await portal.locator("text").getAttribute("transform");
    for (const progress of [0.15, 0.4, 0.65, 0.85, 1, 0.85, 0.65, 0.4, 0.15, 0]) {
      await travel(bounds.start + bounds.distance * progress);
      const state = await portal.evaluate((el) => ({
        p: Number(el.getAttribute("data-gp-progress")),
        stageOpacity: Number((el.querySelector("[data-gp-stage]") as HTMLElement).style.opacity),
        clip: (el.querySelector("[data-gp-field]") as HTMLElement).style.clipPath,
        servicesTop: el.querySelector("#services")!.getBoundingClientRect().top,
        nested: !!el.querySelector("[data-gp-stage] #services"),
        overflow: document.documentElement.scrollWidth - innerWidth,
      }));
      expect(state.p).toBeCloseTo(progress, 2);
      expect(state.nested).toBe(false);
      expect(state.overflow).toBeLessThanOrEqual(1);
      if (progress === 1) {
        expect(state.stageOpacity).toBe(0);
        expect(state.clip).toBe("none");
        expect(Math.abs(state.servicesTop)).toBeLessThan(1);
        await expect(page.locator("#services h2")).toBeInViewport({ ratio: 1 });
      }
      if (progress < 0.78) expect(state.clip).toContain("url(");
    }
    expect(await portal.locator("text").getAttribute("transform")).toBe(opening);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(portal).not.toHaveAttribute("data-gp-motion", "on");
    await expect(portal.locator(".glyph-portal-poster")).toHaveCSS("opacity", "1");
    expect(await portal.locator(".pin-spacer").count()).toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.locator(".glyph-portal")).not.toHaveAttribute("data-gp-motion", "on");
  expect(await page.locator(".glyph-portal .pin-spacer").count()).toBe(0);
});

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
