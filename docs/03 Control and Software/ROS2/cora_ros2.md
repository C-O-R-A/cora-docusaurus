# ROS 2 API

CORA uses ROS 2 as the distributed robotic software backend. Usage is largely the same as any other ROS 2 application. The supported release is **ROS 2 Jazzy LTS** on Ubuntu 24.04.

## Packages

The ROS 2 backend spans three repositories, each a self-contained workspace:

| Repository | Contents |
|------------|----------|
| [**cora_common**](https://github.com/C-O-R-A/cora_common) | Shared packages used by both real robot and simulation |
| [**cora_robot**](https://github.com/C-O-R-A/cora_robot) | On-board robot packages: ODrive ros2_control hardware interface, ODrive setup scripts |
| [**cora_desktop**](https://github.com/C-O-R-A/cora_desktop) | Desktop simulation packages: Gazebo launch files and world configs |

### cora_common packages

| Package | Purpose |
|---------|---------|
| `cora_bringup` | Top-level launch files for real robot and simulation |
| `cora_codi` | ROS 2 bridge node connecting the CoDI SDK to the hardware stack |
| `cora_description` | URDF, XACRO, and mesh files for the robot |
| `cora_gripper_1_description` | URDF and meshes for the default gripper |
| `cora_moveit` | MoveIt 2 Python action server (`mover_node`) and keyboard servo test |
| `cora_moveit_config` | MoveIt 2 SRDF, kinematics, and controller config |
| `cora_msgs` | Custom message and action definitions |
| `cora_vision` | Lifecycle camera node and ArUco marker detection |

### cora_robot packages

| Package | Purpose |
|---------|---------|
| `odrive_ros2_control` | ros2_control hardware interface plugin for ODrive v3.6 over CAN |
| `odrive_msgs` | ODrive-specific ROS 2 messages (axis state, errors, joint status) |
| `odrive_base` | SocketCAN and CAN message helpers (C++ headers) |
| `odrive_setup` | Python scripts for ODrive configuration and calibration |

## ROS 2 Interfaces

### Topics

| Topic | Type | Publisher | Notes |
|-------|------|-----------|-------|
| `/joint_states` | `sensor_msgs/JointState` | `ros2_control_node` | Joint positions |
| `/tf` | `tf2_msgs/TFMessage` | `robot_state_publisher` | Full transform tree |
| `/tfstatic` | `tf2_msgs/TFMessage` | `static_transform_publisher` | `world` → `base_link` |
| `/robot_description` | `std_msgs/String` | `robot_state_publisher` | URDF string latched on startup |
| `/servo_node/delta_twist_cmds` | `geometry_msgs/TwistStamped` | `codi_node` | Real-time Cartesian velocity commands |
| `/servo_node/delta_joint_cmds` | `control_msgs/JointJog` | `codi_node` | Real-time joint velocity commands |
| `/servo_node/delta_pose_cmds` | `geometry_msgs/PoseStamped` | `codi_node` | Real-time Cartesian pose commands |
| `/arm_controller/joint_trajectory` | `trajectory_msgs/JointTrajectory` | `servo_node` | Outgoing trajectory to arm controller |
| `/gripper_cam/image_raw` | `sensor_msgs/Image` | `camera_node` | Raw gripper camera feed |
| `/gripper_cam/aruco` | `vision_msgs/MarkerArray` | `vision_node` | Detected ArUco markers |

### Actions

#### `posegoal` — `cora_msgs/action/PoseGoal`

The main motion planning action. Served by `mover_node` in `cora_moveit`, called by `codi_node`.

**Goal**

```yaml
cora_msgs/TargetedPoseStamped pose_goal   # Cartesian pose + target frame
float64[] joint_goal                      # Joint positions [J1..J6] in radians
float64 gripper_goal                      # Gripper opening in metres
string predefined_pose                    # Named state from SRDF e.g. 'standby', 'straight'
string space                              # 'TS' (task space) or 'JS' (joint space)
string interface_type                     # 'position', 'velocity', 'acceleration', or 'effort'
```

**Result**

```yaml
geometry_msgs/PoseStamped pose_result     # Achieved end-effector pose
float64[] joint_result                    # Achieved joint positions
string status_result                      # 'Complete' or error description
bool success
```

**Feedback**

```yaml
geometry_msgs/PoseStamped pose_feedback
string status
```

#### `arm_controller/follow_joint_trajectory` — `control_msgs/action/FollowJointTrajectory`

Standard ros2_control trajectory execution action for the `arm` group (J1–J6). Used internally by MoveIt 2.

#### `gripper_fingers_controller/gripper_cmd` — `control_msgs/action/GripperCommand`

Standard parallel gripper action for the `gripper_fingers` group (Finger1, Finger2).

### Services

#### MoveIt Servo

| Service | Type | Notes |
|---------|------|-------|
| `servo_node/switch_command_type` | `moveit_msgs/srv/ServoCommandType` | Switch between `JOINT_JOG`, `TWIST`, and `POSE` input modes |

#### Lifecycle nodes

| Service | Type | Notes |
|---------|------|-------|
| `/vision_node/change_state` | `lifecycle_msgs/srv/ChangeState` | Activate/deactivate ArUco detection |
| `/camera_node/change_state` | `lifecycle_msgs/srv/ChangeState` | Activate/deactivate camera node |
| `/controller_node/change_state` | `lifecycle_msgs/srv/ChangeState` | Activate/deactivate controller node |

#### MoveIt 2 (via `move_group`)

| Service | Type |
|---------|------|
| `/compute_ik` | `moveit_msgs/srv/GetPositionIK` |
| `/compute_fk` | `moveit_msgs/srv/GetPositionFK` |
| `/plan_kinematic_path` | `moveit_msgs/srv/GetMotionPlan` |

### Custom message definitions

#### `cora_msgs/msg/TargetedPoseStamped`

```
string target_frame                       # 'Gripper', 'Camera', or 'endeffector'
geometry_msgs/PoseStamped pose
```

## SRDF — planning groups and named states

| Group | Joints |
|-------|--------|
| `arm` | J1, J2, J3, J4, J5, J6 (chain: `baselink` → `endeffector`) |
| `gripper_fingers` | Finger1, Finger2 |

| Named state | Group | Description |
|-------------|-------|-------------|
| `straight` | arm | All joints at 0 rad |
| `standby` | arm | Folded upright position |
| `standby_2` | arm | Alternate standby |
| `open` | gripper_fingers | Finger1 = 0.035 m |
| `closed` | gripper_fingers | Finger1 = 0 m |

## Launch files

### `bringup.launch.py`

Full robot launch. Starts the CoDI node after a 30 s delay to allow MoveIt to initialise.

```bash
ros2 launch cora_bringup bringup.launch.py \
  hardware_type:=Real \
  gripper_package:=cora_gripper_1_description \
  use_codi:=true
```

| Parameter | Options | Default |
|-----------|---------|---------|
| `hardware_type` | `Fake`, `Real`, `Gazebo` | `Fake` |
| `gripper_package` | any gripper description package | `None` |
| `use_codi` | `true`, `false` | `true` |
| `launch_rsp` | `true`, `false` | `true` |

### `move.launch.py`

Full MoveIt 2 stack: `move_group`, `servo_node`, `ros2_control_node`, `robot_state_publisher`, RViz, and controller spawners.

```bash
ros2 launch cora_moveit move.launch.py \
  hardware_type:=Real \
  use_servo:=true \
  use_moveitpy:=true \
  gripper_package:=cora_gripper_1_description
```

### `vision.launch.py`

Camera node and ArUco detection.

```bash
ros2 launch cora_bringup vision.launch.py
```

### `gazebo.launch.py`

Full Gazebo simulation with bridge, spawner, and bringup.

```bash
ros2 launch cora_gazebo gazebo.launch.py \
  gripper_package:=cora_gripper_1_description
```

## Simulation

### Installation

```bash
git clone --recurse-submodules https://github.com/C-O-R-A/cora_desktop.git
cd cora_desktop
bash install.sh
source install/setup.bash
```

### Usage

```bash
ros2 launch cora_gazebo gazebo.launch.py
```

MoveIt 2 and RViz launch alongside Gazebo. Use the MoveIt motion planning panel in RViz to plan and execute trajectories, or send `PoseGoal` action goals via CoDI.

## Real Robot

### ODrive Setup

Each joint uses an ODrive v3.6 board over CAN at 250 kbps. Node IDs are assigned per-joint in `cora.ros2_control.xacro` (J1=0, J2=1, ... J6=5, Finger1=6).

**1. Bring up CAN interface**

```bash
sudo ip link set can0 up type can bitrate 250000
```

This is automated on boot via the `can0-up.service` installed by `install.sh`.

**2. Load motor config**

```bash
# 6354 270KV motors
odrivetool restore-config odrive_setup/configs/closed_loop_6354.json

# 5065 140KV motors
odrivetool restore-config odrive_setup/configs/closed_loop_5065.json
```

**3. Calibrate**

```bash
python3 odrive_setup/quicksetup.py odrive_setup/configs/closed_loop_6354.json --axis 0
```

This automates the full calibration sequence: config restore → full calibration → set `pre_calibrated` flags → save and reboot.

**4. Test**

```bash
python3 odrive_setup/quicktest.py --axis 0 --mode velocity
```

### Installation

```bash
git clone --recurse-submodules https://github.com/C-O-R-A/cora_robot.git
cd cora_robot
bash install.sh
source install/setup.bash
```

### Usage

```bash
ros2 launch cora_bringup bringup.launch.py \
  hardware_type:=Real \
  gripper_package:=cora_gripper_1_description
```

:::warning CAN bus
Make sure `can0` is up before launching. The `install.sh` installs a `can0-up.service` systemd service that brings it up automatically on boot.
:::

## Adding a Custom Gripper

1. Create a package with this structure:

```
gripper_description/
    meshes/
    urdf/
        cora_gripper.urdf
        cora_gripper.urdf.xacro       # macro name: cora_gripper_xacro
        cora_gripper.ros2_control.xacro
```

2. The xacro macro must be named `cora_gripper_xacro` with params `hardware_type` and `initial_positions_file`.

3. Required joint names: `Finger1` (prismatic, main) and `Finger2` (prismatic, mimic).

4. Required dummy links and fixed joints: `Gripper`, `Camera`, `Camera_optical` with joints `Gripper_frame`, `Camera_frame`, `Camera_frame_optical`.

5. Launch with your package:

```bash
ros2 launch cora_bringup bringup.launch.py gripper_package:=your_gripper_description
```