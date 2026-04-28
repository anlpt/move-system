// ── Spatial Interpolation — IDW & Ordinary Kriging ──────────────────────────
// Used for risk surface estimation over HCMC school zones.
// Inputs are sparse hotspot observations; outputs are smooth risk grids.

export interface SpatialPoint {
  x: number   // longitude
  y: number   // latitude
  value: number
}

// ── IDW: Inverse Distance Weighting ─────────────────────────────────────────
// Classic deterministic method. Weight = 1 / dist^power.
// Higher power → more local influence; lower → smoother surface.
export function idwInterpolate(
  points: SpatialPoint[],
  qx: number,
  qy: number,
  power = 2
): number {
  let num = 0
  let den = 0
  for (const p of points) {
    const d = Math.sqrt((p.x - qx) ** 2 + (p.y - qy) ** 2)
    if (d < 1e-10) return p.value          // query is on a known point
    const w = 1 / d ** power
    num += w * p.value
    den += w
  }
  return den === 0 ? 0 : num / den
}

// ── Variogram models ─────────────────────────────────────────────────────────
// γ(h) = nugget + (sill-nugget) * model(h/range)
// h = lag distance, returns semivariance

function spherical(h: number, nugget: number, sill: number, range: number): number {
  if (h === 0) return 0
  if (h >= range) return sill
  const r = h / range
  return nugget + (sill - nugget) * (1.5 * r - 0.5 * r ** 3)
}

function exponential(h: number, nugget: number, sill: number, range: number): number {
  if (h === 0) return 0
  return nugget + (sill - nugget) * (1 - Math.exp(-3 * h / range))
}

function gaussian(h: number, nugget: number, sill: number, range: number): number {
  if (h === 0) return 0
  return nugget + (sill - nugget) * (1 - Math.exp(-3 * (h / range) ** 2))
}

export type VariogramModel = 'spherical' | 'exponential' | 'gaussian'

export interface KrigingParams {
  nugget: number          // variance at zero lag (measurement error / micro-scale variation)
  sill: number            // total variance (nugget + partial sill)
  range: number           // distance at which spatial correlation becomes negligible (degrees)
  model: VariogramModel
}

// Auto-estimate variogram parameters from data using method-of-moments
export function estimateVariogram(points: SpatialPoint[]): KrigingParams {
  const n = points.length
  if (n < 3) return { nugget: 0, sill: 1, range: 0.05, model: 'spherical' }

  // Empirical semivariance pairs
  const pairs: Array<{ h: number; gamma: number }> = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const h = Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2)
      const gamma = 0.5 * (points[i].value - points[j].value) ** 2
      pairs.push({ h, gamma })
    }
  }

  // Estimate range as median distance, sill as variance of values
  const values = points.map(p => p.value)
  const mean = values.reduce((s, v) => s + v, 0) / n
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n
  const distances = pairs.map(p => p.h).sort((a, b) => a - b)
  const range = distances[Math.floor(distances.length * 0.6)] ?? 0.05

  return {
    nugget: variance * 0.05,          // small nugget: assume low measurement error
    sill:   variance * 1.1,           // slight overdispersion
    range,
    model: 'spherical',
  }
}

// ── Solve n×n linear system via Gaussian elimination (for Kriging weights) ──
function solveLinear(A: number[][], b: number[]): number[] | null {
  const n = A.length
  const M = A.map((row, i) => [...row, b[i]])   // augmented matrix

  for (let col = 0; col < n; col++) {
    // Partial pivoting
    let maxRow = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[maxRow][col])) maxRow = row
    }
    ;[M[col], M[maxRow]] = [M[maxRow], M[col]]

    if (Math.abs(M[col][col]) < 1e-12) return null   // singular

    for (let row = col + 1; row < n; row++) {
      const factor = M[row][col] / M[col][col]
      for (let k = col; k <= n; k++) M[row][k] -= factor * M[col][k]
    }
  }

  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    x[i] = M[i][n] / M[i][i]
    for (let j = i + 1; j < n; j++) x[i] -= (M[i][j] / M[i][i]) * x[j]
  }
  return x
}

