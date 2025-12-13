import teamData from '@/data/team.json';

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface TeamConfig {
  daysPerGuard: number;
  workDaysOnly: boolean;
  startDate: string;
}

export interface TeamData {
  team: TeamMember[];
  rotationOrder: string[];
  config: TeamConfig;
}

/**
 * Obtiene un miembro del equipo por su ID
 * @param personId - ID del miembro a buscar
 * @returns El miembro encontrado o undefined
 */
export function getTeamMember(personId?: string): TeamMember | undefined {
  if (!personId) return undefined;
  const { team } = teamData as TeamData;
  return team.find(member => member.id === personId);
}

/**
 * Obtiene todos los miembros del equipo
 * @returns Array con todos los miembros
 */
export function getAllTeamMembers(): TeamMember[] {
  const { team } = teamData as TeamData;
  return team;
}

/**
 * Obtiene el orden de rotación configurado
 * @returns Array con IDs en orden de rotación
 */
export function getRotationOrder(): string[] {
  const { rotationOrder } = teamData as TeamData;
  return rotationOrder;
}

/**
 * Obtiene la configuración del equipo
 * @returns Objeto con la configuración
 */
export function getTeamConfig(): TeamConfig {
  const { config } = teamData as TeamData;
  return config;
}

/**
 * Obtiene el siguiente miembro en la rotación
 * @param currentId - ID del miembro actual
 * @returns ID del siguiente miembro o undefined
 */
export function getNextTeamMember(currentId: string): string | undefined {
  const rotationOrder = getRotationOrder();
  const currentIndex = rotationOrder.indexOf(currentId);
  
  if (currentIndex === -1) return undefined;
  
  const nextIndex = (currentIndex + 1) % rotationOrder.length;
  return rotationOrder[nextIndex];
}

/**
 * Obtiene el miembro anterior en la rotación
 * @param currentId - ID del miembro actual
 * @returns ID del miembro anterior o undefined
 */
export function getPreviousTeamMember(currentId: string): string | undefined {
  const rotationOrder = getRotationOrder();
  const currentIndex = rotationOrder.indexOf(currentId);
  
  if (currentIndex === -1) return undefined;
  
  const previousIndex = (currentIndex - 1 + rotationOrder.length) % rotationOrder.length;
  return rotationOrder[previousIndex];
}

/**
 * Verifica si un ID de miembro es válido
 * @param personId - ID a verificar
 * @returns true si el miembro existe
 */
export function isValidTeamMember(personId: string): boolean {
  return getTeamMember(personId) !== undefined;
}
