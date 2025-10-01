Here are some recommended **sizes and proportions** for a “subscribe” popup (modal / overlay) based on UI/UX standards and best practices, with caveats. Use these as guidelines, not rigid rules:

---

## 📐 Recommended Sizes & Constraints

These are typical “sweet-spots” drawn from UX articles, popup tools, and design systems:

| Context / Device              | Suggested Size / Proportion                                                    | Notes / Rationale                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Desktop / large screens**   | width ≈ **700×500 px** as a starting point ([Digioh Help Docs][1])             | Many popup builders recommend ~700×500 for desktop popups. ([Digioh Help Docs][1])                   |
|                               | max width ≈ **900px** ([Digioh Help Docs][1])                                  | To avoid stretching too much on large monitors. ([Digioh Help Docs][1])                              |
|                               | max height ≈ **650px** ([Digioh Help Docs][1])                                 | To ensure popup fits “above the fold” and doesn’t force too much scrolling. ([Digioh Help Docs][1])  |
| **Mobile / small screens**    | width ≈ **360px**, height up to ~**660px** ([Digioh Help Docs][1])             | This fits many mid-sized mobile portrait screens. ([Digioh Help Docs][1])                            |
| **General rule / proportion** | modal covers ~ **20-25% of screen / interface area** ([Userpilot][2])          | Many UX sources warn against modals being too big, so capping to ~20-25% is common. ([Userpilot][3]) |
| **Alternate proportion rule** | up to ~50% width on desktop, similar for height (if content) ([htmlBurger][4]) | Some sources propose 50% width as a max for more “heavy content” modals. ([htmlBurger][4])           |

---

## 🧩 Guidelines & Best Practices (size + layout)

* The popup should **not dominate** the entire screen. If your content is small (a 15-word headline + button), it should be compact and focused.
* Use **max-width / percentage width constraints** rather than fixed widths, so the popup scales responsively.
* For mobile, often a **full-width popup** or **bottom sheet** pattern works better than a floating box (so it doesn’t feel cramped).
* Always include internal padding (typically **16–24px**) so content has breathing room.
* If content overflows, allow the **body content area** to scroll while keeping header/footer fixed.
* Ensure whitespace, easy close (“X”), and clear CTA button are visible at all screen sizes.

---

## ✅ Applying to Your Case (15 words + button)

Given your limited content (just a brief message + button), you can go relatively small:

* Desktop: maybe **~400–500px wide × auto height** (height just enough to contain text + padding + button)
* Mobile: full width (100%) with margin/gutter, height auto

For example:

* On desktop: 450px width, padding 24px all around, height auto
* On mobile: width = viewport width minus margins (e.g. 16px on each side), height auto

If you like, I can mock up **exact CSS code** (media queries) for your subscribe popup (both desktop + mobile) so you can drop it into your project. Do you want me to share that?

[1]: https://help.digioh.com/knowledge-base/recommended-sizes-for-pop-ups-on-desktop-and-mobile/?utm_source=chatgpt.com "Website Pop Up Sizes for Desktop & Mobile - Digioh Help Docs"
[2]: https://userpilot.com/blog/modal-design/?utm_source=chatgpt.com "Modal Design Best Practices for SaaS - Userpilot"
[3]: https://userpilot.com/blog/modal-ux-design/?utm_source=chatgpt.com "Modal UX Design for SaaS in 2025 - Best Practices & Examples"
[4]: https://htmlburger.com/blog/modal-ui-design/?utm_source=chatgpt.com "The Pocket Guide to Modal UI Design - htmlBurger"
