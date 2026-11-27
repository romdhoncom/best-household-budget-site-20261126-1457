// DompetKeluarga — tiny canvas chart helpers. No chart library: every bar and
// slice is drawn by hand so the first load stays small.

function setupCanvas(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function niceMax(value) {
  if (value <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  const scaled = value / power;
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 2.5 ? 2.5 : scaled <= 5 ? 5 : 10;
  return nice * power;
}

function niceSteps(max, count) {
  const step = niceMax(max / count);
  const steps = [];
  for (let v = 0; v <= max + 1e-9; v += step) steps.push(v);
  return { step, steps, top: steps[steps.length - 1] };
}

// Horizontal bar chart: [{label, value, color}]. Values formatted by `fmt`.
export function drawBarChart(canvas, rows, fmt) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const w = Math.max(280, Math.min(720, width - 8));
  const labelW = 118;
  const rowH = 30;
  const h = rows.length * rowH + 34;
  const ctx = setupCanvas(canvas, w, h);
  const max = niceMax(Math.max(...rows.map((r) => r.value), 1));
  const plotW = w - labelW - 64;
  ctx.font = '12px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  rows.forEach((row, i) => {
    const y = 14 + i * rowH;
    ctx.fillStyle = '#3d3d3d';
    ctx.textAlign = 'right';
    ctx.fillText(row.label, labelW - 8, y + 9);
    const barW = Math.max(2, (row.value / max) * plotW);
    ctx.fillStyle = row.color;
    ctx.beginPath();
    ctx.roundRect(labelW, y, barW, 18, 4);
    ctx.fill();
    ctx.fillStyle = '#3d3d3d';
    ctx.textAlign = 'left';
    ctx.fillText(fmt(row.value), labelW + barW + 6, y + 9);
  });
  // Axis line and max tick.
  ctx.strokeStyle = '#d8d2c4';
  ctx.beginPath();
  ctx.moveTo(labelW, h - 18);
  ctx.lineTo(labelW + plotW, h - 18);
  ctx.stroke();
  ctx.fillStyle = '#8a8578';
  ctx.textAlign = 'right';
  ctx.fillText(fmt(max), labelW + plotW, h - 8);
}

// Doughnut chart: [{label, value, color}]. Centre shows the total.
export function drawDoughnut(canvas, rows, fmt, centreLabel) {
  const size = 230;
  const ctx = setupCanvas(canvas, size, size);
  const total = rows.reduce((s, r) => s + r.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outer = 104;
  const inner = 66;
  let angle = -Math.PI / 2;
  for (const row of rows) {
    if (row.value <= 0) continue;
    const sweep = (row.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.arc(cx, cy, inner, angle + sweep, angle, true);
    ctx.closePath();
    ctx.fillStyle = row.color;
    ctx.fill();
    angle += sweep;
  }
  ctx.fillStyle = '#1f2a24';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(fmt(total), cx, cy - 8);
  ctx.fillStyle = '#8a8578';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(centreLabel, cx, cy + 12);
}

// Grouped monthly bars: income vs spent per month.
export function drawMonthlyChart(canvas, months, fmt) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const w = Math.max(280, Math.min(720, width - 8));
  const h = 210;
  const ctx = setupCanvas(canvas, w, h);
  const padL = 52;
  const padB = 26;
  const plotW = w - padL - 12;
  const plotH = h - padB - 12;
  const max = niceMax(Math.max(...months.flatMap((m) => [m.income, m.spent]), 1));
  const { steps, top } = niceSteps(max, 4);
  ctx.font = '11px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = '#e6e1d3';
  ctx.fillStyle = '#8a8578';
  ctx.textAlign = 'right';
  for (const v of steps) {
    const y = 12 + plotH - (v / top) * plotH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - 12, y);
    ctx.stroke();
    ctx.fillText(fmt(v), padL - 6, y);
  }
  const groupW = plotW / months.length;
  const barW = Math.min(20, (groupW - 14) / 2);
  months.forEach((m, i) => {
    const gx = padL + i * groupW + (groupW - barW * 2 - 6) / 2;
    const hIn = (m.income / top) * plotH;
    const hSp = (m.spent / top) * plotH;
    ctx.fillStyle = '#2e7d5b';
    ctx.beginPath();
    ctx.roundRect(gx, 12 + plotH - hIn, barW, hIn, 3);
    ctx.fill();
    ctx.fillStyle = '#c0564f';
    ctx.beginPath();
    ctx.roundRect(gx + barW + 6, 12 + plotH - hSp, barW, hSp, 3);
    ctx.fill();
    ctx.fillStyle = '#3d3d3d';
    ctx.textAlign = 'center';
    ctx.fillText(m.month, padL + i * groupW + groupW / 2, h - 10);
  });
}
