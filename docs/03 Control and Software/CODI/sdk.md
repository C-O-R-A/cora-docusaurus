# CoDI

`codi` (CoDI — Cora Desktop Interface) is a TCP client/server SDK for
controlling and monitoring a CORA robot without writing ROS 2 directly.

## Installation

Install from github

```bash
pip install git+https://github.com/C-O-R-A/CoDI.git@main
```

Or install a specific release:

```bash
pip install git+https://github.com/C-O-R-A/CoDI.git@v0.1.0
```

From source (recommended during development)

```bash
cd codi && pip install -e .

# Once published
pip install codi
```

## Architecture

`CoraInterface` (base class for `CoraClient` and `CoraServer`) manages four
length-prefixed TCP sockets: `command`, `states`, `video`, `config`.

:::note
Config files accept a `vision_port`, but there is no dedicated vision
socket wired up yet — ArUco pose streaming isn't implemented in this
version despite references to it in the class docstrings.
:::

## Basic usage — client

```python
from codi import CoraClient
from codi.codi_enums import InterfaceType

client = CoraClient(filepath="config.yaml")
client._activate()

# Cartesian pose command
client.send_command(
    pose_command=(0.1, 0.0, 0.3, 0.0, 0.0, 0.0),
    interface_type=InterfaceType.POSITION,
)

# Joint-space command
client.send_command(
    joint_command=(0.0, 1.57, -0.5, 0.0, 0.0, 0.0),
    interface_type=InterfaceType.POSITION,
)

# Predefined pose
client.send_command(target="gripper", predef_pose="standby")

state = client.get_states()   # FeedbackObject | None
print(state.joint_states)     # dict[str, JointStateObject]
print(state.transforms)       # list[TransformObject]
print(state.status)

# Walk the transform chain between two frames
tf = state.lookup_transform("base_link", "tool0")  # 4x4 np.ndarray or None

frame = client.get_frame()    # requires use_camera=True
```

:::note
`send_command` requires **exactly one** of `pose_command` or
`joint_command`. Passing both, or neither, raises `ProtocolSchemaError`.
:::

Enable video streaming and reconcile the receive threads:

```python
client.configure_robot(use_camera=True)
```

## Basic usage — server

```python
from codi import CoraServer
from codi.codi_enums import MoveStatus

server = CoraServer(filepath="config.yaml")
server.start()

server.send_state(transforms, jointstates, MoveStatus.IDLE)
server.send_frame(image)   # numpy array (H, W, C)

command = server.get_command()   # CommandMessage | None
config = server.get_config()     # ConfigMessage | None
```

:::caution
`send_frame`'s `encoding`/`quality` parameters aren't applied yet — the
image is currently sent as a raw pixel array (`image.tolist()`), not
JPEG/PNG-compressed. Treat the video path as work-in-progress.
:::

## Config file

```yaml
host: 192.168.1.100
ports:
  command_port: 5000
  states_port: 5001
  video_port: 5002
  config_port: 5003
```

`.json` config files are also supported.

## Enums (`codi_enums`)

| Enum | Values |
|---|---|
| `InterfaceType` | `POSITION`, `VELOCITY`, `EFFORT` |
| `GoalSpace` | `JS`, `TS` |
| `MoveStatus` | `IDLE`, `MOVING`, `BRAKE`, `ERROR`, `ODRIVE_ERROR` |

## Messages (`messages`)

Wire-protocol models (Pydantic v2, JSON over length-prefixed TCP frames).
All of them set `use_enum_values = True`, so decoded enum fields come back
as their underlying value, not the enum member.

- **`CommandMessage`** — `pose_command` | `joint_command` (exactly one),
  `interface_type`, `rt`, `target`, `gripper_command`, `predef_pose`
- **`FeedbackMessage`** — `transforms` (`TFMessage`), `joint_states`
  (`JointStates`), `status`
- **`ConfigMessage`** — `named_state`, `rt`, `space`, `interface_type`,
  `target`, `enable_camera`
- **`ImageMessage`** — `encoding`, `shape`, `dtype`, `data`, `quality`

Lightweight (non-Pydantic) objects returned by `CoraClient.get_states()`:

- `JointStateObject(position, velocity, effort)`
- `TransformObject(parent, child, position, orientation, transform_matrix)`
- `FeedbackObject(joint_states, transforms, status)` — exposes
  `.lookup_transform(parent_frame, child_frame)`, which walks the
  child → parent transform chain and returns a 4×4 `numpy` matrix, or
  `None` if there's no path between the two frames.

## Protocol (`protocol`)

```python
from codi import protocol as pt

payload = pt.encode(message)          # pydantic model -> JSON -> bytes
message = pt.decode(payload, Model)   # bytes -> JSON -> pydantic model
```

Only `encode` and `decode` are exported. Framing (4-byte big-endian length
prefix + JSON payload) is handled internally by
`CoraInterface._send` / `_receive`.

## Runtime (`runtime`)

Singleton convenience wrapper around a single `CoraClient` instance:

```python
import codi.runtime as rt

rt.start_client("config.yaml")
client = rt.get_client()
rt.stop_client()
```

## Exceptions (`exeptions`)

:::caution
Module name is `codi.exeptions` — the typo is preserved to match the
actual filename.
:::

- `ProtocolError` — base class
- `ProtocolSchemaError` — missing keys or wrong types
- `ProtocolSemanticError` — invalid values, shapes, ranges

## Connection lifecycle

:::note
`CoraClient._activate()` starts a background supervisor thread that
cycles `disconnected → connected → configured → ready`, automatically
tearing down and reconnecting if `states_socket`, `command_socket`, or
`config_socket` drop. `CoraServer.start()` runs the equivalent supervisor
and re-accepts a new client connection after any disconnect.
:::

## Full API reference

See [Python SDK API Reference](../api/python/index.md) for the full
class and method listing generated from `codi/src/` docstrings.