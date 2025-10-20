
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
      <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
          h1 { margin: 0 0 10px 0; font-size: 32px; }
          .subtitle { opacity: 0.9; font-size: 16px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 20px; font-weight: bold; color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          .stats { display: flex; gap: 20px; margin-bottom: 30px; }
          .stat-card { flex: 1; background: #f7fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .stat-label { font-size: 12px; color: #718096; margin-bottom: 5px; }
          .stat-value { font-size: 28px; font-weight: bold; color: #2d3748; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          th { background: #f7fafc; font-weight: bold; color: #4a5568; }
          .categoria-bar { display: flex; align-items: center; margin-bottom: 15px; }
          .categoria-name { width: 150px; font-weight: 500; }
          .categoria-amount { margin-left: auto; font-weight: bold; color: #667eea; }
          .deuda-item { background: #fff5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #fc8181; margin-bottom: 10px; }
          .balance-item { background: #f0fff4; padding: 15px; border-radius: 8px; border-left: 4px solid #68d391; margin-bottom: 10px; }
          .footer { margin-top: 40px; text-align: center; color: #a0aec0; font-size: 12px; }
        </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Reporte de Gastos Compartidos</h1>
        <div class="subtitle">Generado el ${fechaActual}</div>
        <div class="subtitle">Período: ${fechaInicio} - ${fechaFin}</div>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-label">Total de Gastos</div>
          <div class="stat-value">${totalGastos.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Promedio por Día</div>
          <div class="stat-value">${promedioPorDia.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Número de Gastos</div>
          <div class="stat-value">${gastos.length}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">💰 Gastos por Persona</div>
        ${participantes.map(p => `
          <div class="balance-item">
            <strong>${p}</strong> gastó: <strong>${gastosPorPersona[p]?.toFixed(2) || '0.00'}</strong>
          </div>
        `).join('')}
        <div style="margin-top: 15px; padding: 15px; background: #edf2f7; border-radius: 8px;">
          <strong>Promedio por persona:</strong> ${(totalGastos / participantes.length).toFixed(2)}
        </div>
      </div>

      <div class="section">
        <div class="section-title">📊 Balance de Deudas</div>
        ${deudas.length === 0
          ? '<p style="color: #68d391; font-weight: bold;">✅ ¡Todo está equilibrado! No hay deudas pendientes.</p>'
          : deudas.map(d => `
            <div class="deuda-item">
              <strong>${d.deudor}</strong> debe <strong style="color: #e53e3e;">${d.monto.toFixed(2)}</strong> a <strong>${d.acreedor}</strong>
            </div>
          `).join('')}
      </div>

      <div class="section">
        <div class="section-title">📁 Gastos por Categoría</div>
        ${categorias.map(cat => `
          <div class="categoria-bar">
            <span class="categoria-name">${cat.nombre}</span>
            <span class="categoria-amount">${cat.monto.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">📝 Detalle de Gastos</div>
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
                <td><strong>${g.monto.toFixed(2)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Gastos Compartidos - App de gestión de gastos entre amigos</p>
        <p>Generado automáticamente</p>
      </div>
    </body>
    </html>
  `;
}
