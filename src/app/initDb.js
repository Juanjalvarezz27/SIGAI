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
exports.def = def;
var prismadb_1 = require("@/lib/prismadb");
var equiposSeed_1 = require("../../seeds/equiposSeed");
var direccionesSeed_1 = require("../../seeds/direccionesSeed");
var marcasModelosSeed_1 = require("../../seeds/marcasModelosSeed");
var especificacionesAdicionalesSeed_1 = require("../../seeds/especificacionesAdicionalesSeed");
function def() {
    return __awaiter(this, void 0, void 0, function () {
        var dataUsuarios_1, createUsuarios, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, (0, equiposSeed_1.default)(prismadb_1.default)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, direccionesSeed_1.default)(prismadb_1.default)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, marcasModelosSeed_1.default)(prismadb_1.default)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, especificacionesAdicionalesSeed_1.default)(prismadb_1.default)];
                case 4:
                    _a.sent();
                    // Crear roles
                    return [4 /*yield*/, prismadb_1.default.rol.createMany({
                            data: [
                                { rol: "admin" },
                                { rol: "supervisor" },
                                { rol: "solicitante" },
                                { rol: "analista" },
                                { rol: "personal" },
                            ],
                        })];
                case 5:
                    // Crear roles
                    _a.sent();
                    dataUsuarios_1 = [
                        //Piso 1
                        {
                            usuario: { nombre: "Zenia", apellido: "Monsalve", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas" },
                            equipos: [{ bienNacional: "29640", serial: "CNG1476PRG" }, { id: 2460 }, { id: 2461 }]
                        },
                        {
                            usuario: { nombre: "Aile", apellido: "Hernandez", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
                            equipos: [{ id: 1892 }, { id: 935 }, { id: 1 }, { id: 1728 }]
                        },
                        {
                            usuario: { nombre: "Wilmer", apellido: "Monsalve", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
                            equipos: [{ id: 1928 }, { id: 936 }, { id: 2 }, { id: 1729 }, { id: 1465 }]
                        },
                        {
                            usuario: { nombre: "Genesis", apellido: "Castillo", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
                            equipos: [{ id: 1930 }, { id: 937 }, { id: 3 }, { id: 1730 }]
                        },
                        {
                            usuario: { nombre: "Javier", apellido: "Torres", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
                            equipos: [{ id: 1932 }, { id: 938 }, { id: 4 }, { id: 1731 }, { id: 1852 },]
                        },
                        {
                            usuario: { nombre: "Vicenza", apellido: "Trombino", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
                            equipos: [{ id: 939 }, { id: 940 }, { id: 941 }, { id: 1948 }, { id: 1949 }, { id: 1950 }, { id: 1763 }, { id: 1764 }, { id: 65 }, { id: 1766 }]
                        },
                        {
                            usuario: { nombre: "Yurani", apellido: "Yepez", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-análisis especiales)" },
                            equipos: [{ id: 1940 }, { id: 942 }, { id: 5 }, { id: 1466 }]
                        },
                        {
                            usuario: { nombre: "Vincenza", apellido: "Trombino", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-análisis especiales)" },
                            equipos: [{ id: 1868 }, { id: 1734 }, { id: 1736 }, { id: 1737 }, { id: 1738 }, { id: 1740 }, { id: 1740 }, { id: 1742 }, { id: 1743 }, { id: 1744 }, { id: 943 }, { id: 944 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 1952 }, { id: 1953 }, { id: 1767 }]
                        },
                        {
                            usuario: { nombre: "Patricia", apellido: "Oropeza", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y licores (química de alimentos)" },
                            equipos: [{ id: 1954 }, { id: 945 }, { id: 11 }, { id: 1745 }, { id: 1956 }, { id: 946 }, { id: 12 }, { id: 2511 }, { id: 1957 }, { id: 947 }, { id: 13 }, { id: 948 }, { id: 949 }, { id: 1958 }, { id: 14 }, { id: 1959 }, { id: 1960 }, { id: 15 }, { id: 2511 }, { id: 1467 }, { id: 1768 }, { id: 1769 }, { id: 1961 }, { id: 950 }, { id: 16 }, { id: 2512 }, { id: 2455 }, { id: 1468 }, { id: 2456 }, { id: 1770 }, { id: 1737 }, { id: 1952 }]
                        },
                        {
                            usuario: { nombre: "Rita", apellido: "Loreto", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
                            equipos: [{ id: 1962 }, { id: 951 }, { id: 17 }, { id: 534 }, { id: 2514 }]
                        },
                        {
                            usuario: { nombre: "Fernando", apellido: "Figueroa", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
                            equipos: [{ id: 1963 }, { id: 952 }, { id: 18 }]
                        },
                        {
                            usuario: { nombre: "Migdelis", apellido: "Alejos", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
                            equipos: [{ id: 1964 }, { id: 953 }, { id: 19 }, { id: 535 }, { id: 2515 }]
                        },
                        {
                            usuario: { nombre: "Addias", apellido: "Rivas", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
                            equipos: [{ id: 1965 }, { id: 954 }, { id: 20 }, { id: 536 }, { id: 2516 }]
                        },
                        {
                            usuario: { nombre: "Lysbeth", apellido: "Brito", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
                            equipos: [{ id: 1965 }, { id: 954 }, { id: 21 }, { id: 1966 }, { id: 1967 }, { id: 955 }, { id: 22 }, { id: 23 }, { id: 1968 }, { id: 956 }, { id: 24 }, { id: 2515 }, { id: 1468 }]
                        },
                        {
                            usuario: { nombre: "Elsa", apellido: "De La Rosa", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de producción" },
                            equipos: [{ bienNacional: "31837", serial: "A001333847" }, { id: 957 }, { bienNacional: "31838", serial: "KBHC18K12004A" }, { bienNacional: "19269", serial: "ACD020398JP" }]
                        },
                        {
                            usuario: { nombre: "Karelys", apellido: "Diaz", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de producción" },
                            equipos: [{ bienNacional: "27896", serial: "A000679610" }, { bienNacional: "27811", serial: "16DD8BA333581" }, { bienNacional: "26274", serial: "KBC521K11586A" }, { id: 2514 }, { id: 539 }]
                        },
                        {
                            usuario: { nombre: "Yasmira", apellido: "Ramirez", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de producción" },
                            equipos: [{ bienNacional: "024685", serial: "A000091966" }, { bienNacional: "024690", serial: "778ACBA015007" }, { bienNacional: "024684", serial: "KBAB26Q41572A" }, { bienNacional: "30083", serial: "212079001005348" }, { id: 1870 }]
                        },
                        {
                            usuario: { nombre: "Manuel", apellido: "Moya", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de producción" },
                            equipos: [{ bienNacional: "31702", serial: "A001332791" }, { id: 960 }, { bienNacional: "31703", serial: "KBHC12K16671A" }, { id: 2516 }, { id: 1470 }, { id: 1871 }, { id: 1852 }, { bienNacional: "11320", serial: "AR247799" }, { id: 1919 }, { id: 1541 }, { bienNacional: "022422", serial: "21THR18970" }, { bienNacional: "023962", serial: "6110513413" }, { id: 1772 }, { bienNacional: "32046", serial: "22322Y3333761" }]
                        },
                        {
                            usuario: { nombre: "Celly", apellido: "Monzales", rolId: 5, direccionNombre: "Gerencia de regulación sanitaria", areaNombre: "Dirección de alimentos" },
                            equipos: [{ bienNacional: "16151", serial: "MXD41808ZF" }, { bienNacional: "20173", serial: "CNN64622S5" }, { bienNacional: "16100", serial: "C0403121802" }, { bienNacional: "27584", serial: "13355496078" }, { bienNacional: "29596", serial: "CNG14669CQ" }, { bienNacional: "29612", serial: "3CQ144DBZC" }, { bienNacional: "20186", serial: "B94540KGASX393" }, { id: 1571 }, { id: 1472 }, { bienNacional: "21237", serial: "21THR09988" }]
                        },
                        {
                            usuario: { nombre: "Maria", apellido: "Urbina", rolId: 5, direccionNombre: "Gerencia de regulación sanitaria", areaNombre: "Dirección de alimentos" },
                            equipos: [{ bienNacional: "25983", serial: "A000403818" }, { bienNacional: "26107", serial: "T9CSSYNYYLLUNNJ" }, { bienNacional: "25982", serial: "KBC518K11708A" }, { bienNacional: "31604", serial: "221716347220" }, { id: 1471 }, { id: 1773 }]
                        },
                        {
                            usuario: { nombre: "Maria", apellido: "Diaz", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria", areaNombre: "Dirección general" },
                            equipos: [{ bienNacional: "31825", serial: "A001332493" }, { id: 964 }, { bienNacional: "31826", serial: "KBHC12K16843A" }, { bienNacional: "20123", serial: "3L0651X26607" }, { id: 1573 }, { bienNacional: "18925", serial: "61635010020" }, { bienNacional: "11750", serial: "S30355-S5083-A803-3" }, { bienNacional: "023713", serial: "CNGSC05204" }, { bienNacional: "31953", serial: "42590318654" }, { bienNacional: "31951", serial: "CN-0CW6Y7" }, { id: 35 }, { bienNacional: "30355", serial: "1432000500713" }, { bienNacional: "30274", serial: "1434200506469" }, { bienNacional: "30275", serial: "1432000500733" }]
                        },
                        {
                            usuario: { nombre: "Joanna", apellido: "Huerfana", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria", areaNombre: "Dirección general" },
                            equipos: [{ bienNacional: "29923", serial: "CNG1476TZK" }, { bienNacional: "29909", serial: "3CQ144CJ7" }, { bienNacional: "020081", serial: "B9454OKGASX0VT" }, { bienNacional: "27440", serial: "13355498903" }, { bienNacional: "18928", serial: "061635013793" }, { id: 1776 }]
                        },
                        {
                            usuario: { nombre: "Yirlini", apellido: "Pineda", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria", areaNombre: "Dirección general" },
                            equipos: [{ bienNacional: "25993", serial: "A000403882" }, { bienNacional: "26185", serial: "A59CBA005305" }, { bienNacional: "26220", serial: "KBC220K12531A" }, { bienNacional: "19929", serial: "3L0651X26285" }]
                        },
                        {
                            usuario: { nombre: "Ana", apellido: "Agaton", rolId: 5, direccionNombre: "Dirección de laboratorio de control de medicamentos", areaNombre: "Laboratorio de recombinantes" },
                            equipos: [{ bienNacional: "16371", serial: "MXD4180963" }, { bienNacional: "15331", serial: "BR14330101" }, { bienNacional: "16159", serial: "MXD418091B" }, { bienNacional: "15349", serial: "CN13634341" }, { bienNacional: "17840", serial: "DS15HMEY608597N" }, { id: 36 }, { bienNacional: "17891", serial: "KL0441122282" }, { id: 1577 }, { bienNacional: "021718", serial: "080331-1304873" }, { bienNacional: "18519", serial: "06033701006051DNN" }, { bienNacional: "12264", serial: "100200296" }, { bienNacional: "024024", serial: "080819-12909729" }, { id: 1582 }, { id: 1583 }, { bienNacional: "020078", serial: "3L651X26623" }, { bienNacional: "14894", serial: "280602 319" }, { id: 1586 }, { id: 1476 }, { bienNacional: "020430", serial: "CNB1F02454" }, { bienNacional: "024551", serial: "3B1047X37129" }]
                        },
                        {
                            usuario: { nombre: "Maritza", apellido: "Burgos", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ bienNacional: "31815", serial: "A001332794" }, { id: 970 }, { bienNacional: "31816", serial: "KBHC12K16784A" }, { bienNacional: "24091", serial: "090219-1311663" }, { id: 1778 }, { bienNacional: "26122", serial: "C0BB5090T080E011" }, { id: 38 }, { bienNacional: "23793", serial: "MXL9410S4N" }, { bienNacional: "24728", serial: "778ACBA015033" }, { bienNacional: "19954", serial: "B94540KGASX34P" }, { bienNacional: "19955", serial: "3L0650X31191" }, { bienNacional: "26869", serial: "A000403732" }, { bienNacional: "26139", serial: "A59CB6BA004268" }, { bienNacional: "31824", serial: "KBHC12K16906A" }, { bienNacional: "19945", serial: "3L0650X31200" }, { bienNacional: "29592", serial: "CNG1476PGB" }, { bienNacional: "29608", serial: "3CQ144C482" }, { id: 41 }, { bienNacional: "25661", serial: "13355496035" }, { id: 975 }, { id: 42 }]
                        },
                        {
                            usuario: { nombre: "Francis", apellido: "Bolivar", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ bienNacional: "31813", serial: "A001332803" }, { id: 1320 }, { bienNacional: "31814", serial: "KBHC12K16939A" }, { bienNacional: "27565", serial: "13355496171" }]
                        },
                        {
                            usuario: { nombre: "Alexander", apellido: "Marcano", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ bienNacional: "26271", serial: "A000403733" }, { bienNacional: "24725", serial: "778ACBA015030" }, { bienNacional: "24732", serial: "KBAB23Q47000A" }, { bienNacional: "12432", serial: "2007534" }]
                        },
                        {
                            usuario: { nombre: "Cristina", apellido: "Lugo", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ bienNacional: "31811", serial: "A001332531" }, { id: 123 }, { bienNacional: "31812", serial: "KBHC12K16561A" }, { bienNacional: "27384", serial: "13355496164" }]
                        },
                        {
                            usuario: { nombre: "Eduardo", apellido: "Rodriguez", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ bienNacional: "31823", serial: "A001332518" }, { id: 1307 }, { id: 46 }, { bienNacional: "27385", serial: "13355496162" }]
                        },
                        {
                            usuario: { nombre: "Maritza", apellido: "Burgos", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ bienNacional: "26263", serial: "A000403945" }, { id: 1778 }, { id: 1477 }]
                        },
                        {
                            usuario: { nombre: "Alicia", apellido: "Zambrano", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Oficina de gestión de la calidad" },
                            equipos: [{ bienNacional: "28830", serial: "CNG1476PHG" }, { bienNacional: "28762", serial: "3CQ144C4GR" }, { bienNacional: "31377", serial: "65818882408" }, { id: 2537 }]
                        },
                        {
                            usuario: { nombre: "Ana", apellido: "Agaton", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
                            equipos: [{ bienNacional: "26275", serial: "A000403896" }, { bienNacional: "27640", serial: "A000679760" }, { bienNacional: "27841", serial: "C16D8BA000490" }, { bienNacional: "26268", serial: "KBC518K11061A" }, { id: 2560 }, { bienNacional: "26215", serial: "A000403918" }, { bienNacional: "26164", serial: "A59C6B005206" }, { bienNacional: "26214", serial: "KBC521K11761A" }, { bienNacional: "024090", serial: "090219-1311664" }, { bienNacional: "11953", serial: "090200" }, { bienNacional: "29860", serial: "CNG1476PJZ" }, { bienNacional: "29842", serial: "3CQ144C488" }, { id: 85 }, { bienNacional: "20756", serial: "MXL7270DBK" }, { bienNacional: "20703", serial: "CNN72419G4" }, { bienNacional: "27859", serial: "A000679592" }, { bienNacional: "26200", serial: "A59C6BA005267" }, { bienNacional: "26124", serial: "A59C6BA005864" }, { bienNacional: "26131", serial: "A59C6BA007368" }, { bienNacional: "27881", serial: "C16D8BA000515" }, { id: 86 }, { id: 87 }, { bienNacional: "26008", serial: "KBC220K10643A" }, { bienNacional: "25992", serial: "KBC518K11064A" }, { id: 2460 }, { bienNacional: "021331", serial: "W-AB07366532" }, { bienNacional: "020522", serial: "21THR04413" }, { id: 1858 }]
                        },
                        {
                            usuario: { nombre: "Ana", apellido: "Agaton", rolId: 5, direccionNombre: "Regulación", areaNombre: "Cuarto de muestra en análisis II" },
                            equipos: [{ bienNacional: "26045", serial: "A000403966" }, { bienNacional: "26156", serial: "A59C6BA007369" }, { bienNacional: "26278", serial: "KBC518K11089A" }, { id: 2567 }, { bienNacional: "26279", serial: "A000403734" }, { bienNacional: "26203", serial: "A59C6BA005803" }, { bienNacional: "16774", serial: "ZM5527045268" }, { bienNacional: "020818", serial: "MXL7270D9F" }, { bienNacional: "020678", serial: "CNN72419GD" }, { bienNacional: "00208", serial: "C2601930" }, { id: 2569 }, { bienNacional: "26000", serial: "KBC523K" }, { bienNacional: "20068", serial: "CNN6430J85" }, { bienNacional: "18022", serial: "DS15HMEY608912W" }, { bienNacional: "24731", serial: "778ACBA015022" }, { bienNacional: "20072", serial: "CNN64622V0" }, { bienNacional: "21112", serial: "CND7353TL1" }, { bienNacional: "21116", serial: "MXL7330DMJ" }, { bienNacional: "20071", serial: "MXJ702079R" }]
                        },
                        {
                            usuario: { nombre: "Ana", apellido: "Agaton", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional cuarto 11" },
                            equipos: [{ bienNacional: "00208", serial: "C2601930" }, { id: 2040 }, { bienNacional: "021710", serial: "MXL8210G10" }, { bienNacional: "020822", serial: "MX7270DBQ" }, { bienNacional: "18521", serial: "MXJ60803S6" }, { id: 2045 }, { bienNacional: "020153", serial: "CNN644622X4" }, { bienNacional: "26104", serial: "A59C6BA005759" }, { bienNacional: "26198", serial: "T9CSSYYNYYYYLLUNNJ" }, { bienNacional: "18516", serial: "CNN6181DDD" }, { id: 1042 }, { id: 1043 }, { bienNacional: "020149", serial: "CNN64622WQ" }, { id: 93 }, { bienNacional: "26216", serial: "KBC532K10966A" }, { id: 95 }, { bienNacional: "19974", serial: "382926-161" }, { bienNacional: "020771", serial: "435301-161" }, { bienNacional: "020154", serial: "382826-161" }, { bienNacional: "020767", serial: "435302-161" }, { bienNacional: "020821", serial: "435303-161" }, { bienNacional: "024735", serial: "KBAB23Q46428A" }, { bienNacional: "024729", serial: "KBAB23Q47131A" }, { id: 1045 }, { id: 1046 }, { bienNacional: "21719", serial: "CHN1R58979" }]
                        },
                        {
                            usuario: { nombre: "Jesmin", apellido: "Sayago", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Oficina de gestión de la calidad" },
                            equipos: [{ bienNacional: "26597", serial: "A000403652" }, { bienNacional: "26338", serial: "A59C6BA005413" }, { bienNacional: "024167", serial: "PUAV0953006646" }, { bienNacional: "26597", serial: "A000403652" }, { bienNacional: "26338", serial: "A59C6BA005413" }, { bienNacional: "024167", serial: "PUAV0953006646" }, { bienNacional: "28767", serial: "3CQ144C4W3" }, { bienNacional: "28760", serial: "3CQ145B9GG" }, { bienNacional: "31699", serial: "KBHC12K16753A" }, { bienNacional: "19920", serial: "B94540KGASX0VB" }, { bienNacional: "28732", serial: "CNG1476W9M" }]
                        },
                        {
                            usuario: { nombre: "Jesmin", apellido: "Sayago", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Dirección" },
                            equipos: [{ bienNacional: "31835", serial: "A001332490" }, { id: 986 }, { bienNacional: "31836", serial: "KBHC18K12966A" }, { id: 1478 }, { id: 2541 }, { id: 1872 }, { bienNacional: "28764", serial: "3CQ145BCW9" }, { id: 1780 }]
                        },
                        {
                            usuario: { nombre: "Jesmin", apellido: "Sayago", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Documentación" },
                            equipos: [{ bienNacional: "27616", serial: "A000679616" }, { bienNacional: "27658", serial: "C16D8BA000537" }, { bienNacional: "27617", serial: "KBD624K10942A" }, { id: 2544 }, { bienNacional: "32087", serial: "CN354AQ071" }, { bienNacional: "19241", serial: "06GM26022276" }, { bienNacional: "24674", serial: "A000091965" }]
                        },
                        {
                            usuario: { nombre: "Heisel", apellido: "Urosa", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Oficina de gestión de la calidad" },
                            equipos: [{ bienNacional: "29228", serial: "CNG1476V8P" }, { bienNacional: "29196", serial: "3CQ144C471" }, { bienNacional: "25125", serial: "WE1692042367" }, { bienNacional: "27467", serial: "13355196285" }]
                        },
                        {
                            usuario: { nombre: "Yesis", apellido: "Rodriguez", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Oficina de gestión de la calidad" },
                            equipos: [{ bienNacional: "28730", serial: "CNG1477VY7" }, { bienNacional: "28772", serial: "3CQ144C9L1" }, { bienNacional: "26450", serial: "KBC525K10457A" }, { bienNacional: "020341", serial: "3L0651X26661" }]
                        },
                        {
                            usuario: { nombre: "Yohansis", apellido: "Montero", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Dirección" },
                            equipos: [{ bienNacional: "28738", serial: "CNG1476W91" }, { bienNacional: "24669", serial: "778ACBA007745" }, { bienNacional: "20737", serial: "BC3370BGAUH0EB" }, { bienNacional: "27469", serial: "13355496282" }, { bienNacional: "30072", serial: "JRL-IHP0902-PRE01" }]
                        },
                        {
                            usuario: { nombre: "Delida", apellido: "Rangel", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Aseguramiento" },
                            equipos: [{ bienNacional: "28777", serial: "CNG1476W3P" }, { bienNacional: "24672", serial: "778ACBA015014" }, { bienNacional: "26042", serial: "KBC525K10744A" }]
                        },
                        {
                            usuario: { nombre: "Edilida", apellido: "Petit", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Documentación" },
                            equipos: [{ bienNacional: "31794", serial: "A001333877" }, { id: 1091 }, { bienNacional: "31832", serial: "KBHC18K12064A" }, { id: 2543 }]
                        },
                        {
                            usuario: { nombre: "Leonel", apellido: "Serrano", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Documentación" },
                            equipos: [{ bienNacional: "26451", serial: "A000403827" }, { bienNacional: "26329", serial: "A59C6BA005865" }, { bienNacional: "26596", serial: "KBC220K11071A" }, { bienNacional: "20377", serial: "3L0629X41792" }, { bienNacional: "16901", serial: "CN441SA08Z" }]
                        },
                        {
                            usuario: { nombre: "Maura", apellido: "Flores", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología" },
                            equipos: [{ bienNacional: "29852", serial: "CNG1466991" }, { bienNacional: "27873", serial: "C16D8BA000524" }, { id: 67 }, { id: 1482 }, { bienNacional: "02086", serial: "3L0651X26586" }]
                        },
                        {
                            usuario: { nombre: "Ingrid", apellido: "Osorio", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología (área de analista)" },
                            equipos: [{ bienNacional: "29868", serial: "CNG1476VS7" }, { bienNacional: "29840", serial: "3CQ145BCZB" }, { bienNacional: "27862", serial: "KBD624K11236A" }, { id: 1873 }, { bienNacional: "27600", serial: "13355499087" }]
                        },
                        {
                            usuario: { nombre: "Reinaly", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología (área de analista)" },
                            equipos: [{ bienNacional: "26225", serial: "A000403940" }, { bienNacional: "26133", serial: "A59C6BA008042" }, { bienNacional: "26224", serial: "KBC220K12601A" }, { id: 2556 }]
                        },
                        {
                            usuario: { nombre: "Elizabeth", apellido: "Peña", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología" },
                            equipos: [{ bienNacional: "31833", serial: "A001333650" }, { id: 1004 }, { bienNacional: "31834", serial: "KBHC18J13001A" }, { bienNacional: "020834", serial: "070527-1290916" }, { bienNacional: "021517", serial: "21THR11440" }]
                        },
                        {
                            usuario: { nombre: "Elizabeth", apellido: "Peña", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología (Área técnica)" },
                            equipos: [{ bienNacional: "020770", serial: "MXL7270D91" }, { bienNacional: "020701", serial: "CNN72418ZC" }, { bienNacional: "26038", serial: "KBC220K10649A" }]
                        },
                        {
                            usuario: { nombre: "Elizabeth", apellido: "Peña", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología (Oficina de técnicos resguardo de muestra en tránsito y papelería)" },
                            equipos: [{ bienNacional: "020828", serial: "MXL7270D9Y" }, { bienNacional: "29603", serial: "3CQ143CD3K" }, { bienNacional: "020288", serial: "B94540KGASX336" }]
                        },
                        {
                            usuario: { nombre: "Elizabeth", apellido: "Peña", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología (área de analista)" },
                            equipos: [{ bienNacional: "27861", serial: "A000679634" }, { bienNacional: "29845", serial: "3CQ143CDZT" }, { id: 71 }, { bienNacional: "27599", serial: "13355499089" }, { bienNacional: "27874", serial: "C16D8BA000450" }, { bienNacional: "020792", serial: "MXL7231GON" }, { id: 1483 }]
                        },
                        {
                            usuario: { nombre: "Michael", apellido: "Herrera", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología (área de analista)" },
                            equipos: [{ bienNacional: "27865", serial: "A000679655" }, { bienNacional: "021700", serial: "803MXAY12024" }, { bienNacional: "27866", serial: "KBD624K11232A" }]
                        },
                        {
                            usuario: { nombre: "Gilma", apellido: "Moreno", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de físicoquímica de medicamentos (Oficina de cosméticos)" },
                            equipos: [{ bienNacional: "26033", serial: "A000403748" }, { bienNacional: "26003", serial: "A000403723" }, { bienNacional: "021702", serial: "MXL8210GOX" }, { bienNacional: "020059", serial: "MXJ70207B5" }, { bienNacional: "26002", serial: "KBC518K117004A" }, { bienNacional: "020073", serial: "B94540AVBSX4XG" }, { bienNacional: "26004", serial: "KBC525K10749A" }, { bienNacional: "17087", serial: "ZM3916903570" }, { bienNacional: "26116", serial: "A59C6BA005874" }, { bienNacional: "26190", serial: "A59C6BA005328" }, { bienNacional: "26135", serial: "A59C6BA008059" }, { bienNacional: "26166", serial: "A59C6BA005763" }, { bienNacional: "29911", serial: "3CQ144C27B" }, { bienNacional: "020679", serial: "CNN72419DJ" }, { bienNacional: "27489", serial: "13355498327" }, { bienNacional: "11127", serial: "RP10797523" }, { bienNacional: "25789", serial: "41J114003275" }, { bienNacional: "022423", serial: "21THR18388" }, { bienNacional: "020075", serial: "MXJ70207BQ" }]
                        },
                        {
                            usuario: { nombre: "Wilfredo", apellido: "Sanchez", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
                            equipos: [{ bienNacional: "24736", serial: "A000092063" }, { bienNacional: "24740", serial: "778ACBA015017" }, { bienNacional: "26236", serial: "KBC521K12054A" }, { id: 2559 }, { bienNacional: "16908", serial: "CL445T0687" }, { bienNacional: "18941", serial: "061635010035" }]
                        },
                        {
                            usuario: { nombre: "Daimar", apellido: "Pacheco", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
                            equipos: [{ bienNacional: "31913", serial: "A001336179" }, { id: 1019 }, { id: 80 }]
                        },
                        {
                            usuario: { nombre: "Amarilis", apellido: "Aguilera", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
                            equipos: [{ bienNacional: "26207", serial: "A000403925" }, { bienNacional: "26127", serial: "A59C6BA005810" }, { bienNacional: "26206", serial: "KBC220K12730A" }, { bienNacional: "27394", serial: "13355499896" }]
                        },
                        {
                            usuario: { nombre: "Deyanira", apellido: "Guille", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
                            equipos: [{ bienNacional: "31911", serial: "A001336192" }, { id: 1022 }, { id: 83 }, { bienNacional: "020865", serial: "070527-1291860" }]
                        },
                        {
                            usuario: { nombre: "Mirta", apellido: "Puente", rolId: 5, direccionNombre: "Regulación", areaNombre: "Vigilancia sanitaria" },
                            equipos: [{ bienNacional: "020788", serial: "MXL7270D99" }, { bienNacional: "02790", serial: "MXL7270DB7" }, { bienNacional: "020804", serial: "MXL7270D96" }, { bienNacional: "020786", serial: "MXL72507MR" }, { bienNacional: "020758", serial: "MXL7270DBD" }, { bienNacional: "020764", serial: "MXL7270D9N" }, { bienNacional: "024180", serial: "MXL0050TXS" }, { bienNacional: "19930", serial: "MXJ702079Q" }, { bienNacional: "020677", serial: "CNN7241B2" }, { bienNacional: "024686", serial: "778ACBA015047" }, { bienNacional: "020666", serial: "CNN72418ZQ" }, { bienNacional: "020680", serial: "CNN72419GJ" }, { bienNacional: "020757", serial: "BC3370BGAUH0C7" }, { bienNacional: "27643", serial: "KBD624K10907A" }, { bienNacional: "024658", serial: "KBAB23Q47080A" }, { bienNacional: "19932", serial: "B94540KGASX0U0A" }, { bienNacional: "19933", serial: "3L0651X2656" }, { id: 2572 }, { id: 1860 }]
                        }
                        //Piso 2
                        ,
                        //Piso 2
                        {
                            usuario: { nombre: "Ana", apellido: "Franca", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
                            equipos: [{ bienNacional: "28959", serial: "CNG1476Q9C" }, { bienNacional: "28960", serial: "3CQ144D9HY" }, { bienNacional: "20733", serial: "BC3370BVBUH0WQ" }, { id: 1598 }]
                        },
                        {
                            usuario: { nombre: "Alfredo", apellido: "Perozo", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Comunicaciones" },
                            equipos: [{ bienNacional: "29756", serial: "CNG1476Q4B" }, { bienNacional: "29189", serial: "3CQ144C9LH" }, { bienNacional: "024171", serial: "PUAV1001009493" }, { bienNacional: "27456", serial: "13355496414" }]
                        },
                        {
                            usuario: { nombre: "Ana", apellido: "Pelay", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "Dirección" },
                            equipos: [{ bienNacional: "27837", serial: "A000976711" }, { bienNacional: "29188", serial: "3CQ143CF33" }, { bienNacional: "31375", serial: "65818882894" }, { id: 2 }, { bienNacional: "27486", serial: "13355498320" }]
                        },
                        {
                            usuario: { nombre: "Aramis", apellido: "Silva", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Cooperación técnica" },
                            equipos: [{ bienNacional: "29224", serial: "CNG1476WL0" }, { bienNacional: "29186", serial: "3CQ145BCZX" }, { bienNacional: "16072", serial: "C0403112523" }, { bienNacional: "27442", serial: "13255499945" }]
                        },
                        {
                            usuario: { nombre: "Beatriz", apellido: "Mosqueda", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Comunicaciones" },
                            equipos: [{ bienNacional: "29222", serial: "CNG1476WY5" }, { bienNacional: "29195", serial: "3CQ144D7D4" }, { bienNacional: "020190", serial: "B94540KGASX0W5" }, { id: 641 }]
                        },
                        {
                            usuario: { nombre: "Angely", apellido: "Nieves", rolId: 5, direccionNombre: "Desarrollo", areaNombre: "Patología" },
                            equipos: [{ bienNacional: "29204", serial: "CNG1476QFK" }, { bienNacional: "29180", serial: "3CQ144DCM8" }, { id: 176 }, { id: 1485 }]
                        },
                        {
                            usuario: { nombre: "Carlos", apellido: "Suarez", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ bienNacional: "24724", serial: "A000092051" }, { bienNacional: "17434", serial: "MJ15H4JXA22529H" }, { id: 205 }, { id: 679 }, { bienNacional: "5645", serial: "18364123" }]
                        },
                        {
                            usuario: { nombre: "Carmen", apellido: "Goicochea", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Consultor jurídico" },
                            equipos: [{ bienNacional: "28820", serial: "CNG1476V4P" }, { bienNacional: "16718", serial: "DS15HMEY608899K" }, { bienNacional: "16716", serial: "ZM5527045263" }, { bienNacional: "32023", serial: "230331-0560763" }]
                        },
                        {
                            usuario: { nombre: "Dailyn", apellido: "Betancourt", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "División de seguridad de medicamentos" },
                            equipos: [{ bienNacional: "29569", serial: "CNG1476W5G" }, { bienNacional: "28765", serial: "3CQ145B9H6" }, { bienNacional: "24718", serial: "KBAB26Q41602A" }, { bienNacional: "27570", serial: "43152174" }]
                        },
                        {
                            usuario: { nombre: "Eimy", apellido: "Aranque", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "División de reacciones adversas de medicamentos" },
                            equipos: [{ bienNacional: "29220", serial: "CNG1476V7Z" }, { bienNacional: "29553", serial: "3CQ144C4N0" }, { id: 203 }, { bienNacional: "27473", serial: "13355496278" }]
                        },
                        {
                            usuario: { nombre: "Daniel", apellido: "Buvat", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica", areaNombre: "División de bacteriología (Laboratorio de enfermedades zoonóticas y metaxénicas bacterianas LEZMB)" },
                            equipos: [{ bienNacional: "26027", serial: "A000403718" }, { bienNacional: "26179", serial: "A59CCBA005762" }, { bienNacional: "26026", serial: "KBC518K11087A" }, { bienNacional: "16608", serial: "3546866" }, { bienNacional: "19277", serial: "341243543" }]
                        },
                        {
                            usuario: { nombre: "Coralia", apellido: "Arteaga", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Departamento de gestión de sistema" },
                            equipos: [{ bienNacional: "31722", serial: "MJ096CB2" }, { bienNacional: "31723", serial: "61B1JAR1WW" }, { bienNacional: "29665", serial: "626970-001" }, { bienNacional: "31721", serial: "863016124" }, { bienNacional: "24140", serial: "906220662861" }, { bienNacional: "26243", serial: "A000403773" }, { bienNacional: "21088", serial: "CNC725PCCV" }, { bienNacional: "20783", serial: "BC3370BVBUECOY" }, { bienNacional: "32092", serial: "262021661766" }]
                        },
                        {
                            usuario: { nombre: "Eleana", apellido: "Serrano", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación farmacéutica" },
                            equipos: [{ bienNacional: "31672", serial: "A001332787" }, { bienNacional: "30377", serial: "D72E6BA00678" }, { bienNacional: "31671", serial: "KBHC12K16681A" }, { bienNacional: "27485", serial: "13355498330" }, { bienNacional: "18931", serial: "061635009989" }, { id: 1875 }, { id: 1540 }]
                        },
                        {
                            usuario: { nombre: "Erika", apellido: "Holzhauser", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Departamento de manejo e integración de resultados" },
                            equipos: [{ bienNacional: "26235", serial: "A000403740" }, { bienNacional: "27883", serial: "C16D8BA000541" }, { bienNacional: "024656", serial: "778ACBA015024" }, { bienNacional: "26098", serial: "KBC525K101154A" }, { bienNacional: "27397", serial: "13355499897" }]
                        },
                        {
                            usuario: { nombre: "Elbiglnnis", apellido: "Molina", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
                            equipos: [{ bienNacional: "26267", serial: "A000403975" }, { bienNacional: "26172", serial: "A59C6BA005279" }, { bienNacional: "19924", serial: "B94540KGASX0V6" }]
                        },
                        {
                            usuario: { nombre: "Eleana", apellido: "Cerrano", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
                            equipos: [{ bienNacional: "44444", serial: "06GM26023611" }]
                        },
                        {
                            usuario: { nombre: "Francis", apellido: "Alayon", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
                            equipos: [{ bienNacional: "31682", serial: "A001332796" }, { id: 1095 }, { bienNacional: "31681", serial: "KBHC12K16653A" }, { id: 1619 }]
                        },
                        {
                            usuario: { nombre: "Franklin", apellido: "Garaban", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Consultor jurídico" },
                            equipos: [{ bienNacional: "26253", serial: "A000403806" }, { bienNacional: "024783", serial: "778ACBA015002" }, { id: 168 }, { bienNacional: "30089", serial: "212079001005345" }, { bienNacional: "30073", serial: "VNB6Z07937" }]
                        },
                        {
                            usuario: { nombre: "Fatima", apellido: "Torrico", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "División de reacciones adversas de medicamentos" },
                            equipos: [{ bienNacional: "27825", serial: "A000679732" }, { bienNacional: "27718", serial: "C16D8BA000540" }, { bienNacional: "25132", serial: "WE1692042372" }, { bienNacional: "16193", serial: "8231691243" }, { id: 1881 }, { id: 1915 }]
                        },
                        {
                            usuario: { nombre: "Francis", apellido: "Bolivar", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ id: 2148 }, { id: 1151 }, { bienNacional: "16194", serial: "13234241" }, { bienNacional: "21161", serial: "MXJ702077X" }, { bienNacional: "26140", serial: "A59C8BA007373" }, { bienNacional: "21160", serial: "BC3370BVBUQ2NO" }, { bienNacional: "16457", serial: "6546553453" }, { id: 2150 }, { bienNacional: "16076", serial: "C0403116789" }, { id: 1795 }, { id: 1922 }]
                        },
                        {
                            usuario: { nombre: "Greilis", apellido: "Ortega", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Archivo y correspondencia" },
                            equipos: [{ bienNacional: "020826", serial: "MXL72405SC" }, { bienNacional: "024160", serial: "MY19H9NZ147099H" }, { bienNacional: "16094", serial: "C0403112297" }, { bienNacional: "27519", serial: "13355494908" }, { bienNacional: "020778", serial: "MXD7270DBC" }, { bienNacional: "020251", serial: "CNN6430K1T" }, { bienNacional: "19962", serial: "B94540KGASX0VM" }, { bienNacional: "27653", serial: "A000679641" }, { bienNacional: "27730", serial: "C16D8BA001990" }, { bienNacional: "27652", serial: "KBD624K10944A" }, { bienNacional: "27583", serial: "13355496081" }, { bienNacional: "29702", serial: "3CQ144DD2G" }, { bienNacional: "19279", serial: "56487653" }]
                        },
                        {
                            usuario: { nombre: "Glenda", apellido: "Lares", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
                            equipos: [{ bienNacional: "31684", serial: "A0013322799" }, { id: 1097 }, { bienNacional: "31683", serial: "KBHC12K16105A" }, { bienNacional: "24049", serial: "5827700066" }]
                        },
                        {
                            usuario: { nombre: "Glenda", apellido: "Morin", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Dirección" },
                            equipos: [{ bienNacional: "29212", serial: "CNG1476V0P" }, { bienNacional: "29736", serial: "3CQ144DC2C" }, { id: 152 }, { bienNacional: "021323", serial: "AB073763784" }, { bienNacional: "18939", serial: "061635009998" }]
                        },
                        {
                            usuario: { nombre: "Gladys", apellido: "Gonzalez", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Dirección" },
                            equipos: [{ bienNacional: "31821", serial: "A001332788" }, { id: 1099 }, { bienNacional: "31822", serial: "KBHK18K12963A" }, { bienNacional: "27454", serial: "13355496316" }, { bienNacional: "31493", serial: "321311321321" }, { bienNacional: "32081", serial: "2239512007225" }, { id: 1101 }, { id: 1102 }, { id: 155 }, { bienNacional: "020479", serial: "G871016BU02" }, { bienNacional: "020808", serial: "21THR00688" }, { bienNacional: "31694", serial: "A001332808" }, { id: 1107 }, { bienNacional: "31695", serial: "KBHC12K16589A" }, { bienNacional: "27459", serial: "13355496412" }]
                        },
                        {
                            usuario: { nombre: "Ivanna", apellido: "Fonseca", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
                            equipos: [{ bienNacional: "26261", serial: "A000403946" }, { bienNacional: "020665", serial: "CNN72419DK" }, { bienNacional: "27870", serial: "KBD624K10946A" }, { id: 1601 }]
                        },
                        {
                            usuario: { nombre: "Josefina", apellido: "Hernandez", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Dirección" },
                            equipos: [{ bienNacional: "28779", serial: "CNG1476VRF" }, { bienNacional: "024773", serial: "7779AKM5NQH4LUNNJ" }, { bienNacional: "31992", serial: "0200704666758" }]
                        },
                        {
                            usuario: { nombre: "Josmar", apellido: "Garcia", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Cooperación técnica" },
                            equipos: [{ bienNacional: "29218", serial: "CNG1466986" }, { bienNacional: "29745", serial: "3CQ144K91D" }, { id: 157 }, { bienNacional: "27448", serial: "13355499938" }, { bienNacional: "123456", serial: "2141500002594" }]
                        },
                        {
                            usuario: { nombre: "Judith", apellido: "Luces", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Despacho" },
                            equipos: [{ bienNacional: "26101", serial: "A000403956" }, { bienNacional: "020080", serial: "CNN64622R6" }, { bienNacional: "024784", serial: "KBAB26Q43227A" }, { bienNacional: "05121", serial: "RP11300040" }, { bienNacional: "19284", serial: "13213231" }, { bienNacional: "29238", serial: "CNG1476VPJ" }, { bienNacional: "020185", serial: "CNN6430HZ4" }, { id: 163 }, { bienNacional: "18929", serial: "061635013788" }, { bienNacional: "26245", serial: "A000403849" }, { bienNacional: "19927", serial: "CNN6430HTE" }, { bienNacional: "14244", serial: "3892C595" }, { bienNacional: "05388", serial: "248038" }]
                        },
                        {
                            usuario: { nombre: "Ingrid", apellido: "Araque", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Consultor jurídico" },
                            equipos: [{ bienNacional: "020730", serial: "MXL7270D9R" }, { bienNacional: "26125", serial: "A59C6BA005805" }, { id: 169 }, { bienNacional: "18904", serial: "06021-1200917" }]
                        },
                        {
                            usuario: { nombre: "Jessica", apellido: "Vivas", rolId: 5, direccionNombre: "Producción", areaNombre: "Dirección de biotecnología y desarrollo" },
                            equipos: [{ bienNacional: "31915", serial: "M242023220150" }, { id: 1130 }, { id: 183 }, { bienNacional: "27588", serial: "13355496075" }, { bienNacional: "27431", serial: "13355498913" }, { bienNacional: "27555", serial: "13355498279" }]
                        },
                        {
                            usuario: { nombre: "Jesus", apellido: "Torres", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica", areaNombre: "División de bacteriología (Laboratorio de enfermedades zoonóticas y metaxénicas bacterianas LEZMB)" },
                            equipos: [{ bienNacional: "27778", serial: "A000679768" }, { bienNacional: "27761", serial: "C16D8BA001992" }, { bienNacional: "27779", serial: "KBD624K10970A" }, { bienNacional: "14193", serial: "1902880" }, { id: 1884 }]
                        },
                        {
                            usuario: { nombre: "Kirsey", apellido: "Heriguez", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
                            equipos: [{ bienNacional: "27820", serial: "A000679569" }, { bienNacional: "27844", serial: "C16D8BA000510" }, { bienNacional: "020727", serial: "BC3370BVBUECVC" }, { id: 1602 }]
                        },
                        {
                            usuario: { nombre: "Karen", apellido: "Nieves", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
                            equipos: [{ bienNacional: "31668", serial: "A001332816" }, { bienNacional: "34567", serial: "34567" }, { bienNacional: "31669", serial: "KBHC12K16677A" }]
                        },
                        {
                            usuario: { nombre: "Lilibeth", apellido: "Leottau", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "División de seguridad de medicamentos" },
                            equipos: [{ bienNacional: "27344", serial: "A000679708" }, { bienNacional: "29553", serial: "3CQ144C48K" }, { bienNacional: "31378", serial: "65818882893" }, { bienNacional: "24040", serial: "090701-0660463" }]
                        },
                        {
                            usuario: { nombre: "Lisbeth", apellido: "Ruiz", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica", areaNombre: "División de bacteriología" },
                            equipos: [{ bienNacional: "021348", serial: "MXL7500HYZ" }, { bienNacional: "020668", serial: "CNN72419GQ" }, { bienNacional: "16624", serial: "C0403121760" }, { bienNacional: "27447", serial: "1335549940" }, { bienNacional: "12387", serial: "USGT086927" }]
                        },
                        {
                            usuario: { nombre: "Luis", apellido: "Rangel", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
                            equipos: [{ bienNacional: "25987", serial: "A000403931" }, { bienNacional: "26202", serial: "A59C6BA005767" }, { id: 206 }, { bienNacional: "34", serial: "C11893485" }]
                        }
                    ];
                    createUsuarios = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _loop_1, _i, dataUsuarios_2, dataUsuario;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Iniciando creación de usuarios...");
                                    _loop_1 = function (dataUsuario) {
                                        var direccion, areaId, area, usuario, equiposAsignados, _b, _c, equipo, result, error_2, whereCondition, error_3;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    console.log("Procesando usuario: ".concat(dataUsuario.usuario.nombre));
                                                    return [4 /*yield*/, prismadb_1.default.direcciones.findFirst({
                                                            where: { direccion: dataUsuario.usuario.direccionNombre },
                                                            include: { areas: true }
                                                        })];
                                                case 1:
                                                    direccion = _d.sent();
                                                    console.log("Dirección encontrada");
                                                    if (!direccion) {
                                                        console.log("\u274C Direcci\u00F3n no encontrada para: ".concat(dataUsuario.usuario.nombre));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    areaId = null;
                                                    if (dataUsuario.usuario.areaNombre && direccion.areas) {
                                                        area = direccion.areas.find(function (a) { return a.nombre === dataUsuario.usuario.areaNombre; });
                                                        if (area) {
                                                            areaId = area.id;
                                                            console.log("\u00C1rea encontrada");
                                                        }
                                                        else {
                                                            console.log("\u26A0\uFE0F \u00C1rea no encontrada: ".concat(dataUsuario.usuario.areaNombre));
                                                        }
                                                    }
                                                    return [4 /*yield*/, prismadb_1.default.usuario.create({
                                                            data: {
                                                                nombre: dataUsuario.usuario.nombre,
                                                                apellido: dataUsuario.usuario.apellido,
                                                                rolId: dataUsuario.usuario.rolId,
                                                                direccionId: direccion.id,
                                                                areaId: areaId
                                                            }
                                                        })];
                                                case 2:
                                                    usuario = _d.sent();
                                                    console.log("Usuario creado: ".concat(usuario.nombre, " ").concat(usuario.apellido, " (ID: ").concat(usuario.id, ")"));
                                                    equiposAsignados = 0;
                                                    _b = 0, _c = dataUsuario.equipos;
                                                    _d.label = 3;
                                                case 3:
                                                    if (!(_b < _c.length)) return [3 /*break*/, 15];
                                                    equipo = _c[_b];
                                                    console.log("Buscando equipo:", equipo);
                                                    result = void 0;
                                                    if (!equipo.id) return [3 /*break*/, 8];
                                                    _d.label = 4;
                                                case 4:
                                                    _d.trys.push([4, 6, , 7]);
                                                    return [4 /*yield*/, prismadb_1.default.equipos.update({
                                                            where: { id: equipo.id },
                                                            data: { usuarioId: usuario.id }
                                                        })];
                                                case 5:
                                                    result = _d.sent();
                                                    console.log("Equipo actualizado por ID: ".concat(equipo.id));
                                                    equiposAsignados += 1;
                                                    return [3 /*break*/, 7];
                                                case 6:
                                                    error_2 = _d.sent();
                                                    console.log("\u274C Error actualizando equipo por ID ".concat(equipo.id, ":"), error_2);
                                                    return [3 /*break*/, 7];
                                                case 7: return [3 /*break*/, 14];
                                                case 8:
                                                    if (!(equipo.bienNacional && equipo.serial)) return [3 /*break*/, 13];
                                                    whereCondition = {
                                                        bienNacional: equipo.bienNacional,
                                                        serial: equipo.serial
                                                    };
                                                    _d.label = 9;
                                                case 9:
                                                    _d.trys.push([9, 11, , 12]);
                                                    return [4 /*yield*/, prismadb_1.default.equipos.updateMany({
                                                            where: whereCondition,
                                                            data: { usuarioId: usuario.id }
                                                        })];
                                                case 10:
                                                    result = _d.sent();
                                                    console.log("Equipos actualizados: ".concat(result.count));
                                                    equiposAsignados += result.count;
                                                    if (result.count === 0) {
                                                        console.log("\u26A0\uFE0F Equipo no encontrado con bienNacional: ".concat(equipo.bienNacional, " y serial: ").concat(equipo.serial));
                                                    }
                                                    return [3 /*break*/, 12];
                                                case 11:
                                                    error_3 = _d.sent();
                                                    console.log("Error actualizando equipo:", error_3);
                                                    return [3 /*break*/, 12];
                                                case 12: return [3 /*break*/, 14];
                                                case 13:
                                                    console.log("\u274C Equipo sin formato v\u00E1lido:", equipo);
                                                    _d.label = 14;
                                                case 14:
                                                    _b++;
                                                    return [3 /*break*/, 3];
                                                case 15:
                                                    console.log("\u2705 Total equipos asignados a ".concat(usuario.nombre, ": ").concat(equiposAsignados));
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, dataUsuarios_2 = dataUsuarios_1;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < dataUsuarios_2.length)) return [3 /*break*/, 4];
                                    dataUsuario = dataUsuarios_2[_i];
                                    return [5 /*yield**/, _loop_1(dataUsuario)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    // EJECUTAR la función
                    createUsuarios()
                        .then(function () { return console.log("Script ejecutado exitosamente"); })
                        .catch(function (error) { return console.error("Error:", error); });
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
