'use client';

import { getAllTeamMembers } from '@/lib/scheduleGenerator';

export default function Legend() {
  const teamMembers = getAllTeamMembers();

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Leyenda</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Equipo</h4>
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                </div>
                <span className="text-gray-700">{member.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Estados de Guardia</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-guard-day1 rounded border border-gray-300"></div>
              <span className="text-gray-700">Día 1 de Guardia</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-guard-day2 rounded border border-gray-300"></div>
              <span className="text-gray-700">Día 2 de Guardia</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gray-100 rounded border border-gray-300"></div>
              <span className="text-gray-700">Fin de Semana</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-orange-600 font-bold">⚠️</span>
              <span className="text-gray-700">Reemplazo Activo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}