function allowedCoord([newCol, newRow], placements) {
  return placements.every(([oldCol, oldRow]) => {
    if (oldCol === newCol) {
      return newRow < oldRow - 1 || oldRow + 1 < newRow;
    }

    if (oldRow === newRow) {
      return newCol < oldCol - 1 || oldCol + 1 < newCol;
    }

    return true;
  });
}

function randomPos() {
  return 3 + Math.floor(Math.random() * 15);
}

function newCoord(placements) {
  const coord = [randomPos(), randomPos()];

  if (allowedCoord(coord, placements)) {
    return coord;
  }

  return newCoord(placements);
}

export default function randomPlacements(n = 0, placements = []) {
  if (n <= 0) {
    return placements;
  }

  placements.push(newCoord(placements));

  return randomPlacements(n - 1, placements);
}
