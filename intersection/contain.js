function generateAndVisualizeLines() {
  const numLines = 2;
  const lines = [];

  for (let i = 0; i < numLines; i++) {
    const line = generateRandomLinePoints();
    lines.push(line);
  }

  visualizeLines(lines);
  const intersectionPoint = findIntersectionPoint(lines[0], lines[1]);
  visualizeIntersectionPoints(intersectionPoint);

  if (intersectionPoint) {
    document.getElementById("result").innerText = "Intersection Point: [" + intersectionPoint.join(", ") + "]";
  } else {
    document.getElementById("result").innerText = "No Intersection Point";
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
      .attr("stroke", getRandomColor());
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
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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

  const intersectionX =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / det;

  const intersectionY =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / det;

  // Check if the intersection point is within the bounding box of both line segments
  if (
    intersectionX >= Math.min(x1, x2) &&
    intersectionX <= Math.max(x1, x2) &&
    intersectionX >= Math.min(x3, x4) &&
    intersectionX <= Math.max(x3, x4) &&
    intersectionY >= Math.min(y1, y2) &&
    intersectionY <= Math.max(y1, y2) &&
    intersectionY >= Math.min(y3, y4) &&
    intersectionY <= Math.max(y3, y4) &&
    contains(intersectionX, intersectionY, line1) &&
    contains(intersectionX, intersectionY, line2)
  ) {
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

    const slope = (y2 - y1) / (x2 - x1);
    const cond1 = (x1 <= x0) && (x0 < x2);
    const cond2 = (x2 <= x0) && (x0 < x1);
    const above = (y0 < slope * (x0 - x1) + y1);

    if ((cond1 || cond2) && above) {
      crossings++;
    }
  }

  return crossings % 2 !== 0;
}

function visualizeIntersectionPoints(intersectionPoints) {
  const svg = d3.select("#visualization");

  // Draw intersection point
  if (intersectionPoints) {
    svg.append("circle")
      .attr("cx", intersectionPoints[0])
      .attr("cy", intersectionPoints[1])
      .attr("r", 5)
      .attr("fill", "red");
  }
}
