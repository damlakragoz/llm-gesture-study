# Deploy Study to GitHub Pages

## 1. Create a new repo on GitHub

- Go to https://github.com/new
- Name it e.g. `gesture-study` (or any name)
- **Do not** initialize with README
- Create the repo

## 2. Push from study-deploy folder

```bash
cd /Users/damlak/Downloads/cs490/study-deploy
git init
git add .
git commit -m "Gesture & Personality Perception Study"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gesture-study.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `gesture-study` with your GitHub username and repo name.

## 3. Enable GitHub Pages

- Repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `main` / `/ (root)`
- Save

## 4. Your study URL

```
https://YOUR_USERNAME.github.io/gesture-study/
```

## Prolific link

```
https://YOUR_USERNAME.github.io/gesture-study/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}
```
