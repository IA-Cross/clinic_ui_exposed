// Convierte un título en un slug apto para URL:
// "Ortodoncia en Niños ¿Cuándo empezar?" → "ortodoncia-en-ninos-cuando-empezar"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita acentos (ñ → n incluida tras NFD)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
