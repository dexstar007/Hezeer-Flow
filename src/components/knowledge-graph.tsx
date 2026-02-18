'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useHezeerFlow } from '@/store/use-hezeer-flow';
import { useTranslation } from '@/hooks/use-translation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, ZoomIn, ZoomOut, RefreshCw, Loader2 } from 'lucide-react';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

export function KnowledgeGraph() {
  const { t } = useTranslation();
  const {
    graphNodes,
    graphLinks,
    notes,
    setCurrentNote,
    updateGraph,
    currentView,
  } = useHezeerFlow();

  const [highlightNode, setHighlightNode] = useState<string | null>(null);
  const graphRef = useRef<any>();

  // Update graph when notes change
  useEffect(() => {
    updateGraph();
  }, [notes, updateGraph]);

  // Prepare graph data
  const graphData = {
    nodes: graphNodes.map((node) => ({
      id: node.id,
      name: node.name,
      val: Math.max(5, node.value * 3 + 5),
      color: highlightNode === node.id ? '#3b82f6' : '#64748b',
    })),
    links: graphLinks,
  };

  // Handle node click
  const handleNodeClick = (node: any) => {
    const note = notes.find((n) => n.id === node.id);
    if (note) {
      setCurrentNote(note);
    }
  };

  // Handle node hover
  const handleNodeHover = (node: any) => {
    setHighlightNode(node?.id || null);
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(200, 100);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(0.8);
    }
  };

  const handleRefresh = () => {
    updateGraph();
    setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400);
      }
    }, 100);
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          <h2 className="font-semibold text-lg">{t.knowledgeGraph}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {t.nodes}: {graphNodes.length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {t.links}: {graphLinks.length}
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Graph */}
      <Card className="flex-1 overflow-hidden bg-background">
        {graphNodes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t.noNotesYet}</p>
              <p className="text-sm mt-1">Create notes with [[wikilinks]] to build connections</p>
            </div>
          </div>
        ) : (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel="name"
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans`;
              ctx.fillStyle = highlightNode === node.id ? '#3b82f6' : '#64748b';
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI);
              ctx.fill();

              // Draw label
              ctx.fillStyle = highlightNode === node.id ? '#3b82f6' : '#64748b';
              ctx.fillText(label, node.x + node.val + 2, node.y + 4);
            }}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            linkColor="#cbd5e1"
            linkWidth={1}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            warmupTicks={100}
            cooldownTicks={0}
            onEngineStop={() => {
              if (graphRef.current) {
                graphRef.current.zoomToFit(400);
              }
            }}
          />
        )}
      </Card>
    </div>
  );
}
