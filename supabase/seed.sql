-- Artículos de ejemplo (opcional). Ejecutar después de schema.sql.
-- Puedes borrarlos desde el panel de administración cuando haya contenido real.

insert into posts (slug, title, excerpt, content, category, tags, keywords, meta_description, author, status, published_at)
values
(
  'cuando-llevar-a-tu-hijo-al-ortodoncista',
  '¿Cuándo llevar a tu hijo al ortodoncista por primera vez?',
  'La primera visita al ortodoncista debe ocurrir antes de lo que la mayoría de los papás imagina. Te explicamos por qué.',
  E'La Asociación Americana de Ortodoncistas recomienda que la primera evaluación se realice **alrededor de los 7 años**. A esa edad ya erupcionaron los primeros molares permanentes y es posible detectar a tiempo problemas de mordida o de espacio.\n\n## ¿Qué evaluamos en esa primera visita?\n\n- El desarrollo de los maxilares\n- La erupción de los dientes permanentes\n- Hábitos como succión digital o respiración bucal\n\n## Detectar a tiempo hace la diferencia\n\nMuchos tratamientos de ortopedia maxilar aprovechan el crecimiento del niño: intervenir en el momento adecuado puede evitar tratamientos más largos y costosos en la adolescencia.\n\n> En Clínica Verboonen acompañamos el crecimiento y desarrollo de tus hijos con revisiones periódicas y sin costo de valoración inicial.\n\nAgenda una cita por WhatsApp y resolvemos todas tus dudas.',
  'ODONTOLOGÍA PEDIÁTRICA',
  array['niños', 'ortodoncia', 'prevención'],
  array['ortodoncista para niños', 'primera visita ortodoncista', 'ortodoncia infantil'],
  'Descubre a qué edad llevar a tu hijo al ortodoncista por primera vez y por qué detectar problemas de mordida a tiempo evita tratamientos largos.',
  'Dra. Verboonen',
  'published',
  now() - interval '14 days'
),
(
  'brackets-o-alineadores-cual-elegir',
  'Brackets o alineadores: ¿cuál es mejor para ti?',
  'Ambos enderezan tu sonrisa, pero cada uno tiene ventajas distintas. Esta guía te ayuda a decidir junto con tu ortodoncista.',
  E'Elegir entre brackets y alineadores transparentes depende de tu caso clínico, tu estilo de vida y tu presupuesto.\n\n## Brackets\n\n- Resuelven prácticamente cualquier maloclusión\n- No dependen de la disciplina del paciente\n- Hoy existen opciones estéticas (cerámicos)\n\n## Alineadores transparentes\n\n- Casi invisibles\n- Removibles: comes y cepillas sin obstáculos\n- Requieren usarlos 22 horas al día\n\n## Nuestra recomendación\n\nNo hay una respuesta única: en una valoración con estudios completos te decimos con honestidad qué opción logra el mejor resultado para tu caso.',
  'ORTODONCIA',
  array['brackets', 'alineadores', 'estética'],
  array['brackets o alineadores', 'ortodoncia invisible', 'alineadores transparentes precio'],
  'Brackets o alineadores transparentes: compara ventajas, tiempos y cuidados de cada tratamiento de ortodoncia y elige el ideal para tu sonrisa.',
  'Dra. Verboonen',
  'published',
  now() - interval '7 days'
),
(
  'cinco-habitos-para-una-sonrisa-sana',
  '5 hábitos diarios para una sonrisa sana',
  'Cuidar tus dientes no tiene que ser complicado. Estos cinco hábitos marcan la diferencia a largo plazo.',
  E'La salud bucal se construye con pequeños hábitos diarios.\n\n## 1. Cepíllate dos veces al día\n\nUsa pasta con flúor y dedica al menos dos minutos a cada cepillado.\n\n## 2. No olvides el hilo dental\n\nEl cepillo no llega a las superficies entre los dientes, donde se forma la mayoría de las caries.\n\n## 3. Modera el azúcar\n\nLas bacterias que causan caries se alimentan de azúcares. Cuida especialmente las bebidas azucaradas.\n\n## 4. Hidrátate\n\nLa saliva es la defensa natural de tu boca; beber agua ayuda a mantenerla.\n\n## 5. Visita a tu dentista cada 6 meses\n\nUna limpieza y revisión semestral detecta problemas cuando aún son pequeños y fáciles de tratar.',
  'HIGIENE',
  array['higiene', 'prevención', 'consejos'],
  array['hábitos salud dental', 'cómo cuidar los dientes', 'prevención de caries'],
  'Cinco hábitos sencillos —cepillado, hilo dental, menos azúcar, hidratación y revisiones— que mantienen tu sonrisa sana toda la vida.',
  'Dra. Verboonen',
  'published',
  now() - interval '2 days'
);
