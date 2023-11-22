function generateAndVisualizeLines() {
    const numLines = 2;
    const lines = [];

    for (let i = 0; i < numLines; i++) {
        const line = generateRandomLinePoints();
        lines.push(line);
    }

    visualizeLines(lines);
    findAndVisualizeIntersectionPoint(lines);
}

function findAndVisualizeIntersectionPoint(lines) {
    const intersectionPoint = findIntersectionPoint(lines[0], lines[1]);

    if (intersectionPoint) {
        // Round the coordinates to one decimal place
        const roundedIntersectionPoint = intersectionPoint.map(coord => coord.toFixed(1));
        visualizeIntersectionPoints(roundedIntersectionPoint);
        document.getElementById("result").innerText = "Intersection Point: [" + roundedIntersectionPoint.join(", ") + "]";
    } else {
        visualizeIntersectionPoints(null); // Clear previous intersection points
        document.getElementById("result").innerText = "No Intersection Point";
    }
}

function visualizeIntersectionPoints(intersectionPoints) {
    const svg = d3.select("#visualization");

    // Clear previous intersection points
    svg.selectAll(".intersection-point").remove();

    // Draw intersection point if it exists
    if (intersectionPoints) {
        svg.append("circle")
            .attr("cx", intersectionPoints[0])
            .attr("cy", intersectionPoints[1])
            .attr("r", 5)
            .attr("fill", "red")
            .attr("class", "intersection-point");
    }
}



  function visualizeLines(lines) {
    const svg = d3.select("#visualization");
  
    // Clear previous lines and intersection points
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
    return [[x1, y1], [x2, y2]];
  }
  
  function getRandomColor() {
    let color = ['#ff0000', '#51414f', '#953553', '#800080'];
    let randomIndex = Math.floor(Math.random() * color.length);
    return color[randomIndex];
}
  
function findIntersectionPoint(line1, line2) {
    const x1 = line1[0][0];
    const y1 = line1[0][1];
    const x2 = line1[1][0];
    const y2 = line1[1][1];

    const x3 = line2[0][0];
    const y3 = line2[0][1];
    const x4 = line2[1][0];
    const y4 = line2[1][1];

    const det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (det === 0) {
        // Lines are parallel, no intersection
        return null;
    }

    const t =
        ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;

    const u =
        -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / det;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const intersectionX = x1 + t * (x2 - x1);
        const intersectionY = y1 + t * (y2 - y1);
        return [intersectionX, intersectionY];
    }

    return null;
}

  
  function contains(x0, y0, line) {
    let crossings = 0;

    for (let i = 0; i < line.length - 1; i++) {
        const x1 = line[i][0];
        const y1 = line[i][1];
        const x2 = line[i + 1][0];
        const y2 = line[i + 1][1];

        // Check if the point is on the line segment
        if ((y1 <= y0 && y0 <= y2) || (y2 <= y0 && y0 <= y1)) {
            // Check for vertical line to avoid division by zero
            if (x1 === x2 && x1 === x0) {
                return true;
            }

            // Check if the point is to the left of the line (for non-vertical lines)
            if (x1 !== x2 && x0 < ((y0 - y1) * (x2 - x1)) / (y2 - y1) + x1) {
                crossings++;
            }
        }
    }

    return crossings % 2 !== 0;
}

  
  function visualizeIntersectionPoints(intersectionPoints) {
    const svg = d3.select("#visualization");
  
    // Clear previous intersection points
    svg.selectAll(".intersection-point").remove();
  
    // Draw intersection point if it exists
    if (intersectionPoints) {
      svg.append("circle")
        .attr("cx", intersectionPoints[0])
        .attr("cy", intersectionPoints[1])
        .attr("r", 5)
        .attr("fill", "red")
        .attr("class", "intersection-point");
    }
  }
  
  