// Variables to store width, height, points, hull, and speed
var width = 1000;
var height = 400;
var points = [];
var hull = [];
//var speed = parseInt(document.getElementById("speed").value) || 3;
var speed = 3;    // Default speed value

// Function to clear existing points SVG
function clearPoints() {
    var svg = d3.select("#visualization")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("circle").remove(); // Clear previous points
}

// Function to check if a point is too close to any existing points
function isTooClose(newPoint, existingPoints, minDistance) {
    for (let i = 0; i < existingPoints.length; i++) {
        if (distance(newPoint, existingPoints[i]) < minDistance) {
            return true;
        }
    }
    return false;
}
// Function to calculate the distance between two points
function distance(point1, point2) {
    return Math.sqrt(((point1.x - point2.x) ** 2) + ((point1.y - point2.y) ** 2));
}
// Function to eliminate duplicates from an array of objects with x, y keys
function createUniqueArray(array) {
    const keys = ['x', 'y'];
    const filteredArray = array.filter((item, index, self) =>
        index === self.findIndex((t) => (
            keys.every((k) => t[k] === self[index][k])
        ))
    );
    return filteredArray;
}

// Function to visualize points on the SVG
function visualizePoints() {
    var svg = d3.select("#visualization")
        .attr("width", width)
        .attr("height", height);

    //svg.selectAll("circle").remove(); // Clear previous points
    clearPoints();   // Clear previous points
    svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("fill", "black"); 
}

// Functions to generate random points with a minimum distance
function generatePoints() {
    var numPoints = parseInt(document.getElementById("numPoints").value) || 10;
    var minDistance = 50; // Adjust this value as needed
    var boundaryPadding = 50; // Increase this value to move points away from boundary

    points = [];
    for (let i = 0; i < numPoints; i++) {
        let x, y;
        do {
            x = boundaryPadding + Math.random() * (width - 2 * boundaryPadding); // Apply padding to x-coordinate
            y = boundaryPadding + Math.random() * (height - 2 * boundaryPadding); // Apply padding to y-coordinate
        } while (isTooClose({ x: x, y: y }, points, minDistance));

        points.push({ x: x, y: y });
    }
    visualizePoints();
}
function monotoneChainConvexHull(points) {
    // Sort points lexicographically
    points.sort(function(a, b) {
        return a.x - b.x || a.y - b.y;
    });

    // Build lower hull
    var lowerHull = [];
    for (var i = 0; i < points.length; i++) {
        while (lowerHull.length >= 2 && orientation(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], points[i]) <= 0) {
            lowerHull.pop();
        }
        lowerHull.push(points[i]);
    }

    // Build upper hull
    var upperHull = [];
    for (var i = points.length - 1; i >= 0; i--) {
        while (upperHull.length >= 2 && orientation(upperHull[upperHull.length - 2], upperHull[upperHull.length - 1], points[i]) <= 0) {
            upperHull.pop();
        }
        upperHull.push(points[i]);
    }

    // Combine lower and upper hulls to form the convex hull
    var convexHull = lowerHull.slice(0, lowerHull.length - 1).concat(upperHull.slice(0, upperHull.length - 1));

    return convexHull;
}

// Function to determine the orientation of three points (p, q, r)
function orientation(p, q, r) {
    var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0;  // Collinear
    return (val > 0) ? 1 : -1; // Clockwise or counterclockwise
}

//monotone logic ends here
function visualizeHull() {
    var svg = d3.select("#visualization")
        .attr("width", width)
        .attr("height", height);

    // Clear previous points and edges
    svg.selectAll("circle").remove();
    svg.selectAll("line").remove();

    // Draw points
    svg.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("fill", "black");

    // Draw edges of the convex hull
    for (var i = 0; i < hull.length - 1; i++) {
        svg.append("line")
            .attr("x1", hull[i].x)
            .attr("y1", hull[i].y)
            .attr("x2", hull[i + 1].x)
            .attr("y2", hull[i + 1].y)
            .style("stroke", "red");
    }

    // Connect the last and first points to close the hull
    svg.append("line")
        .attr("x1", hull[hull.length - 1].x)
        .attr("y1", hull[hull.length - 1].y)
        .attr("x2", hull[0].x)
        .attr("y2", hull[0].y)
        .style("stroke", "red");

    // Count the unique points in the hull
    var uniquePoints = createUniqueArray(hull);

    // Update the points in hull field
    document.getElementById("pointsInHull").innerText = "Points in Hull: " + uniquePoints.length;
}

function visualizeConvexHull() {
    d3.select("#visualization").selectAll("line").remove(); // Clear previous hull edges

    hull = monotoneChainConvexHull(points);

    // Clear previous points and visualize them
    visualizePoints();

    // Visualize convex hull step by step with delays
    visualizeConvexHullStepByStep(hull, 0);
   
}

function visualizeConvexHullStepByStep(hull, index) {
    if (index < hull.length - 1) {
        // Draw the current edge of the convex hull
        visualizeHullSegment(hull[index], hull[index + 1]);

        // Delay before moving to the next step
        setTimeout(function () {
            visualizeConvexHullStepByStep(hull, index + 1);
        }, 1000 / speed); // Adjust the delay based on the specified speed
    } else {
        // Draw the last edge to close the convex hull
        visualizeHullSegment(hull[hull.length - 1], hull[0]);
    }
     // Count the unique points in the hull
     var uniquePoints = createUniqueArray(hull);

     // Update the points in hull field
     document.getElementById("pointsInHull").innerText = "Points in Hull: " + uniquePoints.length;
}

function visualizeHullSegment(point1, point2) {
    var svg = d3.select("#visualization");

    svg.append("line")
        .attr("x1", point1.x)
        .attr("y1", point1.y)
        .attr("x2", point2.x)
        .attr("y2", point2.y)
        .style("stroke", "red");
}



// Update the speed variable when the speed input changes
document.getElementById("speed").addEventListener("input", function () {
    speed = parseInt(this.value) || 3;
});
// Add event listeners for the buttons
document.getElementById("generatePointsButton").addEventListener("click", generatePoints);
document.getElementById("visualizeConvexHullButton").addEventListener("click", visualizeConvexHull);