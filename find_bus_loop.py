import os
import xml.etree.ElementTree as ET
import subprocess
import random

# Find all busstops
tree = ET.parse("manhattan_additionals.add.xml")
stops = {}
for el in tree.getroot().findall('busStop'):
    stops[el.get('id')] = el.get('lane')[:-2]  # remove _0

stop_ids = list(stops.keys())
# pick two random stops until we find a pair that duarouter can connect both ways
success = False

for _ in range(50):
    s1 = random.choice(stop_ids)
    s2 = random.choice(stop_ids)
    if s1 == s2:
        continue
    
    e1 = stops[s1]
    e2 = stops[s2]
    
    with open("bus_test_trip.xml", "w") as f:
        f.write('<routes>\n')
        f.write('  <vType id="bus_type" vClass="bus"/>\n')
        f.write(f'  <trip id="test" type="bus_type" depart="0" from="{e1}" to="{e1}" via="{e2}">\n')
        f.write(f'    <stop busStop="{s1}" duration="20"/>\n')
        f.write(f'    <stop busStop="{s2}" duration="20"/>\n')
        f.write(f'  </trip>\n')
        f.write('</routes>\n')
    
    res = subprocess.run([
        'duarouter', '-n', 'manhattan.net.xml',
        '-r', 'bus_test_trip.xml',
        '-a', 'manhattan_additionals.add.xml',
        '-o', 'bus_test_route.rou.xml',
        '--ignore-errors'
    ], capture_output=True, text=True)
    
    if "no valid route" not in res.stderr and "No connection" not in res.stderr:
        print(f"Found valid loop: {s1} -> {s2} -> {s1}")
        
        # Now create the actual flows using this valid round trip
        with open("bus_flow.xml", "w") as f:
            f.write('<routes>\n')
            f.write('  <vType id="bus_type" vClass="bus"/>\n')
            f.write(f'  <flow id="bus_loop" type="bus_type" begin="0" end="3600" period="8" from="{e1}" to="{e1}" via="{e2}">\n')
            f.write(f'    <stop busStop="{s1}" duration="20"/>\n')
            f.write(f'    <stop busStop="{s2}" duration="20"/>\n')
            f.write(f'  </flow>\n')
            f.write('</routes>\n')
            
        subprocess.run([
            'duarouter', '-n', 'manhattan.net.xml',
            '-r', 'bus_flow.xml',
            '-a', 'manhattan_additionals.add.xml',
            '-o', 'routes_bus.rou.xml',
            '--ignore-errors'
        ])
        success = True
        break

if not success:
    print("Could not find a valid looping bus route.")
