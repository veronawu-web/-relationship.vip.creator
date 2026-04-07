
export interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  group: 'core' | 'high' | 'support' | 'cool';
  val: number;
  lastMessage?: string;
  messages?: string[];
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  value: number;
  intensity: number; // 0-1
  lastMessage?: string;
}
