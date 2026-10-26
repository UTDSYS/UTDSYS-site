# Eye-tracking and attention evidence for a split-layout landing hero

Target layout under discussion: one screen at 1440×900. Left ~40% is a full-height dark navy panel with a circular crest. Right ~60% is a light column holding an eyebrow, a large two-line wordmark, a lede, two links and two CTAs. A fixed top nav has the brand at top-left and links at top-right.

Evidence grading used below:
- **STRONG**: peer-reviewed, or NN/g eyetracking with stated sample size.
- **MODERATE**: NN/g qualitative or observational work with small or unstated n.
- **WEAK/FOLKLORE**: design-blog convention with no primary data.

---

## 1. Scanning patterns (F, layer-cake, spotted, Z): what was found, and does it apply to a sparse hero?

### Takeaway
The F-pattern is real but conditional. NN/g (2006, updated 2017) says it shows up on **unformatted, text-heavy** content read by users who want efficiency and are not committed to it. NN/g calls it a failure mode, not a template. A sparse hero with one large heading does not meet those conditions. The "Z-pattern" / Gutenberg diagram is mostly print and design convention. I found no primary web eyetracking study that validates it.

### Cited Findings
- F-pattern definition (NN/g, original research 2006, article updated Nov 12, 2017). Users make a horizontal movement across the upper content area, then a shorter horizontal movement lower down, then a vertical scan down the left side. **MODERATE/STRONG** — [NN/g, F-Shaped Pattern of Reading on the Web (2017)](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- The F-pattern needs three conditions together: (1) text with little or no web formatting (no bolding, bullets or subheads), (2) a user who wants to be efficient, and (3) a user not strongly committed to reading everything. — [NN/g 2017](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- NN/g is explicit that the pattern is not something to design toward: "The F-shaped scanning pattern is bad for users and businesses: it means that users may skip important content simply because it appears on the right side of the page." — [NN/g 2017](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- Study sizes in the 2017 article: the examples cite studies of "more than 45 people" ("The 1900 Storm") and 47 people ("Tigers in Crisis"). The 2006 participant count is not stated in the updated article. — [NN/g 2017](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- Other patterns NN/g names: layer-cake (headings and subheadings, body skipped), spotted (jumps to words that are styled differently or match the task), marking (eyes stay fixed while scrolling), bypassing (skipping repeated words at line starts) and commitment (reading nearly everything). — [NN/g 2017](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- NN/g ranks the text-scanning patterns by effectiveness: F is least effective, layer-cake is "by far the most effective" short of full reading, and commitment is most thorough. The "Text Scanning Patterns" article (Aug 25, 2019) says separate patterns exist for image-heavy pages ("zigzag", "exhaustive review") but does not detail them. Its studies include 47 participants (Tigers) and 6 users (a Wikipedia study). — [NN/g, Text Scanning Patterns: Eyetracking Evidence (2019)](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/)
- **Z-pattern / Gutenberg diagram (WEAK/FOLKLORE).** The usual description: the eye goes from the top-left "primary optical area" across to top-right, diagonally to bottom-left, and ends at the bottom-right "terminal area" ("reading gravity"). Blogs recommend putting CTAs in the terminal area. The sources I found are design blogs and secondary articles that assert, but do not show, eyetracking validation. One blog says both patterns are "validated by eyetracking studies" and cites no study. — [The Next Web (2015)](https://thenextweb.com/dd/2015/04/15/designing-websites-that-mirror-how-our-eyes-work-part-2/); [UX Collective, "Grab attention…with Z-pattern"](https://uxdesign.cc/grab-attention-of-your-website-readers-with-z-pattern-7764fca7f28e)

### Inferences
- The hero has five or so text elements and one dominant type element, so neither F (which needs unformatted text) nor layer-cake (which needs several headings) strictly applies. The closest analogue is the **spotted pattern**: fixations jump to whatever is styled differently. That means the huge wordmark, the crest, and anything with high contrast or saturation (such as a filled CTA).
- The Z-pattern is better treated as a composition heuristic than as evidence. In this layout a literal Z would run brand (top-left) → nav links (top-right) → crest panel (bottom-left) → CTAs (bottom-right). The crest occupies the "weak fallow" left side, and the CTAs would sit in the Gutenberg "terminal area" only if they are bottom-right of the whole viewport. Claims that this sequencing increases conversion have no primary evidence I could find.
- The F-pattern's main lesson does transfer: content at the start of the left edge of the *text column* gets fixated. The right column is left-aligned, which gives the eyebrow, wordmark, lede and CTAs a shared left edge. That is a good fit with the evidence.

### Gaps
- I found no peer-reviewed eyetracking study that tests the Z-pattern or Gutenberg diagram on web landing pages. If one exists, it did not surface.
- NN/g's "zigzag" pattern for image-heavy pages is mentioned but not described in what I fetched.
- No study I found tests scan paths on a minimal, one-screen, split-panel hero.

---

## 2. Left-side bias: how strong is it, and should the image or the text go on the left?

### Takeaway
NN/g eyetracking found **69% of viewing time on the left half (2010, 1024×768)**, rising to **80% of fixations (2017, 1920×1080, 120+ participants, 130,000+ fixations)**. This is one of the most robust findings in web eyetracking. It argues that whatever is most important should start on the left, which puts the 40% crest panel on the high-attention side and the headline on the lower-attention right.

### Cited Findings
- 2017 update: "80% of the fixations fell on the left half of the screen" and 20% on the right, up from 69% in the 2010 study. **STRONG** — [NN/g, Horizontal Attention Leans Left (Oct 22, 2017)](https://www.nngroup.com/articles/horizontal-attention-leans-left/)
- Method: "more than 120 participants", "over 130,000 eye fixations", a 1920×1080 monitor in 2017 versus 1024×768 in 2010. Tasks were open-ended across many types of site. — [NN/g 2017](https://www.nngroup.com/articles/horizontal-attention-leans-left/)
- The screen got 900px wider, but peak attention moved only about 200px right. Users did not spread their attention to fill wider screens. — [NN/g 2017](https://www.nngroup.com/articles/horizontal-attention-leans-left/)
- On SERPs, 94% of fixations fell on the left side, and 60% in the leftmost 400px. — [NN/g 2017](https://www.nngroup.com/articles/horizontal-attention-leans-left/)
- NN/g recommendations: put priority content in the left, conventionally prominent locations. Use the right for secondary content. If something important must go on the right, raise its visual prominence. NN/g also notes "the very leftmost area should be reserved for navigation". — [NN/g 2017](https://www.nngroup.com/articles/horizontal-attention-leans-left/); search summary of the same article
- In right-to-left languages, users mirror the pattern. That points to learned reading direction and convention, not a fixed perceptual bias. — [NN/g 2017](https://www.nngroup.com/articles/horizontal-attention-leans-left/)
- Date discrepancy: the brief mentions a "2024 update". The live NN/g article is dated **October 22, 2017** (it may have been re-reviewed since), and I found no separate 2024 dataset. Treat 2017 (80%) as the latest numbers. — [NN/g](https://www.nngroup.com/articles/horizontal-attention-leans-left/); [NN/g original 2010 research page](https://www.nngroup.com/articles/horizontal-attention-original-research/)

### Inferences
- **Caveat on transfer.** NN/g measured content-rich pages during tasks, where left-aligned text and nav pull fixations left. The bias is partly *caused* by where content usually sits. On a page where the left 40% is a dark, text-free panel, the 80% figure should not be read as "users will stare at the crest." Users fixate on information, and the bias describes where information usually is.
- Even so, the evidence suggests the right column's headline is in the lower-attention half by default. The fix NN/g recommends ("increase visual prominence") is roughly what a very large two-line wordmark already does. Size and contrast can overcome position.
- At 1440px, the right column starts at about x=576. NN/g's peak attention shifted only about 200px when the screen grew 900px. Typical attention peaks are left of centre, so the text column's left edge (about 576–650px) is reachable, but it is not the hottest zone.
- The crest is the sole feature of the left panel, which is high-contrast (navy) and in the default-attention zone. It will probably draw early fixations, so it competes with the headline for first look. This is an inference from salience and left bias, not from a direct test.
- If the goal is "read the name and the value proposition first", the evidence leans toward **text-left / image-right**. If the goal is "brand recognition first, then text", image-left is defensible, since the crest *is* the brand. Either way, the crest should not be the most salient thing on the page unless that is intended.

### Gaps
- I found no study comparing image-left and text-left split heroes on time-to-first-fixation of the headline or on comprehension.
- I found no evidence on how a large flat-colour panel (as opposed to a content area) affects the left-side distribution.

---

## 3. Above the fold: how it applies to a one-screen page

### Takeaway
NN/g 2018: **57% of viewing time above the fold**, **74% in the first two screenfuls**, and within the fold, more than 65% of time in the *top half of the viewport*. On a one-screen page the fold question mostly goes away. The finding that still matters is the vertical one: attention concentrates near the top of the viewport.

### Cited Findings
- 2010 study: "80% of users' viewing time was spent above the fold" (1024×768). **STRONG** — [NN/g, Scrolling and Attention (Apr 15, 2018)](https://www.nngroup.com/articles/scrolling-and-attention/)
- 2018 update: about 57% of page-viewing time above the fold, and 74% in the first two screenfuls. — [NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/)
- More than 42% of viewing time fell within the top 20% of the page, and more than 65% within the top 40%. — [NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/)
- "More than 65% of the viewing time above the fold was concentrated in the top half of the viewport." — [NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/)
- Method: 120 participants, more than 130,000 fixations, 1920×1080, thousands of sites (news, e-commerce, blogs, FAQs, encyclopedic). This is the same dataset as the 2017 left-bias article. — [NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/)
- Correction to the brief's figures: "~57%" is the **2018** above-fold figure. "~80%" is the **2010** above-fold figure. "~74%" is the 2018 *first two screenfuls* figure, not an above-fold figure. — [NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/)
- NN/g recommends reserving the top of the page for high-priority content and using signifiers to prevent "false floors". — [NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/)

### Inferences
- At 900px tall, minus a fixed nav of about 64–80px, the content-bearing "top half" runs to roughly y=450. If the wordmark, eyebrow and lede sit in the upper half of the right column, they fall in the zone that got about 65% of above-fold time. CTAs placed below roughly 60% of viewport height are in the lower-attention band. That isn't fatal, since users looking for an action will search for it, but it is worth noting.
- On a one-screen page with no scroll, the "false floor" risk flips. Users who expect a scroll and find none just leave. There is no evidence that this hurts on its own.
- Vertical centring of the whole text block, which is common in split heroes, pushes the headline toward the middle and the CTAs toward the bottom third. The 2018 data favours top-biased placement of the headline.

### Gaps
- NN/g's data comes from scrolling, content-rich pages during tasks. I found no eyetracking data specific to fixed one-screen landing pages.

---

## 4. Images vs text: faces, decorative images, banner blindness, and whether a big crest competes

### Takeaway
The evidence separates **informative** images (looked at, sometimes more than text) from **decorative** ones, which users tend to ignore during tasks. The "people always look at images/faces first" claim is weaker than its popularity suggests. Tullis et al. (CHI 2009) found faces did *not* raise the share of users who looked at an area, and faces above the fold *hurt* task performance. A large decorative crest is likely to be either glanced at and dismissed, or to act as a salience competitor in free viewing.

### Cited Findings
- NN/g (Nielsen, Oct 31, 2010): "Some types of pictures are completely ignored. This is typically the case for big feel-good images that are purely decorative." Generic stock photos are bypassed. Product photos and real team portraits get scrutiny. On one "About" page, users spent 10% more time on portrait photos than on biographies, which took 316% more space. **MODERATE** (eyetracking, n not stated in the summary; 2010) — [NN/g, Photos as Web Content](https://www.nngroup.com/articles/photos-as-web-content/)
- Banner blindness (NN/g, Kara Pernice, Apr 22, 2018; eyetracking, 26 participants, desktop and mobile). Users ignore elements that look like ads by *placement* (top of page, right rail), *treatment* (animation, distinctive formatting, coloured backgrounds), or *proximity* to ads. "Anything that stands out from immediate surrounding context is likely to be considered an ad." The right rail got 0.8% of fixations while taking up 25% of the content area. **STRONG-ish** (n=26, plus earlier studies) — [NN/g, Banner Blindness Revisited (2018)](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/)
- Tullis, Siegel & Sun (CHI 2009 EA), "Are people drawn to faces on webpages?" Faces were placed in areas that usually get little attention. They "did not increase the number of people who viewed the areas" but did change fixation patterns there, and faces above the fold *negatively affected task performance*. **STRONG (peer-reviewed, CHI)**; summary from a Djamasbi et al. abstract, full paper not fetched — [Djamasbi, Siegel & Tullis, AIS THCI 2012 / related work](https://aisel.aisnet.org/thci/vol4/iss3/2); [Djamasbi et al. HICSS 2010 PDF](https://users.wpi.edu/~djamasbi/PDFS/Conference%20papers/2010-Djamasbi%20et%20al-HICCS.pdf)
- Djamasbi, Siegel & Tullis also published "Faces and Viewing Behavior: An Exploratory Investigation" (AIS THCI, 2012) and "Can Fixation on Main Images Predict Visual Appeal of Homepages?" (2014). Related work by the same group (Djamasbi et al. 2011) compared Gen Y and Baby Boomers. These are cited for existence; I did not verify their specific findings. — [AIS THCI](https://aisel.aisnet.org/thci/vol4/iss3/2); [dblp: Djamasbi](https://dblp.uni-trier.de/pid/22/132.html)
- Buscher, Cutrell & Morris (CHI 2009). 20 users, 361 web pages, information-foraging and page-recognition tasks. They modelled which page elements receive visual attention, and found attention depends on task and demographics. **STRONG (peer-reviewed)**, but detailed numbers were not retrieved — [Microsoft Research](https://www.microsoft.com/en-us/research/publication/what-do-you-see-when-youre-surfing-using-eye-tracking-to-predict-salient-regions-of-web-pages/)

### Inferences
- A crest or seal is not a face and not a product photo. Under NN/g's taxonomy it is closer to decorative or brand imagery. Users skimming for "what is this?" will probably give it one or two fixations and move on, unless it carries information (a readable name or motto, for example).
- Banner-blindness risk for this layout: the crest panel is a large block with a *colored background* that "stands out from immediate surrounding context." That is one of NN/g's ad-like triggers. It is not in an ad position, though, and sits in the main composition, so the risk is likely low. The bigger point is that users may treat the whole navy panel as "decoration, skip it," which is fine if nothing essential lives there.
- Competition with the headline: in free viewing at first exposure, high-contrast, isolated, centred-in-a-panel shapes are salient and sit in the left-biased zone. The very large wordmark is also highly salient. Expect a crest-to-wordmark (or wordmark-to-crest) sequence. Which comes first is an empirical question that a quick 5-second test or eyetracking/clicktest could answer.
- Do not put crucial text (the club name, the value proposition) only inside the crest. Decorative-looking imagery is the category users ignore.

### Gaps
- I found no study on emblem or crest/seal imagery specifically, as distinct from photos and faces.
- I did not retrieve the full Buscher et al. 2009 results (location-based attention distributions). The PDF link 404'd.
- NN/g's "Photos as Web Content" summary does not give a sample size.

---

## 5. First impressions: Lindgaard 2006, Tuch 2012, Reinecke 2013

### Takeaway
Aesthetic judgements form in **17–50ms**, stay consistent with longer viewing, and are driven mainly by **visual complexity** (lower is better, sharp penalty at high complexity) and **prototypicality** (looks like what a site of this kind should look like). Colourfulness matters much less. A sparse split hero is low-complexity, which is favourable. Prototypicality depends on whether it reads as a familiar "landing page" layout.

### Cited Findings
- Lindgaard, Fernandes, Dudek & Brown (2006), *Behaviour & Information Technology* 25(2):115–126 (Carleton University). Three studies flashed home pages for 500ms, then 500ms vs **50ms**, with ratings from 1 to 100. Appeal judgements at 50ms were reliable and correlated with judgements from longer exposure. The authors argue first impressions create a halo effect that carries over to perceptions of content. **STRONG (peer-reviewed)**; details via secondary reports — [Bibliographic record](https://makinggood.ac.nz/l/lindgaard,-g,-fernandes,-g,-dudek,-c,-brown,-j-(2006)-attention-web-designers-you-have-50-milliseconds-to-make-a-good-first-impression!-behaviour-it,-25,-115–126); [bit-tech summary (2006)](https://bit-tech.net/news/website_hot_or_not/1/)
- Tuch, Presslaber, Stöcklin, Opwis & Bargas-Avila (2012), *IJHCS* 70(11):794–811 (Google/University of Basel). Study 1 used 119 real-site screenshots varied by visual complexity (low/medium/high) and prototypicality (low/high), shown for 50, 500 or 1000ms. VC and PT affected aesthetics ratings within 50ms. Study 2 (17, 33, 50ms) found effects even at **17ms**, with PT weaker than VC at the shortest exposures. "Websites with low VC and high PT were perceived as highly appealing." **STRONG** — [Google Research publication page](https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/); [Google Research blog (2012)](https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/)
- Reinecke, Yeh, Miratrix, Mardiko, Zhao, Liu & Gajos (CHI 2013), pp. 2049–2058. **548 volunteers** rated **450 websites** after 500ms of exposure. They built computational models of perceived colourfulness (R² = .78) and perceived complexity (R² = .65) from screenshots. Together with demographics, these explain **48%** of the variance in appeal. **STRONG** — [Paper PDF](https://kgajos.seas.harvard.edu/papers/reinecke13aesthetics.pdf); [Harvard listing](https://www.eecs.harvard.edu/~kgajos/papers/2013/reinecke13predicting.shtml)
- Reinecke 2013, shape of the effect: "ratings of appeal are significantly negatively affected by an increase in visual complexity… a strong decrease in ratings of appeal for websites with a high level of complexity, as well as a slight decline… for websites with lower levels of complexity." It also says "websites with low levels of complexity are similarly liked to those with a medium complexity." There is no strong inverted-U. — [Reinecke et al. 2013](https://kgajos.seas.harvard.edu/papers/reinecke13aesthetics.pdf)
- Reinecke 2013: "perceived colorfulness only plays a minor role." Visual complexity explains significantly more variance. — [Reinecke et al. 2013](https://kgajos.seas.harvard.edu/papers/reinecke13aesthetics.pdf)
- Reinecke 2013 demographic effects: participants **older than 45** liked low-complexity sites more than other age groups. Education interacted with colourfulness: PhD holders were most negatively affected by high colourfulness. Even Webby Award sites averaged only 4.21–6.57 on a 9-point scale, with SD around 1.69 ("beauty is in the eye of the beholder"). — [Reinecke et al. 2013](https://kgajos.seas.harvard.edu/papers/reinecke13aesthetics.pdf)
- Reinecke's complexity model uses image metrics including the number of image areas, text versus non-text area, and quadtree decomposition (number of leaves), as well as colour metrics. — [Reinecke et al. 2013, Table 1](https://kgajos.seas.harvard.edu/papers/reinecke13aesthetics.pdf)
- Correction to the brief: the 2013 CHI paper has **548** participants, not 40,000. Large LabintheWild samples belong to later Reinecke & Gajos work, which I did not verify here. — [Reinecke et al. 2013](https://kgajos.seas.harvard.edu/papers/reinecke13aesthetics.pdf)

### Inferences
- A two-region composition (one image area, one text area, large type, few elements) should score as low complexity on Reinecke-style metrics: few image areas, few quadtree leaves, lots of uniform colour. That predicts good first-impression appeal, especially among older visitors and highly educated ones (faculty, recruiters).
- Prototypicality cuts both ways. Split heroes (image panel plus text column) are common in SaaS and institutional sites, so the layout is probably prototypical for "organization landing page." A navy panel with a seal also reads as "university or institution", which is prototypical for a university club. Unusual proportions or a missing nav would lower PT.
- The 40/60 ratio itself has no direct evidence. These studies manipulate complexity and prototypicality, not panel proportions. Any claim that one ratio beats another is not supported by this literature.
- The low weight on colourfulness suggests the navy/light contrast is not a first-impression risk. A restrained palette fits the "less colourful is liked by the highly educated" interaction.

### Gaps
- I found no study isolating split-panel proportions, such as 40/60 versus 50/50, against first-impression appeal.
- I found no data on the target audience (students, quant recruiters) specifically.

---

## 6. CTA placement: does position relative to the headline matter?

### Takeaway
Credible, published evidence on CTA position relative to the headline is thin. The consistent findings are indirect. Users look where they expect the next action to be, which is next to or below the content that motivates it. Prominence beats position. Most "CTA above the fold / terminal area / right side" claims come from vendor or marketing blogs with unclear method.

### Cited Findings
- Marketing-blog eyetracking (Econsultancy, citing a 62-participant eyetracking test). On a PC World product page, moving the CTA closer to the product details, where users naturally look *below* the information instead of scanning back up and to the right, increased the number of people who fixated the button. **WEAK–MODERATE** (vendor test, not peer-reviewed, details unverified) — [Econsultancy, "Do your calls to action grab users' attention?"](https://www.econsultancy.com/do-your-calls-to-action-grab-users-attention/)
- An eyetracking paper titled "Placement of Call to Action Buttons for Higher Website Conversion and Acquisition" (Hernandez & Resnick, 2013) appears in search results. I could not verify its venue, sample or findings. **UNVERIFIED**, and only surfaced via a search summary — [VWO blog (where it surfaced)](https://vwo.com/blog/eye-tracking-website-optimization/)
- Claims that "above the fold is better" or that "below works better for motivated visitors" appear in vendor blogs (VWO, case-study roundups) as anecdotal A/B results. Their methods are not disclosed. **WEAK/FOLKLORE** — [VWO blog](https://vwo.com/blog/guiding-visitors-eye-path-to-increase-conversions/)
- Relevant strong evidence by analogy: NN/g says right-side placement needs extra visual prominence to be noticed (Section 2), and attention concentrates in the top half of the viewport (Section 3). — [NN/g 2017](https://www.nngroup.com/articles/horizontal-attention-leans-left/); [NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/)

### Inferences
- In this layout the CTAs share the text column's left edge, directly under the lede. That follows the one consistent finding: an action placed where reading ends, aligned to the column, not off in a corner. Moving CTAs to the far bottom-right ("Gutenberg terminal area") has no credible support.
- Two equal-weight CTAs plus two text links make four competing actions. Hick's-law-style reasoning and NN/g's "prominence" advice suggest making one primary CTA visually dominant. This is inference, not tested here.
- A filled, high-contrast primary button will act as a "spotted pattern" magnet. It may pull fixations before the lede is read, which is fine if the CTA label carries meaning on its own.

### Gaps
- I found no peer-reviewed A/B or eyetracking study isolating CTA position relative to the headline on landing heroes. I did not consult Baymard (its focus is e-commerce checkout and product pages, with little on landing heroes) or CXL research write-ups. This is a known gap in the evidence base.
- The Hernandez & Resnick (2013) study could not be verified.
