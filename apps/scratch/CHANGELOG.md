# Changelog

All notable changes to the `scratch` application within the Maotuwo ecosystem will be documented in this file.

## [Unreleased]

### Added
- **feat(CP-1.1)**: Initialized application structure and project tracking files (Spec, Progress, Readme, Changelog).
- **feat(CP-1.1)**: Set default local development port to 8011 according to maotuwo-app-spec range (8000-8100/var).
- **feat(CP-1.2)**: Created `scripts/deploy.sh` for low-bandwidth ECS deployment with local build + rsync strategy.
- **feat(CP-1.2)**: Deployed Scratch GUI to ECS (8.130.44.101) at `/home/maotuwo/deployment/scratch/build`.
- **feat(CP-1.2)**: Configured PM2 service "scratch" serving on port 8011 with `serve` static file server.
