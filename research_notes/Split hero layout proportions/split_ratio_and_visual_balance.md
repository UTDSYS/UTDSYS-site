# Split-ratio and visual balance in a dark-panel / light-content split hero

Context being evaluated: 1440x900 desktop, left full-height navy (#0a1838) panel with a ~400px circular crest; right light (#f7f8fa) column with eyebrow, ~120px bold two-line wordmark, ~20px lede, two links, two CTAs; fixed full-width top nav. Question: what panel:content split.

Reference pixel widths at 1440px (arithmetic, not sourced): 1/3 = 480px; 38.2% (golden minor) = 550px; 5/12 = 600px; 1/2 = 720px. A 400px crest leaves 40px side margins at 480px, ~75px at 550px, 100px at 600px, 160px at 720px.

## 1. Empirical research on preference for rectangle / division proportions (golden ratio)

### Takeaway
A century of experiments does not support a robust, universal population preference for the golden ratio (1.618 / 61.8:38.2). The best evidence (paired comparisons, McManus 1980 and its 2010 replication) shows weak population-level preferences but strong, stable, highly idiosyncratic individual preferences; implicit-measure work (Stieger & Swami 2015) finds no automatic golden-ratio preference. A 38.2/61.8 split is a defensible convention, not an evidence-backed optimum.

### Cited Findings
- Fechner (1876) had observers pick the most preferred of 10 rectangles varying in aspect ratio; the golden rectangle was most chosen. — [Spehar, Walker & Taylor 2016, Frontiers in Human Neuroscience](https://www.frontiersin.org/articles/10.3389/fnhum.2016.00350/full)
- Fechner's method has been criticized on methodological grounds (McManus 1980; Russell 2000): only 10 rectangles, no controls for order/presentation; the golden rectangle sat in a position favoured by choice-from-array methods. — [Spehar et al. 2016](https://www.frontiersin.org/articles/10.3389/fnhum.2016.00350/full); [Flip Phillips, "Fechner's Aesthetics Revisited"](https://flipphillips.com/bloggery/fechners-aesthetics-revisited/)
- McManus (1980), using paired comparisons (considered the methodologically strongest option), found population preferences weak but individual preference functions "strong and stable over time but highly variable between different participants"; McManus et al. (2010) replicated this. Höfel & Jacobsen (2003) and Höge (1995/1997) are cited as confirming that "the universal preference for the golden ratio is weak." — [Spehar et al. 2016](https://www.frontiersin.org/articles/10.3389/fnhum.2016.00350/full)
- Summary from the literature: "a century of subsequent experimental work suggests it has little normative role in rectangle preferences." — [McManus et al. line of work as summarized in search of PMC4937063](https://pmc.ncbi.nlm.nih.gov/articles/PMC4937063) (page blocked by captcha during this session; quote taken from search snippet)
- Green (1995), "All That Glitters: A Review of Psychological Research on the Aesthetics of the Golden Section," Perception 24:937-968: concludes there "seem to be real psychological effects associated with the golden section, but they are relatively sensitive to careless methodological practices." I.e. the most-cited review is cautious, not dismissive. — [Green 1995 (York U. copy)](https://www.yorku.ca/christo/papers/goldrev3.htm); [Perception DOI](https://journals.sagepub.com/doi/10.1068/p240937)
- Stieger & Swami (2015), Psychology of Aesthetics, Creativity, and the Arts 9(1):91-100: three studies with real art images, foreground object placed at golden ratio vs centre (Studies 1-2) or 3/4 position (Study 3), measured with explicit ratings and the Implicit Association Test. Neither explicit nor implicit evaluations showed a clear preference for the golden ratio; any preference "may, rather, be driven by art expertise." — [Westminster Research record](https://westminsterresearch.westminster.ac.uk/item/8yvwz/time-to-let-go-no-automatic-aesthetic-preference-for-the-golden-ratio); [Konstanz iScience summary](https://iscience.uni-konstanz.de/2015/02/27/stieger-s-swami-v-2015-time-to-let-go-no-automatic-aesthetic-preference-for-the-golden-ratio-in-art-pictures-psychology-of-aesthetics-creativity-and-the-arts-9-91-100/)
- Analogous individual-differences structure appears in fractal preference: subgroups ~50% intermediate, ~20% smooth, ~20% sharp, ~10% other, stable across image types — reinforcing that "one optimal proportion" framing is the wrong model of aesthetic preference. — [Spehar et al. 2016](https://www.frontiersin.org/articles/10.3389/fnhum.2016.00350/full)

### Inferences
- Treat 38.2/61.8 as one reasonable asymmetric split among several (1/3, 5/12), chosen for how the content fits, not because viewers will prefer it. Any claim that phi splits "convert better" or are "proven most pleasing" is popular overstatement.
- Rectangle-preference studies concern the shape of a whole isolated rectangle; a split hero is the division of a field into two differently-coloured regions with content. The literature on whole rectangles does not transfer directly to a division ratio.
- Because individual preferences are strong but idiosyncratic, the design team's own reactions to a ratio are real but not generalizable; small differences (e.g. 36% vs 40%) are unlikely to matter to visitors.

### Gaps
- Could not access full text of Green 1995 or McManus 1980 for specific numbers (percent choosing golden rectangle in Fechner, n, preferred ratios). Commonly repeated figure that ~35% of Fechner's participants chose the golden rectangle was not verified here.
- Found no empirical study on preferred division ratio of a screen/web layout into two colored panels.
- Benjafield / line-bisection studies (preferred division of a line) not retrieved.

## 2. Layout and grid conventions for asymmetric two-column compositions

### Takeaway
Grid authorities (Müller-Brockmann, Swiss style) favour asymmetric balance on modular grids; book-page canons (Van de Graaf, Tschichold) and Bringhurst use simple geometric ratios like 2:3. These are tradition and craft reasoning, not experimental findings. Web 12-column ratios (4:8 = 1:2, 5:7, 6:6) are engineering conventions that make such splits easy to implement.

### Cited Findings
- Müller-Brockmann's "Grid Systems in Graphic Design" (1961) is the definitive reference; it gives systems from 8 to 32 grid fields. The International Typographic Style is characterized by "asymmetrically balanced, rigid typographic grids" and sans-serif type. — [Made Good Designs](https://madegooddesigns.com/grid-systems/); [designyourway.net](https://www.designyourway.net/blog/grid-systems-in-graphic-design/)
- Column grids "divide the page into vertical columns of equal or varying widths." — [Made Good Designs](https://madegooddesigns.com/grid-systems/)
- Van de Graaf canon, popularized by Tschichold in The Form of the Book: on a 2:3 page, margins are 2:3:4:6 (inner:top:outer:bottom), margins of 1/9 and 2/9 of page size; 2:3 is the most commonly used page proportion. These canons are geometric constructions, not strictly golden-ratio. — [Wikipedia, Canons of page construction](https://en.wikipedia.org/wiki/Canons_of_page_construction)
- Bringhurst (Elements of Typographic Style) asserts that proportions useful for page shapes are equally useful for shaping and positioning the text block. — [Wikipedia, Canons of page construction](https://en.wikipedia.org/wiki/Canons_of_page_construction)

### Inferences
- In a 12-column grid at 1440px: 4:8 = 33.3% panel (480px), 5:7 = 41.7% (600px), 6:6 = 50%. The golden 38.2% falls between 4 and 5 columns (~4.6 columns), so it is off-grid in a 12-column system; 5:7 is the closest grid-native "near-golden" split (7/5 = 1.4, vs 1.618).
- Swiss-style practice argues for asymmetry with a dominant field: the light content side should be the larger field because it carries the reading path (eyebrow-to-CTA), while the panel holds a single emblem. This supports panel < 50%.
- Rule of thirds (a photographic composition convention) maps to a 1/3:2/3 split; it is a convention with little direct experimental support (not researched in depth here).
- None of Müller-Brockmann, Tschichold or Bringhurst justify their ratios with experiments; their authority is craft tradition and internal consistency (repeating one proportion through the system).

### Gaps
- Did not retrieve primary text from Müller-Brockmann on specific column-ratio recommendations; no source found specifically endorsing 5:7.
- Did not verify Bootstrap / Material Design grid docs this session (Bootstrap's 12-column grid and Material's responsive column grid are well known but uncited here).
- No empirical evidence found for rule of thirds in layout preference.

## 3. Practitioner/UX research guidance on split-screen layouts and hero content:image ratios

### Takeaway
There is no NN/g, Baymard, Material or Apple HIG guidance found that prescribes a split ratio for split-screen heroes. Practitioner articles discuss split screens qualitatively (dual messages, contrast, stacking on mobile). The UX evidence that matters is about attention to the first screen and first-impression speed, not proportions.

### Cited Findings
- Split-screen layouts divide the page into two side-by-side panels, each carrying a message or CTA; useful for presenting two paths; they "naturally lend themselves to responsive design," stacking vertically on small screens; without proper execution they can hurt UX. — [ProfileTree](https://profiletree.com/split-screen-layouts/); [UX Planet, Best Practices for Split Screen Design](https://uxplanet.org/best-practices-for-split-screen-design-ad8507d92e66); [InVision blog](https://www.invisionapp.com/blog/split-screen-layouts); [SitePoint](https://www.sitepoint.com/how-to-design-a-daring-but-effective-split-screen-layout/)
- NN/g "The Fold Manifesto" (2015): from 57,453 eye-tracking fixations, the 100px above the fold were viewed 102% more than the 100px just below; users spent ~57% of viewing time above the fold and 74% in the first two screenfuls (reported second-hand). — [Embryo, summarizing NN/g](https://embryo.com/blog/where-to-put-your-cta-is-above-the-fold-still-relevant/)
- Large image-filled heroes are the most common cause of a "false bottom" (users don't realize there's more below). Common hero: heading, supporting text, button, plus image or solid color; two-column variants put text one side and image/empty space on the other. — [Embryo](https://embryo.com/blog/where-to-put-your-cta-is-above-the-fold-still-relevant/)

### Inferences
- Since the hero is deliberately one screen with no scroll sections, the false-bottom concern is moot; the relevant concern is that the content side (which holds all actionable items) gets enough width and prominence. This argues against a 50/50 split where the decorative panel claims half the attention-rich first screen.
- Split-screen guidance in practice is mostly 50/50 (two equal "paths"). The present design is not a dual-path split; it is emblem + content, which is closer to an asymmetric "image + text" hero, so 50/50 conventions do not straightforwardly apply.

### Gaps
- Found no NN/g, Baymard, Material Design, or Apple HIG article that specifies split ratios or content-to-image ratios for heroes. NN/g fold data was only retrieved via a secondary source.
- No A/B test data found on split ratio and conversion.

## 4. Visual weight: balancing a large dark block against a light text area

### Takeaway
Arnheim's theory says weight depends on size, colour/value, position and regularity, and darker/more contrasting areas are commonly treated as heavier; perception studies confirm darker objects are judged heavier by sight. But experiments show Arnheim's "physics" cannot be taken literally, and computational centre-of-mass balance measures predict perceived balance and liking well (r ~ 0.8-0.9) only in simple stimuli. Practical upshot: a saturated dark field against a near-white field will read as the heavier mass per unit area, so it can be the smaller region and still hold its side; there's no evidence for a specific compensating ratio.

### Cited Findings
- Arnheim: balance is reached when forces ("visual weights") compensate; weights derive from size, shape, colour and location. In a rectangular frame, the centre has strongest attraction, then corners, main axes, diagonals; off-centre elements experience tension toward the centre. Arnheim acknowledged these factors needed verification. — [Hübner & Fillinger 2016, Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- McManus et al. (2011) operationalized "mass" as the inverse of each pixel's grey level (darker = heavier) and found centres of mass in art photographs lay closer to the axes than in controls; but with two discs of different grey level, judgments were "incompatible with a physical interpretation of balance," and they concluded Arnheim's terms "cannot be taken literally." — [Hübner & Fillinger 2016](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- Hübner & Fillinger (2016), three experiments (n = 16, 21, 23): deviation of centre of mass (DCM) correlated r = -0.822 with balance ratings (Exp 1) and -0.916 (Exp 3); Wilson & Chatterjee's APB measure r = -0.784 / -0.836; mirror symmetry only r = 0.418; homogeneity r = 0.707. For liking (Exp 2): APB r = -0.867, DCM r = -0.844, homogeneity r = 0.848. I.e. more balanced (by mass-weighted measures) = rated better, in simple abstract stimuli. — [Hübner & Fillinger 2016](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- Experts and non-experts both shift perceived centre of "mass" when compositions are disrupted, but only experts judged disrupted versions as less balanced (Locher, Stappers, Overbeeke et al.). Perceived weight of colour (esp. red, yellow) scaled with area for both trained and untrained viewers. — [Search summary; TU Delft record "The contribution of color to perceived pictorial balance"](https://research.tudelft.nl/en/publications/the-contribution-of-color-to-perceived-pictorial-balance/); [Perception p5033](https://journals.sagepub.com/doi/10.1068/p5033)
- Darker objects are judged heavier by vision alone (brightness-weight correspondence); when actually lifted, the effect reverses (white ball felt ~8 g, 6.2%, heavier than black). — [Walker et al., "The brightness-weight illusion," Lancaster eprints](https://eprints.lancs.ac.uk/id/eprint/49952/); [PMC7297857, heaviness-brightness correspondence](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7297857/)
- Irradiation illusion: a light area looks larger than an identical dark area (light scatter in the eye plus asymmetric neural responses to light vs dark). — [Wikipedia, Irradiation illusion](https://en.wikipedia.org/wiki/Irradiation_illusion); [Scientific American](https://www.scientificamerican.com/blog/illusion-chasers/the-stars-in-your-eyes)

### Inferences
- Two effects point the same way: dark fields read as heavier, and light fields read as larger. A navy panel therefore tends to look heavier and slightly narrower than its pixel width; a near-white column looks lighter and slightly wider. Under a McManus-style inverse-luminance mass model, #0a1838 (very dark) vs #f7f8fa (near white) means the panel carries almost all the "mass"; a 50/50 split would put the centre of mass well left of centre. Shrinking the panel (e.g. 1/3 to ~40%) moves the composition toward balance, and the large dark wordmark (120px bold) adds mass to the right side.
- However, McManus 2011 shows the physical model fails even with two discs, so do not compute an "exact" balancing ratio; tune by eye.
- Figure-ground: the light crest inside the dark panel will be figure on the left; the wordmark is figure on the right. Balance is between these two figures plus the dark field, not just the two fields.
- A light crest (if rendered light on navy) will appear larger than its true 400px because of irradiation; this argues for a slightly smaller crest or more panel margin than the numbers suggest.

### Gaps
- Arnheim's Art and Visual Perception primary text not retrieved; claims here are via Hübner & Fillinger's summary. The often-repeated design-textbook claim "dark elements carry more visual weight than light" is not directly tested in a layout-balance study found here (only object-weight and grey-disc studies).
- No numerical estimate of how much smaller a dark block must be to balance a light block; no source found.

## 5. Empirical studies on balance/symmetry and web page aesthetics/usability

### Takeaway
Computational layout metrics (Ngo, Teo & Byrne) formalize balance, symmetry, proportion, etc., and correlate with judged aesthetics, but largely in simple displays. Large web studies show first impressions form in 17-50ms and are driven mainly by visual complexity and prototypicality (and colorfulness), not by specific ratios. A clean two-field split with low element count is well-positioned on those factors.

### Cited Findings
- Ngo, Teo & Byrne (2003), "Modelling interface aesthetics," Information Sciences: 14 aesthetic measures (balance, equilibrium, symmetry, sequence, cohesion, unity, proportion, simplicity, density, regularity, economy, homogeneity, rhythm, order/complexity). Balance = difference in total weighting (area-based) of components on each side of the horizontal and vertical axes. Empirical study suggested the measures matter to viewers. — [Academia.edu copy](https://www.academia.edu/11749849/Modelling_interface_aesthetics); [Ngo, "A Mathematical Theory of Interface Aesthetics"](https://www.mi.sanu.ac.rs/vismath/ngo/index.html)
- Lindgaard et al. (2006), Behaviour & Information Technology: home pages flashed at 500ms vs 50ms, rated 1-100 on appeal; reliable appeal judgments formed within 50ms. — [Nature news 2006](https://www.nature.com/news/2006/060109/full/news060109-13.html)
- Tuch et al. (2012), IJHCS 70(11):794-811: Study 1, 119 real website screenshots varying in visual complexity (low/med/high) and prototypicality (low/high), shown 50/500/1000ms; Study 2 at 17/33/50ms. VC and PT affect aesthetic judgments within 17ms; low complexity + high prototypicality rated most appealing; PT's effect grows with exposure time. — [Google Research publication](https://research.google/pubs/pub38315/); [Google Research blog](https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/)
- Reinecke & Gajos (2014), CHI: 2.4 million ratings from ~40,000 participants; the colorfulness and complexity levels at which appeal peaks vary by demographics (e.g. women liked more colorful sites than men; higher education lowered preference for colorfulness; Russians preferred lower complexity). — [Harvard project page](https://eecs.harvard.edu/~kgajos/papers/2014/reinecke14visual.shtml); [PDF](https://kgajos.seas.harvard.edu/papers/reinecke14visual.pdf)

### Inferences
- The evidence base for website first impressions is about complexity, familiarity (prototypicality) and colorfulness. Split ratio is a minor lever compared to keeping the hero simple. A two-colour split with one emblem and a short text stack is low complexity.
- Prototypicality: asymmetric text-plus-visual heroes are a familiar web pattern; a panel noticeably narrower than the content side (1/3 to ~40%) matches the familiar "image beside text" hero more than an exact 50/50 "two doors" split does, though this is inference, not tested.
- Ngo-style balance would penalize a heavy left block unless offset by right-side mass (wordmark, buttons), consistent with Section 4.

### Gaps
- Did not retrieve Lavie & Tractinsky (2004) classical vs expressive aesthetics data, or any study that manipulates column ratio on web pages.
- Ngo et al.'s specific validation statistics (n, correlations) not retrieved.
