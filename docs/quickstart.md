# Quickstart

## Simulation (linux required)

### 1.1 Clone the simulation repository

```bash
cd /ros2_ws
```

```bash
git clone https://github.com/C-O-R-A/cora_desktop.git >> src/
colcon build --symlink-install
```

### 1.2 Install codi

```bash 
pip install git+https://github.com/C-O-R-A/CoDI.git
```

### 2. Start the simulation

In terminal 1

```bash
ros2 launch cora_gazebo gazebo.launch.py
```

:::{tip} Expected result
Gazebo opens with your configured arm. RViz2 shows the robot model with
MoveIt 2 loaded. You can send joint goals from the Motion Planning panel.
:::

<div>
    <img src="../../static/assets/screenshots/gazebo_viz.png" alt="Gazebo and Rviz" style="width:100%;border-radius:6px;margin-bottom:12px;" />
</div>

### 3. Run an example

In terminal 2

```bash
python3 examples/teleop_keyboard.py
```

### 4. Control with teleop

Control the arm with the following schema

| button | direction |
| --- | --- |
| w | forwards (+x) |
| a | left (-y) |
| x | backwards (-x) |
| d | right (+y) |
| s | switch control modes |


