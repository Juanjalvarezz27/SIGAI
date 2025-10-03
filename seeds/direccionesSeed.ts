import { PrismaClient } from "@prisma/client";

export default async function seedDirecciones(prisma: PrismaClient) {

    
    // Crear los Pisos
    await prisma.piso.createMany({
          data: [
            { piso: "Piso 1" },
            { piso: "Piso 2" },
            { piso: "Piso 3" },
            { piso: "Planta baja" },
            { piso: "Sotano" },
            { piso: "Area externa" },
          ],  skipDuplicates: true,
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
            direccion: "Presidencia",
            pisoId: 3,
            areas: ["Despacho", "Seguridad industrial", "Auditoría interna"],
          },
          {
            direccion: "Dirección de tecnología e informatica",
            pisoId: 3,
            areas: [
              "Dirección de informatica",
              "Area de soporte",
              "Área de infraestructura",
              "Área de programación y base de datos",
            ],
          },
          {
            direccion: "Dirección de talento humano",
            pisoId: 3,
            areas: [
              "Dirección",
              "Secretaria de despacho",
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
            direccion: "Dirección de diagnostigo y vigilancia epidemiologica",
            pisoId: 4,
            areas: ["Red de laboratorio de salid publica", "Inmunocerologia viral"],
          },
          {
            direccion:
              "Dirección general de diagnostico y vigilancia epidemiologica",
            pisoId: 4,
            areas: [
              "Dirección de estadistica y analisis estrategico",
              "Labotario de programas especiales hepatitis y sida",
            ],
          },
          {
            direccion: "Dirección medios de cultivo y reactivos",
            pisoId: 4,
            areas: [
              "Division de medios de cultivos",
              "Unidad de control de calidad de medios y reactivos",
            ],
          },
          {
            direccion: "Cordinaccion de atencion al ciudadano",
            pisoId: 4,
            areas: ["Oficina de atencion al ciudadano"],
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
              "Dirección de regulacion de productos de uso y consumo humano",
            pisoId: 4,
            areas: ["Unidad de manejo de muestras e integracion de resultados"],
          },
          {
            direccion:
              "Dirección de laboratorio nacional de control de medicamentos,cosmeticos, productos medicos y otras tecnologias",
            pisoId: 4,
            areas: [
              "Division de fisicoquimica de medicamentos (cuarto de patrones)",
              "Division de fisicoquimica de medicamentos (oficina de la jefatura de division)",
            ],
          },
          {
            direccion:
              "Dirección general de regulcion sanitaria de productos de uso y consumo humno",
            pisoId: 4,
            areas: ["Dirección de vigilancia sanitaria"],
          },
          {
            direccion: "Dirección de seguridad y transporte",
            pisoId: 4,
            areas: ["Centro comuniccion y Monitoreo (cecom)"],
          },
          {
            direccion: "Dirección general de diagnostico",
            pisoId: 4,
            areas: [
              "Dirección general de diagnostico",
              "Departamento de virologia",
              "Ateccion al paciente",
            ],
          },
    
          // Sotano
          {
            direccion: "Dirección administracion",
            pisoId: 5,
            areas: ["Coordinacion de cocina"],
          },
          {
            direccion: "Dirección general de seguridad y transporte",
            pisoId: 5,
            areas: ["Coordinacion de seguridad"],
          },
          {
            direccion: "Servicio medico",
            pisoId: 5,
            areas: ["Servicio medico"],
          },
          {
            direccion: "Sunep",
            pisoId: 5,
            areas: ["Secretaria general"],
          },
          {
            direccion: "Dirección de talento humano",
            pisoId: 5,
            areas: ["Coordinacion de cultura"],
          },
          {
            direccion: "Dirección de produccion",
            pisoId: 5,
            areas: ["Dirección procesamiento de agua y material de laboratorio"],
          },
          {
            direccion: "Cenavif",
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
            areas: ["Caja"],
          },
          {
            direccion: "Regulacion sanitaria",
            pisoId: 6,
            areas: ["Dirección de regulacion y consumo humano"],
          },
          {
            direccion: "Dirección de administracion",
            pisoId: 6,
            areas: ["Coordinacion de almacen"],
          },
          {
            direccion: "Departamento de micologia",
            pisoId: 6,
            areas: [
              "Secretaría",
              "Dirección",
              "Área de diagnostico",
              "Atención al paciente",
            ],
          },
          {
            direccion: "Bioterio",
            pisoId: 6,
            areas: ["Secretaría", "Mecánica", "Dirección"],
          },
    ]; 
    
    // Crear cada dirección y sus áreas asociadas en la base de datos
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

    console.log("Direcciónes creadas.");
}