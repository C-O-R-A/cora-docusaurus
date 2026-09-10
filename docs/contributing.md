# Contributing

CORA is built by and for the student association. All contributions welcome —
new joint types, bug fixes, documentation, or build guides.

## Where to contribute

| Area | What's needed |
|------|--------------|
| Joint library | New joint types (prismatic, spherical, gripper). See [Adding a Joint](../docs/01%20Configuration/Contribute/joint-custom.md). |
| Configurator | Joint parameter panels, export progress modal, connection validation UX. |
| Export pipeline | STEP assembly generation, URDF collision refinement. |
| codi SDK | Motion primitives, gripper API, trajectory recording. |
| Documentation | Build photos, wiring diagrams, video walkthroughs. |

## PR checklist

:::tip 
Before opening a PR
New joint types must include a valid `manifest.json` (CI runs schema validation) and a mesh file pair.
Backend changes must not break the existing export paths.
:::
