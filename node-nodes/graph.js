// #######################################################################
//
// Note
// ----
//
// A node looks like this:
//
// {
//   name: ''
//   , payload: {}
// };
//
//
// An edge looks like this:
//
// {
//   source: {}
//   , destination: {}
//   , description: ''
// }
//
// #######################################################################


var Node = (function() {
  var Node = function(name, payload) {
    // TODO: Generate unique IDs or use hashes>
    this.name = name;
    this.payload = payload || undefined;
  }

  Node.prototype = new (function() {
    this.equals = function (other) {
      // No checks for payloads since they have to be handled individually
      // anyway
      return this.name === other.name && this.payload === other.payload;
    };
  });

  return Node;
})();


var Edge = (function() {
  var Edge = function(source, destination, properties) {
    var properties = properties || {};
    var description = properties.description || undefined;
    var payload = properties.payload || undefined;

    this.source = typeof source === 'object' ? source : { name: source }
    this.destination = typeof destination ==='object' ? destination : {
      name: destination }
    this.description = description
    this.payload = payload
  }

  Edge.prototype = new (function() {
    this.equals = function(other) {
      return this.source === other.source
	&& this.destination === other.destination
	&& this.description === other.description  // Open to discussion
	&& this.payload === other.payload
    };
  });

  return Edge;
})();

var DirectedGraph = (function() {
  var DirectedGraph = function() {

  };

  DirectedGraph.prototype = new (function() {
    var root = this;

    this._edges = [];

    // TODO: removeEdge

    // this.isEdgeAlreadyInEdges = function(edge) {
    //   for (var i in root._edges) {
    // 	var currentEdge = root._edges[i];
    // 	if () {
    
    // 	}
    //   }
    // };

    Object.defineProperty(this, 'edges', {
      get: function() { return this._edges } });

    this.newEdge = function(source, destination, properties) {
      var properties = properties || {};
      if (typeof source !== 'object') {
	source = new Node(source);
      }
      if (typeof destination !== 'object') {
	destination = new Node(destination);
      }
      root._edges.push(new Edge(source, destination, properties));
    };

    Object.defineProperty(this, 'nodes', { get: function() {
      var nodes = [];
      for (var i in root._edges) {
	var currentEdge = root._edges[i];
	nodes.push(currentEdge.source);
	nodes.push(currentEdge.destination);
      }
      var nodeNames = {};

      for (var i in nodes) {
	var currentNode = nodes[i];
	nodeNames[currentNode.name]  = currentNode;
      }
      // Get unique node names
      var uniqueNodes = [];
      for (var i in nodeNames) {
	uniqueNodes.push(nodeNames[i])
      }
      return uniqueNodes;
    } });
    // Get node for every unique node name
    Object.defineProperty(this, 'edges', function() {
      return root._edges;
    });

    this.outboundsOf = function(name) {
      var outbounds = [];
      for (var i in root._edges) {
	var edge = root._edges[i];
	if (edge.source.name === name) {
	  outbounds.push(edge.destination)
	}
      }
      return outbounds;
    };

    this.inboundsOf = function(name) {
      var inbounds = [];
      for (var i in root._edges) {
	var edge = root._edges[i];
	if (edge.destination.name === name) {
	  inbounds.push(edge);
	}
      }
      return inbounds;
    };

    this._contains = function(array, value) {
      var i = array.length;
      while (i--) {
	if (array[i] === value) {
	  return true;
	}
      }
      return false;
    };

    Object.defineProperty(this, 'nodeNames', { get: function() {
      var nodeNames = [];
      for (var i in root._edges) {
	var node = root._edges[i];
	if (!root._contains(nodeNames, node.source.name)) {
	  nodeNames.push(node.source.name);
	}
	if (!root._contains(nodeNames, node.destination.name)) {
	  nodeNames.push(node.destination.name);
	}
      }
      return nodeNames;
    }});

    this.getEdge = function(source, destination) {
      for (var i in root._edges) {
	var currentEdge = root._edges[i];
	if (currentEdge.source.name === source &&
	    currentEdge.destination.name === destination) {
	  return currentEdge;
	}
      }
    };

    this._shortestEdge = function(edges, criterion) {
      var shortest = edges[0];
      for (var i in edges) {
	var currentEdge = edges[i];
	if (currentEdge.payload[criterion] < shortest.payload[criterion]) {
	  shortest = currentEdge;
	}
      }
      return shortest;
    };

    this._removeEdge = function(start, stop, edges) {
      var edges = edges || root._edges;
      for (var i in edges) {
	var currentEdge = edges[i];
	if (currentEdge.source.name === start &&
	    currentEdge.destination.name === stop) {
	  root._edges.splice(i, 1);
	}
      }
    };

    this._getNodeWithName = function(name, nodes) {
      var nodes = nodes || root.nodes;
      for (var i in nodes) {
	var currentNode = nodes[i];
	if (currentNode.name === name) {
	  return currentNode;
	}
      }
    };

    // dist: [['foo', 2], ['bar', 42], ['baz', 1]]
    this._smallestDistance = function(dist) {
      var temp = +Infinity;
      var smallestDistance = undefined;
      for (var i in dist) {
	var currentEntry = dist[i];
	var currentDistance = currentEntry[1];
	if (currentDistance < temp) {
	  temp = currentDistance;
	  smallestDistance = currentEntry;
	}
      }
      if (smallestDistance !== undefined) {
	return smallestDistance;
      } else {
      	return dist[0];
      }
    };

    this._getValueForNameInPQ = function(name, pq) {
      for (var i in pq) {
	var currentEntry = pq[i];
	if (currentEntry[0] === name) {
	  return currentEntry[1];
	}
      }
    };

    this._replaceValueForNameInPQ = function(name, value, pq) {
      for (var i in pq) {
	var currentEntry = pq[i];
	if (currentEntry[0] === name) {
	  currentEntry[1] = value;
	}
      }
    };

    this.shortestPathBetween = function(start, stop, criterion) {
      // Initialize

      var dist = [];
      // Prepare graph
      var graph = root.nodes;
      var edges = root._edges;
      for (var i in graph) {
	var currentNode = graph[i];
	for (var i in edges) {
	  var currentEdge = edges[i];
	  if (currentEdge.destination.name === currentNode.name) {
	    currentNode.distance = currentEdge.payload.costs;
	  }
	}
      }

      var previous = [];
      for (var v in graph) {
	var currentNodeName = graph[v].name;
	dist.push([currentNodeName, +Infinity]);
	previous[currentNodeName] = undefined;
      }

      dist.push([start, 0]);
      var q = graph.splice(0);

      while (q !== []) {
	console.log('---------------------------------------------------------------------------');
	var smallestDistance = root._smallestDistance(dist);
	var u = root._getNodeWithName(smallestDistance[0]);
	q.splice(q.indexOf(u.name));

	console.log(root._getValueForNameInPQ(u.name, dist));
	if (root._getValueForNameInPQ(u.name, dist) === Infinity) {
	  break;
	}

	var neigbors = root.outboundsOf(u.name);
	console.log('o: ' + JSON.stringify(neigbors));
	for (var i in neigbors) {
	  v = neigbors[i];
	  var edge = root.getEdge(u.name, v.name);
	  var alt = root._getValueForNameInPQ(u.name, dist) + edge.destination.distance;
	  if (alt < root._getValueForNameInPQ(v.name, dist)) {
	    root._replaceValueForNameInPQ(v.name, alt, dist);
	    previous[v.name] = u;
	  }
	}
      }

      var s = [];
    };

  });

  return DirectedGraph;
})();


module.exports.DirectedGraph = DirectedGraph;
