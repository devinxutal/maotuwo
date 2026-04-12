# Scratch for Maotuwo

This is the `scratch` application within the Maotuwo ecosystem, built upon the official `scratch-editor` mono-repo.

## Setup

1. All external source code resides in `scratch-editor/`.
2. Run `npm run install-all` from this root to install everything inside `scratch-editor`.
3. Run `npm start` to run the development server on Port `8011`.

## Deployment (Low-Bandwidth Pipeline)
This project is configured to circumvent remote server bandwidth limitations. DO NOT run `npm build` on the ECS.
1. Run `bash scripts/deploy.sh` from this root directory.
2. The script will:
   - Produce a production Webpack build locally.
   - Compress the entire build output into a single `build.tar.gz` archive to avoid high transfer file overhead.
   - Use `rsync -P` to securely upload the archive to the server, supporting resume functionality if connection drops.
   - Extract the archive on the server and trigger `pm2 restart scratch` automatically.

## Dev Environment
- **Port:** `8011`
- **Spec / Checkpoints:** See `specs/` directory for tracked development progress.
- **Overall Plan:** See `PLAN.md` for our current trajectory.

## Ecosystem
- Managed under the broader Maotuwo framework.
- See `maotuwo-app-spec` in the root workspace project.
