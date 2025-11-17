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
  
  totalScoreContainer.innerHTML = `
    <div class="circular-progress total-progress">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <defs>
          <linearGradient id="gradient-total" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0972d3;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0052cc;stop-opacity:1" />
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
    
    pillarDiv.innerHTML = `
      <div class="circular-progress">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <defs>
            <linearGradient id="gradient-${pillar}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#0972d3;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#0052cc;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle class="progress-bg" cx="26" cy="26" r="20"></circle>
          <circle class="progress-bar" cx="26" cy="26" r="20" 
                  style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}; stroke: url(#gradient-${pillar})"></circle>
        </svg>
        <div class="progress-value">${score}</div>
      </div>
      <div class="pillar-name">${pillar.toLowerCase()}</div>
    `;
    
    pillarScoresContainer.appendChild(pillarDiv);
  }

  resultsEl.classList.remove('hidden');
}
