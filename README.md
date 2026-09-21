# School Teacher Portal

A beautiful, responsive web application for teachers to manage their classes, assignments, and exams.

## Deploying the Backend to Render

You can instantly deploy the `json-server` database to Render.com by clicking the button below:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Click the button above.
2. Sign in to Render (if you aren't already).
3. The Blueprint will automatically create a Web Service named `school-teacher-backend`.
4. Click "Apply" at the bottom of the screen.
5. Wait a minute for the deploy to finish. Render will generate a URL for your live API (e.g., `https://school-teacher-backend.onrender.com`).

### Connecting your GitHub Pages Frontend to the Live Backend

Once your backend is successfully deployed on Render:
1. Open `src/services/mockData.ts` in your local project.
2. Replace `'YOUR_RENDER_URL_HERE'` with your actual Render URL.
3. Open your terminal and run `npm run deploy`.
4. Your GitHub Pages site will now use your live database!

---

## Local Development

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` (This will start both the Vite frontend on port 5173 and the JSON Server on port 3000)
