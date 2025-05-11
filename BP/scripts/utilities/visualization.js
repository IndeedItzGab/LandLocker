globalThis.visualization = (primaryBlock, secondaryBlock, data) => {
  const cornerOffsets = [
    { dx: 0, dz: 0, type: `${primaryBlock}` },
    { dx: 1, dz: 0, type: `${secondaryBlock}` },
    { dx: 0, dz: 1, type: `${secondaryBlock}` }
  ];
  
  const baseCorners = [
    { x: data.bounds.lx, z: data.bounds.rz },
    { x: data.bounds.lx, z: data.bounds.lz },
    { x: data.bounds.rx, z: data.bounds.lz },
    { x: data.bounds.rx, z: data.bounds.rz }
  ];
  
  let corners = [];
  
  // Responsible for setting up the corner part of the land
  for (const base of baseCorners) {
    for (const offset of cornerOffsets) {
      const x = base.x + offset.dx * (base.x === data.bounds.rx ? -1 : 1);
      const z = base.z + offset.dz * (base.z === data.bounds.rz ? -1 : 1);
      const y = getTopBlock({ x, z });
  
      corners.push({ x, y, z, type: `${offset.type}` });
    }
  }
  
  // Responsible for in-between edit blocks
  for (let i = 0; i < baseCorners.length; i++) {
    const current = baseCorners[i];
    const next = baseCorners[(i + 1) % baseCorners.length];
  
    if (current.x === next.x) {
      const step = current.z < next.z ? 10 : -10;
      for (let z = current.z; step > 0 ? z <= next.z : z >= next.z; z += step) {
        const remaining = Math.abs(next.z - z);
        if (remaining >= 6) {
          if(z === current.z) continue
          const y = getTopBlock({ x: current.x, z });
          corners.push({ x: current.x, y, z, type: secondaryBlock });
        }
      }
    } else if (current.z === next.z) {
      const step = current.x < next.x ? 10 : -10;
      for (let x = current.x; step > 0 ? x <= next.x : x >= next.x; x += step) {
        const remaining = Math.abs(next.x - x);
        if (remaining >= 6) {
          if(x === current.x) continue
          const y = getTopBlock({ x, z: current.z });
          corners.push({ x, y, z: current.z, type: secondaryBlock });
        }
      }
    }
  }
  return corners;
}