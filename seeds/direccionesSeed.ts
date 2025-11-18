import { PrismaClient } from "@prisma/client";

export default async function seedDirecciones(prisma: PrismaClient) {
  // Verificar si ya existen direcciones
  const existingDirecciones = await prisma.direcciones.count();
  if (existingDirecciones > 0) {
    console.log("Las direcciones ya existen. Saltando creación.");
    return;
  }

  console.log("Creando direcciones...");

  // Crear los Pisos
  await prisma.piso.createMany({
    data: [
      { piso: "Piso 1" },
      { piso: "Piso 2" },
      { piso: "Piso 3" },
      { piso: "Planta baja" },
      { piso: "Sotano" },
      { piso: "Area externa" },
    ],
    skipDuplicates: true,
  });
    
    // Data de las Direcciones
    const direccionesData = [
          // Piso 1
          {
            direccion:
              "Dirección general de regulación sanitaria de productos de uso y consumo humano",
            pisoId: 1,
            areas: [
              "Dirección de laboratorio de control de productos alimentarios y bebidas",
              "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)",
              "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-análisis especiales)",
              "Dirección de laboratorio de control de productos alimentarios y licores (química de alimentos)",
              "Dirección de laboratorio de control de productos alimentarios y licores (química de alimentos - laboratorio de enriquecimiento)",
              "Dirección de laboratorio de control de productos alimentarios y licores (química de alimentos - área de detección)",
              "Dirección de laboratorio de control de productos alimentarios y licores (química de alimentos - laboratorio físico químico)",
              "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos - área de pcr)",
            ],
          },
          {
            direccion: "Dirección general de producción",
            pisoId: 1,
            areas: ["Dirección de cultivo celular", "Dirección de producción"],
          },
          {
            direccion: "Gerencia de regulación sanitaria",
            pisoId: 1,
            areas: ["Dirección de alimentos"],
          },
          {
            direccion: "Dirección general de regulación sanitaria",
            pisoId: 1,
            areas: ["Dirección general"],
          },
          {
            direccion: "Dirección de laboratorio de control de medicamentos",
            pisoId: 1,
            areas: ["Laboratorio de recombinantes"],
          },
          {
            direccion: "Regulación sanitaria",
            pisoId: 1,
            areas: ["Pruebas biológicas", "Departamento de gestión de sistema",],
          },
          {
            direccion: "Oficina de gestión de la calidad",
            pisoId: 1,
            areas: [
              "Oficina de gestión de la calidad",
              "Dirección",
              "Aseguramiento",
              "Documentación",
            ],
          },
          {
            direccion:
              "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías",
            pisoId: 1,
            areas: [
              "División de microbiología y parasitología",
              "División de microbiología y parasitología (Oficina de técnicos resguardo de muestra en tránsito y papelería)",
              "División de microbiología y parasitología (área de analista)",
              "División de físicoquímica de medicamentos (Oficina de cosméticos)",
              "División de microbiología y parasitología (Área técnica)",
            ],
          },
          {
            direccion: "Regulación",
            pisoId: 1,
            areas: [
              "Laboratorio nacional",
              "Cuarto de muestra en análisis II",
              "Laboratorio nacional cuarto 11",
              "Vigilancia sanitaria",
            ],
          },
    
          // Piso 2
          {
            direccion: "Presidencia",
            pisoId: 2,
            areas: ["Museo", "Seguridad Industrial", "Auditoría interna"],
          },
          {
            direccion: "Dirección de autorizaciones sanitarias de medicamentos",
            pisoId: 2,
            areas: [
              "División de evaluación farmacéutica",
              "División de evaluación clínica",
              "Departamento de manejo e integración de resultados",
              "Archivo y correspondencia",
            ],
          },
          {
            direccion: "Evaluación farmacéutica",
            pisoId: 2,
            areas: ["Autorizaciones sanitarias"],
          },
          {
            direccion:
              "Oficina de relaciones interinstitucionales y comunicaciones",
            pisoId: 2,
            areas: ["Dirección", "Cooperación técnica", "Comunicaciones"],
          },
          {
            direccion: "Consultoría jurídica",
            pisoId: 2,
            areas: ["Despacho", "Consultor jurídico"],
          },
          {
            direccion: "Dirección de centro nacional de vigilancia farmacológica",
            pisoId: 2,
            areas: [
              "Dirección",
              "División de seguridad de medicamentos",
              "División de reacciones adversas de medicamentos",
            ],
          },
          {
            direccion: "Producción",
            pisoId: 2,
            areas: [
              "Biotecnología y desarrollo",
              "Dirección de biotecnología y desarrollo",
            ],
          },
          {
            direccion:
              "Dirección general de diagnóstico y vigilancia epidemiológica",
            pisoId: 2,
            areas: [
              "División de bacteriología",
              "División de bacteriología (laboratorio de aislamiento e identificación bacteriana aeib)",
              "División de bacteriología (Laboratorio de enfermedades zoonóticas y metaxénicas bacterianas LEZMB)",
              "División de bacteriología (laboratorio de diagnósticos especiales)",
            ],
          },
          {
            direccion: "Desarrollo",
            pisoId: 2,
            areas: ["Patología"],
          },
          {
            direccion: "Regulación sanitaria",
            pisoId: 2,
            areas: ["Pruebas biológicas", "Departamento de gestión de sistema"],
          },
    
          // Piso 3
          {
            direccion: "Presidencia piso 3",
            pisoId: 3,
            areas: ["Despacho", "Seguridad industrial", "Auditoría interna"],
          },
          {
            direccion: "Dirección de tecnología e informatica",
            pisoId: 3,
            areas: [
              "Dirección de informatica",
              "Área de soporte",
              "Área de infraestructura",
              "Área de programación y base de datos",
            ],
          },
          {
            direccion: "Dirección de talento humano",
            pisoId: 3,
            areas: [
              "Dirección",
              "Secretaría de despacho",
              "Registro y control",
              "Reclutamiento y selección",
              "Coordinación de nómina",
              "Clasificación y remuneración",
              "Bienestar social",
            ],
          },
          {
            direccion: "Dirección de administración",
            pisoId: 3,
            areas: [
              "Dirección",
              "Coordinación de compras",
              "Tesorería",
              "Contabilidad",
            ],
          },
          {
            direccion: "Dirección planificación y presupuesto",
            pisoId: 3,
            areas: [
              "Dirección planificación y presupuesto",
              "Coordinación de presupuesto",
              "Coordinación de planificación",
              "Coordinación de organización",
            ],
          },
          {
            direccion: "Dirección general de investigación y docencia",
            pisoId: 3,
            areas: [
              "Biblioteca",
              "Unidad imprenta y reproducción",
              "Aula C",
              "Aula D",
              "Aula E",
              "Aula B",
              "Campus virtual",
              "Dirección de docencia",
              "Desarrollo e innovación",
              "Dirección de investigación desarrollo e innovación",
            ],
          },
          {
            direccion: "Junta revisora",
            pisoId: 3,
            areas: ["No posee"],
          },
    
          // Planta Baja
          {
            direccion: "Dirección de diagnóstico y vigilancia epidemiológica",
            pisoId: 4,
            areas: ["Red de laboratorio de salud pública", "Inmunocerología viral"],
          },
          {
            direccion:
              "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)",
            pisoId: 4,
            areas: [
              "Dirección de estadística y análisis estratégico",
              "Laboratorio de programas especiales hepatitis y sida",
            ],
          },
          {
            direccion: "Dirección medios de cultivo y reactivos",
            pisoId: 4,
            areas: [
              "División de medios de cultivos",
              "Unidad de control de calidad de medios y reactivos",
            ],
          },
          {
            direccion: "Coordinación de atención al ciudadano",
            pisoId: 4,
            areas: ["Oficina de atención al ciudadano"],
          },
          {
            direccion: "Dirección general de produccion",
            pisoId: 4,
            areas: [
              "Departamento de medios decultivos y rediactivos",
              "Seccion de ractivos y colorantes",
            ],
          },
          {
            direccion:
              "Dirección de regulación de productos de uso y consumo humano",
            pisoId: 4,
            areas: ["Unidad de manejo de muestras e integración de resultados"],
          },
          {
            direccion:
              "Dirección de laboratorio nacional de control de medicamentos,cosméticos, productos médicos y otras tecnologías (planta baja)",
            pisoId: 4,
            areas: [
              "División de fisicoquímica de medicamentos (Cuarto de patrones)",
              "División de fisicoquímica de medicamentos (Oficina de la jefatura de división)",
              "División de fisicoquímica de medicamentos (Área de transcripción)",
              "División de fisicoquímica de medicamentos (Área instrumental I)",
              "División de fisicoquímica de medicamentos (Área instrumental II)",
            ],
          },
          {
            direccion:
              "Dirección general de regulación sanitaria de productos de uso y consumo humano (planta baja)",
            pisoId: 4,
            areas: ["Dirección de vigilancia sanitaria"],
          },
          {
            direccion: "Dirección de seguridad y transporte",
            pisoId: 4,
            areas: ["Centro comunicación y monitoreo (CECOM)"],
          },
          {
            direccion: "Dirección general de diagnóstico",
            pisoId: 4,
            areas: [
              "Dirección general de diagnóstico",
              "Departamento de virología",
              "Ateccion al paciente",
            ],
          },
           {
            direccion: "Dirección general de producción (planta baja)",
            pisoId: 4,
            areas: [
              "Departamento de medios de cultivos y reactivos", "Sección de reactivos y colorantes",
            ],
          },
    
          // Sotano
          {
            direccion: "Dirección administración (sotano)",
            pisoId: 5,
            areas: ["Coordinación de cocina"],
          },
          {
            direccion: "Dirección general de seguridad y transporte",
            pisoId: 5,
            areas: ["Coordinación de seguridad"],
          },
          {
            direccion: "Servicio médico",
            pisoId: 5,
            areas: ["Servicio médico"],
          },
          {
            direccion: "SUNEP",
            pisoId: 5,
            areas: ["Secretaría general"],
          },
          {
            direccion: "Dirección de talento humano (sotano)",
            pisoId: 5,
            areas: ["Coordinación de cultura"],
          },
          {
            direccion: "Dirección de producción",
            pisoId: 5,
            areas: ["Dirección procesamiento de agua y material de laboratorio"],
          },
          {
            direccion: "CENAVIF",
            pisoId: 5,
            areas: ["Caja de ahorro"],
          },
    
          // Area Externa
          {
            direccion: "Oficina de infraestructura y proyecto",
            pisoId: 6,
            areas: [
              "Dirección",
              "Asistente de dirección",
              "Electricidad",
              "Electrónica",
              "Infraestructura",
            ],
          },
          {
            direccion: "Administracion",
            pisoId: 6,
            areas: [
              "Caja",
              "Coordinación de almacén",
            ],
          },
          {
            direccion: "Regulación sanitaria (area externa)",
            pisoId: 6,
            areas: ["Dirección de regulación y consumo humano"],
          },
          {
            direccion: "Departamento de micología",
            pisoId: 6,
            areas: [
              "Secretaría",
              "Dirección",
              "Área de diagnóstico",
              "Atención al paciente",
            ],
          },
          {
            direccion: "Bioterio",
            pisoId: 6,
            areas: ["Secretaría", "Mecánica", "Dirección"],
          },
    ]; 
    
  // Crear cada dirección y sus áreas
  for (const dir of direccionesData) {
    await prisma.direcciones.create({
      data: {
        direccion: dir.direccion,
        pisoId: dir.pisoId,
        areas: {
          create: dir.areas.map((nombre) => ({ nombre })),
        },
      },
    });
  }

  console.log("Direcciones creadas.");
}