// https://observablehq.com/@d3/sticky-force-layout@137
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Sticky Force Layout

In a [force simulation](https://github.com/d3/d3-force#simulation_nodes), we set *d.*fx = x and *d.*fy = y while dragging, to fix the nodes in the ⟨x,y⟩ position after they have been repositioned by the user.

Click on a node to release it from its fixed position. Note that the force layout resumes automatically on drag. This ensures that other nodes in the graph respond naturally to the dragged node’s movement.
`
)});
  main.variable(observer()).define(["d3","width","height","graph","clamp"], function*(d3,width,height,graph,clamp)
{
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]),
    link = svg
      .selectAll(".link")
      .data(graph.links)
      .join("line")
      .classed("link", true),
    node = svg
      .selectAll(".node")
      .data(graph.nodes)
      .join("circle")
      .attr("r", 12)
      .classed("node", true)
      .classed("fixed", d => d.fx !== undefined);

  yield svg.node();

  const simulation = d3
    .forceSimulation()
    .nodes(graph.nodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(graph.links))
    .on("tick", tick);

  const drag = d3
    .drag()
    .on("start", dragstart)
    .on("drag", dragged);

  node.call(drag).on("click", click);

  function tick() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function click(event, d) {
    delete d.fx;
    delete d.fy;
    d3.select(this).classed("fixed", false);
    simulation.alpha(1).restart();
  }

  function dragstart() {
    d3.select(this).classed("fixed", true);
  }

  function dragged(event, d) {
    d.fx = clamp(event.x, 0, width);
    d.fy = clamp(event.y, 0, height);
    simulation.alpha(1).restart();
  }
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
Math.min(500, width * 0.6)
)});
  main.variable(observer("clamp")).define("clamp", function(){return(
function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<style>

.link {
  stroke: #000;
  stroke-width: 1.5px;
}

.node {
  cursor: move;
  fill: #ccc;
  stroke: #000;
  stroke-width: 1.5px;
}

.node.fixed {
  fill: #f00;
}

</style>`
)});
  main.variable(observer("graph")).define("graph", function(){return(
{
  nodes: Array.from({length:13}, () => ({})),
  links: [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 0 },
    { source: 1, target: 3 },
    { source: 3, target: 2 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 5, target: 7 },
    { source: 6, target: 7 },
    { source: 6, target: 8 },
    { source: 7, target: 8 },
    { source: 9, target: 4 },
    { source: 9, target: 11 },
    { source: 9, target: 10 },
    { source: 10, target: 11 },
    { source: 11, target: 12 },
    { source: 12, target: 10 }
  ]
}
)});
  return main;
}
