"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedDirecciones;
function seedDirecciones(prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var direccionesData, _i, direccionesData_1, dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Crear los Pisos
                return [4 /*yield*/, prisma.piso.createMany({
                        data: [
                            { piso: "Piso 1" },
                            { piso: "Piso 2" },
                            { piso: "Piso 3" },
                            { piso: "Planta baja" },
                            { piso: "Sotano" },
                            { piso: "Area externa" },
                        ], skipDuplicates: true,
                    })];
                case 1:
                    // Crear los Pisos
                    _a.sent();
                    direccionesData = [
                        // Piso 1
                        {
                            direccion: "Dirección general de regulación sanitaria de productos de uso y consumo humano",
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
                            direccion: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías",
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
                            areas: ["Museo"],
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
                            direccion: "Oficina de relaciones interinstitucionales y comunicaciones",
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
                            direccion: "Dirección general de diagnóstico y vigilancia epidemiológica",
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
                            areas: ["Despacho", "Seguridad industrial", "Auditoria interna"],
                        },
                        {
                            direccion: "Dirección de tecnologia e informatica",
                            pisoId: 3,
                            areas: [
                                "Dirección de informatica",
                                "Area de soporte",
                                "Area de infraestructura",
                                "Area de programacion y base de datos",
                            ],
                        },
                        {
                            direccion: "Dirección de talento humano",
                            pisoId: 3,
                            areas: [
                                "Direccion",
                                "Secretaria de despacho",
                                "Registro y control",
                                "Reclutamiento y seleccion",
                                "Coordinacion de nomina",
                                "Clasificacion y remuneracion",
                                "Bienestar social",
                            ],
                        },
                        {
                            direccion: "Dirección de administración",
                            pisoId: 3,
                            areas: [
                                "Direccion",
                                "Coordinacion de compras",
                                "Tesoreria",
                                "Contabilidad",
                            ],
                        },
                        {
                            direccion: "Direccion planificación y presupuesto",
                            pisoId: 3,
                            areas: [
                                "Direccion planificación y presupuesto",
                                "Coordinacion de presupuesto",
                                "Coordinacion de planificación",
                                "Coordinacion de organización",
                            ],
                        },
                        {
                            direccion: "Direccion general de investigacion y docencia",
                            pisoId: 3,
                            areas: [
                                "Biblioteca",
                                "Unidad imprenta y reproduccion",
                                "Aula c",
                                "Aula d",
                                "Aula e",
                                "Aula b",
                                "Campus virtual",
                                "Direccion de docencia",
                                "Desarrollo e innovacion",
                                "Direccion de investigacion desarrollo e innovacion",
                            ],
                        },
                        {
                            direccion: "Junta revisora",
                            pisoId: 3,
                            areas: ["No posee"],
                        },
                        // Planta Baja
                        {
                            direccion: "Direccion de diagnostigo y vigilancia epidemiologica",
                            pisoId: 4,
                            areas: ["Red de laboratorio de salid publica", "Inmunocerologia viral"],
                        },
                        {
                            direccion: "Direccion general de diagnostico y vigilancia epidemiologica",
                            pisoId: 4,
                            areas: [
                                "Direccion de estadistica y analisis estrategico",
                                "Labotario de programas especiales hepatitis y sida",
                            ],
                        },
                        {
                            direccion: "Direccion medios de cultivo y reactivos",
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
                            direccion: "Direccion general de produccion",
                            pisoId: 4,
                            areas: [
                                "Departamento de medios decultivos y rediactivos",
                                "Seccion de ractivos y colorantes",
                            ],
                        },
                        {
                            direccion: "Direccion de regulacion de productos de uso y consumo humano",
                            pisoId: 4,
                            areas: ["Unidad de manejo de muestras e integracion de resultados"],
                        },
                        {
                            direccion: "Direccion de laboratorio nacional de control de medicamentos,cosmeticos, productos medicos y otras tecnologias",
                            pisoId: 4,
                            areas: [
                                "Division de fisicoquimica de medicamentos (cuarto de patrones)",
                                "Division de fisicoquimica de medicamentos (oficina de la jefatura de division)",
                            ],
                        },
                        {
                            direccion: "Direccion general de regulcion sanitaria de productos de uso y consumo humno",
                            pisoId: 4,
                            areas: ["Direccion de vigilancia sanitaria"],
                        },
                        {
                            direccion: "Direccion de seguridad y transporte",
                            pisoId: 4,
                            areas: ["Centro comuniccion y Monitoreo (cecom)"],
                        },
                        {
                            direccion: "Direccion general de diagnostico",
                            pisoId: 4,
                            areas: [
                                "Direccion general de diagnostico",
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
                            direccion: "Direccion general de seguridad y transporte",
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
                            direccion: "Direccion de produccion",
                            pisoId: 5,
                            areas: ["Direccion procesamiento de agua y material de laboratorio"],
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
                            areas: ["Direccion de regulacion y consumo humano"],
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
                    _i = 0, direccionesData_1 = direccionesData;
                    _a.label = 2;
                case 2:
                    if (!(_i < direccionesData_1.length)) return [3 /*break*/, 5];
                    dir = direccionesData_1[_i];
                    return [4 /*yield*/, prisma.direcciones.create({
                            data: {
                                direccion: dir.direccion,
                                pisoId: dir.pisoId,
                                areas: {
                                    create: dir.areas.map(function (nombre) { return ({ nombre: nombre }); }),
                                },
                            },
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("Direcciones creadas.");
                    return [2 /*return*/];
            }
        });
    });
}
