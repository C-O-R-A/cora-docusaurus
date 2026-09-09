# Adding a Custom Joint

CORA is designed to be extended without modifying platform code.
A new joint type is a self-contained folder.

## Folder structure

```
<ros_package>/joints/
└── your_joint_id/
    ├── manifest.json                   # required — see Joint Manifest Schema
    ├── description                     # CadQuery parametric script
        ├── meshes                      # meshes folder
        |    ├── your_joint_id.gltf     # visual mesh
        └── your_joint_id.urdf.xacro    # simplified collision mesh
```

## Steps

**1. Create the folder**

Use your joint ID (snake_case) as the folder name.

**2. Write `manifest.json`**

Follow the [Joint Manifest Schema](schema.md). Validation runs on
server startup — the backend will refuse to start if any manifest is invalid.

**2. Add mesh files**

Provide a visual mesh (`.dae` or `.stl`) and a simplified collision
mesh (`.stl`). Reference both in the manifest `mesh` field.

**3. Create URDF**

Create the urdf using the frame standard described in [Joint Frames](frames.md).
