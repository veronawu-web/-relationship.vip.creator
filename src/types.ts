
export interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  group: 'core' | 'secure' | 'anxious' | 'avoidant' | 'disorganized';
  val: number;
  lastMessage?: string;
  messages?: string[];
  attachmentType?: string;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  value: number;
  intensity: number; // 0-1
  lastMessage?: string;
  streamerMessages?: string[];
  sentimentScore?: number; // 0 (Cold) to 100 (Passionate)
}
