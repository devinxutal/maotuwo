# CP-1.2: ECS 低带宽自动化部署 (Low-bandwidth Deployment)

> **Status**: `APPROVED`
> **Created**: 2026-04-12
> **Last Updated**: 2026-04-12

---

## 1. Purpose

The purpose of this checkpoint is to establish a fast, reliable, and low-bandwidth deployment pipeline from the local macOS machine directly to the Maotuwo Aliyun ECS instance (`8.130.44.101`). Because Scratch is a massive webapp and the server has low bandwidth, we execute all heavy compilation (`npm build`) locally and transfer only the minified assets with incremental sync (`rsync --delete -z`). 

---

## 2. Scope

### In Scope
- Creating `scripts/deploy.sh` in the `apps/scratch` repository.
- Configuring `deploy.sh` to compile `scratch-editor/packages/scratch-gui/build` locally.
- Applying SSH credentials natively managed by the `ecs-maotuwo` skill to stream files via `rsync`.
- Using ECS `pm2 serve` command remotely to serve the built static resources on port `8011`.
- Updating `README.md` to persist the deployment knowledge.

### Out of Scope
- Backend proxy creation (handled in maotuwo host Nginx).
- Automatic CI/CD via GitHub Actions (strictly manual local-to-server push mechanism to save internet bandwidth).

---

## 3. Interface Contract

### Network Target
- ECS Server IP: `8.130.44.101`
- Target path on remote: `/home/maotuwo/deployment/scratch/build`
- PM2 configuration: `pm2 start 'serve -s build -l 8011' --name scratch`

---

## 4. Acceptance Criteria

- [ ] AC-1: Running `bash scripts/deploy.sh` triggers local build without issues.
- [ ] AC-2: `deploy.sh` runs `rsync` passing correctly the local SSH key.
- [ ] AC-3: Deployment successfully mirrors the local `build` assets into the `deployment/` path on the ECS server.
- [ ] AC-4: PM2 service "scratch" is properly spun up or restarted remotely, listening on port 8011.

---

## 5. Dependencies

- Depends on: `CP-1.1`, `ecs-maotuwo`
- Blocks: `CP-1.3`

---

## Implementation Notes

> *Filled in after implementation.*
