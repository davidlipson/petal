export interface Adjacency {
  a_name: string;
  b_name: string;
  a_geometry: string;
  b_geometry: string;
  street_length: number;
  road_type: number;
  street_name: string;
  departing_angle: number; // angle leaving a node
  arriving_angle:  number; // angle arriving at b node
  geometry: string;
  bike_lanes: any[];
}
