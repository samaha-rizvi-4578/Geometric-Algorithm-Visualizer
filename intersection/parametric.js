function generateLines() {
    const numLines = 2;
    const lines = [];

    for (let i = 0; i < numLines; i++) {
        const line = generateRandomLinePoints();
        lines.push(line);
    }

    visualizeLines(lines);
    const intersectionPoint = findIntersectionPoint(lines);
    if (intersectionPoint) {
        document.getElementById("result").innerText = "Intersection Point: ( " + intersectionPoint + ")";
    } else {
        document.getElementById("result").innerText = "Lines Segments are Not Intersecting";
    }
}

function visualizeLines(lines) {
    const svg = d3.select("#visualization");

    // Clear previous lines
    svg.selectAll("*").remove();

    lines.forEach(line => {
        // Visualize line
        svg.append("line")
            .attr("x1", line[0][0])
            .attr("y1", line[0][1])
            .attr("x2", line[1][0])
            .attr("y2", line[1][1])
            .attr("stroke", getRandomColor())
            .style("stroke-width", 2); // Increase the stroke-width to make the line bolder
    });
}

function generateRandomLinePoints() {
    const x1 = Math.random() * 300;
    const y1 = Math.random() * 300;
    const x2 = Math.random() * 300;
    const y2 = Math.random() * 300;
    return [[x1, y1], [x2+15, y2+15]];
}

function getRandomColor() {
    let color = ['#ff0000', '#51414f', '#953553', '#800080'];
    let randomIndex = Math.floor(Math.random() * color.length);
    return color[randomIndex];
}

// Function to check if two line segments intersect using parametric approach
function findIntersectionPoint(lines) {
    const numLines = lines.length;
    const intersectionPoints = [];

    for (let i = 0; i < numLines - 1; i++) {
        const line1 = lines[i];
        const [x1, y1] = line1[0];
        const [x2, y2] = line1[1];

        for (let j = i + 1; j < numLines; j++) {
            const line2 = lines[j];
            const [x3, y3] = line2[0];
            const [x4, y4] = line2[1];

            const ua_num = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
            const ua_denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

            const ub_num = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
            const ub_denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

            const ua = ua_denom !== 0 ? ua_num / ua_denom : Number.MAX_VALUE;
            const ub = ub_denom !== 0 ? ub_num / ub_denom : Number.MAX_VALUE;

            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                // Intersection found, calculate the point
                const intersectionX = x1 + ua * (x2 - x1);
                const intersectionY = y1 + ua * (y2 - y1);
                intersectionPoints.push([intersectionX, intersectionY]);
            }
        }
    }

    visualizeIntersectionPoints(lines, intersectionPoints);

    return intersectionPoints.length > 0 ? intersectionPoints : null; // No intersection found
}

function visualizeIntersectionPoints(lines, intersectionPoints) {
    const svg = d3.select("#visualization");

    // Draw intersection points
    svg.selectAll("circle")
        .data(intersectionPoints)
        .enter().append("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5)
        .attr("fill", "red");
}

