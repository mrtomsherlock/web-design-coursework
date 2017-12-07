function init() {

  var $ = go.GraphObject.make;

  myDiagram =
    $(go.Diagram, "mindMap", // the ID of the DIV HTML element
      {
        initialContentAlignment: go.Spot.Center,
        "Changed": invalidateLinkRoutes,
        "undoManager.isEnabled": true
      });

  myDiagram.nodeTemplate =
    $(go.Node, go.Panel.Auto, {
        locationSpot: go.Spot.Center
      },
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape, {
          figure: "Circle",
          fill: "white",
          strokeWidth: 0
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock, {
          font: "200 14pt Nunito Sans,sans-serif",
          stroke: "white"
        },
        new go.Binding("text"))
    );

  myDiagram.linkTemplate =
    $(MultiNodePathLink, // subclass of Link, defined below
      go.Link.Bezier, {
        layerName: "Background",
        toShortLength: 4
      },
      $(go.Shape, {
          strokeWidth: 4
        },
        new go.Binding("stroke", "color")),
      $(go.Shape, {
          toArrow: "Standard",
          scale: 3,
          strokeWidth: 0
        },
        new go.Binding("fill", "color"))
    );

  function invalidateLinkRoutes(e) {
    // when a Node is moved, invalidate the route for all MultiNodePathLinks that go through it
    if (e.change === go.ChangedEvent.Property && e.propertyName === "location" && e.object instanceof go.Node) {
      var diagram = e.diagram;
      var node = e.object;
      if (node._PathLinks) {
        node._PathLinks.each(function(l) {
          l.invalidateRoute();
        });
      }
    } else if (e.change === go.ChangedEvent.Remove && e.object instanceof go.Layer) {
      // when a Node is deleted that has MultiNodePathLinks going through it, invalidate those link routes
      if (e.oldValue instanceof go.Node) {
        var node = e.oldValue;
        if (node._PathLinks) {
          node._PathLinks.each(function(l) {
            l.invalidateRoute();
          });
        }
      } else if (e.oldValue instanceof MultiNodePathLink) {
        // when deleting a MultiNodePathLink, remove all references to it in Node._PathLinks
        var link = e.oldValue;
        var diagram = e.diagram;
        var midkeys = link.data.path;
        if (Array.isArray(midkeys)) {
          for (var i = 0; i < midkeys.length; i++) {
            var node = diagram.findNodeForKey(midkeys[i]);
            if (node !== null && node._PathLinks) node._PathLinks.remove(link);
          }
        }
      }
    }
  }

  // create a few nodes and links
  myDiagram.model = new go.GraphLinksModel([{
      key: 1,
      text: "Schemes",
      color: "rgb(99,157,159)",
      loc: "200 200"
    },
    {
      key: 2,
      text: "Technology",
      color: "rgb(116,133,175)",
      loc: "-60 80"
    },
    {
      key: 3,
      text: "Farming",
      color: "rgb(116,133,175)",
      loc: "350 80"
    },
    {
      key: 4,
      text: "HR",
      color: "rgb(116,133,175)",
      loc: "40 250"
    },
    {
      key: 5,
      text: "Management",
      color: "rgb(116,133,175)",
      loc: "-50 450"
    },
    {
      key: 6,
      text: "Science",
      color: "rgb(116,133,175)",
      loc: "200 0"
    },
    {
      key: 7,
      text: "Public Sector",
      color: "rgb(116,133,175)",
      loc: "370 400"
    },
    {
      key: 8,
      text: "Medical",
      color: "rgb(116,133,175)",
      loc: "400 250"
    },
    {
      key: 9,
      text: "FERA Science",
      color: "rgb(220,106,103)",
      loc: "350 -80"
    },
    {
      key: 10,
      text: "UK R&D",
      color: "rgb(220,106,103)",
      loc: "60 -80"
    },
    {
      key: 11,
      text: "IBM UK",
      color: "rgb(220,106,103)",
      loc: "-80 250"
    },
    {
      key: 12,
      text: "A&B Co.",
      color: "rgb(220,106,103)",
      loc: "500 130"
    },
    {
      key: 13,
      text: "GSK Medical",
      color: "rgb(220,106,103)",
      loc: "530 330"
    },
    {
      key: 14,
      text: "  HMLR  ",
      color: "rgb(220,106,103)",
      loc: "180 490"
    }

  ], [{
      from: 1,
      to: 2,
      path: [1],
      color: "grey"
    }, {
      from: 1,
      to: 3,
      path: [1],
      color: "grey"
    }, {
      from: 1,
      to: 4,
      path: [1],
      color: "grey"
    }, {
      from: 1,
      to: 5,
      path: [1],
      color: "grey"
    }, {
      from: 1,
      to: 6,
      path: [1],
      color: "grey"
    },
    {
      from: 1,
      to: 7,
      path: [1],
      color: "grey"
    },
    {
      from: 1,
      to: 8,
      path: [1],
      color: "grey"
    },
    {
      from: 3,
      to: 9,
      path: [9],
      color: "rgb(99,157,159)"
    },
    {
      from: 6,
      to: 9,
      path: [9],
      color: "rgb(99,157,159)"
    },
    {
      from: 2,
      to: 10,
      path: [10],
      color: "rgb(99,157,159)"
    },
    {
      from: 6,
      to: 10,
      path: [10],
      color: "rgb(99,157,159)"
    },
    {
      from: 2,
      to: 11,
      path: [11],
      color: "rgb(99,157,159)"
    },
    {
      from: 5,
      to: 11,
      path: [11],
      color: "rgb(99,157,159)"
    },
    {
      from: 4,
      to: 11,
      path: [11],
      color: "rgb(99,157,159)"
    },
    {
      from: 3,
      to: 12,
      path: [12],
      color: "rgb(99,157,159)"
    },
    {
      from: 5,
      to: 14,
      path: [14],
      color: "rgb(99,157,159)"
    },
    {
      from: 7,
      to: 14,
      path: [14],
      color: "rgb(99,157,159)"
    },
    {
      from: 8,
      to: 13,
      path: [13],
      color: "rgb(99,157,159)"
    }
  ]);
}


