'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

type ExportFormat = 'JSON' | 'CSV' | 'PDF' | 'EXCEL';
type ExportType = 'PROJECT' | 'REPORTS' | 'EVALUATIONS' | 'DASHBOARD';

interface ExportOptions {
  format: ExportFormat;
  include: string[];
  type: ExportType;
}

export default function ExportPanel() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'JSON',
    include: ['all'],
    type: 'PROJECT',
  });

  const [exporting, setExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<any[]>([]);

  const handleExport = async () => {
    setExporting(true);
    try {
      let endpoint = '';
      let body = {};

      switch (exportOptions.type) {
        case 'PROJECT':
          endpoint = `/api/projects/${projectId}/export`;
          body = {
            format: exportOptions.format,
            include: exportOptions.include,
          };
          break;
        case 'EVALUATIONS':
          endpoint = `/api/projects/${projectId}/export/evaluations`;
          break;
        default:
          endpoint = `/api/projects/${projectId}/export`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        // Trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'export.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Refresh export history
        fetchExportHistory();
      } else {
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Error during export:', error);
    } finally {
      setExporting(false);
    }
  };

  const fetchExportHistory = async () => {
    try {
      const response = await fetch('/api/export/history');
      if (response.ok) {
        const data = await response.json();
        setExportHistory(data);
      }
    } catch (error) {
      console.error('Error fetching export history:', error);
    }
  };

  const handleIncludeChange = (item: string) => {
    if (item === 'all') {
      setExportOptions(prev => ({
        ...prev,
        include: prev.include.includes('all') ? [] : ['all'],
      }));
    } else {
      setExportOptions(prev => ({
        ...prev,
        include: prev.include.includes(item)
          ? prev.include.filter(i => i !== item)
          : [...prev.include.filter(i => i !== 'all'), item],
      }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📤</span>
        <h1 className="text-2xl font-bold">Exportar Datos</h1>
      </div>

      {/* Export Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Configuración de Exportación</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Exportación
            </label>
            <select
              value={exportOptions.type}
              onChange={(e) => setExportOptions(prev => ({
                ...prev,
                type: e.target.value as ExportType,
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PROJECT">Proyecto Completo</option>
              <option value="EVALUATIONS">Evaluaciones/Calificaciones</option>
              <option value="REPORTS">Reportes</option>
              <option value="DASHBOARD">Dashboard</option>
            </select>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato
            </label>
            <select
              value={exportOptions.format}
              onChange={(e) => setExportOptions(prev => ({
                ...prev,
                format: e.target.value as ExportFormat,
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="JSON">JSON</option>
              <option value="CSV">CSV</option>
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel</option>
            </select>
          </div>
        </div>

        {/* Include Options (for project export) */}
        {exportOptions.type === 'PROJECT' && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incluir Datos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { key: 'all', label: 'Todo' },
                { key: 'stories', label: 'Historias' },
                { key: 'tasks', label: 'Tareas' },
                { key: 'sprints', label: 'Sprints' },
                { key: 'evaluations', label: 'Evaluaciones' },
                { key: 'team', label: 'Equipo' },
              ].map((option) => (
                <label key={option.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.include.includes(option.key)}
                    onChange={() => handleIncludeChange(option.key)}
                    className="mr-2"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="mt-6">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
          >
            {exporting ? 'Exportando...' : 'Exportar Datos'}
          </button>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Historial de Exportaciones</h2>

        {exportHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay exportaciones recientes
          </p>
        ) : (
          <div className="space-y-3">
            {exportHistory.map((exportItem) => (
              <div key={exportItem.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{exportItem.fileName}</p>
                  <p className="text-sm text-gray-600">
                    {exportItem.type} • {exportItem.format} • {exportItem.fileSize} bytes
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(exportItem.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    exportItem.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : exportItem.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {exportItem.status}
                  </span>
                  {exportItem.status === 'completed' && exportItem.downloadUrl && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Descargar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setExportOptions(prev => ({ ...prev, type: 'EVALUATIONS', format: 'CSV' }));
              handleExport();
            }}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl mb-2 block">📊</span>
              <span className="text-sm font-medium">Exportar Calificaciones</span>
            </div>
          </button>

          <button
            onClick={() => {
              setExportOptions(prev => ({ ...prev, type: 'PROJECT', format: 'JSON' }));
              handleExport();
            }}
            className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl mb-2 block">📦</span>
              <span className="text-sm font-medium">Backup Completo</span>
            </div>
          </button>

          <button
            onClick={() => {
              setExportOptions(prev => ({ ...prev, type: 'REPORTS', format: 'PDF' }));
              handleExport();
            }}
            className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl mb-2 block">📄</span>
              <span className="text-sm font-medium">Reporte PDF</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}