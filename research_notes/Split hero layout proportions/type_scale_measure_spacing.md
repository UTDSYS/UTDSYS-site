# Typographic proportions for a large-wordmark landing hero: type scale, measure, leading, whitespace, minimums

Context assumed: 1440×900 desktop / 390×844 mobile; right column has a 20px eyebrow, a ~120px two-line wordmark (lh 0.9, tracking −0.04em), a ~20px lede of about 70 characters wrapping to 2 lines, two link items (18px title + 15px description) and two pill CTAs. Site tokens (from `app/globals.css`): navy `#1b2a4a`, ink `#0e1830`, offwhite `#f7f8fa`, signal `#2d5bff`.

## 1. Modular type scales: recommended ratios, display-to-body relationships, and the evidence behind them

### Takeaway
Modular scales come from **convention and craft** (Bringhurst, then Tim Brown). I found **no empirical study** showing that a consistent ratio improves readability or perceived quality. The closest research, on golden-ratio preference, finds group preferences weak or absent. Major design systems don't use one clean ratio; they use hand-tuned steps. A ~120px wordmark over 20px text is 6× the lede size. That is well above Material's largest display/body ratio (about 3.6×) but within the range Tim Brown used in his own worked example (about 10.5×).

### Cited Findings
- Bringhurst is the source of the idea that "A modular scale, like a musical scale, is a prearranged set of harmonious proportions." Tim Brown builds on it. He starts from a readable body size (18px) plus a second "important number" (a 190px headline), then multiplies and divides by the golden ratio 1:1.618 to generate the other sizes. — [Tim Brown, "More Meaningful Typography", A List Apart](https://alistapart.com/article/more-meaningful-typography/)
- Brown justifies his ratio choice on **cultural and historical grounds** (the typeface's Renaissance heritage), not on test results. He also says scales are tools, not dogma: deviate when your judgement says to. — [A List Apart](https://alistapart.com/article/more-meaningful-typography/)
- In Brown's own example the headline is 190/18 ≈ **10.6× body**. — [A List Apart](https://alistapart.com/article/more-meaningful-typography/)
- The Material Design 3 (2021) type scale is **not a single geometric ratio**. Sizes are 57/45/36 (display), 32/28/24 (headline), 22/16/14 (title), 16/14/12 (body), 14/12/11 (label). Line heights run 64/52/44/40/36/32/28/24/20/24/20/16. Display Large has −0.25 tracking; body styles have positive tracking (+0.5 for bodyLarge). Display Large / Body Large = 57/16 ≈ **3.6×**. Consecutive display steps are about 1.27 and 1.25 apart. — [Flutter TextTheme docs (M3 2021 spec)](https://api.flutter.dev/flutter/material/TextTheme-class.html)
- Material's display line-height ratio is about 64/57 = 1.12 and its body ratio is 24/16 = 1.5. Leading tightens as size grows. — [Flutter TextTheme docs](https://api.flutter.dev/flutter/material/TextTheme-class.html)
- Golden-ratio aesthetics: McManus (1980) and McManus et al. (2010) used paired comparisons. They found the **population preference for golden-section rectangles is weak and may not exist under bias-free methods**. Individual preferences are strong and stable but vary widely between people. — [Frontiers in Human Neuroscience 2016 (PMC4937063)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4937063)
- A search for empirical work specifically on modular type scales found nothing; only general "harmony preference" research (Palmer & Griscom 2013). That work found preference for harmony correlates across color, shape, spatial and music domains, and **decreases with art/music training**. — [Palmer & Griscom 2013](https://palmerlab.berkeley.edu/pdf/PalmerGriscom2013.pdf)

### Inferences
- With a 20px base, these ratios reach about 120px at these powers (my arithmetic):
  - major third 1.25: 20×1.25⁸ ≈ 119 (8 steps)
  - perfect fourth 1.333: 20×1.333⁶ ≈ 112 (6 steps)
  - perfect fifth 1.5: 20×1.5⁴ ≈ 101; the next step is 152
  - golden 1.618: 20×1.618⁴ ≈ 137; 1.618³ ≈ 85

  So 120px sits on a 1.25 scale from 20, and roughly on a 1.333 scale (√ step). Any choice here can be justified by convention rather than evidence.
- In a hero, the wordmark-to-lede ratio drives hierarchy more than scale consistency does. A 6× jump puts the wordmark in clearly display/poster territory. Intermediate steps (eyebrow 20, link title 18, description 15) should stay visibly distinct from each other. On a 1.2 to 1.25 scale, 20 → 16 → 13 would be the conventional steps. 20/18/15 gives ratios of about 1.11 and 1.2, so the eyebrow and the link titles are close in size and will need weight or color to tell them apart.
- On 390px mobile, a 7-letter extra-bold word at −0.04em takes roughly 3.8–4.2em (an estimate, not measured). So "Systems" at 120px won't fit in 358px (390 minus 16px gutters). It caps out around 85–90px, which is about 4.5× a 20px lede or 5.5× a 16px lede.

### Gaps
- I could not retrieve Apple HIG type sizes; the page renders client-side. Commonly cited iOS values (Large Title 34pt, Body 17pt, a ratio of 2×) remain **unverified here**.
- I found no study on "display size as a multiple of body size". The "4–8× body" heuristic appears to be convention with no traceable source.
- type-scale.com's ratio list was not fetched. The named ratios (1.067 minor second up to 1.618 golden) are widely reproduced but unverified here.

## 2. Line length (measure): empirical evidence vs convention, and whether a 1–2 line lede follows the same rules

### Takeaway
The research consistently finds two things:
- On screen, **longer lines (up to about 95–100 cpl) are read as fast or faster**, with no comprehension cost.
- **People prefer moderate lines** (about 45–75 cpl, or a 4–5 inch line).

The 45–75 / 66 "ideal" figure is a print convention (Bringhurst). WCAG's 80-character cap is an accessibility requirement (AAA). Line-length studies all use multi-paragraph prose. A 70-character lede that wraps once is barely covered by them, so its measure is chiefly an aesthetic and scannability choice.

### Cited Findings
- Bringhurst: "Anything from 45 to 75 characters is widely regarded as satisfactory for a single-column serifed text page. The 66-character line is widely regarded as ideal. For multiple column work, a better average is 40 to 50 characters." — [The Elements of Typographic Style Applied to the Web](http://webtypography.net/2.1.2)
- Butterick recommends **45–90 characters per line including spaces**, or "two and three alphabets on a line". — [Practical Typography: Line length](https://practicaltypography.com/line-length.html)
- Baymard recommends **50–75 characters** for body text, citing Emil Ruder's 50–60. Its rationale is user perception: long lines feel "intimidating". This comes from qualitative usability testing, not controlled timing studies. — [Baymard Institute](https://baymard.com/blog/line-length-readability)
- WCAG 2.2 SC 1.4.8 Visual Presentation (**Level AAA**) requires a mechanism so that width is **no more than 80 characters or glyphs** (40 for CJK). Its stated rationale is that readers with reading disabilities lose their place on long lines. — [W3C Understanding 1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
- Dyson & Kipping (1998), 12pt: reading rate rose with line length (4 inches slowest, 7.3 inches fastest), yet **users preferred the 4-inch line** and the 3-column layout. — [Human Factors International newsletter](https://humanfactors.com/newsletters/optimal_line_length.html)
- Dyson & Haselgrove (2001): a 4-inch line was read faster than a 1.7-inch line. Secondary summaries cite **55 cpl** as supporting good speed and comprehension, and 100 cpl as fastest. Accounts conflict here, so treat the specific "55 cpl optimal" figure with caution. — [HFI](https://humanfactors.com/newsletters/optimal_line_length.html); [Dyson & Haselgrove summary search, O'Reilly "100 Things" ch.18](https://oreilly.com/library/view/100-things-every/9780132658638/ch18.html)
- Bernard, Fernandez & Hull (2002) tested 9.6, 5.7 and 3.3 inch lines and found **no reliable differences in reading speed**. Adults preferred the two shorter lengths. — [HFI](https://humanfactors.com/newsletters/optimal_line_length.html)
- Youngman & Scharff (1999): an 8-inch line was fastest compared with 4 and 6 inches, and users preferred 4 inches. — [HFI](https://humanfactors.com/newsletters/optimal_line_length.html)
- Shaikh & Chaparro (2004/2005), 20 students reading news at 35/55/75/95 cpl: **95 cpl was read fastest**, and line length had **no effect on comprehension**. — [ERAU portfolio](https://portfolio.erau.edu/en/publications/the-effects-of-line-length-on-reading-performance-of-online-news-/); [UX Movement summary](https://uxmovement.com/content/how-margins-and-line-lengths-affect-readability/)
- Beymer, Russell & Orton (BCS HCI 2008, IBM Almaden) eye-tracked the same text at 9-inch vs 5-inch widths. Secondary reports say readers read faster and retained more with **narrow** paragraphs. This **contradicts** the Shaikh/Dyson speed results. I could not access the primary PDF (403), so the details are unverified. — [IBM Research listing](https://researcher.watson.ibm.com/publications/the-long-and-the-short-of-learning); [TD magazine](https://td.org/content/td-magazine/the-long-and-the-short-of-learning)
- Nanavati & Bias (2005) literature review: "line length should not exceed about 70 characters per line". Both very short and very long lines disrupt eye-movement patterns. — [Visible Language 39(2)](https://journals.uc.edu/index.php/vl/article/view/5765)

### Inferences
- **Evidence:** very short lines (under about 35 cpl, or 2.5 inches or less) reliably slow reading. Beyond that, speed is flat or rises with length up to about 95–100 cpl.
- **Convention and preference:** 45–75 cpl. Preference is itself a legitimate goal on a marketing hero, so a ~70-character measure is defensible on preference grounds.
- A 2-line lede doesn't involve sustained return sweeps, so the "losing your place" rationale barely applies. What matters more:
  - **A balanced break**: avoid a one-word widow on line 2. `text-wrap: balance` or a deliberate max-width helps.
  - **A lede width that relates to the wordmark's width**, so the column reads as one block.
- Rough estimate: a 20px humanist sans averages about 0.5em per character, so 70 characters ≈ 700px. Capping the lede at about 30–36ch (≈ 600–720px) gives a 2-line wrap of ~35 characters per line. That sits at the low end of the research range, but for 2 lines that is fine.

### Gaps
- I didn't fetch NN/g's line-length article, so their specific position isn't captured.
- There is no research on line length for 1–2 line display/lede copy specifically.

## 3. Leading and tracking: display vs body, and WCAG spacing

### Takeaway
Body leading of 1.2–1.5 is supported by convention (Butterick 120–145%) and design systems (Material 1.5 for body). WCAG asks for 1.5 at AAA, and at AA requires layouts to *survive* user overrides to 1.5. Display type conventionally gets tighter leading (Material ≈ 1.1; posters often 0.85–1.0) and negative tracking. Empirically, leading had **no measurable effect on reading performance** in Chaparro et al. (2004), only on preference.

### Cited Findings
- Butterick: "For most text, the optimal line spacing is between 120% and 145% of the point size." — [Practical Typography: Line spacing](https://practicaltypography.com/line-spacing.html)
- WCAG 1.4.8 (AAA): line spacing at least 1.5 within paragraphs, and paragraph spacing at least 1.5× the line spacing. — [W3C Understanding 1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
- WCAG 1.4.12 Text Spacing (**AA**): there must be no loss of content or function when a user sets:
  - line height to 1.5× the font size
  - paragraph spacing to 2×
  - letter spacing to 0.12×
  - word spacing to 0.16×

  These are override tolerances, not values authors must use. — [W3C Understanding 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- Material 3: display line height ≈ 1.12 (57/64) with −0.25px tracking at Display Large. Body is 1.5 (16/24) with +0.5px tracking. This codifies the convention that tracking and leading fall as size rises. — [Flutter TextTheme (M3)](https://api.flutter.dev/flutter/material/TextTheme-class.html)
- Chaparro et al. (2004): leading "was not shown to impact reading performance but did influence overall user preference". — [ERAU portfolio](https://portfolio.erau.edu/en/publications/reading-online-text-a-comparison-of-four-white-space-layouts/)

### Inferences
- A wordmark at lh 0.9 / −0.04em is standard display practice. Material's −0.25px at 57px is only about −0.004em, so −0.04em is far tighter than system defaults. That suits an extra-bold geometric wordmark, but check that descender/ascender collisions don't occur between "Decision" and "Systems". At 0.9, the descender-free lowercase helps.
- Under the 1.4.12 override (letter-spacing +0.12em, line-height 1.5), a fixed-height one-screen hero with `overflow: hidden` could clip the lede or links. That is an AA failure risk. Avoid fixed heights on text containers.
- The lede at 20px should use about 1.4–1.5 leading; the 15px descriptions about 1.45–1.6.

### Gaps
- I found no empirical studies on optimal leading or tracking for display sizes. Values come from design practice.

## 4. Whitespace, margins, vertical rhythm and spacing systems

### Takeaway
The one solid empirical finding is that **margins around text improve reading speed and comprehension and raise satisfaction** (Chaparro et al., 2004). The often-quoted "white space increases comprehension by 20% (Lin 2004)" appears to be a **miscitation**: Lin's 2004 paper studied older adults' retention across presentation media and text topology. Baseline grids, 4/8pt systems and spacing derived from the type scale are conventions for consistency. I found no evidence that they affect comprehension.

### Cited Findings
- Chaparro, Baker, Shaikh, Hull & Brady (2004, Usability News, Wichita State SURL) manipulated margins and leading to make four white-space conditions:
  - Text **with margins** gave better reading speed and comprehension than text without margins.
  - Participants were more satisfied with margins.
  - Leading affected only preference.

  — [ERAU portfolio](https://portfolio.erau.edu/en/publications/reading-online-text-a-comparison-of-four-white-space-layouts/); [Chaparro bepress](https://works.bepress.com/barbara-chaparro/115)
- UX Movement's summary of the Wichita work also reports **lower eyestrain** with margins. — [UX Movement](https://uxmovement.com/content/how-margins-and-line-lengths-affect-readability/)
- Lin's 2004 paper ("Evaluating older adults' retention in hypertext perusal…", *Computers in Human Behavior*) tested 24 older adults on animated graphs, static pictures and text across hierarchical vs referential topologies. It is **not a white-space study**, which flags the popular "20% comprehension" claim as unreliable. — [datalearner record of the paper](https://www.datalearner.com/academic/journal-papers/0747-5632/volumes-and-issues/83/paper-detail/71627)
- Tim Brown recommends deriving all measurements, not just font sizes, from the same scale for "resonant" proportions. This is a craft argument. — [A List Apart](https://alistapart.com/article/more-meaningful-typography/)

### Inferences
- In practice:
  - Snap spacing to a 4/8px grid for consistency.
  - Size gaps relative to the elements they separate. For example: eyebrow → wordmark gap ≈ 0.2–0.3× the wordmark size (24–32px); wordmark → lede ≈ 1.5–2× the lede size (32–40px); lede → links → CTAs on a consistent 24/32/40 rhythm.
  - Proximity (Gestalt) matters more than any ratio. The gap between groups should clearly exceed the gap within a group, roughly ≥ 2×.
- Outer margins: I found no research on margin as a share of viewport. Common practice is about 4–8% of width on desktop (≈ 56–112px at 1440) and a 16–24px gutter on mobile (the artifact contract here specifies 16px).

### Gaps
- No empirical source on baseline grids, 4/8pt systems, or viewport-percentage margins.
- I did not retrieve Material's 8dp grid page or Apple's layout margins.

## 5. Minimum sizes and contrast (grey secondary text, mobile body size)

### Takeaway
WCAG AA requires 4.5:1 for normal text and 3:1 for large text (≥ 24px regular or ≥ 18.67px bold). With the site's tokens on `#f7f8fa`:
- **Navy `#1b2a4a` at 65% opacity is exactly ~4.54:1**, a borderline AA pass.
- **At 60% it fails (3.94:1)** for 15–20px regular text.
- **Ink `#0e1830` passes at 60% (4.54)** and comfortably at 65% (5.39).

I did not find WCAG setting a minimum font size. The 16px mobile body size is a convention (iOS Safari zooms into inputs below 16px; Material bodyLarge = 16).

### Cited Findings
- WCAG 1.4.3 (AA): 4.5:1 for normal text and 3:1 for large text. Large means 18pt (≈ 24px) or 14pt bold (≈ 18.5px), with 1pt = 1.333px. Logotypes are exempt. — [W3C Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- The Understanding doc doesn't address alpha directly. Contrast is evaluated on the rendered (composited) colour. — [W3C Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- The Material 3 body size is 16 (bodyLarge) / 14 (bodyMedium). — [Flutter TextTheme](https://api.flutter.dev/flutter/material/TextTheme-class.html)
- Computed by me with the WCAG relative-luminance formula, alpha-composited onto `#f7f8fa`:

  | Colour | 75% | 70% | 65% | 60% | 55% |
  |---|---|---|---|---|---|
  | navy `#1b2a4a` (100% = 13.38:1) | 6.13 | 5.27 | 4.54 | 3.94 | 3.40 |
  | ink `#0e1830` (100% = 16.58:1) | 7.60 | 6.39 | 5.39 | 4.54 | 3.88 |

  Signal `#2d5bff` on offwhite = 4.88:1.

  Method: [WCAG 1.4.3 definitions](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### Inferences
- For the 15px link descriptions and 20px lede (both "normal" text unless bold ≥ 18.67px), use navy at ≥ 0.70 opacity, or ink at ≥ 0.62. The 65% navy setting is at the threshold, and subpixel or antialiasing on thin humanist strokes makes it look lighter than the ratio implies.
- A semibold 20px eyebrow (≥ 18.67px bold) counts as large text, so 3:1 applies. Navy at 55% (3.40) would technically pass.
- The wordmark, as a logotype, is exempt from contrast rules, but full-strength navy or ink gives 13–16:1 anyway.
- The ~4.9:1 signal blue is fine for text links and CTA labels on offwhite. White text on signal blue is the same 4.9:1 pair (by symmetry, roughly).

### Gaps
- WCAG has no minimum font size criterion. The 16px mobile body figure comes from convention and platform behaviour (iOS input zoom), not a cited research threshold. I did not retrieve a primary source for the iOS zoom behaviour.
- APCA (WCAG 3 draft) values were not computed. APCA would likely score thin 15px grey text more harshly than WCAG 2.
