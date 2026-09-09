# Joint Manifest Schema

Every joint in the CORA library is defined by a `manifest.json`.
This file is the contract between the configurator, the export pipeline,
and the physical build instructions.

## Top-level fields

| Field | Type | |
|-------|------|--|
| `id` | `string` | <span class="tag-required">required</span> Unique joint type identifier. Used as the folder name. |
| `display_name` | `string` | <span class="tag-required">required</span> Human-readable label in the configurator. |
| `type` | `enum` | <span class="tag-required">required</span> `revolute` \| `prismatic` \| `fixed` |
| `axis` | `[x, y, z]` | <span class="tag-required">required</span> Joint axis vector. REP-103: metres. |
| `limits` | `object` | <span class="tag-required">required</span> Position, velocity, and effort limits. |
| `params` | `object` | <span class="tag-optional">optional</span> Joint-type-specific parameters. |
| `connectors` | `object` | <span class="tag-optional">optional</span> Electrical connector layout. |
| `mesh` | `object` | <span class="tag-required">required</span> Paths to visual and collision meshes. |

## Example manifest

```json
{
  "id": "revolute_80mm",
  "display_name": "Revolute 80 mm",
  "type": "revolute",
  "axis": [0, 0, 1],
  "limits": {
    "lower": -3.14159,
    "upper":  3.14159,
    "velocity": 1.5,
    "effort":   10.0
  },
  "params": {
    "gear_ratio": 50,
    "motor_model": "T-Motor AK10-9",
    "housing_diameter_mm": 80
  },
  "connectors": {
    "power_in":  "XT60_panel",
    "power_out": "XT60_panel",
    "can_in":    "M12_A5_bulkhead",
    "can_out":   "M12_A5_bulkhead"
  },
  "mesh": {
    "visual":    "mesh.dae",
    "collision": "mesh_collision.stl"
  }
}
```