// ── Ordinary Kriging ─────────────────────────────────────────────────────────
// Best Linear Unbiased Estimator (BLUE) for spatial data.
// Solves the kriging system: Γ·λ = γ₀  subject to Σλ = 1 (unbiasedness).
export function krigingInterpolate(
  points: SpatialPoint[],
  qx: number,
  qy: number,
  params: KrigingParams
): number {
  const n = points.length
  if (n === 0) return 0
  if (n === 1) return points[0].value

  const γ = (h: number) => {
    if (params.model === 'spherical')   return spherical(h, params.nugget, params.sill, params.range)
    if (params.model === 'exponential') return exponential(h, params.nugget, params.sill, params.range)
    return gaussian(h, params.nugget, params.sill, params.range)
  }

  // Build Γ (n+1)×(n+1) kriging matrix (includes Lagrange multiplier row/col)
  const size = n + 1
  const Gamma: number[][] = Array.from({ length: size }, () => new Array(size).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const h = Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2)
      Gamma[i][j] = γ(h)
    }
    Gamma[i][n] = 1
    Gamma[n][i] = 1
  }
  Gamma[n][n] = 0

  // Build γ₀ — semivariances from query to each data point
  const gamma0 = points.map(p => {
    const h = Math.sqrt((p.x - qx) ** 2 + (p.y - qy) ** 2)
    return γ(h)
  })
  gamma0.push(1)   // Lagrange constraint

  const weights = solveLinear(Gamma, gamma0)
  if (!weights) return idwInterpolate(points, qx, qy, 2)   // fallback to IDW

  // Kriging estimate = Σ λᵢ·zᵢ
  let estimate = 0
  for (let i = 0; i < n; i++) estimate += weights[i] * points[i].value
  return estimate
}

// ── Grid generation ───────────────────────────────────────────────────────────
// Returns a flat array of { x, y, value } covering [minX,maxX]×[minY,maxY]
export function buildGrid(
  points: SpatialPoint[],
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  cols: number,
  rows: number,
  method: 'idw' | 'kriging',
  idwPower = 2,
  krigingParams?: KrigingParams
): number[] {
  const kp = krigingParams ?? estimateVariogram(points)
  const grid: number[] = new Array(cols * rows)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = bounds.minX + (col / (cols - 1)) * (bounds.maxX - bounds.minX)
      const y = bounds.minY + (row / (rows - 1)) * (bounds.maxY - bounds.minY)
      const val = method === 'kriging'
        ? krigingInterpolate(points, x, y, kp)
        : idwInterpolate(points, x, y, idwPower)
      grid[row * cols + col] = val
    }
  }
  return grid
}

// ── Color mapping ─────────────────────────────────────────────────────────────
// 5-stop ramp: deep blue → teal → green → amber → red
// t=0 (safe) … t=1 (high risk). All pixels fully opaque for vivid demo display.
export function riskToRGBA(value: number, minVal: number, maxVal: number): [number, number, number, number] {
  const t = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal || 1)))

  // Stops: 0 → 0.25 → 0.5 → 0.75 → 1
  // Colors: #3b82f6  #22c55e  #84cc16  #f59e0b  #ef4444
  const stops: Array<[number, number, number]> = [
    [59,  130, 246],   // blue   (t=0)
    [34,  197,  94],   // green  (t=0.25)
    [132, 204,  22],   // lime   (t=0.5)
    [245, 158,  11],   // amber  (t=0.75)
    [239,  68,  68],   // red    (t=1)
  ]

  const seg = t * (stops.length - 1)
  const lo  = Math.floor(seg)
  const hi  = Math.min(lo + 1, stops.length - 1)
  const u   = seg - lo

  const r = Math.round(stops[lo][0] + u * (stops[hi][0] - stops[lo][0]))
  const g = Math.round(stops[lo][1] + u * (stops[hi][1] - stops[lo][1]))
  const b = Math.round(stops[lo][2] + u * (stops[hi][2] - stops[lo][2]))

  // Uniform high opacity so the full ramp is always vivid
  const alpha = Math.round((0.55 + t * 0.35) * 255)   // 0.55 … 0.90
  return [r, g, b, alpha]
}

// ── Render grid to canvas ImageData ──────────────────────────────────────────
// Pass adaptiveScale=true to auto-stretch contrast to grid's actual min/max.
export function gridToImageData(
  grid: number[],
  cols: number,
  rows: number,
  minVal: number,
  maxVal: number,
  adaptiveScale = true
): ImageData {
  let lo = minVal
  let hi = maxVal
  if (adaptiveScale) {
    lo = Infinity; hi = -Infinity
    for (const v of grid) { if (v < lo) lo = v; if (v > hi) hi = v }
    // Small margin so extreme points stay at full red/blue
    const margin = (hi - lo) * 0.08
    lo = Math.max(minVal, lo - margin)
    hi = Math.min(maxVal, hi + margin)
  }

  const data = new Uint8ClampedArray(cols * rows * 4)
  for (let i = 0; i < grid.length; i++) {
    const [r, g, b, a] = riskToRGBA(grid[i], lo, hi)
    data[i * 4]     = r
    data[i * 4 + 1] = g
    data[i * 4 + 2] = b
    data[i * 4 + 3] = a
  }
  return new ImageData(data, cols, rows)
}
