# Mobile proportions for a stacked split hero (390×844)

Scope: how much of the first mobile screen should go to the brand/crest panel vs headline + CTAs when a desktop split hero (dark navy crest panel left, text right) stacks to one column. Current mobile build: fixed nav ~66px, crest panel ~350px (crest ~220px), then eyebrow, two-line wordmark at ~64–70px, lede, two links, two CTAs.

Evidence labels used below: **[EMPIRICAL]** = measured study; **[STANDARD]** = normative spec or platform guideline; **[CONVENTION]** = practitioner advice or common practice with no measured outcome; **[WEAK]** = claim found only in aggregators or secondary sources, or one that couldn't be traced to a primary source.

## 1. Mobile above-the-fold attention and scrolling behaviour

### Takeaway
On desktop, attention falls off sharply at the fold (57% of viewing time lands above it). Mobile users scroll more readily, and most will scan an entire mobile homepage. They scroll only if the first screen gives them a reason to, though, and a full-bleed image can create a "false floor" that stops them. Neither NN/g nor Google gives a clean, phone-specific "% of time on the first screen" number.

### Cited Findings
- **[EMPIRICAL] Desktop.** NN/g eye-tracking: 130,000+ fixations from 120 participants at 1920×1080. 57% of page-viewing time was above the fold and 74% in the first two screenfuls (down from 80% above the fold in 2010 at 1024×768). The top 20% of the page got >42% of viewing time and the top 40% got >65%. Within the first screenful, the top half got 65% of above-fold viewing time. "People will scroll if they have a reason to do it. Attention still lingers towards the top." — [NN/g, Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)
- **[EMPIRICAL] Older NN/g fold analysis** (57,453 fixations): the 100px just above the fold were viewed 102% more than the 100px just below it. — [NN/g, Page Fold Manifesto](https://nngroup.com/articles/page-fold-manifesto) (search snippet; not fetched in full)
- **[WEAK] Misattributed number.** Several aggregators restate the NN/g figure as "57% of time on the first *mobile* screen, 17% on the second." The NN/g primary source measured 1920×1080 desktop screens. Treat the "mobile 57%" claim as a misattribution. — compare [NN/g](https://www.nngroup.com/articles/scrolling-and-attention/) with aggregator summaries such as [wyliecomm](https://www.wyliecomm.com/2023/05/above-the-fold-statistics)
- **[EMPIRICAL] Google / Eye Square, 2011, Germany.** Lab eye-tracking with 90 participants, n≈37–50 per mobile condition. On mobile search, "First two screens are carefully checked" and "A traditional above and below the fold is missing on the mobile page." On a mobile display-network site, "through scrolling the entire mobile site is viewed," with "Strong focus on the first news block." Desktop: "content below the fold is noticed marginal[ly]." Caveats: the study is old (2011 phones), was run with ad and search stimuli, and comes from an ad-industry sponsor. — [Think with Google / Eye Square eye-tracking study PDF](https://www.thinkwithgoogle.com/_qs/documents/1424/eye-tracking-study-comparing-mobile-and-desktop_research-studies.pdf)
- **[EMPIRICAL] Baymard, large-scale mobile ecommerce usability testing.** "70% of users scrolled up and down nearly the entire mobile homepage," quickly scanning to answer "What type of site is this?" Baymard also found 42% of benchmarked mobile homepages risk setting wrong expectations. — [Baymard mobile homepage benchmark](https://baymard.com/mcommerce-usability/benchmark/mobile-page-types/homepage)
- **[EMPIRICAL, small n] False floor from a large hero.** In an NN/g usability test of Maple.com's full-screen video hero, "Six out of eight users did not realize they could scroll down this page" and couldn't find out what the company offered. NN/g recommends that "additional content peeks above the fold" when large banners or videos are used, along with "Show additional content bleeding off screen." It names large mobile ads as a particular risk for hiding content below them. — [NN/g, Illusion of Completeness](https://www.nngroup.com/articles/illusion-of-completeness/)
- **[CONVENTION]** "Use of large hero graphics and videos is the most common cause of the illusion of completeness." — [St Andrews digital comms blog](https://digitalcommunications.wp.st-andrews.ac.uk/2020/09/21/scrolling-and-the-illusion-of-completeness/) (secondary; summarises the NN/g work)
- **[EMPIRICAL] Hoober.** Users "often scroll content to bring the part they're reading to the middle of the screen if they can." — [Hoober, UXmatters 2017](https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php)

### Inferences
- Users will probably scroll past a large hero on mobile (Baymard 70%), so the first screen's job is to (a) identify the site and (b) show visibly that more follows, not to hold everything. The main risk for this design is not "nobody sees the CTAs." It is a self-contained-looking navy block plus wordmark that reads as a complete poster and creates a false floor.
- The NN/g "top half of the first screen gets ~65% of first-screen attention" pattern (desktop data) implies that whatever sits in roughly y=66–420px (nav bottom to mid-screen) gets most attention. In the current build that band is entirely crest panel.

### Gaps
- I found no recent (post-2018) primary NN/g eye-tracking figure for the percentage of viewing time on the first *phone* screenful. NN/g's mobile reading studies exist, but I couldn't locate a fold-percentage number for them.
- Baymard's detailed hero and carousel guidance is paywalled. Only the 70% scrolling stat was accessible.

## 2. Hero image height on mobile; should the headline and CTA be in the first viewport?

### Takeaway
No empirical study gives an optimal image-to-text ratio such as "≤40% image." That threshold is convention. The evidence supports a weaker rule: the first screen must state what the site is, which here means the wordmark, and show a cue that content continues. CTAs above the fold are a convention for a club landing page, not a proven requirement.

### Cited Findings
- **[CONVENTION]** A typical desktop fold shows image, headline, subhead and CTA, "while a mobile fold might only show the hero image and headline." — [omniconvert, above-the-fold design](https://www.omniconvert.com/blog/above-the-fold-design/) (practitioner blog)
- **[CONVENTION / WEAK]** "A clear, highly visible CTA placed above the fold is among the highest-impact elements on a product page according to Baymard." This comes from a vendor blog citing Baymard, and the context is product pages, not brand landing pages. — [xictron blog](https://www.xictron.com/en/blog/product-page-optimization-above-the-fold-2026/)
- **[CONVENTION]** "A split hero that stacks image-first gives half of your traffic a screen of decoration before a single word." The author argues for putting the message first. — [pravinkumar.co, split-screen hero on mobile](https://www.pravinkumar.co/blog/design-split-screen-hero-webflow-mobile-2026)
- **[EMPIRICAL]** NN/g found that users scroll "if they have a reason to." Top-placed content gets disproportionate attention. — [NN/g](https://www.nngroup.com/articles/scrolling-and-attention/)
- **[EMPIRICAL, small n]** A full-screen visual hero hid the value proposition for 6 of 8 users. — [NN/g, Illusion of Completeness](https://www.nngroup.com/articles/illusion-of-completeness/)

### Inferences (arithmetic on the current build, not sourced)
- On a nominal 390×844 layout viewport: nav 66 + panel 350 = 416px, which is about 49% of 844, before any text appears. Most of the "top-half" attention band therefore goes to the crest.
- A rough stack of the text column: eyebrow (~20px plus margin) + two-line wordmark (2 × ~70px at ~1.0 line-height ≈ 140px) + lede (~3–4 lines × ~24px ≈ 72–96px) + two links (~48px) + two CTAs (~48px each plus gap, or side by side ~48px). That is roughly 300–400px of text, plus spacing. The total is about 416 + 350–450 ≈ 770–870px, so the CTAs sit at or below 844 even on the nominal viewport.
- iOS Safari's visible area is smaller than 844 when its toolbars are showing (see section 4, small viewport `svh`). In practice the CTAs are almost certainly below the fold, and the lede may be too.
- Reasonable target, as convention not evidence: keep the crest panel to about 25–35% of the first screen (roughly 200–280px including nav overlap, crest ~140–180px). The eyebrow and full wordmark then land in the upper half, and the lede plus at least the top edge of the CTAs land in the first `svh`, which also serves as a "content continues" cue. If the panel must stay large, letting the wordmark visibly start in the first screen is the minimum needed to avoid a false floor.

### Gaps
- I found no A/B or eye-tracking study that compares hero image heights (for example 30% vs 50% vs 100% of the viewport) on mobile. The "image >40–50% of the screen pushes the headline below the fold" rule appears to be practitioner convention. I found no primary source for a specific percentage threshold.

## 3. Thumb zone, reachability and CTA placement

### Takeaway
Hoober's field data shows grips vary and change constantly. His later work found that people prefer, and are most accurate at, the center of the screen, and he calls the popular "thumb zone heat-map" overstated. For CTAs, that argues for full-width or large buttons in the middle band of the screen rather than squeezing them to the bottom edge. CTAs low in the first screen are fine, but bottom-edge placement isn't required.

### Cited Findings
- **[EMPIRICAL] Hoober 2013 field study.** 1,333 observations (780 touching the screen) in streets, airports, buses and cafés. Grips: one-handed 49%, cradled 36%, two-handed 15%. One-handed use: right thumb 67%, left thumb 33%. Cradled: thumb 72%, finger 28%. Two-handed: 90% portrait. "Users change the way they're holding their phone very often—sometimes every few seconds." — [Hoober, UXmatters 2013](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php)
- **[EMPIRICAL / WEAK]** "75% of all mobile interactions are thumb-driven." This is widely attributed to Hoober and appears in secondary summaries, but I didn't verify it on the primary page. — [mobiforge summary](https://mobiforge.com/design-development/designing-touch-thumb-and-finger-sized-design)
- **[EMPIRICAL] Hoober 2014 centering study** (31 participants, ~100 hours of coding). Taps concentrate in the "center two-thirds of the screen" across phones and tablets. "People are more accurate at touching the middle of a mobile device's screen," and they slow down for corner and edge targets. On full-content pages, people scroll from the far right side. — [Hoober, UXmatters 2014](https://www.uxmatters.com/mt/archives/2014/09/insights-on-switching-centering-and-gestures-for-touchscreens.php)
- **[EMPIRICAL] Hoober 2017.** Accuracy varies by region: targets can be ~7mm in the center but need ~12mm in corners (sized to capture 95% of taps). The popular thumb-sweep chart is "incorrect," because the Back button "is usually the most-used button on the screen, even when it's in the upper-right corner." — [Hoober, UXmatters 2017](https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php)
- **[EMPIRICAL via NN/g]** Minimum touch target of 1cm × 1cm (Parhi, Karlson and Bederson). MIT Touch Lab measured fingertips at 1.6–2cm wide. — [NN/g, Touch Target Size](https://www.nngroup.com/articles/touch-target-size/)

### Inferences
- On a stacked hero, the "thumb zone" argument for pushing CTAs to the screen bottom is weak. Centered or full-width CTAs that users can scroll into the middle of the screen fit Hoober's data better.
- Making the two CTAs full-width and stacked (≥48px tall) at 390px gives large, center-spanning targets.
- The hamburger in the top corner is a corner target, so it should be at least 44–48px with generous padding (Hoober's ~12mm corner figure).

### Gaps
- I found no study measuring conversion for CTAs in the lower vs upper part of the first mobile screen on a landing page.

## 4. Touch targets, minimum text, safe areas, viewport units

### Takeaway
Use ≥44px (Apple) or 48px (Material) targets; WCAG 2.2 AA's 24px is a floor, not a goal. Body text and inputs should be ≥16px, because iOS zooms form fields below 16px. For a hero sized to the screen, `svh` is the stable choice; `dvh` resizes as Safari's toolbar moves.

### Cited Findings
- **[STANDARD] WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA.** "At least 24 by 24 CSS pixels." Smaller targets pass only if a 24px circle centered on each doesn't intersect another target. Inline targets in sentences are exempt. W3C advises that "for important links/controls, consider aiming for the stricter 2.5.5 Target Size (Enhanced)" (AAA, 44×44 CSS px). — [W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- **[STANDARD] Apple HIG** minimum hit target is 44×44pt. **Material Design** is 48×48dp, roughly 9–12mm physical. — [frontendchecklist, touch targets](https://frontendchecklist.io/rules/accessibility/touch-targets) (secondary; values match the well-known HIG and M3 figures, but I didn't fetch the primary pages)
- **[EMPIRICAL]** NN/g gives 1cm × 1cm as the minimum. — [NN/g](https://www.nngroup.com/articles/touch-target-size/)
- **[PLATFORM BEHAVIOUR]** iOS Safari automatically zooms on focus into form fields with font-size <16px. The fix is ≥16px. Disabling zoom with `maximum-scale=1` or `user-scalable=no` harms accessibility. — [Rick Strahl, preventing iOS textbox auto-zoom](https://weblog.west-wind.com/posts/2023/Apr/17/Preventing-iOS-Textbox-Auto-Zooming-and-ViewPort-Sizing)
- **[STANDARD] Viewport units** (supported in Safari 15.4, Chrome/Edge 108, Firefox 101, all 2022):
  - `svh` = 1% of the small viewport, with UI expanded.
  - `lvh` = 1% of the large viewport, with UI retracted.
  - `dvh` switches between the two.
  - "The values for the dynamic viewport do not update at 60fps... updating is throttled as the UA UI expands or retracts."
  - The virtual keyboard doesn't affect these units by default.
  - Source: [web.dev, The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units)

### Inferences
- If the panel or hero is sized relative to the screen, size it in `svh`, for example `min(…, 30svh)`. That way the headline and CTAs stay visible when Safari's toolbars are showing, and nothing jumps as they collapse. Sizing to `100vh` on iOS equals the *large* viewport, so content falls under the toolbar.
- A fixed 66px nav subtracts directly from the first screen. If the page uses `viewport-fit=cover`, the nav needs `padding-top: env(safe-area-inset-top)`. I didn't find a primary source for this point; it is standard WebKit practice.

### Gaps
- I didn't fetch the primary Apple HIG, Material 3 or WebKit safe-area pages; the values are from secondary sources. I found no primary source for the exact iPhone 12–15 Safari visible height with toolbars expanded.

## 5. Responsive typography for large display headings; avoiding overflow of "Decision" at 390px

### Takeaway
Use `clamp()` with a rem-based minimum and a vw-plus-rem preferred value, so the size scales with the screen but text zoom still works. At 390px with 16px gutters there is about 358px of measure. An 8-letter word at ~64–70px usually fits, but only just, depending on the typeface's letter width. Test it, and set the clamp maximum for mobile from the measured width of "Decision."

### Cited Findings
- **[STANDARD / EXPERT] Accessibility risk.** Sizing text purely or mostly in `vw`, or capping it with `clamp()`, can stop users scaling text to 200%. That fails WCAG 1.4.4 Resize Text (AA). Roselli shows text *shrinking* while zooming at an 800px viewport. — [Adrian Roselli, Responsive Type and Zoom](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html); [Smashing, Fluid Typography and zoom](https://smashingmagazine.com/2022/12/fluid-typography-predict-problem-users-zoom-in/)
- **[EXPERT]** The mitigation is to combine rem and vw in the preferred value, for example `clamp(3rem, 1.5rem + 8vw, 7rem)`, and keep the max/min ratio ≤2.5 so 200% zoom is still reachable. — [Smashing, Addressing Accessibility Concerns With Fluid Type](https://smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type) (search result; specific ratio not verified in a fetch, so treat as [WEAK])

### Inferences (unsourced arithmetic)
- Available measure: 390 − 2×16 = 358px. "Decision" is 8 glyphs. Average advance width for display sans and serifs is about 0.5–0.6em, giving roughly 4.0–4.8em.
  - At 64px: ≈256–307px, which fits.
  - At 70px: ≈280–336px, which fits with a small margin.
  - At ~75–80px or above, a wide or heavy face overflows.
  - Bold, wide, or positive letter-spacing faces move these numbers up.
- Display-size to viewport-width ratio: 70/390 ≈ 18vw. That is already aggressive. A common ceiling is a mobile display size around 14–18vw for one-word lines. This is convention; I found no source for a canonical ratio.
- Add `overflow-wrap: anywhere` or `hyphens: auto` only as a safety net. Hyphenating a wordmark looks broken, so size it to fit instead. Test at 320px (iPhone SE first gen / zoomed display mode), where measure is about 288px, so "Decision" at 70px likely overflows. The clamp minimum should therefore be driven by vw.

### Gaps
- I found no empirical study of display-heading size vs comprehension or engagement on mobile. All display-size guidance is convention or typographic craft.

## 6. Stacking order: image first vs text first

### Takeaway
Practitioner consensus favours text first, or at least the headline first, on mobile, and source order should match visual order for accessibility. I found no A/B or eye-tracking study comparing image-first and text-first stacked heroes.

### Cited Findings
- **[CONVENTION]** "Put the message first and the picture second, always." Image-first stacking "buries your message." — [pravinkumar.co](https://www.pravinkumar.co/blog/design-split-screen-hero-webflow-mobile-2026)
- **[STANDARD-ADJACENT]** Reordering with CSS `order` "leaves the reading order and the tab order unchanged." Write markup in reading order and let the grid place it. This relates to WCAG 1.3.2 Meaningful Sequence and 2.4.3 Focus Order. — same source; see also [DEV, staggered layout stacking problem](https://dev.to/marklchaves/the-staggered-layout-problem-mobile-stacking-order-3gnp)
- **[CONVENTION]** Some design systems and templates still stack image above text "so the visual still leads." — [21st.dev, split-screen layout components](https://21st.dev/blog/split-screen-layout-components); [shadcnblocks Hero 2](https://www.shadcnblocks.com/block/hero2)
- **[EMPIRICAL, indirect]** Top-of-page content gets most attention (NN/g), and mobile users scan to answer "what type of site is this?" (Baymard 70%). Whatever sits first should identify the site. — [NN/g](https://www.nngroup.com/articles/scrolling-and-attention/); [Baymard](https://baymard.com/mcommerce-usability/benchmark/mobile-page-types/homepage)

### Inferences
- A crest/seal is itself a brand identifier, unlike a decorative photo, so image-first is more defensible here than the "decoration first" critique implies. Only a shorter panel is needed, so the wordmark appears in the top half.
- Middle-ground patterns:
  - A compact crest band (~180–260px) above the text.
  - The crest scaled down and placed inline above the eyebrow, inside the text column.
  - The wordmark overlaid on the bottom of the navy panel.

### Gaps
- I found no controlled study (A/B, eye-tracking or conversion) comparing image-first and text-first stacking of split heroes on mobile.
