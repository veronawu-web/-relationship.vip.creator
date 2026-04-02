import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Zap, Shield, User, Info, Activity, Search, X } from 'lucide-react';
import { NODES, LINKS } from './constants';
import { Node, Link } from './types';

export default function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const filteredNodes = useMemo(() => {
    if (!searchQuery) return NODES;
    return NODES.filter(node => 
      node.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

  useEffect(() => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('class', 'main-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    const simulation = d3.forceSimulation<Node>(NODES)
      .force('link', d3.forceLink<Node, Link>(LINKS).id(d => d.id).distance(140))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80));

    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      svg.attr('width', w).attr('height', h);
      simulation.force('center', d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.3).restart();
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
      .attr('stroke-width', 20)
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

    const node = g.append('g')
      .selectAll('g')
      .data(NODES)
      .enter().append('g')
      .attr('class', 'node-group')
      .on('click', (event, d) => setSelectedNode(d))
      .on('mouseover', (event, d) => setHoveredNode(d))
      .on('mouseout', () => setHoveredNode(null))
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', d => 30 + (d.val / 2))
      .attr('fill', d => {
        if (d.group === 'core') return 'rgba(255, 255, 255, 0.9)';
        if (d.group === 'high') return 'rgba(255, 55, 95, 0.08)';
        if (d.group === 'support') return 'rgba(191, 90, 242, 0.08)';
        return 'rgba(0, 122, 255, 0.05)';
      })
      .attr('stroke', d => {
        if (d.group === 'core') return '#007AFF';
        if (d.group === 'high') return '#FF375F';
        if (d.group === 'support') return '#BF5AF2';
        return '#007AFF';
      })
      .attr('stroke-width', 1.5)
      .style('filter', 'url(#glow)')
      .style('cursor', 'pointer');

    // Add a subtle outer ring for "Soft Tech" look
    node.append('circle')
      .attr('r', d => 35 + (d.val / 2))
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.group === 'core') return 'rgba(0, 122, 255, 0.2)';
        if (d.group === 'high') return 'rgba(255, 55, 95, 0.2)';
        if (d.group === 'support') return 'rgba(191, 90, 242, 0.2)';
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
      .html(d => {
        const color = d.group === 'high' ? '#FF375F' : d.group === 'support' ? '#BF5AF2' : '#007AFF';
        if (d.group === 'core') return `<div style="color: ${color}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>`;
        return `<div style="color: ${color}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg></div>`;
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkHitArea
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Update opacity based on search
    const updateSearchHighlight = () => {
      if (!searchQuery) {
        node.style('opacity', 1);
        link.style('opacity', d => 0.2 + d.intensity * 0.5);
        return;
      }
      
      const matchedIds = new Set(filteredNodes.map(n => n.id));
      node.style('opacity', d => matchedIds.has(d.id) ? 1 : 0.1);
      link.style('opacity', (d: any) => 
        matchedIds.has(d.source.id) || matchedIds.has(d.target.id) ? 0.3 : 0.05
      );
    };

    updateSearchHighlight();

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
          zoom.transform,
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
  }, [searchQuery, filteredNodes]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden font-sans bg-[#f8faff]">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '-4s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-pink-300/5 blur-[150px] rounded-full animate-float" />

      {/* Main SVG Visualization */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* UI Overlay: Header & Search */}
      <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-3xl max-w-md shadow-xl border border-white/40"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
              <Activity size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">情感線熱點圖</h1>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            基於訊息頻率與關鍵字分析，呈現主播與大哥之間的互動張力。
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="搜尋 User name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-card w-80 pl-12 pr-10 py-3.5 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-white/40 shadow-lg transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      </div>

      {/* UI Overlay: Legend */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-3 border border-white/40 shadow-lg">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <div className="w-3 h-3 rounded-full bg-[#FF375F] shadow-[0_0_8px_rgba(255,55,95,0.6)]" /> 高強度 (焦慮/依賴)
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <div className="w-3 h-3 rounded-full bg-[#BF5AF2] shadow-[0_0_8px_rgba(191,90,242,0.6)]" /> 支持型 (穩定/共感)
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <div className="w-3 h-3 rounded-full bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.6)]" /> 冷靜型 (單向/失落)
          </div>
        </div>
      </div>

      {/* UI Overlay: Export & View Controls */}
      <div className="absolute top-8 right-8 z-30 flex flex-col gap-4 items-end">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fitToScreen}
            className="glass-card p-4 rounded-2xl flex items-center gap-3 text-slate-700 font-bold text-sm hover:bg-white/60 transition-all group border border-white/40 shadow-lg"
            title="縮放至全螢幕"
          >
            <Zap size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">自動對齊</span>
          </motion.button>
        </div>

        <div className="glass-card p-3 rounded-xl text-[10px] text-slate-400 font-bold uppercase tracking-wider border border-white/40">
          滾輪縮放 / 拖拽移動 / 點擊查看詳情
        </div>

        {/* UI Overlay: Detail Panel */}
        <AnimatePresence>
          {(selectedNode || hoveredNode) && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-80"
            >
              <div className="glass-card p-6 rounded-3xl overflow-hidden relative border border-white/60 shadow-2xl">
                {/* Decorative Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 ${
                  (selectedNode || hoveredNode)?.group === 'high' ? 'bg-pink-500' : 
                  (selectedNode || hoveredNode)?.group === 'support' ? 'bg-purple-500' : 'bg-blue-500'
                }`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {(selectedNode || hoveredNode)?.group} Intensity
                    </span>
                    <div className="p-1.5 bg-slate-100 rounded-full">
                      <User size={14} className="text-slate-500" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {(selectedNode || hoveredNode)?.id}
                  </h2>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedNode || hoveredNode)?.val || 0}%` }}
                        className={`h-full ${
                          (selectedNode || hoveredNode)?.group === 'high' ? 'bg-pink-500' : 
                          (selectedNode || hoveredNode)?.group === 'support' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {(selectedNode || hoveredNode)?.val}%
                    </span>
                  </div>

                  {(selectedNode || hoveredNode)?.lastMessage && (
                    <div className="bg-white/50 p-4 rounded-2xl border border-white/80 shadow-inner">
                      <div className="flex items-center gap-2 mb-2 text-slate-400">
                        <MessageCircle size={14} />
                        <span className="text-[10px] font-bold uppercase">核心語錄</span>
                      </div>
                      <p className="text-sm text-slate-600 italic leading-relaxed">
                        "{(selectedNode || hoveredNode)?.lastMessage}"
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

      {/* Floating Decorative Objects */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white rounded-full blur-sm animate-float opacity-40" />
      <div className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-blue-200 rounded-full blur-md animate-float opacity-30" style={{ animationDelay: '2s' }} />
    </div>
  );
}
