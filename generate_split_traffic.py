import os
import xml.etree.ElementTree as ET
import random
import subprocess
import math

sumo_home = os.environ.get("SUMO_HOME", "")

# 1. Parse bus stops
stops = []
tree = ET.parse("manhattan_additionals.add.xml")
for el in tree.getroot().findall('busStop'):
    stops.append({
        'id': el.get('id'),
        'lane': el.get('lane'),
        'edge': el.get('lane').rsplit('_', 1)[0]
    })

# Select 5 stops for the looping route
route_stops = random.sample(stops, min(5, len(stops)))
# To loop back and forth, we go A -> B -> C -> D -> E -> D -> C -> B -> A
loop_sequence = route_stops + route_stops[::-1][1:]

with open("bus_trips.xml", "w") as f:
    f.write('<routes>\n')
    f.write('  <vType id="bus_type" vClass="bus"/>\n')
    # Generate 450 buses over 3600 seconds, so about 1 bus every 8 seconds
    # But user wants a single defined route that loops, and vehicles deployed on it.
    
    # We will write multiple trips, one for each departure time. 
    # Or just write flows. Let's write flows.
    f.write('  <flow id="bus_loop" type="bus_type" begin="0" end="3600" period="8" from="%s" to="%s">\n' % (loop_sequence[0]['edge'], loop_sequence[-1]['edge']))
    
    # add vias for the intermediate stops to force duarouter
    vias = " ".join([s['edge'] for s in loop_sequence[1:-1]])
    # We will just write the stops. DUAROUTER will route through them.
    for s in loop_sequence:
        f.write('    <stop busStop="%s" duration="20"/>\n' % s['id'])
    
    f.write('  </flow>\n')
    f.write('</routes>\n')

# Use duarouter to route the buses
subprocess.run([
    'duarouter', '-n', 'manhattan.net.xml',
    '-r', 'bus_trips.xml',
    '-a', 'manhattan_additionals.add.xml',
    '-o', 'routes_bus.rou.xml',
    '--ignore-errors'
])

# 2. Generate other traffic
# Total 4500 vehicles
# Motorcycles: double previous amount -> period 1.0
print("Generating motorcycles...")
subprocess.run([
    'python', os.path.join(sumo_home, 'tools', 'randomTrips.py'),
    '-n', 'manhattan.net.xml',
    '-o', 'trips_moto.xml',
    '--begin', '0', '--end', '3600',
    '--period', '1.0',
    '--fringe-factor', '5',
    '--vehicle-class', 'motorcycle',
    '--prefix', 'moto_'
])
subprocess.run(['duarouter', '-n', 'manhattan.net.xml', '-t', 'trips_moto.xml', '-o', 'routes_moto.rou.xml', '--ignore-errors'])

# Cars: 30% (1350) -> period 2.66
print("Generating cars...")
subprocess.run([
    'python', os.path.join(sumo_home, 'tools', 'randomTrips.py'),
    '-n', 'manhattan.net.xml',
    '-o', 'trips_car.xml',
    '--begin', '0', '--end', '3600',
    '--period', '2.66',
    '--fringe-factor', '5',
    '--vehicle-class', 'passenger',
    '--prefix', 'car_'
])
subprocess.run(['duarouter', '-n', 'manhattan.net.xml', '-t', 'trips_car.xml', '-o', 'routes_car.rou.xml', '--ignore-errors'])

# Big vehicles: 20% of previous -> period 20.0
print("Generating trucks/autos...")
subprocess.run([
    'python', os.path.join(sumo_home, 'tools', 'randomTrips.py'),
    '-n', 'manhattan.net.xml',
    '-o', 'trips_truck.xml',
    '--begin', '0', '--end', '3600',
    '--period', '20.0',
    '--fringe-factor', '5',
    '--vehicle-class', 'truck',
    '--prefix', 'truck_'
])
subprocess.run(['duarouter', '-n', 'manhattan.net.xml', '-t', 'trips_truck.xml', '-o', 'routes_truck.rou.xml', '--ignore-errors'])

print("All traffic generated successfully.")
