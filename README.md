# ETE Maps SUMO Simulation

This project contains a SUMO (Simulation of Urban MObility) traffic simulation setup, specifically based on a Manhattan map. It includes infrastructure for various vehicle types, bus loops, traffic signals, and CCTVs.

## Project Structure

### Configuration Files (`.sumocfg`)
The simulation can be started using the following configuration files:
- **`simulation.sumocfg`**: The base simulation configuration file linking the network, routes, and additionals.
- **`simulation_gui.sumocfg`**: A configuration file used for running the simulation with the SUMO GUI.
- **`simulation_headless.sumocfg`**: A configuration file used for running the simulation without the GUI (useful for automated runs or training RL models).

### Python Setup Scripts
These scripts are used to programmatically generate and modify the simulation environment:
- **`modify_network.py`**: A vital script that updates road types (number of lanes, speed limits), determines traffic light placements at major intersections, and generates `manhattan_additionals.add.xml`. It automatically adds bus stops, parking areas, and CCTV detectors to the simulation.
- **`generate_additionals_safe.py`**: An alternative or supporting script to generate additional simulation elements like bus stops, parking stations, and lane area detectors (CCTVs) and save them to `manhattan_additionals.add.xml`.
- **`generate_split_traffic.py`**: Generates randomized traffic flows for different vehicle classes (motorcycles, passenger cars, trucks) using SUMO's `randomTrips.py` utility. It outputs specific route files (`routes_moto.rou.xml`, `routes_car.rou.xml`, `routes_truck.rou.xml`).
- **`find_bus_loop.py`**: Randomly pairs generated bus stops and uses `duarouter` to find a valid continuous looping route for buses. Upon success, it writes a continuous bus flow to `routes_bus.rou.xml`.

### XML Network & Route Files
- **`manhattan.net.xml`**: The core SUMO road network.
- **`manhattan_additionals.add.xml`**: Defines infrastructure elements like bus stops, parking, and detectors.
- **`routes_*.rou.xml`**: Contains the routing information for specific vehicle types (bus, car, moto, truck).
- **`outputs/`**: Directory where simulation outputs (like `tripinfo.xml` and detector outputs) are saved during simulation runs.

## Workflow & How It Works

1. **Network Modification**: 
   The network starts as a baseline OSM/plain network. Running `modify_network.py` or `generate_additionals_safe.py` adds necessary metadata such as lane speeds, traffic lights, and structural additionals (CCTVs, bus stops).

2. **Traffic Generation**: 
   To populate the simulation with traffic, use `generate_split_traffic.py` to create cars, motorcycles, and trucks. To ensure buses operate correctly on loops, `find_bus_loop.py` must be used to calculate a valid cyclic bus route.

3. **Running the Simulation**: 
   Once the definitions and routes are properly generated, open your terminal and run the simulation using SUMO:
   ```bash
   sumo-gui -c simulation_gui.sumocfg
   ```
   Or without GUI:
   ```bash
   sumo -c simulation_headless.sumocfg
   ```

4. **Reviewing Data**:
   Check the `outputs/` folder for trip statistics and detector data generated during the simulation run.
