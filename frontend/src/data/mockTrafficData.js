export const junctions = [
  {
    id: "J-001",
    name: "Main St & 5th Ave",
    status: "Heavy Traffic",
    statusColor: "orange",
    density: 75,
    vehicleCount: 120,
    signalState: "Red",
    timer: 25,
    emergency: false,
    accident: false,
    coordinates: { x: 10, y: 20 }
  },
  {
    id: "J-002",
    name: "Broadway & Park Row",
    status: "Smooth Traffic",
    statusColor: "green",
    density: 20,
    vehicleCount: 35,
    signalState: "Green",
    timer: 45,
    emergency: false,
    accident: false,
    coordinates: { x: 30, y: 40 }
  },
  {
    id: "J-003",
    name: "Empire Blvd & Flatbush",
    status: "Severe Congestion",
    statusColor: "red",
    density: 95,
    vehicleCount: 210,
    signalState: "Red",
    timer: 10,
    emergency: false,
    accident: true,
    coordinates: { x: 50, y: 60 }
  },
  {
    id: "J-004",
    name: "Lexington Ave & 42nd St",
    status: "Moderate Traffic",
    statusColor: "yellow",
    density: 45,
    vehicleCount: 85,
    signalState: "Yellow",
    timer: 5,
    emergency: true,
    accident: false,
    coordinates: { x: 70, y: 80 }
  },
  {
    id: "J-005",
    name: "Madison Ave & 59th St",
    status: "Road Block",
    statusColor: "black",
    density: 100,
    vehicleCount: 0,
    signalState: "Red",
    timer: 0,
    emergency: false,
    accident: false,
    coordinates: { x: 90, y: 100 }
  }
];

export const alerts = [
  {
    id: "A-101",
    location: "Empire Blvd & Flatbush",
    type: "Accident",
    typeColor: "purple",
    timestamp: "2026-03-16 11:30 AM",
    status: "Active"
  },
  {
    id: "A-102",
    location: "Lexington Ave & 42nd St",
    type: "Emergency Vehicle",
    typeColor: "blue",
    timestamp: "2026-03-16 11:40 AM",
    status: "Active"
  },
  {
    id: "A-103",
    location: "Madison Ave & 59th St",
    type: "Road Block",
    typeColor: "black",
    timestamp: "2026-03-16 09:15 AM",
    status: "Resolved"
  }
];

export const trafficStats = [
  { time: '08:00', density: 40, vehicles: 400 },
  { time: '09:00', density: 85, vehicles: 850 },
  { time: '10:00', density: 65, vehicles: 650 },
  { time: '11:00', density: 75, vehicles: 750 },
  { time: '12:00', density: 55, vehicles: 550 },
  { time: '13:00', density: 45, vehicles: 450 },
  { time: '14:00', density: 50, vehicles: 500 },
];

export const systemOverview = {
  totalJunctions: 24,
  activeSignals: 22,
  emergencyVehicles: 2,
  detectedAccidents: 1,
  roadBlocks: 1,
  overallCongestion: "Moderate"
};
