import xml.etree.ElementTree as ET
import os

net_tree = ET.parse("manhattan.net.xml")
net_root = net_tree.getroot()

add_root = ET.Element('additional')

busstop_id = 1
parking_id = 1
cctv_id = 1

def add_bus_stop(edge_id, lane_idx):
    global busstop_id
    b = ET.SubElement(add_root, 'busStop')
    b.set('id', f'bus_stop_{busstop_id}')
    b.set('lane', f'{edge_id}_{lane_idx}')
    b.set('startPos', '0')
    b.set('endPos', '15')
    busstop_id += 1

def add_parking(edge_id, lane_idx, start='15', end='30'):
    global parking_id
    p = ET.SubElement(add_root, 'parkingArea')
    p.set('id', f'auto_stand_{parking_id}')
    p.set('lane', f'{edge_id}_{lane_idx}')
    p.set('startPos', start)
    p.set('endPos', end)
    p.set('roadsideCapacity', '3')
    parking_id += 1

def add_cctv(edge_id, lane_idx, cctv_type, pos):
    global cctv_id
    d = ET.SubElement(add_root, 'laneAreaDetector')
    d.set('id', f'cctv_{cctv_type}_{cctv_id:02d}')
    d.set('lane', f'{edge_id}_{lane_idx}')
    d.set('pos', str(pos))
    d.set('length', '10')
    d.set('freq', '60')
    d.set('file', 'outputs/detector_output.xml')
    cctv_id += 1

for edge in net_root.findall('edge'):
    if edge.get('function') == 'internal': continue
    eid = edge.get('id')
    typ = edge.get('type')
    
    lanes = edge.findall('lane')
    if not lanes: continue
    
    length = float(lanes[0].get('length', '0'))
    
    # We only place stops and sensors on edges long enough
    if length > 50:
        # CCTV queue (before signal) -> let's place it at length - 40
        add_cctv(eid, 0, 'signal_queue', length - 40)
        # CCTV midblock -> at 10
        add_cctv(eid, 0, 'midblock', 10)
        
        # Bus stop and parking
        if typ in ['highway.primary', 'highway.secondary']:
            add_bus_stop(eid, 0)
            add_parking(eid, 0)
        elif typ in ['highway.residential']:
            if int(eid[-1]) % 2 == 0:
                add_parking(eid, 0, '10', '30')

with open("manhattan_additionals.add.xml", "wb") as f:
    f.write(ET.tostring(add_root))

print("Additionals script complete.")
