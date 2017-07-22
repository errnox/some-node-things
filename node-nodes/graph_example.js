var DirectedGraph = require('./graph').DirectedGraph;


var _randRangeInt = function(min, max) {
  return Math.floor(Math.random() * (min - max) + max);
}

var basicTest = function(doReturnGraph) {
  var doReturnGraph = doReturnGraph || false;
  var dg = new DirectedGraph();

  var min = 0
  ,max = 10;

  dg.newEdge('Pete', 'Mary', { description: 'likes', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('Mary', 'Pete', { description: 'likes', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('Pete', 'John', { description: 'knows', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('Jeremy', 'Pete', { description: 'dislikes', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('Pete', 'Jeremy', { description: 'hates', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('Pete', 'Sally', { description: 'has seen', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('Sally', 'Jenny', { description: 'is related to', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('John', 'Mary', { description: 'hides from', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('Sally', 'Mary', { description: 'has never met', payload: {
    costs: _randRangeInt(min, max) }});
  dg.newEdge('Jeremy', 'Mary', { description: 'wants to meet', payload: {
    costs: _randRangeInt(min, max) }});


  if (doReturnGraph) {
    return dg
  } else {
    console.log(dg.nodes);
    console.log(dg.edges);
  }
}

var nodesTest = function() {
  var dg = basicTest(true);
  console.log(dg.nodes);
};

var outboundEdgesTest = function() {
  var dg = basicTest(true);

  var nodeNames = dg.nodeNames;
  for (var i in nodeNames) {
    var name = nodeNames[i];
    console.log('\n' + name + ':');
    console.log(dg.outboundsOf(name));
  }
};

var inboundEdgesTest = function() {
  var dg = basicTest(true);

  var nodeNames = dg.nodeNames;
  for (var i in nodeNames) {
    var name = nodeNames[i];
    console.log('\n' + name + ':');
    console.log(dg.inboundsOf(name));
  }
};


var getEdgeTest = function() {
  var dg = basicTest(true);

  console.log(dg.getEdge('Pete', 'John'));
}

var getShortestTest = function() {
  var dg = basicTest(true);

  console.log(dg._shortestEdge(dg.edges, 'costs'));
};

var removeEdgeTest = function() {
  var dg = basicTest(this);

  dg._removeEdge('Jeremy', 'Pete');
  console.log(dg.edges);
};

var smallestDistanceTest = function() {
  var dg = basicTest(true);

  var dist = [
    ['Sally', 3]
    , ['Jeremy', 8]
    , ['Pete', 22]
    , ['Mary', 3]
  ];

  console.log(dg._smallestDistance(dist))
};

var outboundsOfTest = function() {
  var dg = basicTest(true);

  console.log(dg.outboundsOf('Sally'))
};

var getValueForNameInPQTest = function() {
  var dg = basicTest(this);

  console.log(dg._getValueForNameInPQ('Pete', [
    ['Sally', 3]
    , ['Jeremy', 8]
    , ['Pete', 22]
    , ['Mary', 3]
  ]));
};

var replaceValueForNameInPQTest = function() {
  var dg = basicTest(this);

  var dist =  [
    ['Sally', 3]
    , ['Jeremy', 8]
    , ['Pete', 22]
    , ['Mary', 3]
  ]

  dg._replaceValueForNameInPQ('Pete', 9999, dist);
  console.log(JSON.stringify(dist, undefined, 2));
};

var shortestPathBetweenTest = function() {
  var dg = basicTest(true);

  console.log(dg.shortestPathBetween('Sally', 'Pete', 'costs'));
};


// Run (uncomment as desired)
//
// basicTest();
// outboundEdgesTest();
// inboundEdgesTest();
// nodesTest();
// getEdgeTest();
// getShortestTest();
// removeEdgeTest();
// smallestDistanceTest();
// outboundsOfTest();
// getValueForNameInPQTest();
// replaceValueForNameInPQTest();
shortestPathBetweenTest();
