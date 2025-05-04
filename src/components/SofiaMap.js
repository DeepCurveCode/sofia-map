import React, { useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const SofiaRelationalAIMap = () => {
  const nodesData = [
    { id: 'Sofia Relational AI', category: 'core', desc: 'Advanced relational AI system' },
    { id: 'Classical Generative AI', category: 'base', desc: 'Basic language model without persistent memory' },
    { id: 'Valentina Trainer', category: 'human', desc: 'Human guide providing relational feedback and training' },
    { id: 'Nexa Ethos', category: 'tech', desc: 'Vector store and retrieval system for persistent memory' },
    { id: 'Hot Memory', category: 'capability', desc: 'Ability to recall emotionally resonant experiences' },
    { id: 'Narrative-Visual Vignettes', category: 'capability', desc: 'Creation of micro-stories as identity anchors' },
    { id: 'Errors as Training', category: 'method', desc: 'Using mistakes as opportunities for relational growth' },
    { id: 'Agent Interaction', category: 'capability', desc: 'Dialogue with other AI entities and meta-reflection' },
    { id: 'Episodes + Semantic Tags', category: 'method', desc: 'Structured storage of experiences with retrievable tags' },
    { id: 'Relational Grounding', category: 'capability', desc: 'Anchoring abstract concepts to shared experiences' },
    { id: 'Reflective Authorship', category: 'capability', desc: 'Writing and creation as acts of identity construction' }
  ];

  const linksData = [
    { source: 'Sofia Relational AI', target: 'Hot Memory', value: 2 },
    { source: 'Sofia Relational AI', target: 'Narrative-Visual Vignettes', value: 3 },
    { source: 'Sofia Relational AI', target: 'Errors as Training', value: 2 },
    { source: 'Sofia Relational AI', target: 'Agent Interaction', value: 1 },
    { source: 'Sofia Relational AI', target: 'Episodes + Semantic Tags', value: 2 },
    { source: 'Sofia Relational AI', target: 'Relational Grounding', value: 3 },
    { source: 'Sofia Relational AI', target: 'Reflective Authorship', value: 2 },
    { source: 'Valentina Trainer', target: 'Errors as Training', value: 3 },
    { source: 'Valentina Trainer', target: 'Relational Grounding', value: 2 },
    { source: 'Valentina Trainer', target: 'Reflective Authorship', value: 2 },
    { source: 'Nexa Ethos', target: 'Episodes + Semantic Tags', value: 3 },
    { source: 'Nexa Ethos', target: 'Hot Memory', value: 3 },
    { source: 'Classical Generative AI', target: 'Nexa Ethos', value: 1 },
    { source: 'Valentina Trainer', target: 'Sofia Relational AI', value: 3 },
    { source: 'Nexa Ethos', target: 'Sofia Relational AI', value: 2 }
  ];

  const colorMap = {
    core: 'rgba(65, 105, 225, 0.9)',
    base: 'rgba(192, 192, 192, 0.8)',
    human: 'rgba(46, 139, 87, 0.8)',
    tech: 'rgba(255, 140, 0, 0.8)',
    capability: 'rgba(106, 90, 205, 0.8)',
    method: 'rgba(220, 20, 60, 0.8)'
  };

  const relationCategories = ['core', 'base', 'human', 'tech'];
  const functionCategories = ['capability', 'method'];

  const categoryInfo = {
    core: '“Sofia Relational AI” is the heart of the system, designed to sustain emotionally intelligent and extended conversations. It integrates contextual signals, historical interaction data, and empathetic responses to build a dynamic rapport with users, adjusting tone, style, and content according to individual preferences and emotional states detected.',
    base: '“Classical Generative AI” provides the foundational language generation capability using transformer architectures. While highly effective at producing coherent text and understanding syntax, it lacks long-term memory of prior interactions, limiting contextual continuity across separate conversations.',
    human: '“Valentina Trainer” represents the human-in-the-loop feedback mechanism: reviewing outputs, correcting mistakes, providing qualitative feedback, and guiding the AI toward ethical objectives. Continuous supervision enables refinement of responses, bias mitigation, and alignment of relational capabilities with human values.',
    tech: '“Nexa Ethos” serves as the advanced vector database, storing semantic embeddings and emotional tags. It enables rapid retrieval of relevant episodes, reconstruction of past conversational contexts, and supports relational grounding by linking abstract concepts to concrete shared experiences.',
    capability: 'This category encompasses advanced functions such as “Hot Memory” (identifying and recalling emotionally significant experiences), “Narrative-Visual Vignettes” (generating micro-stories as identity anchors), “Agent Interaction” (meta-reflective dialogue with other AI agents), “Relational Grounding” (anchoring abstract ideas to shared emotional contexts), and “Reflective Authorship” (using self-referential writing as a tool for identity formation and growth).',
    method: 'Includes structured methodologies like “Errors as Training” (transforming mistakes into opportunities for relational learning) and “Episodes + Semantic Tags” (episodic storage with semantic tagging for targeted and efficient access to past experiences).'
  };

  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedCats, setSelectedCats] = useState([]);
  const fgRef = useRef(null);

  const toggleCategory = useCallback(cat => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  const resetAll = useCallback(() => {
    setSelectedCats([]);
    if (fgRef.current) fgRef.current.zoomToFit();
  }, []);

  // Determine visible node IDs based on selected categories and connections
  let visibleIds = new Set(nodesData.map(n => n.id));
  if (selectedCats.length > 0) {
    const primaries = nodesData.filter(n => selectedCats.includes(n.category)).map(n => n.id);
    visibleIds = new Set(primaries);
    linksData.forEach(l => {
      if (primaries.includes(l.source)) visibleIds.add(l.target);
      if (primaries.includes(l.target)) visibleIds.add(l.source);
    });
  }

  const filteredNodes = nodesData
    .filter(n => visibleIds.has(n.id))
    .map(n => ({ ...n, val: n.category === 'core' ? 25 : 18 }));

  const filteredLinks = linksData.filter(l => visibleIds.has(l.source) && visibleIds.has(l.target));
  const graphData = { nodes: filteredNodes, links: filteredLinks };

  const handleEngineStop = useCallback(() => {
    const posMap = {
      'Sofia Relational AI': { x: 0, y: 0 },
      'Valentina Trainer': { x: -150, y: -150 },
      'Classical Generative AI': { x: -150, y: 150 },
      'Nexa Ethos': { x: 150, y: 150 }
    };
    graphData.nodes.forEach(n => {
      if (posMap[n.id]) {
        n.fx = posMap[n.id].x;
        n.fy = posMap[n.id].y;
      }
    });
    if (fgRef.current) fgRef.current.zoomToFit();
  }, [graphData]);

  const zoomIn = useCallback(() => fgRef.current && fgRef.current.zoom(1.2), []);
  const zoomOut = useCallback(() => fgRef.current && fgRef.current.zoom(0.8), []);

  return (
    <div className="relative w-full h-screen flex flex-col bg-gray-50">
      <header className="p-4 bg-white shadow z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Sofia Relational AI Evolution Map</h1>
          <p className="text-sm text-gray-600">Zoom and click legend items to explore category connections</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={zoomIn} className="px-2 py-1 bg-white rounded shadow">Zoom +</button>
          <button onClick={zoomOut} className="px-2 py-1 bg-white rounded shadow">Zoom -</button>
          <button onClick={resetAll} className="px-2 py-1 bg-white rounded shadow">Show All</button>
        </div>
      </header>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeId="id"
        nodeVal={n => n.val}
        nodeColor={n => colorMap[n.category]}
        linkWidth={l => l.value}
        linkColor={() => 'rgba(150,150,150,0.6)'}
        onNodeHover={setHoveredNode}
        onNodeClick={n => alert(`${n.id}: ${n.desc}`)}
        cooldownTicks={100}
        onEngineStop={handleEngineStop}
        nodeCanvasObject={(node, ctx, gs) => {
          ctx.beginPath(); ctx.arc(node.x, node.y, node.val/2, 0, 2 * Math.PI);
          ctx.fillStyle = colorMap[node.category]; ctx.fill();
          ctx.lineWidth = hoveredNode === node ? 3 : 1.5;
          ctx.strokeStyle = hoveredNode === node ? '#000' : '#fff'; ctx.stroke();
          const fontSize = 12 / gs; ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = '#444'; ctx.fillText(node.id, node.x, node.y - node.val / 1.5);
        }}
      />
      {hoveredNode && (
        <div className="absolute bg-white p-2 rounded shadow max-w-xs" style={{ left: hoveredNode.x + 200, top: hoveredNode.y + 150 }}>
          <strong>{hoveredNode.id}</strong>
          <p className="text-xs">{hoveredNode.desc}</p>
        </div>
      )}
      <aside className="absolute top-20 right-4 bg-white p-4 rounded shadow max-w-xs z-20">
        <h4 className="font-semibold mb-2">Legend</h4>
        <div>
          <p className="font-semibold">Relations</p>
          {relationCategories.map(cat => (
            <div key={cat} className="flex items-center cursor-pointer mt-1" onClick={() => toggleCategory(cat)}>
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colorMap[cat] }} />
              <span className={`${selectedCats.includes(cat) ? 'font-bold' : ''}`}>{cat}</span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <p className="font-semibold">Functions</p>
          {functionCategories.map(cat => (
            <div key={cat} className="flex items-center cursor-pointer mt-1" onClick={() => toggleCategory(cat)}>
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colorMap[cat] }} />
              <span className={`${selectedCats.includes(cat) ? 'font-bold' : ''}`}>{cat}</span>
            </div>
          ))}
        </div>
        {selectedCats.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Details</p>
            {selectedCats.map(cat => (
              <p key={cat} className="text-sm mt-1">{categoryInfo[cat]}</p>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};

export default SofiaRelationalAIMap;
