Key UX / Localization Considerations for English + Urdu
From UX / design literature:
Challenge	Best practice / guidance
RTL layout / mirroring	Since Urdu reads right → left, the UI must support RTL mirroring: swapping sidebars, alignment, navigation direction. 
Localize
+1
Numbers & LTR content inside RTL	Numbers, dates, neutral words (e.g. “USD”, “2025”) should remain LTR even in Urdu context. 
Localize
Text expansion / contraction	Translated Urdu strings may take more or less space; design flexible containers and allow multiline. 
Linguise
+1
Fonts & readability	Use high-quality Urdu fonts (Noto Nastaliq Urdu, or similar) that are legible at small sizes. Also ensure fallback fonts.
Language switcher & default detection	Place switching option clearly (header, footer). Autodetect browser / locale but allow override. 
Weglot
+1
Consistent UI across both languages	Use same layout structure, component order, theming across both language versions—just mirrored for Urdu. 
lionbridge
+1
Avoid text in images	Because Urdu text in images is hard to retranslate, use HTML + CSS rather than embedding critical text in images. 
UX Planet
+1
Cultural adaptation	Beyond translation, adapt examples, icons, images to local context (e.g. currency display, examples relevant to Urdu speakers).
Given those, let me revise the wireframes + copy kit accordingly.
Revised Wireframes & Flow: English + Urdu
The funnel remains the same structure: Landing → Preview → Signup → Onboarding → First Signal → Upgrade. But each screen needs to support both languages, defaulting based on user choice.
Desktop layout (dual support)
Topbar: left side has language switcher (e.g. “EN | اردو”).
For English: layout as earlier (logo left, nav links to the right).
For Urdu: mirroring: logo on the right, nav links on left, RTL reading flow.
Hero: in English version H1 + bullets left-aligned; in Urdu, RTL aligned.
Live preview / signals list: items can flow top → bottom; within each card, text in Urdu aligned RTL.
Pricing cards: display Urdu + English names side by side or toggle view.
FAQ: accordion that opens in the correct direction; Urdu questions sorted RTL.
Footer: English and Urdu links (terms, privacy, contact) side by side or toggled.
Mobile layout (dual)
Language switcher: in top bar or a floating toggle.
Swiping / navigation should respect direction: e.g., horizontal carousels swipe appropriately.
Menus slide from right for Urdu, from left for English.
Buttons, icons, arrows should be mirrored (e.g. “next” arrows pointing left in Urdu view).
Mirroring logic
Components that are directional (e.g. progression steps, breadcrumbs, arrows) must be mirrored in Urdu view.
Icons that don’t imply direction (e.g. magnifier, settings) can remain same.
Mixed content (numbers, URLs, product names) remain LTR in Urdu layout.
Copy Kit: English + Urdu
Below are example headlines, buttons, disclaimers etc., localized for Urdu. Use professional translation or consult native speaker to refine, but these are drafts:
Context	English Copy	Urdu Copy (draft)
Hero headline	“Actionable market setups, delivered when it matters.”	“عملی بازار کی سیٹ اپس، جب اہم ہو پہنچائیں گئے۔”
Hero bullets	“Timely alerts with entry/exit zones and context.”
“Coverage across FX, crypto, commodities, indices.”
“Clear setups you can evaluate—no hype.”	“وقت پر الارم، داخلے/خروج کے زون سمیت معلومات کے ساتھ۔”
“ایف ایکس، کرپٹو، اشیاء، اشاریے شامل ہیں۔”
“صاف سیٹ اپس جنہیں آپ خود جانچ سکتے ہیں — کوئی مبالغہ نہیں۔”
Primary CTA	“Get free preview”	“مفت جائزہ حاصل کریں”
Secondary CTA	“See pricing”	“قیمت دیکھیں”
Risk disclaimer (micro)	“Trading involves risk. Past performance does not guarantee future results.”	“تجارت میں خطرہ شامل ہے۔ ماضی کی کارکردگی مستقبل کی ضمانت نہیں دیتی۔”
Pricing bullets	“Full intraday feed • Email/Push alerts • Historical access • Cancel anytime.”	“مکمل اندرونی فیڈ • ای میل/پش الرٹس • تاریخی رسائی • کبھی بھی ختم کریں”
Footer / long disclaimer	“Information provided is for educational purposes only and is not investment advice. Trading involves risk and may cause loss of principal. Past performance is not indicative of future results.”	“دی گئی معلومات صرف تعلیمی مقصد کے لیے ہیں اور سرمایہ کاری کا مشورہ نہیں ہیں۔ تجارت میں خطرہ شامل ہے اور آپ کی اصل سرمایہ کاری کو نقصان پہنچ سکتا ہے۔ ماضی کی کارکردگی مستقبل کی عکاسی نہیں کرتی۔”
FAQ items	“How many alerts per week?”
“Which markets do you cover?”
“Can I cancel anytime?”	“ہفتے میں کتنے الارم ملیں گے؟”
“آپ کون سے بازار کور کرتے ہیں؟”
“کیا کبھی بھی منسوخ کیا جا سکتا ہے؟”
Modal / exit intent	“Before you go: see today’s setups (1 free).”	“جانے سے پہلے: آج کی سیٹ اپس دیکھیں (1 مفت)”
Toast after signup	“Magic link sent to {email}”	“جادوئی لنک {email} پر بھیجا گیا”
Be sure to get native proofreading and consider dialectical preferences (Urdu script conventions).
Updated Flow Notes & UX Additions for Bilingual
Language selection at first touch
On user's first visit, optionally detect browser locale and show a small banner: “We see your language is Urdu. Switch site version?” Let them switch or stick. After selection, persist via cookie or user profile.
Toggle UI
Always allow switching between English <-> Urdu. Switching should not drop user context; e.g. if you're on pricing page in English, switching to Urdu should show the same pricing page in Urdu.
Parallel layout templates
Use a single global template with RTL/LTR toggles (versus two totally separate templates) to ensure consistency and avoid maintenance divergence. 
lionbridge
+1
Manage text expansion / line breaks
In designing component widths, assume some Urdu texts might be longer or break into two lines. Use flexible containers, avoid fixed width buttons or truncated labels.
Font & rendering optimizations
Preload the Urdu font file. Use proper font fallback, ensure hinting and line spacing (leading) works well. On small screens, provide slightly larger font sizes for Urdu, if needed, for readability.
Mixed text blocks
For UI elements containing both English + Urdu (e.g. “EN | اردو”), ensure proper script order and directionality. Use Unicode “directionality” controls (e.g. dir="rtl" / dir="ltr") carefully.
SEO & URL structure
Use language-specific URL structure, e.g. /en/... and /ur/.... Use <html lang="ur" or lang="en" attributes and dir="rtl" for Urdu pages. Add hreflang tags. 
Linguise
+1
Localization of imagery / icons
Any image with embedded text must have versions in Urdu. Icons with direction (e.g. arrow, progress) must mirror. Cultural relevance (e.g. currency symbols, localized examples) should reflect Urdu users’ context.
Accessibility & screen readers
For multilingual and non-Latin scripts, ensure correct lang attributes so screen readers read Urdu correctly. Also include fallback alt text. Be careful: many assistive tech have weaker support for non-Latin scripts. (Recent research warns of accessibility for multilingual web content) 
arXiv
Testing in real environments
Test the UI under Urdu mode on multiple devices (Android iOS), with different screen densities. Pay attention to mirroring glitches, clipping, alignment issues.