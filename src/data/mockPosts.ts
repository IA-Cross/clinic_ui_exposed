import type { BlogPost } from '../types';

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

// Artículos de ejemplo para el modo demostración local (sin Supabase).
// Espejo de supabase/seed.sql.
export const mockPosts: BlogPost[] = [
  {
    id: 'mock-1',
    slug: 'cuando-llevar-a-tu-hijo-al-ortodoncista',
    title: '¿Cuándo llevar a tu hijo al ortodoncista por primera vez?',
    excerpt:
      'La primera visita al ortodoncista debe ocurrir antes de lo que la mayoría de los papás imagina. Te explicamos por qué.',
    content:
      'La Asociación Americana de Ortodoncistas recomienda que la primera evaluación se realice **alrededor de los 7 años**. A esa edad ya erupcionaron los primeros molares permanentes y es posible detectar a tiempo problemas de mordida o de espacio.\n\n## ¿Qué evaluamos en esa primera visita?\n\n- El desarrollo de los maxilares\n- La erupción de los dientes permanentes\n- Hábitos como succión digital o respiración bucal\n\n## Detectar a tiempo hace la diferencia\n\nMuchos tratamientos de ortopedia maxilar aprovechan el crecimiento del niño: intervenir en el momento adecuado puede evitar tratamientos más largos y costosos en la adolescencia.',
    coverImage: '',
    coverImageAlt: '',
    category: 'ODONTOLOGÍA PEDIÁTRICA',
    tags: ['niños', 'ortodoncia', 'prevención'],
    keywords: ['ortodoncista para niños', 'primera visita ortodoncista'],
    metaDescription:
      'Descubre a qué edad llevar a tu hijo al ortodoncista por primera vez y por qué detectar problemas de mordida a tiempo evita tratamientos largos.',
    author: 'Dra. Verboonen',
    status: 'published',
    publishedAt: daysAgo(14),
    createdAt: daysAgo(14),
    updatedAt: daysAgo(14),
  },
  {
    id: 'mock-2',
    slug: 'brackets-o-alineadores-cual-elegir',
    title: 'Brackets o alineadores: ¿cuál es mejor para ti?',
    excerpt:
      'Ambos enderezan tu sonrisa, pero cada uno tiene ventajas distintas. Esta guía te ayuda a decidir junto con tu ortodoncista.',
    content:
      'Elegir entre brackets y alineadores transparentes depende de tu caso clínico, tu estilo de vida y tu presupuesto.\n\n## Brackets\n\n- Resuelven prácticamente cualquier maloclusión\n- No dependen de la disciplina del paciente\n\n## Alineadores transparentes\n\n- Casi invisibles\n- Removibles: comes y cepillas sin obstáculos\n- Requieren usarlos 22 horas al día',
    coverImage: '',
    coverImageAlt: '',
    category: 'ORTODONCIA',
    tags: ['brackets', 'alineadores'],
    keywords: ['brackets o alineadores', 'ortodoncia invisible'],
    metaDescription:
      'Brackets o alineadores transparentes: compara ventajas, tiempos y cuidados de cada tratamiento de ortodoncia.',
    author: 'Dra. Verboonen',
    status: 'published',
    publishedAt: daysAgo(7),
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    id: 'mock-3',
    slug: 'cinco-habitos-para-una-sonrisa-sana',
    title: '5 hábitos diarios para una sonrisa sana',
    excerpt:
      'Cuidar tus dientes no tiene que ser complicado. Estos cinco hábitos marcan la diferencia a largo plazo.',
    content:
      'La salud bucal se construye con pequeños hábitos diarios.\n\n## 1. Cepíllate dos veces al día\n\nUsa pasta con flúor y dedica al menos dos minutos a cada cepillado.\n\n## 2. No olvides el hilo dental\n\nEl cepillo no llega a las superficies entre los dientes.\n\n## 3. Modera el azúcar\n\n## 4. Hidrátate\n\n## 5. Visita a tu dentista cada 6 meses',
    coverImage: '',
    coverImageAlt: '',
    category: 'HIGIENE',
    tags: ['higiene', 'prevención'],
    keywords: ['hábitos salud dental', 'prevención de caries'],
    metaDescription:
      'Cinco hábitos sencillos que mantienen tu sonrisa sana toda la vida.',
    author: 'Dra. Verboonen',
    status: 'published',
    publishedAt: daysAgo(2),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'mock-4',
    slug: 'borrador-de-ejemplo',
    title: 'Borrador de ejemplo (solo visible en el panel)',
    excerpt: 'Un borrador para probar la pestaña de borradores del panel.',
    content: 'Contenido en progreso…',
    coverImage: '',
    coverImageAlt: '',
    category: 'NOTICIAS',
    tags: [],
    keywords: [],
    metaDescription: '',
    author: 'Dra. Verboonen',
    status: 'draft',
    publishedAt: null,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];
