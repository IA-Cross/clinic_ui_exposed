import type { SlideImage } from '../components/home/ImageSlideshow';

import crecimiento1 from '../assets/services/crecimiento-y-desarrollo-1.webp';
import crecimiento2 from '../assets/services/crecimiento-y-desarrollo-2.webp';
import general1 from '../assets/services/odontologia-general-1.webp';
import general2 from '../assets/services/odontologia-general-2.webp';
import pediatrica1 from '../assets/services/odontologia-pediatrica-1.webp';
import pediatrica2 from '../assets/services/odontologia-pediatrica-2.webp';
import orthokinetica1 from '../assets/services/orthokinetica-1.webp';
import orthokinetica2 from '../assets/services/orthokinetica-2.webp';
import ortodoncia1 from '../assets/services/ortodoncia-1.webp';
import ortodoncia2 from '../assets/services/ortodoncia-2.webp';
import ortopedia1 from '../assets/services/ortopedia-maxilar-1.webp';
import ortopedia2 from '../assets/services/ortopedia-maxilar-2.webp';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Material Symbols
  images: SlideImage[];
}

const img = (src: string, alt: string, width = 1080, height = 1080): SlideImage => ({
  src,
  alt,
  width,
  height,
});

// Las seis secciones de servicios: títulos tomados de las carpetas de
// material del cliente; cada una muestra sus dos imágenes en carrusel.
export const services: Service[] = [
  {
    id: 'ortodoncia',
    title: 'Ortodoncia',
    icon: 'sentiment_satisfied',
    description:
      'Alineamos tu sonrisa con brackets y alineadores de última generación. Tratamientos personalizados para niños, adolescentes y adultos que mejoran la función y la estética de tu sonrisa.',
    images: [
      img(ortodoncia1, 'Tratamiento de ortodoncia en Clínica Verboonen'),
      img(ortodoncia2, 'Paciente con brackets durante tratamiento de ortodoncia'),
    ],
  },
  {
    id: 'odontologia-general',
    title: 'Odontología General',
    icon: 'dentistry',
    description:
      'Cuidado integral para toda la familia: limpiezas, resinas, extracciones y revisiones preventivas. Diagnóstico preciso y atención profesional en cada visita.',
    images: [
      img(general1, 'Atención de odontología general en Clínica Verboonen'),
      img(general2, 'Consulta de odontología general'),
    ],
  },
  {
    id: 'odontologia-pediatrica',
    title: 'Odontología Pediátrica',
    icon: 'child_care',
    description:
      'Atención dental especializada para bebés, niños y adolescentes en un ambiente cálido y de confianza. Acompañamos la salud bucal de tus hijos desde los primeros meses de vida.',
    images: [
      img(pediatrica1, 'Odontología pediátrica: atención desde los primeros meses', 1200, 1200),
      img(pediatrica2, 'Consulta de odontología pediátrica en Clínica Verboonen'),
    ],
  },
  {
    id: 'ortopedia-maxilar',
    title: 'Ortopedia Maxilar',
    icon: 'medical_services',
    description:
      'Guiamos el crecimiento de los maxilares en niños y adolescentes para prevenir y corregir maloclusiones, favoreciendo un desarrollo facial armónico.',
    images: [
      img(ortopedia1, 'Tratamiento de ortopedia maxilar'),
      img(ortopedia2, 'Aparato de ortopedia maxilar en Clínica Verboonen', 1200, 1200),
    ],
  },
  {
    id: 'crecimiento-y-desarrollo',
    title: 'Crecimiento y Desarrollo',
    icon: 'monitoring',
    description:
      'Vigilamos y acompañamos el desarrollo craneofacial y dental de tus hijos, detectando a tiempo alteraciones para intervenir en el momento ideal.',
    images: [
      img(crecimiento1, 'Evaluación de crecimiento y desarrollo craneofacial'),
      img(crecimiento2, 'Seguimiento de crecimiento y desarrollo dental infantil'),
    ],
  },
  {
    id: 'orthokinetica',
    title: 'Orthokinética',
    icon: 'self_improvement',
    description:
      'Terapia funcional que integra la postura, la respiración y la función oral para resultados ortodóncicos estables y una mejor calidad de vida.',
    images: [
      img(orthokinetica1, 'Terapia orthokinética en Clínica Verboonen'),
      img(orthokinetica2, 'Sesión de tratamiento orthokinético'),
    ],
  },
];