function MultiNodePathLink() {
  go.Link.call(this);
}
go.Diagram.inherit(MultiNodePathLink, go.Link);


MultiNodePathLink.prototype.computePoints = function() {
  // get the list of Nodes that should be along the path
  var nodes = [];
  if (this.fromNode !== null && this.fromNode.location.isReal()) {
    nodes.push(this.fromNode);
  }
  var midkeys = this.data.path;
  if (Array.isArray(midkeys)) {
    var diagram = this.diagram;
    for (var i = 0; i < midkeys.length; i++) {
      var node = diagram.findNodeForKey(midkeys[i]);
      if (node instanceof go.Node && node.location.isReal()) {
        nodes.push(node);
        var set = node._PathLinks;
        if (!set) set = node._PathLinks = new go.Set(go.Link);
        set.add(this);
      }
    }
  }
  if (this.toNode !== null && this.toNode.location.isReal()) {
    nodes.push(this.toNode);
  }

  // now do the routing
  this.clearPoints();
  var prevloc = null;
  var thisloc = null;
  var nextloc = null;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    thisloc = node.location;
    nextloc = (i < nodes.length - 1) ? nodes[i + 1].location : null;

    var prevpt = null;
    var nextpt = null;
    if (this.curve === go.Link.Bezier) {
      if (prevloc !== null && nextloc !== null) {
        var prevang = thisloc.directionPoint(prevloc);
        var nextang = thisloc.directionPoint(nextloc);
        var avg = (prevang + nextang) / 2;
        var clockwise = prevang > nextang;
        if (Math.abs(prevang - nextang) > 180) {
          avg += 180;
          clockwise = !clockwise;
        }
        if (avg >= 360) avg -= 360;
        prevpt = new go.Point(Math.sqrt(thisloc.distanceSquaredPoint(prevloc)) / 4, 0);
        prevpt.rotate(avg + (clockwise ? 90 : -90));
        prevpt.add(thisloc);
        nextpt = new go.Point(Math.sqrt(thisloc.distanceSquaredPoint(nextloc)) / 4, 0);
        nextpt.rotate(avg - (clockwise ? 90 : -90));
        nextpt.add(thisloc);
      } else if (nextloc !== null) {
        prevpt = null;
        nextpt = thisloc; // fix this point after the loop
      } else if (prevloc !== null) {
        var lastpt = this.getPoint(this.pointsCount - 1);
        prevpt = thisloc; // fix this point after the loop
        nextpt = null;
      }
    }

    if (prevpt !== null) this.addPoint(prevpt);
    this.addPoint(thisloc);
    if (nextpt !== null) this.addPoint(nextpt);
    prevloc = thisloc;
  }

  // fix up the end points when it's Bezier
  if (this.curve === go.Link.Bezier) {
    // fix up the first point and the first control point
    var start = this.getLinkPointFromPoint(this.fromNode, this.fromPort, this.fromPort.getDocumentPoint(go.Spot.Center), this.getPoint(3), true);
    var ctrl2 = this.getPoint(2);
    this.setPoint(0, start);
    this.setPoint(1, new go.Point((start.x * 3 + ctrl2.x) / 4, (start.y * 3 + ctrl2.y) / 4));
    // fix up the last point and the last control point
    var end = this.getLinkPointFromPoint(this.toNode, this.toPort, this.toPort.getDocumentPoint(go.Spot.Center), this.getPoint(this.pointsCount - 4), false);
    var ctrl1 = this.getPoint(this.pointsCount - 3);
    this.setPoint(this.pointsCount - 2, new go.Point((end.x * 3 + ctrl1.x) / 4, (end.y * 3 + ctrl1.y) / 4));
    this.setPoint(this.pointsCount - 1, end);
  }

  return true;
};
// end MultiNodePathLink class
