import xml.etree.ElementTree as ET
import os

# 1. Update Types
typ_tree = ET.parse("manhattan_plain.typ.xml")
typ_root = typ_tree.getroot()

for type_elem in typ_root.findall('type'):
    tid = type_elem.get('id')
    if tid in ['highway.primary', 'highway.secondary']:
        type_elem.set('numLanes', '3')
        type_elem.set('speed', '13.9')
    elif tid in ['highway.residential', 'highway.unclassified']:
        type_elem.set('numLanes', '2')
        type_elem.set('speed', '11.0')
    elif tid in ['highway.living_street', 'highway.service']:
        type_elem.set('numLanes', '1')
        type_elem.set('speed', '8.0')

typ_tree.write("manhattan_plain.typ.xml")

# 2. Extract Edges and Nodes to find signalized and major roads
nod_tree = ET.parse("manhattan_plain.nod.xml")
nod_root = nod_tree.getroot()
tls_nodes = set()
for node in nod_root.findall('node'):
    if node.get('type') == 'traffic_light':
        tls_nodes.add(node.get('id'))

tls_nodes = set() # We might not have TLS nodes yet, so we will assign node type traffic_light to larger intersections
node_incoming = {} # node_id -> list of edge_ids
node_outgoing = {} # node_id -> list of edge_ids

edg_tree = ET.parse("manhattan_plain.edg.xml")
edg_root = edg_tree.getroot()

edges = {}
for edge in edg_root.findall('edge'):
    eid = edge.get('id')
    frm = edge.get('from')
    to = edge.get('to')
    typ = edge.get('type')
    numLanes = int(edge.get('numLanes', 1))
    # if it inherits from type, we might not have numLanes in edge, let's infer
    if not numLanes and typ:
        if typ in ['highway.primary', 'highway.secondary']: numLanes = 3
        elif typ in ['highway.residential', 'highway.unclassified']: numLanes = 2
        else: numLanes = 1
    
    edges[eid] = {
        'from': frm, 'to': to, 'type': typ, 'numLanes': numLanes, 'length': 0.0 # will guess length for now
    }
    
    if frm not in node_outgoing: node_outgoing[frm] = []
    node_outgoing[frm].append(eid)
    
    if to not in node_incoming: node_incoming[to] = []
    node_incoming[to].append(eid)

for node in nod_root.findall('node'):
    nid = node.get('id')
    inc = len(node_incoming.get(nid, []))
    out = len(node_outgoing.get(nid, []))
    if inc + out >= 6: # Major intersection
        node.set('type', 'traffic_light')
        tls_nodes.add(nid)
nod_tree.write("manhattan_plain.nod.xml")


# 3. Generate Additionals
add_root = ET.Element('additional')

busstop_id = 1
parking_id = 1
cctv_id = 1
cross_id = 1

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

def add_cctv(edge_id, lane_idx, cctv_type, pos='-10'):
    global cctv_id
    d = ET.SubElement(add_root, 'laneAreaDetector')
    d.set('id', f'cctv_{cctv_type}_{cctv_id:02d}')
    d.set('lane', f'{edge_id}_{lane_idx}')
    d.set('pos', pos)
    d.set('length', '10')
    d.set('freq', '60')
    d.set('file', 'outputs/detector_output.xml')
    cctv_id += 1


for eid, edata in edges.items():
    typ = edata['type']
    if not typ: continue
    
    # Traffic signals and CCTVs at TLS
    if edata['to'] in tls_nodes:
        # CCTV queue (before signal)
        add_cctv(eid, 0, 'signal_queue', '-30')
        add_cctv(eid, 0, 'midblock', '10')
    
    if typ in ['highway.primary', 'highway.secondary']:
        # Major roads: Add bus stops, parking, priority
        # Bus stop before intersection
        add_bus_stop(eid, 0)
        
        # Parking near bus stop
        add_parking(eid, 0)
        
    elif typ in ['highway.residential']:
        # Occasional parking
        if int(eid[-1]) % 2 == 0:
            add_parking(eid, 0, '10', '30')

with open("manhattan_additionals.add.xml", "wb") as f:
    f.write(ET.tostring(add_root))

print("Modification scripts complete.")
