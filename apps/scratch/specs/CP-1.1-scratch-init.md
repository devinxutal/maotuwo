# CP-1.1: Scratch App Initialization

> **Status**: `APPROVED`
> **Created**: 2026-04-12
> **Last Updated**: 2026-04-12

---

## 1. Purpose

The purpose of this checkpoint is to initialize a new Maotuwo app named `scratch` using the open-source `scratch-editor` repository. It sets up the core foundation for local development under the Maotuwo ecosystem on a defined port (8011).

---

## 2. Scope

### In Scope
- Creating the `apps/scratch` directory structure.
- Downloading/cloning the source code from `scratchfoundation/scratch-editor` (the unified editor repo).
- Modifying the start script / node configurations to ensure the development server runs on port `8011`.
- Ensuring the app installs dependencies and runs successfully in local dev mode.

### Out of Scope
- Backend integration for saving projects to cloud server.
- Nginx and ECS deployment (covered in CP-1.3).
- Customization of Scratch interface/logos (covered in CP-1.2).

---

## 3. Interface Contract

### Network Port Configuration
- Local development server will be bound to port `8011`.

---

## 4. Acceptance Criteria

- [ ] AC-1: `apps/scratch` is populated with the relevant source code.
- [ ] AC-2: Running `npm install` and `npm start` (or equivalent) successfully starts the developer server.
- [ ] AC-3: The application is accessible on `http://localhost:8011`.
- [ ] AC-4: The application GUI loads successfully in the browser.

---

## 5. Dependencies

- Depends on: None
- Blocks: `CP-1.2`

---

## Design

> *Filled in during Phase 2.*

---

## Implementation Notes

> *Filled in after implementation.*
