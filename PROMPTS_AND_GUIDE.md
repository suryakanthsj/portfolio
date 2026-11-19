# Cinematic AI Character Portfolio — Visual Guide & Prompts
*Strictly following `AI_Character_Portfolio_Visual_Guide.pdf` for S. J. Suryakanth*

---

## Part 1: Your 13 Brief Answers (Page 6 & 16)

| # | Question | Your Detail |
|---|---|---|
| **1** | Full name | **S. J. Suryakanth** |
| **2** | Role / title | **Python & Django Developer · Backend & Full-Stack** |
| **3** | City + status line | **Chennai, Tamil Nadu · Open to Full-Time Python & Backend Roles** |
| **4** | About title (one line) | **Engineering intelligent backend architectures & AI systems.** |
| **5** | About (2–3 sentences) | Entry-level Python and Django Developer with a B.Tech in AI & Data Science (CGPA 8.4/10) and full-stack internship experience at ADYOG. I build production REST APIs with Django and FastAPI, write optimized SQL across PostgreSQL and MySQL, craft modern React front ends, and automate end-to-end tests with Playwright and pytest. |
| **6** | 3 stats | **8.4 CGPA** · **4+ AI & Web Projects** · **5+ Certifications** |
| **7** | 3 projects | **1. School Attendance System** (Python, OpenCV, Computer Vision)<br>**2. AI Personal Assistant** (Python, NLP, FastAPI)<br>**3. Full-Stack Task Management App** (Django, PostgreSQL, SQL CRUD) |
| **8** | 8–12 skills | Python, Django, FastAPI, PostgreSQL, MySQL, React, JavaScript, Playwright, pytest, OpenCV, NLP, Git |
| **9** | Experience (2 lines) | Full Stack Development Intern, ADYOG (July 2026 – Present)<br>Built responsive React UIs, Django/FastAPI REST APIs, optimized SQL queries, and Playwright automated tests. |
| **10** | Education (2 lines) | B.Tech – Artificial Intelligence & Data Science, Class of 2026 (CGPA: 8.4 / 10)<br>Thangavelu Engineering College, Chennai |
| **11** | Email + social links | `suryakanth2004sk@gmail.com` · [LinkedIn](https://linkedin.com/in/s-j-surya-kanth) · [GitHub](https://github.com/suryakanthsj) |
| **12** | Outfit for video | Charcoal black blazer, dark fitted top, black tailored trousers, clean white sneakers |
| **13** | Accent colour | Warm amber `#ff9a4d` (matches the rim light) |

---

## Part 2: ChatGPT Start Image Prompt (Page 8)

*Upload `media/photo.jpg` to ChatGPT and paste this exact prompt:*

```text
Use the person in the uploaded photo: same face, same hair.

OUTFIT
Charcoal black blazer, dark fitted inner top, black tailored trousers, white sneakers.

POSE
Full body, standing in the exact center of the frame with his BACK to the camera, arms relaxed. Head to toe visible.

LIGHT
Pure black background, completely dark empty studio. Strong warm amber (#ff9a4d) rim light from behind on both sides, outlining the hair, shoulders and body edges clearly, plus a soft spotlight from above. No floor texture, no props.

STYLE
Photorealistic, cinematic, 16:9 landscape.
```

---

## Part 3: Google Flow Universal Clip Base (Page 9)

*In Google Flow (`labs.google/flow`) with Veo 3 in **Frames to Video** mode (16:9), paste this universal base before each action:*

```text
SHOT
One single continuous camera shot with no cuts, no dissolves and no transitions.

PERSON
The same young Indian man in his early 20s with short neatly styled dark black hair, wearing charcoal black blazer, dark fitted inner top, black tailored trousers and clean white sneakers EXACTLY AS HE APPEARS IN CLIP 1.
His face, hair and outfit stay exactly the same. Only one person in the frame.

STUDIO
A pure black empty studio. A strong warm amber rim light outlines his body and hair at all times, with a soft overhead spotlight. The background stays completely black.

SOUND
No music, no dialogue.

ACTION
[ADD ACTION LINE BELOW]
```

### The 6 Clip Actions (Page 10)

| Clip | First Frame | Action Line to Add |
|---|---|---|
| **Clip 1 (Intro)** | ChatGPT Start image | `He stands with his back to the camera, then slowly turns around to face the camera, looks into the lens and gives a confident, warm smile. Static camera, full body framing.` |
| **Clip 2 (About)** | Clip 1 last frame | `He takes two slow, confident steps toward the camera, stops, and smiles warmly at the lens with a slight nod. Static camera.` |
| **Clip 3 (Transition / Sit)** | Clip 2 last frame | `Starting from the close-up, the camera slowly pulls back in one continuous move to a wide full-body shot. He stays facing the camera, never turns his back, takes one small step backward and lowers himself onto a simple modern white chair right behind him, crosses his legs and smiles.` |
| **Clip 4 (Work / Desk)** | Clip 3 last frame | `Static wide camera. A sleek white desk with an open silver laptop slides in smoothly from the right side of the frame on its own and stops right in front of him. He uncrosses his legs, leans forward, pulls the laptop closer and starts typing, focused, with a small smile.` |
| **Clip 5 (Skills / Walk)** | Clip 4 last frame | `Static wide camera. He stops typing, stands up and steps out from behind the desk to the left. He walks slowly toward the left side of the frame in side profile, stops on the left third, fully visible from head to toe, and smiles at the camera. The desk, laptop and chair stay where they are.` |
| **Clip 6 (Résumé & Contact)** | Clip 5 last frame | `The camera stays completely still. He raises both hands above his head, grabs something invisible and smoothly pulls it down to chest height, like pulling down a screen, holds that pose, then lowers his hands, smiles and gently waves hello with his right hand.` |

---

## Part 4: Assembling Your Video with `build_film.sh`

Once you download your 6 clips as `clip1.mp4` through `clip6.mp4` in `clips/`:

```bash
bash build_film.sh
```

This automatically:
1. Joins all 6 clips with a seamless 0.25s `xfade`.
2. Delogos the Veo watermark.
3. Crushes dark greys to pure black with `colorlevels` (`rimin=0.045:gimin=0.045:bimin=0.045`).
4. Generates web-optimized versions:
   - `site/media/film.mp4` (1280px wide, `-g 1` instant seek, crf 27, faststart)
   - `site/media/film_mobile.mp4` (854px wide, `-g 1` instant seek, crf 28, faststart)
   - `site/media/poster.jpg` (first frame)

---

## Part 5: Deployment

- **GitHub Pages (Live Now):** [https://suryakanthsj.github.io/portfolio/](https://suryakanthsj.github.io/portfolio/)
- **Netlify Drop:** Drag the `site/` folder directly to [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel:** Import your GitHub repo, set root directory to `site/` (or root), and click Deploy.
