// Get package name from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const packageName = urlParams.get('package');

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const resultsEl = document.getElementById('results');

if (!packageName) {
  errorEl.textContent = 'No package specified. Add ?package=your-package-name to the URL';
  errorEl.classList.remove('hidden');
} else {
  analyzePackage(packageName);
}

function convertToDisplayName(signalName) {
  return signalName
    .replace(/_/g, ' - ') // Convert underscore to dash with spaces
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters everywhere
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/\s+/g, ' ') // Clean up multiple spaces
    .trim();
}

function getScoreColor(score) {
  // Smooth gradient from red (0) -> orange (50) -> yellow (75) -> green (100)
  if (score >= 75) {
    // Green zone: interpolate from yellow-green to pure green
    const t = (score - 75) / 25;
    const r = Math.round(132 - 132 * t); // 132 -> 0
    const g = Math.round(204 + 51 * t); // 204 -> 255
    const b = Math.round(22 - 22 * t); // 22 -> 0
    return { 
      start: `rgb(${r}, ${g}, ${b})`, 
      end: `rgb(${Math.round(r * 0.8)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.8)})` 
    };
  } else if (score >= 50) {
    // Orange to yellow zone
    const t = (score - 50) / 25;
    const r = Math.round(239 - 107 * t); // 239 -> 132
    const g = Math.round(68 + 136 * t); // 68 -> 204
    const b = Math.round(68 - 46 * t); // 68 -> 22
    return { 
      start: `rgb(${r}, ${g}, ${b})`, 
      end: `rgb(${Math.round(r * 0.85)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.85)})` 
    };
  } else {
    // Red zone: darker red at 0, lighter at 50
    const t = score / 50;
    const r = Math.round(185 + 54 * t); // 185 -> 239
    const g = Math.round(28 + 40 * t); // 28 -> 68
    const b = Math.round(28 + 40 * t); // 28 -> 68
    return { 
      start: `rgb(${r}, ${g}, ${b})`, 
      end: `rgb(${Math.round(r * 0.8)}, ${Math.round(g * 0.8)}, ${Math.round(b * 0.8)})` 
    };
  }
}

async function analyzePackage(packageName) {
  loadingEl.classList.remove('hidden');
  errorEl.classList.add('hidden');
  resultsEl.classList.add('hidden');

  try {
    const response = await fetch(`/api/analyze/${encodeURIComponent(packageName)}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze package');
    }

    const data = await response.json();
    displayResults(data);
  } catch (error) {
    errorEl.textContent = `Error: ${error.message}`;
    errorEl.classList.remove('hidden');
  } finally {
    loadingEl.classList.add('hidden');
  }
}

function displayResults(data) {
  document.getElementById('packageName').textContent = data.packageName;
  document.getElementById('version').textContent = `Version: ${data.version}`;

  // Total score
  const totalScoreContainer = document.getElementById('totalScoreContainer');
  const circumference = 2 * Math.PI * 36; // radius = 36 (larger for total)
  const offset = circumference - (data.totalScore / 100) * circumference;
  const totalColor = getScoreColor(data.totalScore);
  
  totalScoreContainer.innerHTML = `
    <div class="circular-progress total-progress">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <defs>
          <linearGradient id="gradient-total" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${totalColor.start};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${totalColor.end};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle class="progress-bg" cx="45" cy="45" r="36"></circle>
        <circle class="progress-bar" cx="45" cy="45" r="36" 
                style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}; stroke: url(#gradient-total)"></circle>
      </svg>
      <div class="progress-value">${data.totalScore}</div>
    </div>
  `;

  // Pillar scores
  const pillarScoresContainer = document.getElementById('pillarScores');
  pillarScoresContainer.innerHTML = '';

  for (const [pillar, score] of Object.entries(data.pillarScores)) {
    const pillarDiv = document.createElement('div');
    pillarDiv.className = 'pillar-item';
    
    const circumference = 2 * Math.PI * 20; // radius = 20
    const offset = circumference - (score / 100) * circumference;
    const pillarColor = getScoreColor(score);
    
    // Get signals for this pillar
    const signalScores = data.signalScores?.[pillar] || {};
    const signalWeights = data.signalWeights?.[pillar] || {};
    
    const signalEntries = Object.entries(signalScores);
    const tooltipContent = signalEntries.length > 0 
      ? signalEntries.map(([name, score]) => {
          const weight = signalWeights[name] || 0;
          const displayName = convertToDisplayName(name);
          return `<div class="signal-row"><span class="signal-name">${displayName}</span><span class="signal-score">${score}★ (${weight}%)</span></div>`;
        }).join('')
      : '<div class="signal-row">No signals available</div>';
    
    pillarDiv.innerHTML = `
      <div class="circular-progress">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <defs>
            <linearGradient id="gradient-${pillar}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${pillarColor.start};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${pillarColor.end};stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle class="progress-bg" cx="26" cy="26" r="20"></circle>
          <circle class="progress-bar" cx="26" cy="26" r="20" 
                  style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}; stroke: url(#gradient-${pillar})"></circle>
        </svg>
        <div class="progress-value">${score}</div>
      </div>
      <div class="pillar-name">${pillar.toLowerCase()}</div>
      <div class="tooltip">${tooltipContent}</div>
    `;
    
    pillarScoresContainer.appendChild(pillarDiv);
  }

  resultsEl.classList.remove('hidden');
}
