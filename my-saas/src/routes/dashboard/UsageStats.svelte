<!-- src/routes/dashboard/UsageStats.svelte -->
<script>
  import { onMount } from 'svelte';

  export let monthlyData = [];

  let canvas;
  let chart;

  onMount(() => {
    // Simulation d'un graphique à barres simple
    // Dans une application réelle, vous utiliseriez Chart.js ou D3.js
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawBarChart(ctx, monthlyData);
    }
  });

  function drawBarChart(ctx, data) {
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width - 60) / data.length;
    const maxValue = Math.max(...data.map(d => d.energy)) * 1.1; // Ajouter 10% pour l'espace

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner l'axe Y
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    // Dessiner les barres
    data.forEach((item, index) => {
      const x = 50 + index * barWidth;
      const barHeight = (item.energy / maxValue) * (height - 80);

      // Barre
      ctx.fillStyle = '#2a5caa';
      ctx.fillRect(x, height - 40 - barHeight, barWidth - 10, barHeight);

      // Étiquette du mois
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.month, x + (barWidth - 10) / 2, height - 20);

      // Valeur
      ctx.fillStyle = '#333';
      ctx.fillText(item.energy, x + (barWidth - 10) / 2, height - 45 - barHeight);
    });
  }

  // Responsive chart when window resizes
  function handleResize() {
    if (canvas) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 240;

      const ctx = canvas.getContext('2d');
      drawBarChart(ctx, monthlyData);
    }
  }
</script>

<svelte:window on:resize={handleResize} />

<div class="usage-stats">
  <div class="chart-container">
    <canvas bind:this={canvas} width="300" height="240"></canvas>
  </div>

  <div class="stats-summary">
    <div class="stat-item">
      <span class="stat-label">Total ce mois</span>
      <span class="stat-value">{monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].energy : 0} kWh</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Moyenne mensuelle</span>
      <span class="stat-value">
        {Math.round(monthlyData.reduce((sum, item) => sum + item.energy, 0) / monthlyData.length)} kWh
      </span>
    </div>
  </div>

  <div class="stats-footer">
    <a href="/statistics/detailed" class="btn-details">
      Voir statistiques détaillées
    </a>
  </div>
</div>

<style>
  .usage-stats {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chart-container {
    flex-grow: 1;
    width: 100%;
    height: 240px;
    margin-bottom: 15px;
  }

  .stats-summary {
    display: flex;
    justify-content: space-around;
    margin-bottom: 15px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 5px;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 500;
    color: #2a5caa;
  }

  .stats-footer {
    text-align: center;
    margin-top: auto;
  }

  .btn-details {
    color: #2a5caa;
    text-decoration: none;
    font-size: 0.9rem;
  }

  .btn-details:hover {
    text-decoration: underline;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
</style>