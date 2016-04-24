
var graph = new joint.dia.Graph;

var paper = new  joint.dia.Paper({
    el: document.getElementById('graphContainer'),
    width: '100%',
    height: '100%',
    gridSize: 1,
    model: graph
});

var rect = new joint.shapes.basic.Rect({
  position: { x: 50, y: 70 },
  size: { width: 100, height: 40 }
})
graph.addCell(rect)


