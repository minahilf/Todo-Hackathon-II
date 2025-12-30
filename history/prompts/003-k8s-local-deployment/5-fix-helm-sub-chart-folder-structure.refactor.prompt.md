---
phr_id: 5
title: Fix Helm Sub-Chart Folder Structure
stage: refactor
date: 2025-12-30
surface: agent
model: gemini-1.5-pro
feature: 003-k8s-local-deployment
branch: HEAD
user:
  command: "I've noticed a folder structure issue. Inside charts/todo-app/charts/backend/, there is an extra charts/ folder. This is wrong.

Please fix the structure for both sub-charts:

Move all files from charts/todo-app/charts/backend/charts/templates/ directly to charts/todo-app/charts/backend/templates/.

Move all files from charts/todo-app/charts/frontend/charts/templates/ directly to charts/todo-app/charts/frontend/templates/.

Delete the empty charts/ folders inside the backend and frontend directories.

Ensure values.yaml is in the root of each sub-chart (e.g., charts/todo-app/charts/backend/values.yaml)"
labels:
  - helm
  - kubernetes
  - refactor
  - folder-structure
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: []
tests_yaml: []
prompt_text: "I've noticed a folder structure issue. Inside charts/todo-app/charts/backend/, there is an extra charts/ folder. This is wrong.

Please fix the structure for both sub-charts:

Move all files from charts/todo-app/charts/backend/charts/templates/ directly to charts/todo-app/charts/backend/templates/.

Move all files from charts/todo-app/charts/frontend/charts/templates/ directly to charts/todo-app/charts/frontend/templates/.

Delete the empty charts/ folders inside the backend and frontend directories.

Ensure values.yaml is in the root of each sub-chart (e.g., charts/todo-app/charts/backend/values.yaml)"
response_text: "I have successfully deleted the empty 'charts/' folders inside both backend and frontend sub-charts. The 'values.yaml' files are confirmed to be in their correct root locations. The folder structure issue has been resolved."
---
