
type Gasto = {
  fecha: string;
  descripcion: string;
  pagadoPor: string;
  monto: number;
};

type Categoria = {
  nombre: string;
  monto: number;
  porcentaje: number;
};

type Deuda = {
  deudor: string;
  acreedor: string;
  monto: number;
};

export function generarHTMLPDF({
  fechaInicio,
  fechaFin,
  totalGastos,
  promedioPorDia,
  gastos,
  participantes,
  categorias,
  gastosPorPersona,
  deudas,
}: {
  fechaInicio: string;
  fechaFin: string;
  totalGastos: number;
  promedioPorDia: number;
  gastos: Gasto[];
  participantes: string[];
  categorias: Categoria[];
  gastosPorPersona: { [key: string]: number };
  deudas: Deuda[];
}): string {
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

 return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    :root {
      --primary: #2563eb;
      --primary-light: #60a5fa;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --gray-50: #f8fafc;
      --gray-100: #f1f5f9;
      --gray-200: #e2e8f0;
      --gray-300: #cbd5e1;
      --gray-700: #334155;
      --gray-800: #1e293b;
      --background-card: #ffffff;
      --shadow-light: rgba(0, 0, 0, 0.08);
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: var(--gray-50);
      margin: 0;
      padding: 40px 20px;
      color: var(--gray-800);
      line-height: 1.6;
      font-size: 16px;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      background: var(--background-card);
      border-radius: 20px;
      box-shadow: 0 8px 24px var(--shadow-light);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, var(--primary), #1d4ed8);
      color: white;
      padding: 48px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
    .header::after {
      content: '';
      position: absolute;
      top: 10px;
      right: 10px;
      width: 60px;
      height: 60px;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.15;
      pointer-events: none;
    }
    h1 {
      margin: 0 0 12px 0;
      font-size: 2.8rem;
      font-weight: 800;
      letter-spacing: -1px;
    }
    .subtitle {
      font-size: 1rem;
      opacity: 0.85;
      margin-bottom: 6px;
    }
    .content {
      padding: 40px 32px 60px 32px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 28px;
      margin-bottom: 48px;
    }
    .stat-card {
      background: var(--gray-50);
      padding: 28px 32px;
      border-radius: 16px;
      box-shadow: 0 4px 16px var(--shadow-light);
      border: none;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      cursor: default;
    }
    .stat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 10px 28px rgba(37, 99, 235, 0.3);
    }
    .stat-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .stat-value {
      font-size: 2.4rem;
      font-weight: 900;
      color: var(--primary);
      letter-spacing: -0.02em;
      user-select: all;
    }
    .section {
      margin-bottom: 48px;
      background: var(--gray-50);
      border-radius: 16px;
      box-shadow: 0 2px 12px var(--shadow-light);
      overflow: hidden;
      border: none;
    }
    .section-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--gray-800);
      padding: 20px 30px;
      background: white;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
      gap: 12px;
      user-select: none;
    }
    .section-content {
      padding: 24px 32px;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 10px;
    }
    th {
      font-weight: 700;
      color: var(--gray-700);
      padding: 14px 20px;
      text-align: left;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      background: transparent;
      border-bottom: 2px solid var(--primary-light);
    }
    tbody tr {
      background: white;
      box-shadow: 0 2px 6px var(--shadow-light);
      border-radius: 12px;
    }
    tbody tr td {
      padding: 14px 20px;
      vertical-align: middle;
      font-weight: 500;
      color: var(--gray-800);
      border: none;
    }
    tbody tr td:last-child {
      font-weight: 700;
      color: var(--primary);
      font-family: monospace;
      text-align: right;
      user-select: all;
    }
    .amount {
      font-family: monospace;
      font-weight: 600;
    }
    .balance-card {
      padding: 24px 28px;
      border-radius: 16px;
      margin-bottom: 18px;
      font-size: 1.1rem;
      font-weight: 700;
      user-select: none;
      box-shadow: 0 3px 10px var(--shadow-light);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .balance-card.positive {
      background: #d1fae5;
      border-left: 6px solid #10b981;
      color: #065f46;
    }
    .balance-card.negative {
      background: #fee2e2;
      border-left: 6px solid #ef4444;
      color: #7f1d1d;
    }
    .deuda-item {
      margin-bottom: 12px;
      font-size: 1.1rem;
    }
    .categoria-bar {
      margin-bottom: 14px;
    }
    .categoria-name {
      font-weight: 600;
      margin-bottom: 6px;
      display: block;
      color: var(--gray-700);
      user-select: none;
    }
    .categoria-amount {
      font-weight: 700;
      float: right;
      font-family: monospace;
      color: var(--primary);
      user-select: all;
    }
    .progress-bar {
      height: 18px;
      background: var(--gray-200);
      border-radius: 12px;
      overflow: hidden;
      margin-top: 4px;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.07);
    }
    .progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 12px 0 0 12px;
      transition: width 0.4s ease;
    }
    .footer {
      text-align: center;
      padding: 32px 16px;
      color: var(--gray-600);
      font-size: 14px;
      border-top: 1px solid var(--gray-200);
      user-select: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Reporte de Gastos Compartidos</h1>
      <div class="subtitle">Generado el ${fechaActual}</div>
      <div class="subtitle">Período: ${fechaInicio} - ${fechaFin}</div>
    </div>

    <div class="content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total de Gastos</div>
          <div class="stat-value">$${totalGastos.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Promedio por Día</div>
          <div class="stat-value">$${promedioPorDia.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Número de Gastos</div>
          <div class="stat-value">${gastos.length}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">💰 Gastos por Persona</div>
        <div class="section-content">
          ${participantes.map(p => {
            const gastoPersona = gastosPorPersona[p] || 0;
            const promedioPersona = totalGastos / participantes.length;
            const positive = gastoPersona <= promedioPersona;
            return `
              <div class="balance-card ${positive ? 'positive' : 'negative'}">
                <strong>${p}</strong> gastó: <strong>$${gastoPersona.toFixed(2)}</strong>
              </div>
            `;
          }).join('')}
          <div style="margin-top: 15px; padding: 15px; background: #e0e7ff; border-radius: 12px; font-weight: 700; color: var(--primary); user-select: none;">
            Promedio por persona: $${(totalGastos / participantes.length).toFixed(2)}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📊 Balance de Deudas</div>
        <div class="section-content">
          ${deudas.length === 0
            ? '<p style="color: #22c55e; font-weight: 700; user-select: none;">✅ ¡Todo está equilibrado! No hay deudas pendientes.</p>'
            : deudas.map(d => `
              <div class="deuda-item">
                <strong>${d.deudor}</strong> debe <strong style="color: #ef4444;">$${d.monto.toFixed(2)}</strong> a <strong>${d.acreedor}</strong>
              </div>
            `).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">📁 Gastos por Categoría</div>
        <div class="section-content">
          ${(() => {
            const maxMonto = Math.max(...categorias.map(cat => cat.monto));
            return categorias.map(cat => {
              const porcentaje = maxMonto > 0 ? (cat.monto / maxMonto) * 100 : 0;
              return `
                <div class="categoria-bar">
                  <span class="categoria-name">${cat.nombre}</span>
                  <span class="categoria-amount">$${cat.monto.toFixed(2)}</span>
                  <div class="progress-bar" aria-label="${cat.nombre} - $${cat.monto.toFixed(2)}">
                    <div class="progress-fill" style="width: ${porcentaje}%;"></div>
                  </div>
                </div>
              `;
            }).join('');
          })()}
        </div>
      </div>

      <div class="section">
        <div class="section-title">📝 Detalle de Gastos</div>
        <div class="section-content">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Pagado por</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              ${gastos.map(g => `
                <tr>
                  <td>${g.fecha}</td>
                  <td>${g.descripcion}</td>
                  <td>${g.pagadoPor}</td>
                  <td><strong>$${g.monto.toFixed(2)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="footer">
        <p>Gastos Compartidos - App de gestión de gastos entre amigos</p>
        <p>Generado automáticamente</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

}
