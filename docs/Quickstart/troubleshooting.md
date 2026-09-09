# Troubleshooting

## Segfault in gz_ros2_control

:::{warning} ABI mismatch — full clean rebuild required
This segfault occurs in STL destructor chains when locally built packages
were compiled against a different ABI than the system ROS 2 install.
:::

```bash
cd ~/ros2_ws
rm -rf build/ install/ log/
source /opt/ros/jazzy/setup.bash
colcon build --symlink-install
source install/setup.bash
```

## RViz2 sim-clock warning

Add `parameters=[{'use_sim_time': True}]` to the RViz2 node in your
launch file. See [Simulation](simulation.md).

## Onshape API rate limits

The free tier enforces annual call caps. For production use, publish
CORA as an Onshape App Store application via OAuth2 — this removes the
annual cap. The `EphemeralExporter` supports both auth paths.
