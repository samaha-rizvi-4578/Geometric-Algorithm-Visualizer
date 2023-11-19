// Variables to store width, height, points, hull, and speed
var width = 1000;
var height = 400;
var points = [];
var hull = [];
//var speed = parseInt(document.getElementById("speed").value) || 3;
var speed = 3;    // Default speed value
var uniquePoints = 0;
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
    const filteredArray = array.filter((_item, index, self) =>
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
        .attr("r", 5)
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
//quick hull ogic start
function quickHullConvexHull(points) {
    if (points.length < 3) {
        // Convex hull is not possible with less than 3 points
        return points;
    }

    // Find the leftmost and rightmost points to form the initial line
    var minX = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    var leftmost, rightmost;

    for (var i = 0; i < points.length; i++) {
        var x = points[i].x;

        if (x < minX) {
            minX = x;
            leftmost = i;
        }

        if (x > maxX) {
            maxX = x;
            rightmost = i;
        }
    }

    var hull = [points[leftmost], points[rightmost]];

    // Divide the points into two sets based on the side of the line they fall on
    var set1 = findPointsOnSide(points, hull[0], hull[1]);
    findHull(set1, hull[0], hull[1], hull);

    var set2 = findPointsOnSide(points, hull[1], hull[0]);
    findHull(set2, hull[1], hull[0], hull);

    return hull;
}

function findPointsOnSide(points, p1, p2) {
    var onSide = [];
    for (var i = 0; i < points.length; i++) {
        if (isPointOnSide(points[i], p1, p2) > 0) {
            onSide.push(points[i]);
        }
    }
    return onSide;
}

function isPointOnSide(test, p1, p2) {
    return (p2.x - p1.x) * (test.y - p1.y) - (p2.y - p1.y) * (test.x - p1.x);
}

function findHull(points, p1, p2, hull) {
    var insertIndex = hull.indexOf(p2);

    if (points.length === 0) {
        return;
    }

    if (points.length === 1) {
        hull.splice(insertIndex, 0, points[0]);
        return;
    }

    var farthestPoint = findFarthestPoint(points, p1, p2);
    hull.splice(insertIndex, 0, farthestPoint);

    var set1 = findPointsOnSide(points, p1, farthestPoint);
    var set2 = findPointsOnSide(points, farthestPoint, p2);

    findHull(set1, p1, farthestPoint, hull);
    findHull(set2, farthestPoint, p2, hull);
}

function findFarthestPoint(points, p1, p2) {
    var maxDistance = 0;
    var farthestPoint;

    for (var i = 0; i < points.length; i++) {
        var d = pointToLineDistance(points[i], p1, p2);

        if (d > maxDistance) {
            maxDistance = d;
            farthestPoint = points[i];
        }
    }

    return farthestPoint;
}

function pointToLineDistance(point, lineStart, lineEnd) {
    var numerator = Math.abs((lineEnd.y - lineStart.y) * point.x - (lineEnd.x - lineStart.x) * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x);
    var denominator = Math.sqrt(Math.pow(lineEnd.y - lineStart.y, 2) + Math.pow(lineEnd.x - lineStart.x, 2));
    return numerator / denominator;
}

// quich hull logic end
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
        .attr("r", 5)
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
            .style("stroke", "red")
            .style("stroke-width", 2); // Increase the stroke-width to make the line bolder
    }

    // Connect the last and first points to close the hull
    svg.append("line")
        .attr("x1", hull[hull.length - 1].x)
        .attr("y1", hull[hull.length - 1].y)
        .attr("x2", hull[0].x)
        .attr("y2", hull[0].y)
        .style("stroke", "red")
        .style("stroke-width", 2); // Increase the stroke-width to make the line bolder

    // Count the unique points in the hull
    var uniquePoints = createUniqueArray(hull);

    // Update the points in hull field
    document.getElementById("pointsInHull").innerText = "Points in Hull: " + uniquePoints.length;
}


function visualizeConvexHull() {
    d3.select("#visualization").selectAll("line").remove(); // Clear previous hull edges

    hull = quickHullConvexHull(points);

    // Clear previous points and visualize them
    visualizePoints();

    // Visualize convex hull step by step with delays
    visualizeConvexHullStepByStep(hull, 0);
    // Count the unique points in the hull
    var uniquePoints = createUniqueArray(hull);

    // Update the points in hull field
    document.getElementById("pointsInHull").innerText = "Points in Hull: " + uniquePoints.length;
}


function visualizeConvexHullStepByStep(hull, index) {
    if (index < hull.length - 1) {
        // Draw the current edge of the convex hull
        visualizeHullSegment(hull[index], hull[index + 1], hull);

        // Delay before moving to the next step
        setTimeout(function () {
            visualizeConvexHullStepByStep(hull, index + 1);
        }, 1000 / speed); // Adjust the delay based on the specified speed
    } else {
        // Draw the last edge to close the convex hull
        visualizeHullSegment(hull[hull.length - 1], hull[0], hull);
    }
}


function visualizeHullSegment(point1, point2) {
    var svg = d3.select("#visualization");

    svg.append("line")
        .attr("x1", point1.x)
        .attr("y1", point1.y)
        .attr("x2", point2.x)
        .attr("y2", point2.y)
        .style("stroke", "red")
        .style("stroke-width", 2); // Increase the stroke-width to make the line bolder
         // Count the unique points in the hull
    uniquePoints = createUniqueArray(hull);

    // Update the points in hull field
    document.getElementById("pointsInHull").innerText = "Points in Hull: " + uniquePoints.length;
}



// Update the speed variable when the speed input changes
document.getElementById("speed").addEventListener("input", function () {
    speed = parseInt(this.value) || 3;
});

// Add event listeners for the buttons
document.getElementById("generatePointsButton").addEventListener("click", generatePoints);
document.getElementById("visualizeConvexHullButton").addEventListener("click", visualizeConvexHull);
