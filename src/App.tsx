import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Heart, MessageCircle, Zap, Shield, User, Info, Activity, Search, X, Hand, ZoomIn, ZoomOut, MessageSquare, Flame, Thermometer } from 'lucide-react';
import { NODES, LINKS } from './constants';
import { Node, Link } from './types';

export default function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'dialogue' | 'entanglement'>('heatmap');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1159') {
      setIsAuthorized(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const zoomToNodes = useCallback((nodeIds: Set<string>) => {
    if (!svgRef.current || !zoomRef.current || nodeIds.size === 0) return;
    const svg = d3.select(svgRef.current);
    const g = svg.select('.main-container');
    
    const matchedNodes = NODES.filter(n => nodeIds.has(n.id));
    if (matchedNodes.length === 0) return;

    const padding = 100;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    matchedNodes.forEach(n => {
      minX = Math.min(minX, (n as any).x - 50);
      minY = Math.min(minY, (n as any).y - 50);
      maxX = Math.max(maxX, (n as any).x + 50);
      maxY = Math.max(maxY, (n as any).y + 50);
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const midX = minX + width / 2;
    const midY = minY + height / 2;
    
    const fullWidth = window.innerWidth;
    const fullHeight = window.innerHeight;
    
    const scale = Math.min(2, 0.7 / Math.max(width / fullWidth, height / fullHeight));
    const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
    
    svg.transition().duration(1000).ease(d3.easeCubicInOut).call(
      zoomRef.current.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
  }, []);

  const fitToScreen = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = svg.select('.main-container');
    const bounds = (g.node() as SVGGElement)?.getBBox();
    
    if (bounds && bounds.width > 0 && bounds.height > 0) {
      const fullWidth = window.innerWidth;
      const fullHeight = window.innerHeight;
      const width = bounds.width;
      const height = bounds.height;
      const midX = bounds.x + width / 2;
      const midY = bounds.y + height / 2;
      
      const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
      const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
      
      svg.transition().duration(750).call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
    }
  }, []);

  const handleZoom = useCallback((direction: 'in' | 'out' | 'reset') => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    
    if (direction === 'reset') {
      fitToScreen();
      return;
    }

    const factor = direction === 'in' ? 1.5 : 0.6;
    svg.transition().duration(300).call(zoomRef.current.scaleBy, factor);
  }, [fitToScreen]);

  const filteredNodes = useMemo(() => {
    if (!searchQuery) return NODES;
    return NODES.filter(node => 
      node.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const entanglementData = useMemo(() => {
    const keywords = ['封鎖', '吵架', '難過', '失望', '壓力', '控制', '放棄', '生氣', '不爽', '冷暴力', '止損', '偏執', '痛苦', '排擠', '禁言', '跨不出去', '煎熬', '走心', '遺忘', '欺負', '對不起', '沒辦法', '結束', '拒絕', '累', '不想見面'];
    const excludeKeywords = ['愛你', '想你', '啾咪', '嘻嘻', '麼麼', '寶貝', '甜蜜', '專屬', '寵', '羞', '❤️', '😻', '💋', '夢到我'];
    
    return LINKS.filter(link => {
      const allMsgs = [
        ...(link.streamerMessages || []),
        link.lastMessage || ''
      ];
      
      // Check if any message contains a conflict keyword
      const hasConflict = allMsgs.some(msg => keywords.some(k => msg.includes(k)));
      
      return hasConflict;
    }).map(link => {
      const sourceNode = NODES.find(n => n.id === (typeof link.source === 'string' ? link.source : (link.source as any).id));
      const targetNode = NODES.find(n => n.id === (typeof link.target === 'string' ? link.target : (link.target as any).id));
      
      // Filter the messages shown in entanglement to exclude purely coquettish ones
      const filteredStreamerMessages = (link.streamerMessages || []).filter(msg => {
        const isCoquettish = excludeKeywords.some(ek => msg.includes(ek)) && !keywords.some(k => msg.includes(k));
        return !isCoquettish;
      });

      return { ...link, sourceNode, targetNode, filteredStreamerMessages };
    });
  }, []);

  const streamerDialogues = useMemo(() => {
    return LINKS.filter(link => link.streamerMessages && link.streamerMessages.length > 0)
      .map(link => {
        const sourceNode = NODES.find(n => n.id === (typeof link.source === 'string' ? link.source : (link.source as any).id));
        const targetNode = NODES.find(n => n.id === (typeof link.target === 'string' ? link.target : (link.target as any).id));
        return { ...link, sourceNode, targetNode };
      })
      .sort((a, b) => (b.sentimentScore || 0) - (a.sentimentScore || 0));
  }, []);

  const sentimentChartData = useMemo(() => {
    return streamerDialogues.map(d => ({
      name: `${d.targetNode?.id} ➔ ${d.sourceNode?.id}`,
      score: d.sentimentScore || 0,
      streamer: d.targetNode?.id,
      user: d.sourceNode?.id
    }));
  }, [streamerDialogues]);

  useEffect(() => {
    if (!svgRef.current || !isAuthorized) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('class', 'main-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 5])
      .filter((event) => {
        return !event.button && event.type !== 'dblclick';
      })
      .on('start', () => {
        svg.style('cursor', 'grabbing');
      })
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      })
      .on('end', () => {
        svg.style('cursor', 'grab');
      });

    zoomRef.current = zoom;
    svg.call(zoom)
      .on('dblclick.zoom', null)
      .style('cursor', 'grab');

    svg.on('click', () => setSelectedNode(null)); // Click background to deselect

    // Reset positions and fixed states to ensure they spread out
    NODES.forEach(d => {
      d.x = width / 2 + (Math.random() - 0.5) * 400;
      d.y = height / 2 + (Math.random() - 0.5) * 400;
      d.fx = null;
      d.fy = null;
    });

    const simulation = d3.forceSimulation<Node>(NODES)
      .force('link', d3.forceLink<Node, Link>(LINKS).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('collision', d3.forceCollide().radius(100))
      .stop();

    // Run simulation for a few ticks to get stable positions, then fix them
    for (let i = 0; i < 300; ++i) simulation.tick();
    NODES.forEach(d => {
      d.fx = d.x;
      d.fy = d.y;
    });

    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      svg.attr('width', w).attr('height', h);
      // Re-center if needed, but keep relative positions
    };

    window.addEventListener('resize', updateDimensions);

    const defs = svg.append('defs');
    const linkGradient = defs.append('linearGradient')
      .attr('id', 'link-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    linkGradient.append('stop').attr('offset', '0%').attr('stop-color', '#BF5AF2').attr('stop-opacity', 0.6);
    linkGradient.append('stop').attr('offset', '100%').attr('stop-color', '#007AFF').attr('stop-opacity', 0.6);

    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    const linkGroup = g.append('g').attr('class', 'links-layer');
    const nodeGroupLayer = g.append('g').attr('class', 'nodes-layer'); 
    const labelsGroupLayer = g.append('g').attr('class', 'labels-layer'); // New layer for labels to stay on top
    
    const link = linkGroup.selectAll('line')
      .data(LINKS)
      .enter().append('line')
      .attr('stroke', 'url(#link-gradient)')
      .attr('stroke-opacity', d => 0.2 + d.intensity * 0.5)
      .attr('stroke-width', d => 2 + d.intensity * 6)
      .attr('stroke-linecap', 'round')
      .style('pointer-events', 'none');

    // Add invisible wider lines for better interaction
    const linkHitArea = linkGroup.selectAll('line.hit-area')
      .data(LINKS)
      .enter().append('line')
      .attr('class', 'hit-area')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 6) // Further reduced to prevent blocking nodes
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget.previousSibling).transition().duration(200)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', (d: any) => 4 + d.intensity * 10);
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget.previousSibling).transition().duration(200)
          .attr('stroke-opacity', (d: any) => 0.2 + d.intensity * 0.5)
          .attr('stroke-width', (d: any) => 2 + d.intensity * 6);
      });

    const node = nodeGroupLayer.selectAll('g')
      .data(NODES)
      .enter().append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).raise();
      })
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Remove extra invisible hit area and make visible circle the primary hit target
    node.append('circle')
      .attr('r', d => 30 + (d.val / 2))
      .attr('fill', d => {
        if (d.group === 'core') return 'rgba(255, 255, 255, 0.9)';
        if (d.group === 'anxious') return 'rgba(255, 55, 95, 0.08)';
        if (d.group === 'secure') return 'rgba(191, 90, 242, 0.08)';
        if (d.group === 'avoidant') return 'rgba(0, 122, 255, 0.08)';
        if (d.group === 'disorganized') return 'rgba(255, 149, 0, 0.08)';
        return 'rgba(0, 122, 255, 0.05)';
      })
      .attr('stroke', d => {
        if (d.group === 'core') return '#007AFF';
        if (d.group === 'anxious') return '#FF375F';
        if (d.group === 'secure') return '#BF5AF2';
        if (d.group === 'avoidant') return '#007AFF';
        if (d.group === 'disorganized') return '#FF9500';
        return '#007AFF';
      })
      .attr('stroke-width', 1.5)
      .style('filter', 'url(#glow)')
      .style('cursor', 'pointer')
      .style('pointer-events', 'all'); // Enable clicks exactly on the visible circle

    // Add a subtle outer ring for "Soft Tech" look
    node.append('circle')
      .attr('r', d => 35 + (d.val / 2))
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.group === 'core') return 'rgba(0, 122, 255, 0.2)';
        if (d.group === 'anxious') return 'rgba(255, 55, 95, 0.2)';
        if (d.group === 'secure') return 'rgba(191, 90, 242, 0.2)';
        if (d.group === 'avoidant') return 'rgba(0, 122, 255, 0.2)';
        if (d.group === 'disorganized') return 'rgba(255, 149, 0, 0.2)';
        return 'rgba(0, 122, 255, 0.1)';
      })
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .style('pointer-events', 'none');

    node.append('text')
      .text(d => d.id)
      .attr('dy', d => 55 + (d.val / 2))
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('pointer-events', 'none');

    node.append('foreignObject')
      .attr('x', -12)
      .attr('y', -12)
      .attr('width', 24)
      .attr('height', 24)
      .style('pointer-events', 'none') // Ensure clicks pass through to the node hit area
      .html(d => {
        const color = d.group === 'anxious' ? '#FF375F' : d.group === 'secure' ? '#BF5AF2' : d.group === 'avoidant' ? '#007AFF' : d.group === 'disorganized' ? '#FF9500' : '#007AFF';
        if (d.group === 'core') return `<div style="color: ${color}; pointer-events: none;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>`;
        return `<div style="color: ${color}; pointer-events: none;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg></div>`;
      });

    const label = labelsGroupLayer.selectAll('g')
      .data(NODES)
      .enter().append('g')
      .attr('class', 'label-group')
      .style('pointer-events', 'none');

    label.append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .attr('stroke', 'white')
      .attr('stroke-width', 3)
      .attr('paint-order', 'stroke')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .style('pointer-events', 'none');

    // Set initial positions
    link.attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y).attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
    linkHitArea.attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y).attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
    node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    label.attr('transform', (d: any) => `translate(${d.x},${d.y + 55 + (d.val / 2)})`);

    // Initial fit to screen
    setTimeout(() => {
      const bounds = g.node()?.getBBox();
      if (bounds) {
        const fullWidth = window.innerWidth;
        const fullHeight = window.innerHeight;
        const width = bounds.width;
        const height = bounds.height;
        const midX = bounds.x + width / 2;
        const midY = bounds.y + height / 2;
        if (width === 0 || height === 0) return;
        const scale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
        const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    svg.transition().duration(750).call(
      zoomRef.current.transform as any,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
      }
    }, 1000);

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isAuthorized]);

  // Separate effect for search highlighting
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const node = svg.selectAll('.node-group');
    const label = svg.selectAll('.label-group');
    const link = svg.selectAll('.links-layer line:not(.hit-area)');

    if (!searchQuery) {
      node.style('opacity', 1).style('pointer-events', 'all');
      label.style('opacity', 1);
      link.style('opacity', (d: any) => 0.2 + d.intensity * 0.5);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matchedNodes = NODES.filter(n => n.id.toLowerCase().includes(query));
    const matchedIds = new Set(matchedNodes.map(n => n.id));
    
    const connectedStreamerIds = new Set<string>();
    LINKS.forEach(l => {
      const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
      const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
      if (matchedIds.has(sourceId)) connectedStreamerIds.add(targetId);
      if (matchedIds.has(targetId)) connectedStreamerIds.add(sourceId);
    });

    const allVisibleIds = new Set([...matchedIds, ...connectedStreamerIds]);

    if (searchQuery && matchedIds.size > 0) {
      zoomToNodes(allVisibleIds);
    }

    node.style('opacity', d => allVisibleIds.has((d as any).id) ? 1 : 0.05)
        .style('pointer-events', d => allVisibleIds.has((d as any).id) ? 'all' : 'none');
    
    label.style('opacity', d => allVisibleIds.has((d as any).id) ? 1 : 0.05);
        
    link.style('opacity', (d: any) => {
      const sId = typeof d.source === 'string' ? d.source : d.source.id;
      const tId = typeof d.target === 'string' ? d.target : d.target.id;
      return (matchedIds.has(sId) || matchedIds.has(tId)) ? 0.6 : 0.02;
    });
  }, [searchQuery, isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#f8faff] font-sans relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '-4s' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 rounded-[40px] shadow-2xl border border-white/60 bg-white/80 backdrop-blur-xl z-10 w-full max-w-md mx-4"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 mb-6">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">隱私保護</h1>
            <p className="text-slate-500 text-sm">請輸入存取密碼以查看情感線熱點圖</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                className={`w-full h-14 px-6 rounded-2xl bg-white border ${passwordError ? 'border-red-400' : 'border-slate-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-center text-lg tracking-[0.5em] font-bold text-slate-700 placeholder:tracking-normal placeholder:font-normal`}
                autoFocus
              />
              {passwordError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-0 right-0 text-center text-xs font-bold text-red-500"
                >
                  密碼錯誤，請重新輸入
                </motion.p>
              )}
            </div>
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              進入系統
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden font-sans bg-[#f8faff]">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '-4s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-pink-300/5 blur-[150px] rounded-full animate-float" />

      {/* Main SVG Visualization */}
      <svg 
        ref={svgRef} 
        className={`w-full h-full cursor-grab active:cursor-grabbing absolute inset-0 transition-opacity duration-500 ${activeTab === 'heatmap' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
      />

      {/* Dialogue Tab */}
      {activeTab === 'dialogue' && (
        <div className="relative w-full h-full pt-32 pb-12 px-6 md:px-12 overflow-y-auto custom-scrollbar bg-slate-50/50 z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Sentiment Analysis Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-[32px] border border-white/60 shadow-xl bg-white/90"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-100">
                  <Thermometer size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">主播態度溫度計</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sentiment Analysis (Cold to Passionate)</p>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentChartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={150} 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                              <p className="text-xs font-bold text-slate-800 mb-1">{data.name}</p>
                              <p className="text-sm font-bold text-blue-600">情感溫度：{data.score}%</p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {data.score > 70 ? '🔥 熱情互動中' : data.score > 40 ? '🌤️ 穩定交流' : '❄️ 態度冷淡'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={20}>
                      {sentimentChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.score > 70 ? '#3b82f6' : entry.score > 40 ? '#94a3b8' : '#cbd5e1'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {streamerDialogues.map((link, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="glass-card p-6 rounded-3xl border border-white/60 shadow-xl bg-white/80 relative overflow-hidden"
                >
                  {/* Status Indicator */}
                  <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-bold text-white shadow-sm ${
                    (link.sentimentScore || 0) > 70 ? 'bg-blue-500' : 
                    (link.sentimentScore || 0) > 40 ? 'bg-slate-400' : 'bg-slate-300'
                  }`}>
                    {(link.sentimentScore || 0) > 70 ? '熱情' : (link.sentimentScore || 0) > 40 ? '一般' : '冷淡'}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                        {link.targetNode?.id.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">主播</p>
                        <p className="text-base font-bold text-slate-800">{link.targetNode?.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-blue-500 mb-1">{(link.sentimentScore || 0)}°C</div>
                      <div className="h-px w-12 bg-slate-100" />
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">對象</p>
                        <p className="text-base font-bold text-slate-800">{link.sourceNode?.id}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg shadow-inner">
                        {link.sourceNode?.id.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {link.streamerMessages?.map((msg, mIdx) => (
                      <div key={mIdx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group hover:bg-white transition-colors">
                        <p className="text-sm text-slate-700 leading-relaxed">"{msg}"</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Entanglement Tab */}
      {activeTab === 'entanglement' && (
        <div className="relative w-full h-full pt-32 pb-12 px-6 md:px-12 overflow-y-auto custom-scrollbar bg-slate-50/50 z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col items-center mb-12">
              <div className="w-16 h-16 rounded-3xl bg-red-500 flex items-center justify-center text-white shadow-xl shadow-red-200 mb-4">
                <Flame size={32} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">情感糾葛錄</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Emotional Tension & Conflict Records</p>
            </div>

            {entanglementData.map((link, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="glass-card p-8 rounded-[40px] border border-red-100/50 shadow-2xl bg-white/95 relative overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {link.sourceNode?.id.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">用戶</p>
                      <p className="text-lg font-bold text-slate-800">{link.sourceNode?.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center px-4">
                    <div className="flex items-center gap-1 text-red-500 mb-1">
                      <Zap size={14} fill="currentColor" />
                      <span className="text-xs font-black uppercase tracking-tighter">張力</span>
                    </div>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-200 to-transparent" />
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">主播</p>
                      <p className="text-lg font-bold text-slate-800">{link.targetNode?.id}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-100">
                      {link.targetNode?.id.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  {/* User's Message (The Trigger) */}
                  {link.lastMessage && (
                    <div className="flex flex-col items-start max-w-[85%]">
                      <p className="text-[10px] font-bold text-slate-400 mb-1 ml-4">USER SIDE</p>
                      <div className="bg-slate-100 p-5 rounded-3xl rounded-tl-none shadow-sm border border-slate-200/50">
                        <p className="text-sm text-slate-700 font-medium leading-relaxed italic">"{link.lastMessage}"</p>
                      </div>
                    </div>
                  )}

                  {/* Streamer's Responses (The Entanglement) */}
                  <div className="flex flex-col items-end space-y-3">
                    <p className="text-[10px] font-bold text-red-400 mb-1 mr-4">STREAMER SIDE</p>
                    {(link as any).filteredStreamerMessages?.map((msg: string, mIdx: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + mIdx * 0.1 }}
                        key={mIdx} 
                        className="bg-red-50 p-5 rounded-3xl rounded-tr-none border border-red-100/50 max-w-[85%] shadow-sm"
                      >
                        <p className="text-sm text-red-800 font-bold leading-relaxed">"{msg}"</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer Analysis */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">情緒張力偵測中</span>
                  </div>
                  <div className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    {(link.sentimentScore || 0) < 30 ? '關係冰點' : '高壓互動'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* UI Overlay: Header & Search */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex flex-col gap-3 md:gap-4 items-start">
        <div className="glass-card p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border border-white/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
              <Activity size={18} className="md:w-5 md:h-5" />
            </div>
            <h1 className="text-base md:text-xl font-bold tracking-tight text-slate-800">情感線熱點圖</h1>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex gap-1 mt-4 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
            <button 
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'heatmap' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Activity size={14} />
              熱點圖
            </button>
            <button 
              onClick={() => setActiveTab('dialogue')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'dialogue' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <MessageSquare size={14} />
              主播對話
            </button>
            <button 
              onClick={() => setActiveTab('entanglement')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'entanglement' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Flame size={14} />
              情感糾葛
            </button>
          </div>
        </div>

        {/* Search Bar (Only in Heatmap) */}
        {activeTab === 'heatmap' && (
          <div className="glass-card w-64 md:w-80 h-12 rounded-2xl flex items-center overflow-hidden border border-white/40 shadow-lg bg-white/60 backdrop-blur-md">
            <div className="min-w-[44px] h-full flex items-center justify-center text-slate-500">
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="搜尋用戶或主播..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400 pr-2"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="pr-3 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Search Results Summary (Only in Heatmap) */}
        <AnimatePresence>
          {activeTab === 'heatmap' && searchQuery && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-4 rounded-2xl max-w-[280px] md:max-w-sm border border-white/40 shadow-xl bg-white/80 backdrop-blur-lg"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">關係簡述</h3>
              <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {NODES.filter(n => n.id.toLowerCase().includes(searchQuery.toLowerCase())).map(user => {
                  const connections = LINKS.filter(l => 
                    (typeof l.source === 'string' ? l.source : (l.source as any).id) === user.id ||
                    (typeof l.target === 'string' ? l.target : (l.target as any).id) === user.id
                  );
                  
                  if (connections.length === 0) return null;

                  return (
                    <div key={user.id} className="border-l-2 border-blue-500 pl-3 py-1">
                      <p className="text-sm font-bold text-slate-800">{user.id}</p>
                      <div className="mt-1 space-y-2">
                        {connections.map((l, idx) => {
                          const streamerId = (typeof l.source === 'string' ? l.source : (l.source as any).id) === user.id ? 
                            (typeof l.target === 'string' ? l.target : (l.target as any).id) : 
                            (typeof l.source === 'string' ? l.source : (l.source as any).id);
                          
                          return (
                            <div key={idx} className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                              <div className="text-[11px] text-slate-500 leading-tight mb-2">
                                與 <span className="text-blue-600 font-bold">{streamerId}</span>：
                                {l.intensity > 0.8 ? '高度依賴與強烈互動' : l.intensity > 0.5 ? '穩定的支持與共感' : '較為冷淡或單向互動'}
                              </div>
                              <div className="pl-2 border-l border-slate-200 space-y-1.5">
                                <div className="text-[10px] text-slate-400 italic">
                                  "精選對話：{l.lastMessage || (l.intensity > 0.7 ? '你是我最信任的人，沒有你我不知道該怎麼辦...' : '謝謝你的支持，我會繼續努力的。')}"
                                </div>
                                <div className="text-[9px] font-bold text-blue-500/70 uppercase tracking-tighter">
                                  摘要：{l.intensity > 0.8 ? '情感深度連結，存在強烈的情緒依賴與排他性。' : '關係穩定，雙方在互動中獲得正向情緒價值。'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* UI Overlay: Legend */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-10">
        <motion.div 
          animate={{ height: isLegendExpanded ? 'auto' : 44 }}
          className="glass-card p-1.5 md:p-2 rounded-2xl flex flex-col gap-3 border border-white/40 shadow-lg overflow-hidden bg-white/40 backdrop-blur-md"
        >
          <button 
            onClick={() => setIsLegendExpanded(!isLegendExpanded)}
            className="flex items-center gap-3 h-8 px-2 text-xs font-bold text-slate-600 w-full"
          >
            <div className="p-1.5 bg-white/60 rounded-lg shadow-sm">
              <Zap size={14} className="text-blue-500" />
            </div>
            <span className={isLegendExpanded ? "inline" : "hidden md:inline"}>圖例</span>
            {!isLegendExpanded && (
              <div className="flex gap-1 ml-auto md:hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF375F]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#BF5AF2]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />
              </div>
            )}
          </button>
          
          <AnimatePresence>
            {isLegendExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3 px-2 pb-2 min-w-[160px]"
              >
                <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF375F] shadow-[0_0_8px_rgba(255,55,95,0.6)]" /> 焦慮型 (Anxious)
                </div>
                <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#BF5AF2] shadow-[0_0_8px_rgba(191,90,242,0.6)]" /> 安全型 (Secure)
                </div>
                <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.6)]" /> 逃避型 (Avoidant)
                </div>
                <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF9500] shadow-[0_0_8px_rgba(255,149,0,0.6)]" /> 混亂型 (Disorganized)
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* UI Overlay: View Controls */}
      {activeTab === 'heatmap' && (
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30 flex flex-col gap-3 md:gap-4 items-end">
          <div className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleZoom('in')}
              className="glass-card w-11 h-11 rounded-full flex items-center justify-center text-slate-700 font-bold border border-white/40 shadow-lg bg-white/40 backdrop-blur-md hover:bg-white/60"
              title="放大"
            >
              <ZoomIn size={18} className="text-blue-500" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleZoom('out')}
              className="glass-card w-11 h-11 rounded-full flex items-center justify-center text-slate-700 font-bold border border-white/40 shadow-lg bg-white/40 backdrop-blur-md hover:bg-white/60"
              title="縮小"
            >
              <ZoomOut size={18} className="text-blue-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fitToScreen}
              className="glass-card w-11 h-11 rounded-full flex items-center justify-center text-slate-700 font-bold border border-white/40 shadow-lg bg-white/40 backdrop-blur-md hover:bg-white/60"
              title="移動至視圖中心"
            >
              <Hand size={18} className="text-purple-500" />
            </motion.button>
          </div>

          {/* UI Overlay: Detail Panel */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="w-80"
              >
                <div className="glass-card p-6 rounded-3xl overflow-hidden relative border border-white/60 shadow-2xl">
                  {/* Decorative Glow */}
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 ${
                    selectedNode.group === 'anxious' ? 'bg-pink-500' : 
                    selectedNode.group === 'secure' ? 'bg-purple-500' : 
                    selectedNode.group === 'avoidant' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {selectedNode.attachmentType || '依附關係分析'}
                      </span>
                      <div className="p-1.5 bg-slate-100 rounded-full">
                        <User size={14} className="text-slate-500" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                      {selectedNode.id}
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedNode.val || 0}%` }}
                          className={`h-full ${
                            selectedNode.group === 'anxious' ? 'bg-pink-500' : 
                            selectedNode.group === 'secure' ? 'bg-purple-500' : 
                            selectedNode.group === 'avoidant' ? 'bg-blue-500' : 'bg-orange-500'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {selectedNode.val}%
                      </span>
                    </div>

                    {selectedNode.messages && selectedNode.messages.length > 0 ? (
                      <div className="bg-white/50 p-4 rounded-2xl border border-white/80 shadow-inner max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 mb-3 text-slate-400">
                          <MessageCircle size={14} />
                          <span className="text-[10px] font-bold uppercase">對話精選</span>
                        </div>
                        <div className="space-y-3">
                          {selectedNode.messages.map((msg, idx) => (
                            <p key={idx} className="text-sm text-slate-600 italic leading-relaxed border-l-2 border-slate-200 pl-3">
                              "{msg}"
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : selectedNode.lastMessage && (
                      <div className="bg-white/50 p-4 rounded-2xl border border-white/80 shadow-inner">
                        <div className="flex items-center gap-2 mb-2 text-slate-400">
                          <MessageCircle size={14} />
                          <span className="text-[10px] font-bold uppercase">核心語錄</span>
                        </div>
                        <p className="text-sm text-slate-600 italic leading-relaxed">
                          "{selectedNode.lastMessage}"
                        </p>
                      </div>
                    )}

                    <button 
                      onClick={() => setSelectedNode(null)}
                      className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-bold hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                      關閉詳情
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Decorative Objects */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white rounded-full blur-sm animate-float opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-blue-200 rounded-full blur-md animate-float opacity-30 pointer-events-none" style={{ animationDelay: '2s' }} />
    </div>
  );
}
