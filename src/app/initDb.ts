import prismadb from "@/lib/prismadb";
import seedEquipos from "../../seeds/equiposSeed"
import seedDirecciones from "../../seeds/direccionesSeed"
import seedMarcasModelos from "../../seeds/marcasModelosSeed"
import seedEspecificacionesAdicionales from "../../seeds/especificacionesAdicionalesSeed"
import bcrypt from "bcryptjs"

export async function def() {

  try {
    
    await seedEquipos(prismadb);
    await seedDirecciones(prismadb);
    await seedMarcasModelos(prismadb);
    await seedEspecificacionesAdicionales(prismadb);

    // Crear roles
    
    await prismadb.rol.createMany({
      data: [
        { rol: "admin" },
        { rol: "supervisor" },
        { rol: "solicitante" },
        { rol: "analista" },
        { rol: "personal" },
      ],
    });

    //  Registro de Usuarios
    const dataUsuarios = [

    //Piso 1
      { 
       usuario: { nombre: "Zenia", apellido: "Monsalve", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas" },
       equipos: [{ bienNacional: "29640", serial: "CNG1476PRG" },  { id: 2460 },  { id: 2461 }]
      },  
      {
       usuario: { nombre: "Aile", apellido: "Hernandez", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
       equipos: [{ id: 1892 }, { id: 935 }, { id: 1 }, { id: 1728 } ]
      },
      {
      usuario: { nombre: "Wilmer", apellido: "Monsalve", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
      equipos: [{ id: 1928 }, { id: 936 }, { id: 2 }, { id: 1729 }, { id: 1465 }]
      }, 
      {
      usuario: { nombre: "Genesis", apellido: "Castillo", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
      equipos: [{ id: 1930 }, { id: 937 }, { id: 3 }, { id: 1730 }]
      } ,
     {
      usuario: { nombre: "Javier", apellido: "Torres", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
      equipos: [{ id: 1932 }, { id: 938 }, { id: 4 }, { id: 1731 }, { id: 1852 },]
      },  
      {
      usuario: { nombre: "Vicenza", apellido: "Trombino", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-bacteriología)" },
      equipos: [{ id:939  }, { id:940  }, { id:941 }, { id:1948 }, { id:1949  }, { id:1950  }, { id:1763 }, { id:1764 }, { id:65  }, { id:1766 }]
      },  
      {
      usuario: { nombre: "Yurani", apellido: "Yepez", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-análisis especiales)" },
      equipos: [{ id: 1940 }, { id: 942 }, { id:5 }, { id:1466 }]
      },
      {
      usuario: { nombre: "Vincenza", apellido: "Trombino", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y bebidas (microbiología de alimentos-análisis especiales)" },
      equipos: [{ id:1868 }, { id:1734 }, { id:1736 }, { id:1737 }, { id:1738 }, { id:1740 }, { id:1740 }, { id:1742 }, { id:1743 }, { id:1744 }, { id:943 }, { id:944 }, { id:6 }, { id:7 }, { id:8 }, { id:9 }, { id:1952 }, { id:1953 }, { id:1767 }] 
      }, 
     {
      usuario: { nombre: "Patricia", apellido: "Oropeza", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano", areaNombre: "Dirección de laboratorio de control de productos alimentarios y licores (química de alimentos)" },
      equipos: [{ id:1954 }, { id:945 }, { id:11 }, { id:1745 }, { id:1956 }, { id:946 }, { id:12 }, { id:2511 }, { id:1957 }, { id:947 }, { id:13 }, { id:948 }, { id:949 }, { id:1958 }, { id:14 }, { id:1959 }, { id:1960 }, { id:15 }, { id:2511 }, { id:1467 }, { id:1768 }, { id:1769 }, { id:1961 }, { id:950 }, { id:16 }, { id:2512 }, { id:2455 }, { id:1468 }, { id:2456 }, { id:1770 }, {id:1737}, {id:1952} ] 
      },
      {
      usuario: { nombre: "Rita", apellido: "Loreto", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
      equipos: [{ id:1962 }, { id:951 }, { id:17 }, { id:534 }, { id:2514 }]
      },
      {
      usuario: { nombre: "Fernando", apellido: "Figueroa", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
      equipos: [{ id:1963 }, { id:952 }, { id:18 }]
      },
      {
      usuario: { nombre: "Migdelis", apellido: "Alejos", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
      equipos: [{ id:1964 }, { id:953 }, { id:19 }, { id:535 }, { id:2515 }]
      },
      {
      usuario: { nombre: "Addias", apellido: "Rivas", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
      equipos: [{ id:1965 }, { id:954 }, { id:20 }, { id:536 }, { id:2516 }]
      },
      {
      usuario: { nombre: "Lysbeth", apellido: "Brito", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de cultivo celular" },
      equipos: [{ id:1965 }, { id:954 }, { id:21 }, { id:1966 }, { id:1967 }, { id:955 }, { id:22 }, { id:23 }, { id:1968 }, { id:956 }, { id:24 }, { id:2515 }, { id:1468 }]
      },
      {
      usuario: { nombre: "Elsa", apellido: "De La Rosa", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de producción" },
      equipos: [{ bienNacional: "31837", serial: "A001333847" }, { id:957 }, { bienNacional: "31838", serial: "KBHC18K12004A" }, { bienNacional: "19269", serial: "ACD020398JP" }]
      }, 
      {
      usuario: { nombre: "Karelys", apellido: "Diaz", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de producción" },
      equipos: [{ bienNacional: "27896", serial: "A000679610" }, { bienNacional: "27811", serial: "16DD8BA333581" }, { bienNacional: "26274", serial: "KBC521K11586A" }, { id:2514 }, { id:539 }]
      }, 
      {
      usuario: { nombre: "Yasmira", apellido: "Ramirez", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de producción" },
      equipos: [{ bienNacional: "024685", serial: "A000091966" }, { bienNacional: "024690", serial: "778ACBA015007" }, { bienNacional: "024684", serial: "KBAB26Q41572A" }, { bienNacional: "30083", serial: "212079001005348" }, { id:1870 }]
      },
      {
      usuario: { nombre: "Manuel", apellido: "Moya", rolId: 5, direccionNombre: "Dirección general de producción", areaNombre: "Dirección de producción" },
      equipos: [{ bienNacional: "31702", serial: "A001332791" }, { id:960 }, { bienNacional: "31703", serial: "KBHC12K16671A" }, { id:2516 }, { id:1470 }, { id:1871 }, { id:1852 }, { bienNacional: "11320", serial: "AR247799" }, { id:1919 }, { id:1541 }, { bienNacional: "022422", serial: "21THR18970" }, { bienNacional: "023962", serial: "6110513413" }, { id:1772 }, { bienNacional: "32046", serial: "22322Y3333761" }]
      },
      {
      usuario: { nombre: "Celly", apellido: "Monzales", rolId: 5, direccionNombre: "Gerencia de regulación sanitaria", areaNombre: "Dirección de alimentos" },
      equipos: [{ bienNacional: "16151", serial: "MXD41808ZF" }, { bienNacional: "20173", serial: "CNN64622S5" }, { bienNacional: "16100", serial: "C0403121802" }, { bienNacional: "27584", serial: "13355496078" }, { bienNacional: "29596", serial: "CNG14669CQ" }, { bienNacional: "29612", serial: "3CQ144DBZC" }, { bienNacional: "20186", serial: "B94540KGASX393" }, { id:1571 }, { id:1472 }, { bienNacional: "21237", serial: "21THR09988" }]
      },
      {
      usuario: { nombre: "Maria", apellido: "Urbina", rolId: 5, direccionNombre: "Gerencia de regulación sanitaria", areaNombre: "Dirección de alimentos" },
      equipos: [{ bienNacional: "25983", serial: "A000403818" }, { bienNacional: "26107", serial: "T9CSSYNYYLLUNNJ" }, { bienNacional: "25982", serial: "KBC518K11708A" }, { bienNacional: "31604", serial: "221716347220" }, { id:1471 }, { id:1773 }]
      },
      {
      usuario: { nombre: "Maria", apellido: "Diaz", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria", areaNombre: "Dirección general" },
      equipos: [{ bienNacional: "31825", serial: "A001332493" }, { id:964}, { bienNacional: "31826", serial: "KBHC12K16843A" }, { bienNacional: "20123", serial: "3L0651X26607" }, { id:1573 }, { bienNacional: "18925", serial: "61635010020" }, { bienNacional: "11750", serial: "S30355-S5083-A803-3" }, { bienNacional: "023713", serial: "CNGSC05204" }, { bienNacional: "31953", serial: "42590318654" }, { bienNacional: "31951", serial: "CN-0CW6Y7" }, { id:35 }, { bienNacional: "30355", serial: "1432000500713" }, { bienNacional: "30274", serial: "1434200506469" }, { bienNacional: "30275", serial: "1432000500733" }]
      },
      {
      usuario: { nombre: "Joanna", apellido: "Huerfana", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria", areaNombre: "Dirección general" },
      equipos: [{ bienNacional: "29923", serial: "CNG1476TZK" }, { bienNacional: "29909", serial: "3CQ144CJ7" }, { bienNacional: "020081", serial: "B9454OKGASX0VT" }, { bienNacional: "27440", serial: "13355498903" }, { bienNacional: "18928", serial: "061635013793" }, { id:1776}]
      },
      {
      usuario: { nombre: "Yirlini", apellido: "Pineda", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria", areaNombre: "Dirección general" },
      equipos: [{ bienNacional: "25993", serial: "A000403882" }, { bienNacional: "26185", serial: "A59CBA005305" }, { bienNacional: "26220", serial: "KBC220K12531A" }, { bienNacional: "19929", serial: "3L0651X26285" }]
      },
      {
      usuario: { nombre: "Ana", apellido: "Agaton", rolId: 5, direccionNombre: "Dirección de laboratorio de control de medicamentos", areaNombre: "Laboratorio de recombinantes" },
      equipos: [{ bienNacional: "16371", serial: "MXD4180963" }, { bienNacional: "15331", serial: "BR14330101" }, { bienNacional: "16159", serial: "MXD418091B" }, { bienNacional: "15349", serial: "CN13634341" }, { bienNacional: "17840", serial: "DS15HMEY608597N" }, { id:36}, { bienNacional: "17891", serial: "KL0441122282" }, { id:1577 }, { bienNacional: "021718", serial: "080331-1304873" }, { bienNacional: "18519", serial: "06033701006051DNN" }, { bienNacional: "12264", serial: "100200296" }, { bienNacional: "024024", serial: "080819-12909729" }, { id:1582 }, { id:1583 }, { bienNacional: "020078", serial: "3L651X26623" }, { bienNacional: "14894", serial: "280602 319" }, { id:1586 }, { id:1476 }, { bienNacional: "020430", serial: "CNB1F02454" }, { bienNacional: "024551", serial: "3B1047X37129" }]
      },
      {
      usuario: { nombre: "Maritza", apellido: "Burgos", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ bienNacional: "31815", serial: "A001332794" }, { id:970 }, { bienNacional: "31816", serial: "KBHC12K16784A" }, { bienNacional: "24091", serial: "090219-1311663" }, { id:1778 }, { bienNacional: "26122", serial: "C0BB5090T080E011" }, { id:38 }, { bienNacional: "23793", serial: "MXL9410S4N" }, { bienNacional: "24728", serial: "778ACBA015033" }, { bienNacional: "19954", serial: "B94540KGASX34P" }, { bienNacional: "19955", serial: "3L0650X31191" }, { bienNacional: "26869", serial: "A000403732" }, { bienNacional: "26139", serial: "A59CB6BA004268" }, { bienNacional: "31824", serial: "KBHC12K16906A" }, { bienNacional: "19945", serial: "3L0650X31200" }, { bienNacional: "29592", serial: "CNG1476PGB" }, { bienNacional: "29608", serial: "3CQ144C482" }, { id:41 }, { bienNacional: "25661", serial: "13355496035" }, { id:975 }, { id:42 }]
      }, 
      {
      usuario: { nombre: "Francis", apellido: "Bolivar", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ bienNacional: "31813", serial: "A001332803" }, { id:1320 }, { bienNacional: "31814", serial: "KBHC12K16939A" }, { bienNacional: "27565", serial: "13355496171" }]
      },
      {
      usuario: { nombre: "Alexander", apellido: "Marcano", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ bienNacional: "26271", serial: "A000403733" }, { bienNacional: "24725", serial: "778ACBA015030" }, { bienNacional: "24732", serial: "KBAB23Q47000A" }, { bienNacional: "12432", serial: "2007534" }]
      },
      {
      usuario: { nombre: "Cristina", apellido: "Lugo", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ bienNacional: "31811", serial: "A001332531" }, { id:123 }, { bienNacional: "31812", serial: "KBHC12K16561A" }, { bienNacional: "27384", serial: "13355496164" }]
      },  
      {
      usuario: { nombre: "Eduardo", apellido: "Rodriguez", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ bienNacional: "31823", serial: "A001332518" }, { id:1307 }, { id:46 }, { bienNacional: "27385", serial: "13355496162" }]  
      },
      {
      usuario: { nombre: "Maritza", apellido: "Burgos", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ bienNacional: "26263", serial: "A000403945" }, { id:1778 }, { id:1477}]
      },
      {
      usuario: { nombre: "Alicia", apellido: "Zambrano", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Oficina de gestión de la calidad" },
      equipos: [{ bienNacional: "28830", serial: "CNG1476PHG" }, { bienNacional: "28762", serial: "3CQ144C4GR" }, { bienNacional: "31377", serial: "65818882408" }, { id:2537}]
      }, 
      {
      usuario: { nombre: "Ana", apellido: "Agaton", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
      equipos: [{ bienNacional: "26275", serial: "A000403896" }, { bienNacional: "27640", serial: "A000679760" }, { bienNacional: "27841", serial: "C16D8BA000490" }, { bienNacional: "26268", serial: "KBC518K11061A" }, { id:2560 }, { bienNacional: "26215", serial: "A000403918" }, { bienNacional: "26164", serial: "A59C6B005206" }, { bienNacional: "26214", serial: "KBC521K11761A" }, { bienNacional: "024090", serial: "090219-1311664" }, { bienNacional: "11953", serial: "090200" }, { bienNacional: "29860", serial: "CNG1476PJZ" }, { bienNacional: "29842", serial: "3CQ144C488" }, { id:85 }, { bienNacional: "20756", serial: "MXL7270DBK" }, { bienNacional: "20703", serial: "CNN72419G4" }, { bienNacional: "27859", serial: "A000679592" }, { bienNacional: "26200", serial: "A59C6BA005267" }, { bienNacional: "26124", serial: "A59C6BA005864" }, { bienNacional: "26131", serial: "A59C6BA007368" }, { bienNacional: "27881", serial: "C16D8BA000515" }, {id:86 }, { id:87 }, { bienNacional: "26008", serial: "KBC220K10643A" }, { bienNacional: "25992", serial: "KBC518K11064A" }, { id:2460 }, { bienNacional: "021331", serial: "W-AB07366532" }, { bienNacional: "020522", serial: "21THR04413" }, { id:1858 }]
      },
      {
      usuario: { nombre: "Ana", apellido: "Agaton", rolId: 5, direccionNombre: "Regulación", areaNombre: "Cuarto de muestra en análisis II" },
      equipos: [{ bienNacional: "26045", serial: "A000403966" }, { bienNacional: "26156", serial: "A59C6BA007369" }, { bienNacional: "26278", serial: "KBC518K11089A" }, { id:2567}, { bienNacional: "26279", serial: "A000403734" }, { bienNacional: "26203", serial: "A59C6BA005803" }, { bienNacional: "16774", serial: "ZM5527045268" }, { bienNacional: "020818", serial: "MXL7270D9F" }, { bienNacional: "020678", serial: "CNN72419GD" }, { bienNacional: "00208", serial: "C2601930" }, { id:2569}, { bienNacional: "26000", serial: "KBC523K" }, { bienNacional: "20068", serial: "CNN6430J85" }, { bienNacional: "18022", serial: "DS15HMEY608912W" }, { bienNacional: "24731", serial: "778ACBA015022" }, { bienNacional: "20072", serial: "CNN64622V0" }, { bienNacional: "21112", serial: "CND7353TL1" }, { bienNacional: "21116", serial: "MXL7330DMJ" }, { bienNacional: "20071", serial: "MXJ702079R" }]
      },
      {
      usuario: { nombre: "Ana", apellido: "Agaton", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional cuarto 11" },
      equipos: [{ bienNacional: "00208", serial: "C2601930" }, { id:2040 }, { bienNacional: "021710", serial: "MXL8210G10" }, { bienNacional: "020822", serial: "MX7270DBQ" }, { bienNacional: "18521", serial: "MXJ60803S6" }, { id:2045 }, { bienNacional: "020153", serial: "CNN644622X4" }, { bienNacional: "26104", serial: "A59C6BA005759" }, { bienNacional: "26198", serial: "T9CSSYYNYYYYLLUNNJ" }, { bienNacional: "18516", serial: "CNN6181DDD" }, { id:1042 }, { id:1043 }, { bienNacional: "020149", serial: "CNN64622WQ" }, { id:93 }, { bienNacional: "26216", serial: "KBC532K10966A" }, { id:95 }, { bienNacional: "19974", serial: "382926-161" }, { bienNacional: "020771", serial: "435301-161" }, { bienNacional: "020154", serial: "382826-161" }, { bienNacional: "020767", serial: "435302-161" }, { bienNacional: "020821", serial: "435303-161" }, { bienNacional: "024735", serial: "KBAB23Q46428A" }, { bienNacional: "024729", serial: "KBAB23Q47131A" }, { id:1045 }, { id:1046 }, { bienNacional: "21719", serial: "CHN1R58979" }]
      }, 
      {
      usuario: { nombre: "Jesmin", apellido: "Sayago", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Oficina de gestión de la calidad" },
      equipos: [{ bienNacional: "26597", serial: "A000403652" }, { bienNacional: "26338", serial: "A59C6BA005413" }, { bienNacional: "024167", serial: "PUAV0953006646" }, { bienNacional: "26597", serial: "A000403652" }, { bienNacional: "26338", serial: "A59C6BA005413" }, { bienNacional: "024167", serial: "PUAV0953006646" }, { bienNacional: "28767", serial: "3CQ144C4W3" }, { bienNacional: "28760", serial: "3CQ145B9GG" }, { bienNacional: "31699", serial: "KBHC12K16753A" }, { bienNacional: "19920", serial: "B94540KGASX0VB" }, { bienNacional: "28732", serial: "CNG1476W9M" }]
      },
      {
      usuario: { nombre: "Jesmin", apellido: "Sayago", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "31835", serial: "A001332490" }, { id:986 }, { bienNacional: "31836", serial: "KBHC18K12966A" }, { id:1478 }, { id:2541 }, { id:1872 }, { bienNacional: "28764", serial: "3CQ145BCW9" }, { id:1780 }]
      },
      {
      usuario: { nombre: "Jesmin", apellido: "Sayago", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Documentación" },
      equipos: [{ bienNacional: "27616", serial: "A000679616" }, { bienNacional: "27658", serial: "C16D8BA000537" }, { bienNacional: "27617", serial: "KBD624K10942A" }, { id:2544 }, { bienNacional: "32087", serial: "CN354AQ071" }, { bienNacional: "19241", serial: "06GM26022276" }, { bienNacional: "24674", serial: "A000091965" }]
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
      equipos: [{ bienNacional: "31794", serial: "A001333877" }, { id:1091 }, { bienNacional: "31832", serial: "KBHC18K12064A" }, { id:2543 }]
      }, 
      {
      usuario: { nombre: "Leonel", apellido: "Serrano", rolId: 5, direccionNombre: "Oficina de gestión de la calidad", areaNombre: "Documentación" },
      equipos: [{ bienNacional: "26451", serial: "A000403827" }, { bienNacional: "26329", serial: "A59C6BA005865" }, { bienNacional: "26596", serial: "KBC220K11071A" }, { bienNacional: "20377", serial: "3L0629X41792" }, { bienNacional: "16901", serial: "CN441SA08Z" }]
      },
      {
      usuario: { nombre: "Maura", apellido: "Flores", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología" },
      equipos: [{ bienNacional: "29852", serial: "CNG1466991" }, { bienNacional: "27873", serial: "C16D8BA000524" }, { id:67 }, { id:1482 }, { bienNacional: "02086", serial: "3L0651X26586" }]
      },  
      {
      usuario: { nombre: "Ingrid", apellido: "Osorio", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología (área de analista)" },
      equipos: [{ bienNacional: "29868", serial: "CNG1476VS7" }, { bienNacional: "29840", serial: "3CQ145BCZB" }, { bienNacional: "27862", serial: "KBD624K11236A" }, {id:1873 }, { bienNacional: "27600", serial: "13355499087" }]
      },
      {
      usuario: { nombre: "Reinaly", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología (área de analista)" },
      equipos: [{ bienNacional: "26225", serial: "A000403940" }, { bienNacional: "26133", serial: "A59C6BA008042" }, { bienNacional: "26224", serial: "KBC220K12601A" }, { id:2556 }]
      },
      {
      usuario: { nombre: "Elizabeth", apellido: "Peña", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos, cosméticos, productos médicos y otras tecnologías", areaNombre: "División de microbiología y parasitología" },
      equipos: [{ bienNacional: "31833", serial: "A001333650" }, { id:1004 }, { bienNacional: "31834", serial: "KBHC18J13001A" }, { bienNacional: "020834", serial: "070527-1290916" }, { bienNacional: "021517", serial: "21THR11440" }]
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
      equipos: [{ bienNacional: "27861", serial: "A000679634" }, { bienNacional: "29845", serial: "3CQ143CDZT" }, { id:71 }, { bienNacional: "27599", serial: "13355499089" }, { bienNacional: "27874", serial: "C16D8BA000450" }, { bienNacional: "020792", serial: "MXL7231GON" }, {id:1483 }]
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
      equipos: [{ bienNacional: "24736", serial: "A000092063" }, { bienNacional: "24740", serial: "778ACBA015017" }, { bienNacional: "26236", serial: "KBC521K12054A" }, { id:2559 }, { bienNacional: "16908", serial: "CL445T0687" }, { bienNacional: "18941", serial: "061635010035" }]
      },
      {
      usuario: { nombre: "Daimar", apellido: "Pacheco", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
      equipos: [{ bienNacional: "31913", serial: "A001336179" }, { id:1019 }, { id:80 }]
      },
      {
      usuario: { nombre: "Amarilis", apellido: "Aguilera", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
      equipos: [{ bienNacional: "26207", serial: "A000403925" }, { bienNacional: "26127", serial: "A59C6BA005810" }, { bienNacional: "26206", serial: "KBC220K12730A" }, { bienNacional: "27394", serial: "13355499896" }]
      }, 
      {
      usuario: { nombre: "Deyanira", apellido: "Guille", rolId: 5, direccionNombre: "Regulación", areaNombre: "Laboratorio nacional" },
      equipos: [{ bienNacional: "31911", serial: "A001336192" }, { id:1022 }, { id:83 }, { bienNacional: "020865", serial: "070527-1291860" }]
      }, 
      {
      usuario: { nombre: "Mirta", apellido: "Puente", rolId: 5, direccionNombre: "Regulación", areaNombre: "Vigilancia sanitaria" },
      equipos: [{ bienNacional: "020788", serial: "MXL7270D99" }, { bienNacional: "02790", serial: "MXL7270DB7" }, { bienNacional: "020804", serial: "MXL7270D96" }, { bienNacional: "020786", serial: "MXL72507MR" }, { bienNacional: "020758", serial: "MXL7270DBD" }, { bienNacional: "020764", serial: "MXL7270D9N" }, { bienNacional: "024180", serial: "MXL0050TXS" }, { bienNacional: "19930", serial: "MXJ702079Q" }, { bienNacional: "020677", serial: "CNN7241B2" }, { bienNacional: "024686", serial: "778ACBA015047" }, { bienNacional: "020666", serial: "CNN72418ZQ" }, { bienNacional: "020680", serial: "CNN72419GJ" }, { bienNacional: "020757", serial: "BC3370BGAUH0C7" }, { bienNacional: "27643", serial: "KBD624K10907A" }, { bienNacional: "024658", serial: "KBAB23Q47080A" }, { bienNacional: "19932", serial: "B94540KGASX0U0A" }, { bienNacional: "19933", serial: "3L0651X2656" }, { id:2572 }, { id:1860 }]
      },

      //Piso 2
      {
      usuario: { nombre: "Ana", apellido: "Franca", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "28959", serial: "CNG1476Q9C" }, { bienNacional: "28960", serial: "3CQ144D9HY" }, { bienNacional: "20733", serial: "BC3370BVBUH0WQ" }, { id:1598 }]
      },
      {
      usuario: { nombre: "Alfredo", apellido: "Perozo", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Comunicaciones" },
      equipos: [{ bienNacional: "29756", serial: "CNG1476Q4B" }, { bienNacional: "29189", serial: "3CQ144C9LH" }, { bienNacional: "024171", serial: "PUAV1001009493" }, { bienNacional: "27456", serial: "13355496414" }]
      },
      {
      usuario: { nombre: "Ana", apellido: "Pelay", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "27837", serial: "A000976711" }, { bienNacional: "29188", serial: "3CQ143CF33" }, { bienNacional: "31375", serial: "65818882894" }, { id:2}, { bienNacional: "27486", serial: "13355498320" }]
      }, 
      {
      usuario: { nombre: "Aramis", apellido: "Silva", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Cooperación técnica" },
      equipos: [{ bienNacional: "29224", serial: "CNG1476WL0" }, { bienNacional: "29186", serial: "3CQ145BCZX" }, { bienNacional: "16072", serial: "C0403112523" }, { bienNacional: "27442", serial: "13255499945" }]
      },
      {
      usuario: { nombre: "Beatriz", apellido: "Mosqueda", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Comunicaciones" },
      equipos: [{ bienNacional: "29222", serial: "CNG1476WY5" }, { bienNacional: "29195", serial: "3CQ144D7D4" }, { bienNacional: "020190", serial: "B94540KGASX0W5" }, { id:641 }]
      },
      {
      usuario: { nombre: "Angely", apellido: "Nieves", rolId: 5, direccionNombre: "Desarrollo", areaNombre: "Patología" },
      equipos: [{ bienNacional: "29204", serial: "CNG1476QFK" }, { bienNacional: "29180", serial: "3CQ144DCM8" }, { id:176 }, { id:1485 }]
      },
      {
      usuario: { nombre: "Carlos", apellido: "Suarez", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ bienNacional: "24724", serial: "A000092051" }, { bienNacional: "17434", serial: "MJ15H4JXA22529H" }, { id:205 }, { id:679 }, { bienNacional: "5645", serial: "18364123" }]
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
      equipos: [{ bienNacional: "29220", serial: "CNG1476V7Z" }, { bienNacional: "29553", serial: "3CQ144C4N0" }, { id:203 }, { bienNacional: "27473", serial: "13355496278" }]
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
      equipos: [{ bienNacional: "31672", serial: "A001332787" }, { bienNacional: "30377", serial: "D72E6BA00678" }, { bienNacional: "31671", serial: "KBHC12K16681A" }, { bienNacional: "27485", serial: "13355498330" }, { bienNacional: "18931", serial: "061635009989" }, { id:1875 }, { id:1540 }]
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
      equipos: [{ bienNacional: "31682", serial: "A001332796" }, { id:1095 }, { bienNacional: "31681", serial: "KBHC12K16653A" }, { id:1619 }]
      },
      {
      usuario: { nombre: "Franklin", apellido: "Garaban", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Consultor jurídico" },
      equipos: [{ bienNacional: "26253", serial: "A000403806" }, { bienNacional: "024783", serial: "778ACBA015002" }, { id:168 }, { bienNacional: "30089", serial: "212079001005345" }, { bienNacional: "30073", serial: "VNB6Z07937" }]
      },
      {
      usuario: { nombre: "Fatima", apellido: "Torrico", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "División de reacciones adversas de medicamentos" },
      equipos: [{ bienNacional: "27825", serial: "A000679732" }, { bienNacional: "27718", serial: "C16D8BA000540" }, { bienNacional: "25132", serial: "WE1692042372" }, { bienNacional: "16193", serial: "8231691243" }, { id:1881 }, { id:1915 }]
      },
      {
      usuario: { nombre: "Francis", apellido: "Bolivar", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ id:2148 }, { id:1151 }, { bienNacional: "16194", serial: "13234241" }, { bienNacional: "21161", serial: "MXJ702077X" }, { bienNacional: "26140", serial: "A59C8BA007373" }, { bienNacional: "21160", serial: "BC3370BVBUQ2NO" }, { bienNacional: "16457", serial: "6546553453" }, { id:2150 }, { bienNacional: "16076", serial: "C0403116789" }, { id:1795 }, { id:1922 }]
      }, 
      {
      usuario: { nombre: "Greilis", apellido: "Ortega", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Archivo y correspondencia" },
      equipos: [{ bienNacional: "020826", serial: "MXL72405SC" }, { bienNacional: "024160", serial: "MY19H9NZ147099H" }, { bienNacional: "16094", serial: "C0403112297" }, { bienNacional: "27519", serial: "13355494908" }, { bienNacional: "020778", serial: "MXD7270DBC" }, { bienNacional: "020251", serial: "CNN6430K1T" }, { bienNacional: "19962", serial: "B94540KGASX0VM" }, { bienNacional: "27653", serial: "A000679641" }, { bienNacional: "27730", serial: "C16D8BA001990" }, { bienNacional: "27652", serial: "KBD624K10944A" }, { bienNacional: "27583", serial: "13355496081" }, { bienNacional: "29702", serial: "3CQ144DD2G" }, { bienNacional: "19279", serial: "56487653" }]
      },
      {
      usuario: { nombre: "Glenda", apellido: "Lares", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
      equipos: [{ bienNacional: "31684", serial: "A0013322799" }, { id:1097 }, { bienNacional: "31683", serial: "KBHC12K16105A" }, { bienNacional: "24049", serial: "5827700066" }]
      },
      {
      usuario: { nombre: "Glenda", apellido: "Morin", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "29212", serial: "CNG1476V0P" }, { bienNacional: "29736", serial: "3CQ144DC2C" }, { id:152 }, { bienNacional: "021323", serial: "AB073763784" }, { bienNacional: "18939", serial: "061635009998" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Gonzalez", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "31821", serial: "A001332788" }, { id:1099 }, { bienNacional: "31822", serial: "KBHK18K12963A" }, { bienNacional: "27454", serial: "13355496316" }, { bienNacional: "31493", serial: "321311321321" }, { bienNacional: "32081", serial: "2239512007225" }, { id:1101 }, { id:1102}, { id:155 }, { bienNacional: "020479", serial: "G871016BU02" }, { bienNacional: "020808", serial: "21THR00688" }, { bienNacional: "31694", serial: "A001332808" }, { id:1107 }, { bienNacional: "31695", serial: "KBHC12K16589A" }, { bienNacional: "27459", serial: "13355496412" }]
      }, 
      {
      usuario: { nombre: "Ivanna", apellido: "Fonseca", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "26261", serial: "A000403946" }, { bienNacional: "020665", serial: "CNN72419DK" }, { bienNacional: "27870", serial: "KBD624K10946A" }, { id:1601 }]
      },
      {
      usuario: { nombre: "Josefina", apellido: "Hernandez", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "28779", serial: "CNG1476VRF" }, { bienNacional: "024773", serial: "7779AKM5NQH4LUNNJ" }, { bienNacional: "31992", serial: "0200704666758" }]
      },
      {
      usuario: { nombre: "Josmar", apellido: "Garcia", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Cooperación técnica" },
      equipos: [{ bienNacional: "29218", serial: "CNG1466986" }, { bienNacional: "29745", serial: "3CQ144K91D" }, { id:157 }, { bienNacional: "27448", serial: "13355499938" }, { bienNacional: "123456", serial: "2141500002594" }]
      },
      {
      usuario: { nombre: "Judith", apellido: "Luces", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Despacho" },
      equipos: [{ bienNacional: "26101", serial: "A000403956" }, { bienNacional: "020080", serial: "CNN64622R6" }, { bienNacional: "024784", serial: "KBAB26Q43227A" }, { bienNacional: "05121", serial: "RP11300040" }, { bienNacional: "19284", serial: "13213231" }, { bienNacional: "29238", serial: "CNG1476VPJ" }, { bienNacional: "020185", serial: "CNN6430HZ4" }, { id:163 }, { bienNacional: "18929", serial: "061635013788" }, { bienNacional: "26245", serial: "A000403849" }, { bienNacional: "19927", serial: "CNN6430HTE" }, { bienNacional: "14244", serial: "3892C595" }, { bienNacional: "05388", serial: "248038" }]
      },
      {
      usuario: { nombre: "Ingrid", apellido: "Araque", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Consultor jurídico" },
      equipos: [{ bienNacional: "020730", serial: "MXL7270D9R" }, { bienNacional: "26125", serial: "A59C6BA005805" }, { id:169 }, { bienNacional: "18904", serial: "06021-1200917" }]
      },
      {
      usuario: { nombre: "Jessica", apellido: "Vivas", rolId: 5, direccionNombre: "Producción", areaNombre: "Dirección de biotecnología y desarrollo" },
      equipos: [{ bienNacional: "31915", serial: "M242023220150" }, { id:1130 }, { id:183}, { bienNacional: "27588", serial: "13355496075" }, { bienNacional: "27431", serial: "13355498913" }, { bienNacional: "27555", serial: "13355498279" }]
      },
      {
      usuario: { nombre: "Jesus", apellido: "Torres", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica", areaNombre: "División de bacteriología (Laboratorio de enfermedades zoonóticas y metaxénicas bacterianas LEZMB)" },
      equipos: [{ bienNacional: "27778", serial: "A000679768" }, { bienNacional: "27761", serial: "C16D8BA001992" }, { bienNacional: "27779", serial: "KBD624K10970A" }, { bienNacional: "14193", serial: "1902880" }, { id:1884 }]
      }, 
      {
      usuario: { nombre: "Kirsey", apellido: "Heriguez", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "27820", serial: "A000679569" }, { bienNacional: "27844", serial: "C16D8BA000510" }, { bienNacional: "020727", serial: "BC3370BVBUECVC" }, { id:1602 }]
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
      equipos: [{ bienNacional: "25987", serial: "A000403931" }, { bienNacional: "26202", serial: "A59C6BA005767" }, { id:206 }, { bienNacional: "34", serial: "C11893485" }]
      },
      {
      usuario: { nombre: "Maria", apellido: "Aguilar", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "27869", serial: "A000679356" }, { bienNacional: "26113", serial: "C0BB5090T080E011" }, { bienNacional: "26260", serial: "KBC220K12677A" }, { bienNacional: "19028", serial: "6534342323" }, { bienNacional: "27418", serial: "13355499105" }]
      },
      {
      usuario: { nombre: "Maria", apellido: "Afanador", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
      equipos: [{ bienNacional: "28736", serial: "CNG1476PVG" }, { bienNacional: "28752", serial: "3CQ144C2G3" }, { bienNacional: "20759", serial: "BC3370BVBUEDHD" }, { bienNacional: "27528", serial: "13355496087" }]
      },
      {
      usuario: { nombre: "Marianela", apellido: "Padrino", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
      equipos: [{ bienNacional: "25985", serial: "A000403877" }, { bienNacional: "26141", serial: "A59C6BA007397" }, { bienNacional: "27843", serial: "C16D8BA000482" }, { bienNacional: "26238", serial: "KBC220K1085A" }, { bienNacional: "24055", serial: "532523423" }]
      },
      {
      usuario: { nombre: "Maria", apellido: "Rojas", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
      equipos: [{ bienNacional: "26259", serial: "A000403919" }, { bienNacional: "24151", serial: "MY19H9NZ125631V" }, { bienNacional: "20799", serial: "BK3370BVBUMK0" }, { id:1622 }]
      },
      {
      usuario: { nombre: "Maribel", apellido: "Rengel", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Consultor jurídico" },
      equipos: [{ bienNacional: "024654", serial: "A000091954" }, { bienNacional: "26126", serial: "A59C6BA005809" }, { bienNacional: "26270", serial: "KBC525K10339A" }, { bienNacional: "30090", serial: "212079001005347" }]
      },
      {
      usuario: { nombre: "Maria Eugenia", apellido: "Parada", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "División de reacciones adversas de medicamentos" },
      equipos: [{ bienNacional: "27827", serial: "A000679701" }, { bienNacional: "27848", serial: "C16D8BA000539" }, { bienNacional: "27838", serial: "KBD624K10844A" }, { bienNacional: "18907", serial: "61635010038" }, { bienNacional: "17850", serial: "KL0441120622" }, { id:1882 }, { bienNacional: "28848", serial: "213124234" }, { bienNacional: "28787", serial: "0301100335953" }, { bienNacional: "28788", serial: "0301100335953" }, { bienNacional: "28785", serial: "0301100335953" }, { bienNacional: "28786", serial: "0301100335953" }, { bienNacional: "28789", serial: "0301100335953" }, { bienNacional: "28846", serial: "2345234234" }, { bienNacional: "28847", serial: "65344353" }]
      },
      {
      usuario: { nombre: "Magaly", apellido: "Parra", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Departamento de gestión de sistema" },
      equipos: [{ id:2153 }, { bienNacional: "26121", serial: "A59C6BA005815" }, { bienNacional: "24157", serial: "MY19H9NZ125705X" }, { bienNacional: "26264", serial: "KBC521K12777A" }, { bienNacional: "27490", serial: "13355499225" }, { bienNacional: "24042", serial: "090701-0660" }]
      },
      {
      usuario: { nombre: "Mabel", apellido: "Padron", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Departamento de gestión de sistema" },
      equipos: [{ bienNacional: "27835", serial: "A000679749" }, { bienNacional: "24786", serial: "778ACBA015013" }, { bienNacional: "27839", serial: "C16D8BA000465" }, { bienNacional: "27836", serial: "KBD524K10868A" }, { bienNacional: "27421", serial: "3214121312" }]
      },
      {
      usuario: { nombre: "Mireya", apellido: "Piñate", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "29226", serial: "CNG147WX8" }, { bienNacional: "29706", serial: "3CQ144C4C5" }, { bienNacional: "19940", serial: "B94540KGASX0T9" }, { bienNacional: "17851", serial: "KL0441120595" }]
      },
      {
      usuario: { nombre: "Mayra", apellido: "Blanco", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "31674", serial: "A0001333647" }, { id:1058 }, { bienNacional: "31673", serial: "KBHC12K12665A" }, { id:1598 }, { bienNacional: "020887", serial: "5827700040" }, { bienNacional: "32086", serial: "433423123" }, { bienNacional: "26134", serial: "A59C6BA007366" }, { bienNacional: "27909", serial: "C16D8BA001977" }, { bienNacional: "020717", serial: "CNN72418Z6" }, { bienNacional: "021312", serial: "HA17HVBQ116066R" }, { id:1069}, { bienNacional: "020725", serial: "BC3370BGAUI1HW" }, { bienNacional: "27819", serial: "KBD624K10826A" }, { bienNacional: "020723", serial: "BC3370BVBUEAF5" }, { bienNacional: "020731", serial: "BC3370BVBUEDIP" }, { bienNacional: "29691", serial: "CNG1476PSN" }, { bienNacional: "26227", serial: "A000403938" }, { bienNacional: "07618", serial: "NTH83827" }, { bienNacional: "31675", serial: "KBHC18K12108A" }, { bienNacional: "020729", serial: "BC3370BVBUMJZ0" }]
      },
      {
      usuario: { nombre: "Morella", apellido: "Maristany", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "31618", serial: "A001332793" }, { id:1063 }, { bienNacional: "31677", serial: "KBHC12K16740A" }, { bienNacional: "17854", serial: "KL0441125383" }, { bienNacional: "32086", serial: "433423123" }]
      },
      {
      usuario: { nombre: "Morelly", apellido: "Lopez", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Departamento de manejo e integración de resultados" },
      equipos: [{ bienNacional: "26255", serial: "A000403934" }, { bienNacional: "29605", serial: "3CQ143CDP6" }, { id:128 }, { id:1878 }, { bienNacional: "19030", serial: "76463452342" }, { bienNacional: "020253", serial: "3L0651X26698" }]
      },
      {
      usuario: { nombre: "Marlis", apellido: "Nuñez", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Departamento de manejo e integración de resultados" },
      equipos: [{ bienNacional: "31676", serial: "A0001333639" }, { id:1075 }, { id:132 }, { id:1879 }, { id:1608 }, { bienNacional: "19019", serial: "32131231231" }, { bienNacional: "32082", serial: "CNCRQDN4D9" }]
      },
      {
      usuario: { nombre: "Milagros", apellido: "Hernandez", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Archivo y correspondencia" },
      equipos: [{ bienNacional: "27687", serial: "A000679766" }, { bienNacional: "27662", serial: "C16D8BA001981" }, { bienNacional: "31376", serial: "0065818882405" }, { bienNacional: "024146", serial: "0906220662862" }, { bienNacional: "19033", serial: "3424234352" }, { bienNacional: "31541", serial: "TW1CVB6065" }]
      },
      {
      usuario: { nombre: "Marisol", apellido: "Luis", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
      equipos: [{ bienNacional: "27833", serial: "A000679611" }, { bienNacional: "29713", serial: "3CQ143B1FG" }, { bienNacional: "24163", serial: "PUAV1001009212" }, { bienNacional: "27504", serial: "13355496201" }]
      },
      {
      usuario: { nombre: "Marilyn", apellido: "Laguado", rolId: 5, direccionNombre: "Oficina de relaciones interinstitucionales y comunicaciones", areaNombre: "Comunicaciones" },
      equipos: [{ bienNacional: "31809", serial: "A001333917" }, { id:1108 }, { bienNacional: "31810", serial: "KBHC12K12926A" }, { bienNacional: "321214", serial: "RP11299357" }]
      },
      {
      usuario: { nombre: "Marwan", apellido: "Aguilar", rolId: 5, direccionNombre: "Producción", areaNombre: "Biotecnología y desarrollo" },
      equipos: [{ id:2124 }, { id:1125 }, { id:178 }, { bienNacional: "20280", serial: "382926-161" }, { bienNacional: "18509", serial: "CNN6181CDJ" }, { bienNacional: "27554", serial: "13355498281" }, { bienNacional: "31901", serial: "M242023220169" }, { id:1129 }, { id:182 }]
      },
      {
      usuario: { nombre: "Marta", apellido: "Bravo", rolId: 5, direccionNombre: "Producción", areaNombre: "Dirección de biotecnología y desarrollo" },
      equipos: [{ bienNacional: "31923", serial: "M242023220149" }, { id:1127 }, { id:180 }, { bienNacional: "30085", serial: "212079001008318" }, { bienNacional: "19226", serial: "243143242342" }, { bienNacional: "32093", serial: "L3N0CV04T97112A" }, { bienNacional: "32094", serial: "L6N0CV188748266" }, { bienNacional: "32095", serial: "L3N0CV04T93112C" }]
      },
      {
      usuario: { nombre: "Marta", apellido: "Cardona", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica", areaNombre: "División de bacteriología (Laboratorio de enfermedades zoonóticas y metaxénicas bacterianas LEZMB)" },
      equipos: [{ bienNacional: "27780", serial: "A000679688" }, { bienNacional: "27762", serial: "C16D8BA000477" }, { bienNacional: "27781", serial: "KBD624K14437A" }, { bienNacional: "32112312", serial: "342432423432" }, { bienNacional: "17419", serial: "C0403116971" }, { id:197 }, { bienNacional: "17418", serial: "C0403116648" }, { bienNacional: "020719", serial: "CNN724182Z1" }, { bienNacional: "023516", serial: "290409 04" }, { bienNacional: "023517", serial: "290409 95" }]
      },
      {
      usuario: { nombre: "Maritza", apellido: "Burgos", rolId: 5, direccionNombre: "Regulación sanitaria", areaNombre: "Pruebas biológicas" },
      equipos: [{ bienNacional: "24727", serial: "A000091863" }, { bienNacional: "19901", serial: "CNN64622WS" }, { bienNacional: "19944", serial: "B94540KGAX326" }, { id:1486 }, { bienNacional: "16085", serial: "MXD41808RN" }, { bienNacional: "16071", serial: "MXD41808TN" }, { bienNacional: "16087", serial: "MXD41808V3" }, { bienNacional: "20091", serial: "MXJ7020795" }, { bienNacional: "19946", serial: "MXJ702078V" }, { bienNacional: "26103", serial: "A000403805" }, { id:2163}, { id:2164 }, { id:2165 }, { id:1160 }, { id:1161 }, { bienNacional: "19365", serial: "CNC623PLMN" }, { bienNacional: "18668", serial: "MJ19H9NA107962T" }, { id:1164 }, { id:1165 }, { bienNacional: "21159", serial: "HA17H9NP714609Z" }, { bienNacional: "18967", serial: "HA17H9NYB24250J" }, { id:1168 }, { bienNacional: "19949", serial: "B94540KGASX32B" }, { bienNacional: "20097", serial: "B94540KGASX0V9" }, { bienNacional: "17825", serial: "ZM5527023264" }, { bienNacional: "26272", serial: "KBC521K11767A" }, { bienNacional: "11317", serial: "20639F90G3GE" }, { id:219}, { bienNacional: "19951", serial: "3L0651X26371" }, { bienNacional: "20419", serial: "CND1D01072" }]
      },
      {
      usuario: { nombre: "Oneyda", apellido: "Roman", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Museo" },
      equipos: [{ bienNacional: "020224", serial: "MXJ70207088" }, { bienNacional: "020685", serial: "CNN72419GT" }, { bienNacional: "020645", serial: "ZM7302082793" }, { id:1876 }]
      },
      {
      usuario: { nombre: "Omaira", apellido: "De Campos", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "29598", serial: "CNG1476PKR" }, { bienNacional: "29604", serial: "3CQ144C4FT" }, { bienNacional: "020218", serial: "B94540KGASX32U" }, { id:1597 }]
      },
      {
      usuario: { nombre: "Nubia", apellido: "Rodriguez", rolId: 5, direccionNombre: "Consultoría jurídica", areaNombre: "Consultor jurídico" },
      equipos: [{ bienNacional: "024785", serial: "A000091946" }, { bienNacional: "25153", serial: "A59C6BA006141" }, { bienNacional: "27323", serial: "KBD624K10883A" }, { bienNacional: "30106", serial: "212079001008319" }]
      },
      {
      usuario: { nombre: "Oscar", apellido: "Feo", rolId: 5, direccionNombre: "Producción", areaNombre: "Dirección de biotecnología y desarrollo" },
      equipos: [{ bienNacional: "31927", serial: "M242023220250" }, { id:1128 }, { id:181 }, { bienNacional: "27432", serial: "13355498911" }]
      },
      {
      usuario: { nombre: "Nuris", apellido: "Salgado", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica", areaNombre: "División de bacteriología" },
      equipos: [{ bienNacional: "27776", serial: "A000679585" }, { bienNacional: "27760", serial: "K16D8BA000486" }, { bienNacional: "27777", serial: "KBD624K14411A" }, { bienNacional: "31619", serial: "221716347187" }, { bienNacional: "021467", serial: "CNF80467YS" }, { bienNacional: "31917", serial: "A001336181" }, { id:1133 }, { id:186 }, { bienNacional: "31616", serial: "221716341396" }, { bienNacional: "26018", serial: "KBC52113205A" }, { bienNacional: "021830", serial: "KNWDF03543" }, { bienNacional: "27518", serial: "13355494909" }, { bienNacional: "27387", serial: "13355496159" }, { bienNacional: "18536", serial: "MXJ60803PB" }, { bienNacional: "020121", serial: "CNN6330K1F" }, { bienNacional: "021349", serial: "BC3370CVBUW7W0A" }, { bienNacional: "16623", serial: "MXD418090C" }, { bienNacional: "32344", serial: "CZC32170J4" }, { bienNacional: "32343", serial: "CN-08RWX5" }, { id:189}, { bienNacional: "32345", serial: "3S432X16079" }, { bienNacional: "30501", serial: "CN070176MF" }, { id:1535 }, { bienNacional: "16629", serial: "MXD41808MW" }, { bienNacional: "024695", serial: "A000092027" }, { bienNacional: "024789", serial: "77ACBA015003" }, { bienNacional: "12565", serial: "99P5381UBS15N34297S00000" }, { bienNacional: "27526", serial: "13355496092" }, { bienNacional: "08668", serial: "876657546" }, { bienNacional: "023987", serial: "3B0949X25362" }, { bienNacional: "023989", serial: "3B0949X28011" }, { bienNacional: "26019", serial: "A000403890" }, { bienNacional: "26184", serial: "A59C6BA005377" }, { bienNacional: "024694", serial: "KBAB23Q46991A" }, { bienNacional: "18945" , serial:  "321321312" }, { bienNacional: "14098", serial: "324432423" }, { bienNacional: "27782", serial: "A000679536" }, { bienNacional: "27763", serial: "16D8BA000489" }, { bienNacional: "27783", serial: "KBD624K10908A" }, { id:1884 }, { bienNacional: "16621", serial: "MXD41808V7" }, { bienNacional: "16633", serial: "MXD418094B" }, { bienNacional: "022881", serial: "HA17HVKS205883BMI" }, { bienNacional: "020706", serial: "CNN72419G7" }, { bienNacional: "19919", serial: "CNN64622S4" }, { bienNacional: "16622", serial: "C0403116622" }, { bienNacional: "16630", serial: "C0403116647" }, { bienNacional: "020646", serial: "ZM7302082790" }, { bienNacional: "26029", serial: "A000403762" }, { bienNacional: "26182", serial: "A59C6BA005291" }, { bienNacional: "26028", serial: "KBC525K10748A" }, { bienNacional: "11069", serial: "453453" }]
      }, 
      {
      usuario: { nombre: "Yelitza", apellido: "Padron", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación farmacéutica" },
      equipos: [{ bienNacional: "020283", serial: "CNN6430J8B" }, { bienNacional: "26280", serial: "KBC220K12691A" }, { bienNacional: "020911", serial: "CND1T00379" }, { bienNacional: "023643", serial: "CNDY197475" }]
      },
      {
      usuario: { nombre: "Yehnny", apellido: "Mujica", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación clínica" },
      equipos: [{ bienNacional: "26219", serial: "A000403797" }, { bienNacional: "26132", serial: "A59C6BA008037" }, { bienNacional: "26218", serial: "KBC521K11769A" }, { bienNacional: "020859", serial: "070527-1291096" }, { bienNacional: "19031", serial: "5435345345" }]
      },
      {
      usuario: { nombre: "Yelitza", apellido: "Padron", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Departamento de manejo e integración de resultados" },
      equipos: [{ bienNacional: "26247", serial: "A000403878" }, { bienNacional: "26239", serial: "A000403914" }, { bienNacional: "020700", serial: "CNN72418XT" }, { bienNacional: "29561", serial: "3CQ144DBLB" }, { bienNacional: "27824", serial: "KBD624K10906A" }, { bienNacional: "25984", serial: "KBC518K11069A" }]
      },
      {
      usuario: { nombre: "Yelitza", apellido: "Padron", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Departamento de manejo e integración de resultados" },
      equipos: [{ bienNacional: "020032", serial: "MXJ702007C2" }, { bienNacional: "31680", serial: "A001333678" }, { bienNacional: "31679", serial: "KBHC12K12669A" }, { bienNacional: "17843", serial: "KL0441120616" }, { bienNacional: "29600", serial: "CNG1476VLC" }, { bienNacional: "29610", serial: "3CQ144C2MP" }, { bienNacional: "19958", serial: "B94540AVBSX4XN" }, { bienNacional: "19965", serial: "3L0650X31211" }]
      },
      {
      usuario: { nombre: "Sindy", apellido: "Martinez", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Departamento de manejo e integración de resultados" },
      equipos: [{ bienNacional: "29588", serial: "CNG1476VHL" }, { bienNacional: "27823", serial: "A000679565" }, { bienNacional: "26151", serial: "T9CSSYNYYLLO" }, { bienNacional: "25181", serial: "ZT14H9NB908763L" }, { bienNacional: "26240", serial: "KBC518K11705A" }, { bienNacional: "27386", serial: "13355496161" }, { bienNacional: "021926", serial: "64654" }]
      },
      {
      usuario: { nombre: "Yelitza", apellido: "Padron", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "Departamento de manejo e integración de resultados" },
      equipos: [{ bienNacional: "29575", serial: "CNG1476Q8H" }, { bienNacional: "29705", serial: "3CQ144C30T" }, { bienNacional: "26144", serial: "T9CSSYNYYLLUNNJ" }, { bienNacional: "27832", serial: "KBD624K18042A" }, { bienNacional: "020893", serial: "070527-1291022" }, { bienNacional: "19023", serial: "54543344" }]
      },
      {
      usuario: { nombre: "Rafael", apellido: "Clavo", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
      equipos: [{ bienNacional: "28744", serial: "CNG1476Q0H" }, { bienNacional: "24154", serial: "MY19H9NZ125670Y" }, { bienNacional: "20797", serial: "BC3370BVBUECRS" }, { bienNacional: "24149", serial: "090622-0660201" }]
      },
      {
      usuario: { nombre: "Williams", apellido: "Medina", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
      equipos: [{ bienNacional: "28781", serial: "CNG1476VT8" }, { bienNacional: "28757", serial: "3CQ144C4W7" }, { bienNacional: "27834", serial: "KBD624K10830A" }, { bienNacional: "27525", serial: "13355496090" }]
      },
      {
      usuario: { nombre: "Yelitza", apellido: "Padron", rolId: 5, direccionNombre: "Evaluación farmacéutica", areaNombre: "Autorizaciones sanitarias" },
      equipos: [{ bienNacional: "12996", serial: "MX2336D0XH" }, { id:1792 }, { id:151 }, { bienNacional: "26099", serial: "A000403729" }]
      }, 
      {
      usuario: { nombre: "Yorgeidy", apellido: "Sayago", rolId: 5, direccionNombre: "Dirección de autorizaciones sanitarias de medicamentos", areaNombre: "División de evaluación farmacéutica" },
      equipos: [{ bienNacional: "27849", serial: "A000679642" }, { bienNacional: "27884", serial: "C16D8BA000538" }, { bienNacional: "27850", serial: "KBD634K11235A" }, { bienNacional: "024152", serial: "090622-0662859" }]
      },
      {
      usuario: { nombre: "Yorlenys", apellido: "Ruiz", rolId: 5, direccionNombre: "Dirección de centro nacional de vigilancia farmacológica", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "29565", serial: "CNG1476PNP" }, { bienNacional: "27846", serial: "C16D8BA001991" }, { bienNacional: "16444", serial: "C0403115703" }, { bienNacional: "18976", serial: "654654654654" }, { bienNacional: "16458", serial: "7675645" }]
      }, 

      //Piso 3
      {
      usuario: { nombre: "Ceciver", apellido: "Castillo", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Registro y control" },
      equipos: [{ bienNacional: "26115", serial: "A59C6BA005869" }, { bienNacional: "27695", serial: "A000679582" }, { bienNacional: "27696", serial: "KBD624K10850A" }, { bienNacional: "31621", serial: "22171634719" }, { bienNacional: "26987", serial: "21325240" }]
      },
      {
      usuario: { nombre: "Hilda", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Biblioteca" },
      equipos: [{ bienNacional: "25818", serial: "MXL21415YX" }, { bienNacional: "20033", serial: "CNN6430GS0" }, { bienNacional: "25134", serial: "WE1692042380" }, { bienNacional: "25816", serial: "CNG9D211NN" }, { bienNacional: "20132", serial: "MXJ70207CK" }, { bienNacional: "29758", serial: "CNG1476WBG" }, { bienNacional: "021227", serial: "HA17H9NP713551A" }, { bienNacional: "5048121", serial: "KBE915K10900A" }, { bienNacional: "020273", serial: "342423432423" }, { bienNacional: "16472", serial: "MXD418092N" }, { bienNacional: "020092", serial: "CNN6430J7L" }, { bienNacional: "25928", serial: "2547035" }, { bienNacional: "020266", serial: "MXJ702076T" }, { bienNacional: "028584", serial: "110228A10018SP0125" }, { id:318 }]
      },
      {
      usuario: { nombre: "Hilda", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Unidad imprenta y reproducción" },
      equipos: [{ id:2269 }]
      },
      {
      usuario: { nombre: "Wilmary", apellido: "Aponte", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Coordinación de nómina" },
      equipos: [{ bienNacional: "31700", serial: "A001332799" }, { id:1235}, { bienNacional: "27337", serial: "KBD624K14471A" }, { bienNacional: "32171", serial: "9L2213A00100" }]
      },
      {
      usuario: { nombre: "Adolfo", apellido: "Bastida", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Bienestar social" },
      equipos: [{ bienNacional: "20814", serial: "MXL7270D" }, { bienNacional: "27694", serial: "KBD624K10968A" }, { bienNacional: "261447", serial: "V19LW-B" }, { bienNacional: "26986", serial: "21325238" }, { bienNacional: "8807", serial: "423432432342" }]
      },
      {
      usuario: { nombre: "Aixa", apellido: "Vasquez", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Dirección de informatica" },
      equipos: [{ bienNacional: "27794", serial: "A000679533" }, { bienNacional: "29910", serial: "3CQ144C46W" }, { bienNacional: "31383", serial: "0065818882890" }, { bienNacional: "32020", serial: "230331-0560758" }, { bienNacional: "19024", serial: "42342234" }, { bienNacional: "28107", serial: "S25K342282" }]
      },
      {
      usuario: { nombre: "Alberto", apellido: "Castro", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de investigación desarrollo e innovación" },
      equipos: [{ bienNacional: "29754", serial: "CNG1476W6N" }, { bienNacional: "29740", serial: "3CQ145B9FF" }, { bienNacional: "020138", serial: "B9450KGASX349" }, { id:1895 }, { bienNacional: "27497", serial: "13355499218" }]
      },
      {
      usuario: { nombre: "Hilda", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Aula C" },
      equipos: [{ bienNacional: "30269", serial: "GSLINS02180800312847" }, { bienNacional: "31542", serial: "205RMEN8F060" }, { bienNacional: "31629", serial: "22260T2003014" }, { bienNacional: "14465", serial: "1400" }, { bienNacional: "024036", serial: "090701-0660467" }, { bienNacional: "14163", serial: "1902912" }]
      },
      {
      usuario: { nombre: "Hilda", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Aula D" },
      equipos: [{ bienNacional: "30270", serial: "GSLINS02-180800310808" }, { bienNacional: "31543", serial: "205RMUY8062" }]
      },
      {
      usuario: { nombre: "Hilda", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Aula E" },
      equipos: [{ bienNacional: "30267", serial: "GSLINS02-180800312535" }, { bienNacional: "32089", serial: "50KB534Y-Q2139VD092306718" }]
      },
      {
      usuario: { nombre: "Hilda", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Aula B" },
      equipos: [{ bienNacional: "024577", serial: "110228A1018SP0017" }, { bienNacional: "30983", serial: "GZK500L200600319" }, { id:1460 }]
      },
      {
      usuario: { nombre: "Hilda", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Campus virtual" },
      equipos: [{ bienNacional: "021229", serial: "MXL7420FHD" }, { bienNacional: "29210", serial: "CNG1476V5Z" }, { bienNacional: "30276", serial: "GNCK1HA01559" }, { bienNacional: "30982", serial: "7ZZ95AA#UUF" }, { bienNacional: "30969", serial: "212815087104" }, { bienNacional: "18927", serial: "061635013791" }, { bienNacional: "25917", serial: "VNB3S56139" }, { bienNacional: "24580", serial: "110228A10018SP0129" }, { bienNacional: "300978", serial: "GZK500L200600319" }, { bienNacional: "27453", serial: "13355499935" }]
      }, 
      {
      usuario: { nombre: "Alix", apellido: "Padron", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Clasificación y remuneración" },
      equipos: [{ bienNacional: "29685", serial: "CNG1476VQ0" }, { bienNacional: "024675", serial: "778ACBA014999" }, { bienNacional: "020118", serial: "B94540KGASX34J" }, { bienNacional: "27468", serial: "13355496283" }, { bienNacional: "16825", serial: "43243242" }, { bienNacional: "26992", serial: "21320073" }]
      },
      {
      usuario: { nombre: "Amarilis", apellido: "Albornoz", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Bienestar social" },
      equipos: [{ bienNacional: "24648", serial: "A000091887" }, { bienNacional: "18539", serial: "B93CB0ACPSLB93" }, { bienNacional: "26146", serial: "C0BB5090T08E011" }, { bienNacional: "27727", serial: "C16D8BA000481" }, { bienNacional: "22615", serial: "22615" }]
      },
      {
      usuario: { nombre: "Ana", apellido: "Estraño", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "27906", serial: "A0009679681" }, { bienNacional: "28769", serial: "3CQ145BCD5" }, { bienNacional: "25147", serial: "WE1691008568" }, { bienNacional: "16686", serial: "KL0441125153" }, { id:1495}, { bienNacional: "37090052630", serial: "37090052630" }]
      },
      {
      usuario: { nombre: "Ana", apellido: "Marquez", rolId: 5, direccionNombre: "Dirección planificación y presupuesto", areaNombre: "Coordinación de presupuesto" },
      equipos: [{ bienNacional: "27638", serial: "A000679719" }, { bienNacional: "27676", serial: "C16D8BA000503" }, { bienNacional: "27647", serial: "KBD624K14482A" }, { bienNacional: "16742", serial: "3243242" }]
      },
      {
      usuario: { nombre: "Andreina", apellido: "Ibarra", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Bienestar social" },
      equipos: [{ bienNacional: "29789", serial: "CNG1476W89" }, { bienNacional: "20743", serial: "BC3370B" }, { bienNacional: "29822", serial: "XL877A" }, { bienNacional: "19917", serial: "65542354" }]
      },
      {
      usuario: { nombre: "Angel", apellido: "Nuñez", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Contabilidad" },
      equipos: [{ bienNacional: "29779", serial: "CNG1476W0X" }, { bienNacional: "25813", serial: "ZUHJHTKC401180P" }, { bienNacional: "20349", serial: "B945KGASX33A" }, { bienNacional: "16684", serial: "32354345" }, { id:1499 }, { bienNacional: "28106", serial: "S25K342817" }]
      },
      {
      usuario: { nombre: "Angel", apellido: "Rivas", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de infraestructura" },
      equipos: [{ bienNacional: "27900", serial: "A000679654" }, { bienNacional: "27880", serial: "C16D8BA000534" }, { bienNacional: "020356", serial: "B94540KGASX0VU" }, { bienNacional: "27842", serial: "13355498332" }, { bienNacional: "27329", serial: "C16D8BA000973" }, { bienNacional: "30460", serial: "7591186002016" }]
      },
      {
      usuario: { nombre: "Antonio", apellido: "Quintana", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Seguridad Industrial" },
      equipos: [{ bienNacional: "27707", serial: "A000679644" }, { bienNacional: "27674", serial: "C0BB809150000105" }, { bienNacional: "27708", serial: "C090N0E02000000J" }, { bienNacional: "30100", serial: "212079001008312" }]
      }, 
      {
      usuario: { nombre: "Betzaida", apellido: "Ramos", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Coordinación de nómina" },
      equipos: [{ bienNacional: "27691", serial: "A000679736" }, { bienNacional: "27726", serial: "C16D8BA000460" }, { bienNacional: "27668", serial: "C16D8BA000514" }, { bienNacional: "27692", serial: "KBD624K14530A" }, { bienNacional: "020353", serial: "3L0651X29540" }, { bienNacional: "20130625007985", serial: "20130625007985" }]
      },
      {
      usuario: { nombre: "Breiner", apellido: "Lopez", rolId: 5, direccionNombre: "Dirección planificación y presupuesto", areaNombre: "Coordinación de planificación" },
      equipos: [{ bienNacional: "024639", serial: "A000092072" }, { bienNacional: "27672", serial: "C16D8BA000638" }, { bienNacional: "27629", serial: "KBD624K14417A" }, { id:138 }]
      },
      {
      usuario: { nombre: "Carlos", apellido: "Aponte", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de investigación desarrollo e innovación" },
      equipos: [{ bienNacional: "29768", serial: "CNG1466952" }, { bienNacional: "29742", serial: "3CQ143CDNV" }, { bienNacional: "25924", serial: "2827458" }, { bienNacional: "020135", serial: "3L0651X26223" }, { bienNacional: "CN16N1C33F", serial: "CN16N1C33F" }]
      },
      {
      usuario: { nombre: "Carlos", apellido: "Chirinos", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de infraestructura" },
      equipos: [{ bienNacional: "31704", serial: "A001333657" }, { id:1208 }, { id:1209 }, { bienNacional: "31612", serial: "221716341399" }]
      },
      {
      usuario: { nombre: "Carlos", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de docencia" },
      equipos: [{ bienNacional: "29772", serial: "CNG1476PXV" }, { bienNacional: "29739", serial: "3CQ143CF399" }, { id:459 }, { bienNacional: "27505", serial: "13355496199" }]
      },
      {
      usuario: { nombre: "Celina", apellido: "Lopez", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Dirección" },
      equipos: [{ id:2235 }, { bienNacional: "27912", serial: "C16D8BA000542" }, { bienNacional: "16466", serial: "C0403115184" }, { bienNacional: "14159", serial: "1902907" }, { bienNacional: "SM01000320002913", serial: "SM01000320002913" }, { id:1496 }, { bienNacional: "30991", serial: "AX5PRO865047040665577" }, { bienNacional: "23712", serial: "CNGSC05144" }, { bienNacional: "22452", serial: "21 THR17333" }]
      },
      {
      usuario: { nombre: "Cesar", apellido: "Barreto", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Coordinación de nómina" },
      equipos: [{ bienNacional: "31698", serial: "A001332576" }, { id:1233 }, { bienNacional: "020117", serial: "CNN64622RQ" }, { bienNacional: "020296", serial: "B94540AVBSX4Y0" }, { bienNacional: "32161", serial: "9L2204A027713" }, { bienNacional: "26991", serial: "21320072" }, { bienNacional: "31701", serial: "KBHC12K16993A" }, { id:1491 }]
      }, 
      {
      usuario: { nombre: "Danny", apellido: "Hernandez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Campus virtual" },
      equipos: [{ bienNacional: "24591", serial: "010228A10018SP0007" }, { bienNacional: "5048120", serial: "KBE901K12045A" }]
      },
      {
      usuario: { nombre: "Diego", apellido: "Gomez", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de programación y base de datos" },
      equipos: [{ bienNacional: "27310", serial: "A000679769" }, { bienNacional: "27661", serial: "C16D8BA000451" }, { bienNacional: "26159", serial: "A59C6BA007363" }, { bienNacional: "20014", serial: "B94540AVBSX4WM" }, { bienNacional: "27417", serial: "13355499166" }]
      },
      {
      usuario: { nombre: "Domingo", apellido: "Rivero", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Bienestar social" },
      equipos: [{ bienNacional: "20744", serial: "MXL7270D93" }, { bienNacional: "024646", serial: "KBAB16Q" }, { bienNacional: "26175", serial: "3423423" }]
      },
      {
      usuario: { nombre: "Dora", apellido: "Perez", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Auditoría interna" },
      equipos: [{ bienNacional: "26097", serial: "A000403893" }, { bienNacional: "25170", serial: "ZT14H9N908762V" }, { bienNacional: "26084", serial: "C090M0E02020000H" }, { bienNacional: "30097", serial: "2079001005342" }]
      },
      {
      usuario: { nombre: "Duran", apellido: "Gerardor", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Auditoría interna" },
      equipos: [{ bienNacional: "26087", serial: "A000403826" }, { bienNacional: "024595", serial: "12321312321" }, { bienNacional: "26155", serial: "V19LW-B" }, { bienNacional: "26086", serial: "KBC52K10199A" }, { bienNacional: "30088", serial: "2120770010" }, { bienNacional: "30092", serial: "2120770010" }, { bienNacional: "19053", serial: "2346324" }]
      },
      {
      usuario: { nombre: "Edgar", apellido: "Mejias", rolId: 5, direccionNombre: "Junta revisora", areaNombre: "No posee" },
      equipos: [{ bienNacional: "29795", serial: "CNG1476TRY" }, { bienNacional: "29190", serial: "3CQ144C32M" }, { bienNacional: "27311", serial: "KBD624K14477A" }, { bienNacional: "CZ284A", serial: "CZ284A" }]
      },
      {
      usuario: { nombre: "Esmirin", apellido: "Cordova", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "27304", serial: "A000679764" }, { bienNacional: "29008", serial: "3CQ143CF36" }, { bienNacional: "26066", serial: "KBC518K11068A" }, { bienNacional: "024048", serial: "090701-0660059" }, { bienNacional: "18913", serial: "061635010306" }, { id:1887 }]
      },
      {
      usuario: { nombre: "Fabiola", apellido: "Figuera", rolId: 5, direccionNombre: "Dirección planificación y presupuesto", areaNombre: "Dirección planificación y presupuesto" },
      equipos: [{ bienNacional: "27634", serial: "A000679668" }, { bienNacional: "27663", serial: "C16D8BA000527" }, { bienNacional: "27635", serial: "KBD624K14552A" }]
      },
      {
      usuario: { nombre: "Felicita", apellido: "Ortez", rolId: 5, direccionNombre: "Dirección planificación y presupuesto", areaNombre: "Coordinación de organización" },
      equipos: [{ bienNacional: "024642", serial: "A000091971" }, { bienNacional: "024644", serial: "C012Y09000000000" }, { bienNacional: "31379", serial: "0065818882406" }, { bienNacional: "020369", serial: "5765445" }]
      },
      {
      usuario: { nombre: "Felix", apellido: "Quiariena", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Auditoría interna" },
      equipos: [{ bienNacional: "27705", serial: "A000679555" }, { bienNacional: "024752", serial: "C0B2Y09000000000" }, { bienNacional: "16380", serial: "C0403116640" }, { bienNacional: "27399", serial: "13355499890" }]
      }, 
      {
      usuario: { nombre: "Gabriel", apellido: "Vegas", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de infraestructura" },
      equipos: [{ bienNacional: "31817", serial: "A001332822" }, { bienNacional: "27913", serial: "C16D8BA000473" }, { id:1203  }, { bienNacional: "27860", serial: "KBD624K14413A" }, { bienNacional: "27430", serial: "13355499094" }, { bienNacional: "021944", serial: "641063190" }]
      },
      {
      usuario: { nombre: "Gabriela", apellido: "Gomez", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Contabilidad" },
      equipos: [{ id:2245 }, { bienNacional: "20355", serial: "CNN64623KQ" }, { bienNacional: "021353", serial: "BC3370CVBUW92B" }, { bienNacional: "23313", serial: "22171634722" }]
      },
      {
      usuario: { nombre: "Gerardo", apellido: "Duran", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Auditoría interna" },
      equipos: [{ bienNacional: "021589", serial: "CN5CUSR0F6" }, { bienNacional: "29232", serial: "CNG1476WV8" }, { bienNacional: "18843", serial: "BN96-02331D" }, { bienNacional: "277000", serial: "KBD624K10886A" }, { bienNacional: "30087", serial: "212090010" }, { bienNacional: "021356", serial: "MXL7500HYB" }, { bienNacional: "30091", serial: "1005344" }, { id:1641}, { bienNacional: "18894", serial: "MXJ64000DS" }, { bienNacional: "27722", serial: "C16D8BA000487" }, { bienNacional: "18897", serial: "B93CB0ADPTGDGX" }, { bienNacional: "020707", serial: "CNN72418YT" }, { bienNacional: "29197", serial: "3CQ144C4WV" }, { bienNacional: "020681", serial: "CNN72419DV" }, { bienNacional: "16670", serial: "2M5327085976" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Rangel", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Reclutamiento y selección" },
      equipos: [{ id:1229 }, { bienNacional: "26071", serial: "A000403745" }, { bienNacional: "22218", serial: "ZCA638400935" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Sanchez (Dirección)", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "26095", serial: "A000403874" }, { bienNacional: "26186", serial: "A59C6BA005303" }, { bienNacional: "27907", serial: "KBD624K10945A" }, { bienNacional: "32140", serial: "91212404506459" }, { id:1493 }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Sanchez (Tesorería)", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Tesorería" },
      equipos: [{ bienNacional: "29866", serial: "CNG1476W22" }, { bienNacional: "020125", serial: "CNN6430J7P" }, { bienNacional: "26044", serial: "KBC220K12724A" }, { bienNacional: "27376", serial: "13355495295" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Sanchez (Uso Común)", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Tesorería" },
      equipos: [{ bienNacional: "28768", serial: "3CQ145BCMD" }, { bienNacional: "29798", serial: "21321312321" }, { bienNacional: "24746", serial: "A000092058" }, { bienNacional: "27365", serial: "L1911B" }, { bienNacional: "28775", serial: "CNG1476P86" }]
      },
      {
      usuario: { nombre: "Graciela", apellido: "Torres", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Coordinación de compras" },
      equipos: [{ bienNacional: "26077", serial: "A000403913" }, { bienNacional: "29816", serial: "3CQ144C4MB" }, { bienNacional: "26088", serial: "HBC521K10613A" }, { bienNacional: "31626", serial: "221716347192" }, { bienNacional: "28097", serial: "20201191" }]
      },
      {
      usuario: { nombre: "Greisi", apellido: "Zapata", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Bienestar social" },
      equipos: [{ bienNacional: "27693", serial: "A000679759" }, { bienNacional: "260772", serial: "CO90M0E02020000H" }, { bienNacional: "20375", serial: "CNN64623KL" }, { bienNacional: "27578", serial: "13355496317" }, { bienNacional: "27572", serial: "13355496172" }]
      },
      {
      usuario: { nombre: "Gretty", apellido: "Mellado", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Registro y control" },
      equipos: [{ id:1224 }, { bienNacional: "31841", serial: "A001332824" }, { bienNacional: "31842", serial: "KBHC12K16991A" }, { bienNacional: "27410", serial: "13355499173" }, { bienNacional: "26985", serial: "21325242" }, { bienNacional: "06GM26022313", serial: "06GM26022313" }]
      },
      {
      usuario: { nombre: "Hector", apellido: "Parcero", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Coordinación de compras" },
      equipos: [{ bienNacional: "28823", serial: "CNG1476PDT" }, { bienNacional: "28756", serial: "3CQ143CF02" }, { bienNacional: "26252", serial: "KBC518K11070A" }, { bienNacional: "31620", serial: "221716347191" }, { bienNacional: "17626", serial: "Q2007685" }, { bienNacional: "06GM26222292", serial: "06GM26222292" }, { bienNacional: "020413", serial: "CNB1B01141" }, { bienNacional: "31985", serial: "JX5AAN3003636" }]
      },
      {
      usuario: { nombre: "Irma", apellido: "Gomez", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Reclutamiento y selección" },
      equipos: [{ bienNacional: "20120", serial: "MXJ702078W" }, { bienNacional: "27732", serial: "C16D8BA000464" }, { bienNacional: "26063", serial: "A000403921" }, { bienNacional: "07N549502014", serial: "07N549502014" }]
      },
      {
      usuario: { nombre: "Isabel", apellido: "Cartaya", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Coordinación de compras" },
      equipos: [{ bienNacional: "31905", serial: "A001336199" }, { id:1253 }, { id:294 }, { bienNacional: "27545", serial: "13355496310" }]
      },
      {
      usuario: { nombre: "Isela", apellido: "Vegas", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Auditoría interna" },
      equipos: [{ bienNacional: "27685", serial: "A000679678" }, { bienNacional: "27735", serial: "C16D8BA000536" }, { id:232 }]
      },
      {
      usuario: { nombre: "Ivan", apellido: "Perez", rolId: 5, direccionNombre: "Junta revisora", areaNombre: "No posee" },
      equipos: [{ bienNacional: "24663", serial: "A000091967" }, { bienNacional: "26191", serial: "V19LW-B" }, { bienNacional: "30101", serial: "2077001021873" }]
      },
      {
      usuario: { nombre: "Ivy", apellido: "Bompeat", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Tesorería" },
      equipos: [{ bienNacional: "29797", serial: "CNG1476TXT" }, { bienNacional: "29914", serial: "3CQ144C2LS" }, { bienNacional: "25144", serial: "WE1691008578" }, { bienNacional: "14678", serial: "591451000532" }]
      }, 
      {
      usuario: { nombre: "Jose", apellido: "Bocaranada", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Unidad imprenta y reproducción" },
      equipos: [{ bienNacional: "25821", serial: "MXL21415SB" }, { bienNacional: "25916", serial: "ZT14H4LC204038E" }, { bienNacional: "020130", serial: "B94540KGASX0VO" }, { bienNacional: "0321852", serial: "123214312" }]
      },
      {
      usuario: { nombre: "Jose", apellido: "Cardenas", rolId: 1, email:"admin@gmail.com", password:"1234", direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Dirección de informatica" },
      equipos: [{ bienNacional: "31899", serial: "A001336194" }, { bienNacional: "27719", serial: "K16D8BA002035" }, { id:1189 }, { bienNacional: "31495", serial: "KA19021E000816" }, { bienNacional: "30467", serial: "101228-0402988" }, { bienNacional: "061635013784", serial: "061635013784" }, { bienNacional: "27330", serial: "C16D8BA000449" }, { bienNacional: "31891", serial: "A001336200" }, { id:1191 }]
      },
      {
      usuario: { nombre: "Jose", apellido: "Quiaro", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Biblioteca" },
      equipos: [{ bienNacional: "024590", serial: "110228A10018SP0008" }, { bienNacional: "27025", serial: "ZM2620007224" }, { bienNacional: "020131", serial: "3L0651X26235" }]
      },
      {
      usuario: { nombre: "Joselym", apellido: "Guzman", rolId: 5, direccionNombre: "Junta revisora", areaNombre: "No posee" },
      equipos: [{ bienNacional: "31907", serial: "A001336206" }, { bienNacional: "27601", serial: "13355499086" }, { bienNacional: "18925", serial: "61635010025" }, { bienNacional: "31983", serial: "CN37NB401F" }]
      },
      {
      usuario: { nombre: "Judith", apellido: "Delgado", rolId: 5, direccionNombre: "Junta revisora", areaNombre: "No posee" },
      equipos: [{ bienNacional: "31909", serial: "A001336254" }, { id:1299 }, { id:342 }, { bienNacional: "16365", serial: "2143345235" }, { bienNacional: "17007", serial: "20PT3331/55R" }]
      },
      {
      usuario: { nombre: "Judith", apellido: "Delgado (desincorporar)", rolId: 5, direccionNombre: "Junta revisora", areaNombre: "No posee" },
      equipos: [{ bienNacional: "17006", serial: "6016750" }, { bienNacional: "16783", serial: "LS15DHMEY608135L" }, { bienNacional: "19977", serial: "PX849A" }, { bienNacional: "20257", serial: "3L0651X26603" }, { bienNacional: "27605", serial: "13355499083" }, { bienNacional: "20142", serial: "3L0651X25646" }, { bienNacional: "21310", serial: "7LBWA188758" }, { bienNacional: "22794", serial: "435302-161" }, { id:344 }, { bienNacional: "13320", serial: "NUMO8107" }]
      },
      {
      usuario: { nombre: "Judith", apellido: "Delgado  (Sala de Reuniones)", rolId: 5, direccionNombre: "Junta revisora", areaNombre: "No posee" },
      equipos: [{ bienNacional: "27614", serial: "A000715711" }, { bienNacional: "82B231-240945330003317", serial: "82B231-240945330003317" }, { bienNacional: "27609", serial: "A000715629" }, { bienNacional: "82B231-240945319006047", serial: "82B231-240945319006047" }, { bienNacional: "27607", serial: "A000715770" }, { bienNacional: "82B231-240945319025432", serial: "82B231-240945319025432" }, { bienNacional: "27610", serial: "A000715674" }, { bienNacional: "82B231-240945330005903", serial: "82B231-240945330005903" }, { bienNacional: "4470811", serial: "4470811" }, { bienNacional: "31606", serial: "221716347226" }, { bienNacional: "31538", serial: "202RMCJ2Z875" }, { bienNacional: "32017", serial: "230331-0560757" }, { bienNacional: "32351", serial: "110124F39554" }, { bienNacional: "32352", serial: "22461S7003106" }, { bienNacional: "27269", serial: "PSPK2Z00563" }, { bienNacional: "31465", serial: "5626201738679" }]
      },
      {
      usuario: { nombre: "Judith", apellido: "Delgado (Sin asignar)", rolId: 5, direccionNombre: "Junta revisora", areaNombre: "No posee" },
      equipos: [{ bienNacional: "29214", serial: "CNG1476WXH" }, { bienNacional: "20143", serial: "CNN6430K1K" }, { bienNacional: "27625", serial: "KBD624K10910A" }, { bienNacional: "7111", serial: "51944" }]
      },
      {
      usuario: { nombre: "Judith", apellido: "Delgado (Transferir)", rolId: 5, direccionNombre: "Junta revisora", areaNombre: "No posee" },
      equipos: [{ id:1508 }, { bienNacional: "15749", serial: "RP11299350" }, { bienNacional: "24240", serial: "UAK498831" }, { id:345 }]
      },
      {
      usuario: { nombre: "Julio", apellido: "Vivas (Docencia)", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de docencia" },
      equipos: [{ bienNacional: "024582", serial: "110228A10018SP0103" }, { bienNacional: "020272", serial: "B94540KGASX32Z" }, { bienNacional: "29648", serial: "CNG1476VBV" }, { bienNacional: "29663", serial: "3CQ145BCMK" }, { bienNacional: "020268", serial: "B94540KGASX0VL" }, { bienNacional: "17284", serial: "06014888" }]
      },
      {
      usuario: { nombre: "Julio", apellido: "Vivas (Desarrollo e innovación)", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Desarrollo e innovación" },
      equipos: [{ bienNacional: "29766", serial: "CNG1476PT0" }, { bienNacional: "29741", serial: "3CQ144C27Z" }, { bienNacional: "16467", serial: "C0403116670" }, { bienNacional: "13074", serial: "353465" }]
      },
      {
      usuario: { nombre: "Keimmer", apellido: "Altuve", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de programación y base de datos" },
      equipos: [{ bienNacional: "27356", serial: "C16D8BA000474" }, { bienNacional: "27331", serial: "C16D8BA000463" }, { bienNacional: "31719", serial: "05726514" }, { bienNacional: "31611", serial: "221716347224" }]
      }, 
      {
      usuario: { nombre: "Keimmer", apellido: "Altuve (Jose)", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de programación y base de datos" },
      equipos: [{ bienNacional: "26079", serial: "A000403887" }, { bienNacional: "26138", serial: "A59C6BA008093" }, { bienNacional: "26212", serial: "KBC521K11765A" }]
      },
      {
      usuario: { nombre: "Keimmer", apellido: "Altuve (Carlos)", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de programación y base de datos" },
      equipos: [{ bienNacional: "26213", serial: "A000403935" }, { bienNacional: "26111", serial: "T9CSSYNYYLLUNNJ" }, { bienNacional: "30378", serial: "KBE915K13387A" }]
      },
      {
      usuario: { nombre: "Keimmer", apellido: "Altuve (Engerberth)", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de programación y base de datos" },
      equipos: [{ bienNacional: "26091", serial: "A000403766" }, { bienNacional: "26105", serial: "A59C6BA005765" }, { bienNacional: "26082", serial: "KBC525K10191A" }]
      },
      {
      usuario: { nombre: "Keimmer", apellido: "Altuve (Israel)", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de programación y base de datos" },
      equipos: [{ bienNacional: "26075", serial: "A000403761" }, { bienNacional: "26199", serial: "A59C6BA001368" }, { bienNacional: "26248", serial: "KBC220K10715A" }, { bienNacional: "27529", serial: "13355496086" }]
      },
      {
      usuario: { nombre: "Keimmer", apellido: "Altuve (Nathan)", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de programación y base de datos" },
      equipos: [{ bienNacional: "26114", serial: "A59C6BA005855" }, { bienNacional: "31705", serial: "KBHC18K13030A" }]
      }, 
      {
      usuario: { nombre: "Luisana", apellido: "Orta", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de docencia" },
      equipos: [{ bienNacional: "29679", serial: "CNG1476PYW" }, { bienNacional: "29185", serial: "3CQ144D9ZB" }, { bienNacional: "30981", serial: "GZK500L200600319" }, { bienNacional: "5048027", serial: "582770040" }]
      },
      {
      usuario: { nombre: "Luis", apellido: "Rodriguez", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Auditoría interna" },
      equipos: [{ id:2172 }, { id:1177 }, { bienNacional: "27706", serial: "C090N0E02000000J" }, { id:1633 }, { bienNacional: "27683", serial: "A000679761" }, { bienNacional: "26152", serial: "C0BB9050T080E11" }, { bienNacional: "27686", serial: "C90N0E02000000J" }]
      },
      {
      usuario: { nombre: "Luis", apellido: "Marquez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Biblioteca" },
      equipos: [{ bienNacional: "21090", serial: "MXJ72806GD" }, { bienNacional: "020663", serial: "CNN72419GV" }, { bienNacional: "44Y3462", serial: "44Y3462" }]
      },
      {
      usuario: { nombre: "Luis", apellido: "Castañeda", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Reclutamiento y selección" },
      equipos: [{ bienNacional: "26170", serial: "C0BB5090T08E811" }, { bienNacional: "26679", serial: "A000679685" }, { bienNacional: "27680", serial: "KBD624K10BB4A" }, { id:1657 }]
      },
      {
      usuario: { nombre: "Liz", apellido: "Dosramos", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "24751", serial: "A000091972" }, { bienNacional: "26189", serial: "A59C6BA005273" }, { bienNacional: "16803", serial: "C0403116957" }, { bienNacional: "16432", serial: "4325234234" }]
      },
      {
      usuario: { nombre: "Laury", apellido: "Calderon", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Contabilidad" },
      equipos: [{ bienNacional: "29927", serial: "CNG1476WRB" }, { bienNacional: "29812", serial: "13Q145BC7T" }, { bienNacional: "21156", serial: "BC3370CVBUTE3E" }]
      }, 
      {
      usuario: { nombre: "Mailyn", apellido: "Bello", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Contabilidad" },
      equipos: [{ bienNacional: "22791", serial: "MX38340GW6" }, { id:1260 }, { bienNacional: "19990", serial: "B94540KGASX321" }, { bienNacional: "16683", serial: "432423423" }]
      },
      {
      usuario: { nombre: "Marcos", apellido: "Plua", rolId: 5, direccionNombre: "Dirección planificación y presupuesto", areaNombre: "Coordinación de presupuesto" },
      equipos: [{ bienNacional: "27628", serial: "A000679550" }, { bienNacional: "27657", serial: "C16D8BA000557" }, { bienNacional: "024659", serial: "778ACBA015005" }, { bienNacional: "020376", serial: "B94540KGASX37J" }, { bienNacional: "27481", serial: "13355498335" }, { id:1497 }]
      },
      {
      usuario: { nombre: "Maritza", apellido: "Espinoza", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Clasificación y remuneración" },
      equipos: [{ bienNacional: "024651", serial: "A000091910" }, { bienNacional: "26148", serial: "A59C6BA005331" }, { bienNacional: "ZM2520002645", serial: "ZM2520002645" }, { bienNacional: "020857", serial: "321321312" }, { bienNacional: "26984", serial: "21323436" }, { id:1486 }]
      },
      {
      usuario: { nombre: "Marlene", apellido: "Graterol", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Dirección de informatica" },
      equipos: [{ bienNacional: "27703", serial: "A000679695" }, { bienNacional: "27363", serial: "C16D8BA000506" }, { bienNacional: "27637", serial: "KBD624K14414A" }, { bienNacional: "27374", serial: "13355495291" }]
      },
      {
      usuario: { nombre: "Maury", apellido: "Linares", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Registro y control" },
      equipos: [{ bienNacional: "27667", serial: "C16D8BA000455" }, { bienNacional: "27651", serial: "A000679543" }, { bienNacional: "24723", serial: "KBAB23Q47191A" }, { id:1655 }]
      },
      {
      usuario: { nombre: "Mayerling", apellido: "Velasquez", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Contabilidad" },
      equipos: [{ bienNacional: "24632", serial: "V1980LW-B" }, { bienNacional: "29805", serial: "CNG1476WFY" }, { bienNacional: "19988", serial: "E-C012-03-5116" }, { bienNacional: "20357", serial: "3L065X26544" }]
      },
      {
      usuario: { nombre: "Melissa", apellido: "Arria", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de investigación desarrollo e innovación" },
      equipos: [{ bienNacional: "29200", serial: "CNG1466985" }, { bienNacional: "29183", serial: "3CQ144C2VY" }, { bienNacional: "25928", serial: "2547035" }, { id:1503 }, { bienNacional: "51864", serial: "8756756" }, { bienNacional: "021229", serial: "00144-020-545-902" }, { bienNacional: "29738", serial: "3CQ144C91K" }, { bienNacional: "25822", serial: "BAUVT0BHH2E6GZ" }, { bienNacional: "27509", serial: "13355496195" }, { bienNacional: "020258", serial: "MXJ702076S" }, { bienNacional: "020385", serial: "CNN6463PT" }, { bienNacional: "30980", serial: "GZK500L200600319" }, { bienNacional: "27553", serial: "13355498282" }, { id:2278 }, { bienNacional: "5048120-A", serial: "FSEE8HA015494" }, { bienNacional: "30283", serial: "K15001205009649" }, { bienNacional: "11768", serial: "12980159" }]
      },
      {
      usuario: { nombre: "Melissa", apellido: "Arria (Sin Usuario)", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de investigación desarrollo e innovación" },
      equipos: [{ bienNacional: "020136", serial: "MXJ702078P" }, { bienNacional: "25927", serial: "MJHXHNX" }, { bienNacional: "020800", serial: "MXD7270DBG" }, { bienNacional: "A000907258", serial: "A000907258" }, { bienNacional: "A000907234", serial: "A000907234" }]
      },
      {
      usuario: { nombre: "Mercedes", apellido: "Vergara", rolId: 5, direccionNombre: "Presidencia piso 3", areaNombre: "Seguridad industrial" },
      equipos: [{ bienNacional: "19225", serial: "214325463" }, { bienNacional: "26065", serial: "A000091536" }, { bienNacional: "24687", serial: "C0B2Y09000" }, { bienNacional: "27444", serial: "KBAB26Q41580A" }, { bienNacional: "20416", serial: "CN01F0195" }, { id:1542 }, { id:1623 }]
      },
      {
      usuario: { nombre: "Mercedes", apellido: "Vergara (Sin Usuario)", rolId: 5, direccionNombre: "Presidencia piso 3", areaNombre: "Seguridad industrial" },
      equipos: [{ id:224 }, { id:1622 }]
      },
      {
      usuario: { nombre: "Miguel", apellido: "Dominguez", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Auditoría interna" },
      equipos: [{ bienNacional: "26085", serial: "A000403735" }, { bienNacional: "27736", serial: "C16D8BA000531" }, { bienNacional: "16370", serial: "C0403117008" }, { id:1629 }]
      },
      {
      usuario: { nombre: "Mireya", apellido: "Santos", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Campus virtual" },
      equipos: [{ bienNacional: "29764", serial: "CNG146699L" }, { bienNacional: "29734", serial: "3CQ143CFHS" }, { bienNacional: "19986", serial: "B94540AVBSX4WA" }, { bienNacional: "RP11299352", serial: "RP11299352" }]
      },
      {
      usuario: { nombre: "Miriam", apellido: "Ramos", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Desarrollo e innovación" },
      equipos: [{ bienNacional: "024586", serial: "110228A10018SP0130" }, { bienNacional: "26282", serial: "KBC523K10918A" }]
      },
      {
      usuario: { nombre: "Mirian", apellido: "", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de programación y base de datos" },
      equipos: [{ bienNacional: "27902", serial: "A000679656" }, { bienNacional: "27362", serial: "C16D8BA000512" }, { bienNacional: "27328", serial: "C16D8BA001979" }, { bienNacional: "27868", serial: "KBD624K11240A" }, { bienNacional: "31624", serial: "221716347188" }]
      }, 
      {
      usuario: { nombre: "Norvelis", apellido: "", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Campus virtual" },
      equipos: [{ bienNacional: "29760", serial: "CNG146693J" }, { bienNacional: "29701", serial: "3CQ144C300" }, { bienNacional: "25926", serial: "2785832" }, { bienNacional: "18402", serial: "764533" }, { bienNacional: "024596", serial: "VNB3B81091" }]
      },
      {
      usuario: { nombre: "Oneida", apellido: "Roman", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Biblioteca" },
      equipos: [{ bienNacional: "25903", serial: "MJMLZZX" }, { bienNacional: "25914", serial: "ZT14H4LC203502B" }, { bienNacional: "31011047201", serial: "31011047201" }]
      },
      {
      usuario: { nombre: "Pierangela", apellido: "Alvarez", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "28746", serial: "CNG1476Q6G" }, { bienNacional: "26157", serial: "A59C6BA007365" }, { bienNacional: "26258", serial: "KBC220K10645A" }, { bienNacional: "21535", serial: "W-AB073662322" }]
      },
      {
      usuario: { nombre: "Rafael", apellido: "Diaz", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de docencia" },
      equipos: [{ bienNacional: "29750", serial: "CNG146692H" }, { bienNacional: "29735", serial: "3CQ144C264" }, { bienNacional: "25820", serial: "BAVT0BHH2E5T5" }, { id:1502 }, { bienNacional: "22963", serial: "20138478" }, { bienNacional: "27495", serial: "13355499220" }]
      },
      {
      usuario: { nombre: "Richard", apellido: "Quijada", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de soporte" },
      equipos: [{ bienNacional: "31895", serial: "A00136205" }, { id:1194 }, { id:1195 }, { id:247 }, { bienNacional: "27728", serial: "C16D8BA000471" }, { bienNacional: "31380", serial: "0065818882892" }, { bienNacional: "31496", serial: "KA19021E000811" }, { bienNacional: "31611", serial: "221716347224" }, { id:1915 }]
      },
      {
      usuario: { nombre: "Rodolfo", apellido: "Martinez", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de soporte" },
      equipos: [{ bienNacional: "29263", serial: "02EYHCLG205430A" }, { bienNacional: "27903", serial: "KBD624K10947A" }, { bienNacional: "27543", serial: "13355496312" }, { bienNacional: "29202", serial: "CNG1476Q73" }, { bienNacional: "26128", serial: "A59C6BA005286" }, { bienNacional: "26068", serial: "KBC518K11707A" }]
      },
      {
      usuario: { nombre: "Ronayquel", apellido: "Peroza", rolId: 5, direccionNombre: "Presidencia piso 3", areaNombre: "Seguridad industrial" },
      equipos: [{ bienNacional: "29571", serial: "CNG1476WEDL" }, { bienNacional: "20291", serial: "CNN6430J89" }, { bienNacional: "ZCA63B103291", serial: "ZCA63B103291" }]
      },
      {
      usuario: { nombre: "Rosa", apellido: "Rueda", rolId: 5, direccionNombre: "Dirección planificación y presupuesto", areaNombre: "Coordinación de planificación" },
      equipos: [{ bienNacional: "27626", serial: "A000674566" }, { bienNacional: "024641", serial: "778ACBA007752" }, { bienNacional: "27627", serial: "KBD624K10815A" }, { bienNacional: "16741", serial: "432423423423" }]
      },
      {
      usuario: { nombre: "Rossming", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección planificación y presupuesto", areaNombre: "Dirección planificación y presupuesto" },
      equipos: [{ bienNacional: "27622", serial: "A000679683" }, { bienNacional: "27671", serial: "C0BB809150000105" }, { bienNacional: "27631", serial: "KBD624K509A" }, { bienNacional: "18961", serial: "32423423" }, { id:1495 }, { id:1496 }, { bienNacional: "023710", serial: "CNGSC05196" }, { bienNacional: "16743", serial: "KL0441125477" }, { bienNacional: "16740", serial: "KL0441125482" }, { bienNacional: "16760", serial: "RP11299343" }, { bienNacional: "020816", serial: "MXL7270D92" }, { bienNacional: "27675", serial: "C16D8DA000457" }, { bienNacional: "27654", serial: "KBD624K14526A" }, { bienNacional: "020738", serial: "MXL7270D9L" }, { bienNacional: "27664", serial: "C16D81A001993" }, { bienNacional: "27619", serial: "KBD624K10912A" }, { bienNacional: "020382", serial: "CNN64623KW" }, { bienNacional: "020691", serial: "CNN724191G" }]
      },
      {
      usuario: { nombre: "Sin", apellido: "Usuario", rolId: 5, direccionNombre: "Presidencia", areaNombre: "Auditoría interna" },
      equipos: [{ bienNacional: "020736", serial: "MXL7270D9T" }, { bienNacional: "27733", serial: "C16D8BA000498" }, { id:227 }, { bienNacional: "30096", serial: "2079001008315" }, { bienNacional: "27681", serial: "A000679762" }, { bienNacional: "29556", serial: "3CQ144DCNQ" }, { bienNacional: "27682", serial: "KBD709K12897A" }, { id:1626 }, { id:1630 }, { bienNacional: "27711", serial: "A000679693" }, { bienNacional: "023811", serial: "ETLE10D0929510459" }, { bienNacional: "27712", serial: "KBD624K1887A" }, { bienNacional: "29559", serial: "3CQ143CF9L" }, { id:234 }, { bienNacional: "16777", serial: "KL0441123011" }]
      },
      {
      usuario: { nombre: "Sin", apellido: "Usuario", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Secretaría de despacho" },
      equipos: [{ bienNacional: "020854", serial: "MXL7270DBS" }, { bienNacional: "26193", serial: "A59C6BA005315" }, { bienNacional: "30093", serial: "212079001005343" }, { bienNacional: "021721", serial: "CND1D01042" }]
      },
      {
      usuario: { nombre: "Sin", apellido: "Usuario", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Coordinación de nómina" },
      equipos: [{ bienNacional: "26059", serial: "A000403865" }, { bienNacional: "29704", serial: "3CQ144C2MMS" }, { bienNacional: "017090204652", serial: "017090204652" }]
      },
      {
      usuario: { nombre: "Sin", apellido: "Usuario", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Clasificación y remuneración" },
      equipos: [{ bienNacional: "27701", serial: "A000679700" }, { bienNacional: "27665", serial: "C16D8BA000479" }, { bienNacional: "27698", serial: "KBD624K10841A" }, { bienNacional: "32021", serial: "230331-0560768" }, { bienNacional: "26979", serial: "21323434" }]
      },
      {
      usuario: { nombre: "Sin", apellido: "Usuario", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Tesorería" },
      equipos: [{ bienNacional: "24744", serial: "C0BY090000000" }, { id: 2482 }, { bienNacional: "KBAB23Q46996A", serial: "KBAB23Q46996A" }, { id:2484 }, { bienNacional: "22929", serial: "TH85Q134C2" }, { bienNacional: "22927", serial: "TH850134CP" }]
      },
      {
      usuario: { nombre: "Sin", apellido: "Usuario", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Contabilidad" },
      equipos: [{ id:2241 }, { bienNacional: "26204", serial: "C0BB5090T080E011" }, { bienNacional: "26090", serial: "C090M0E0202000H" }, { id:2485 }]
      },
      {
      usuario: { nombre: "Sistema", apellido: "Biométrico", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Reclutamiento y selección" },
      equipos: [{ bienNacional: "25183", serial: "ZT14H9NB909932V" }, { bienNacional: "27713", serial: "A000679675" }, { bienNacional: "27037", serial: "ZM2520001129" }, { bienNacional: "27480", serial: "13355498334" }, { bienNacional: "31466", serial: "PM1H0000RS" }, { id:1914 }]
      },
      {
      usuario: { nombre: "Teresa", apellido: "Cohen", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Secretaría de despacho" },
      equipos: [{ bienNacional: "29921", serial: "CNG1476PZB" }, { bienNacional: "020161", serial: "CNN6430J87" }, { bienNacional: "024652", serial: "KBAB23Q47595A" }, { id:1482 }, { bienNacional: "ZF5610651369", serial: "ZF5610651369" }, { id:1650 }]
      },
      {
      usuario: { nombre: "Thaynes", apellido: "Olivares", rolId: 5, direccionNombre: "Dirección de administración", areaNombre: "Tesorería" },
      equipos: [{ bienNacional: "29803", serial: "CNG14669669" }, { bienNacional: "29811", serial: "3CQ144C280" }, { bienNacional: "20222", serial: "B94540KGASX34E" }, { bienNacional: "14868", serial: "5-91451000532" }, { id:1492 }]
      },
      {
      usuario: { nombre: "Tomas", apellido: "Díaz", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de soporte" },
      equipos: [{ bienNacional: "31893", serial: "M242023220014" }, { id:1190 }, { bienNacional: "27729", serial: "C16D8BA000478" }, { id:243 }, { bienNacional: "31605", serial: "221716347219" }, { bienNacional: "27316", serial: "A000679750" }, { bienNacional: "26230", serial: "KBC525K10340A" }, { bienNacional: "28013", serial: "JP400113070382" }]
      },
      {
      usuario: { nombre: "Tomas", apellido: "Díaz (Arianyela)", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de soporte" },
      equipos: [{ id:2184 }, { bienNacional: "26188", serial: "A59C6BA005309" }, { bienNacional: "27897", serial: "KBD624K10943A" }]
      },
      {
      usuario: { nombre: "Tomas", apellido: "Díaz (Enyely)", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Área de soporte" },
      equipos: [{ bienNacional: "30386", serial: "A000901737" }]
      },
      {
      usuario: { nombre: "Yeltza", apellido: "Velasquez", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Bienestar social" },
      equipos: [{ bienNacional: "19834", serial: "MXJ70207DQ" }, { bienNacional: "27353", serial: "KBD624K14488A" }, { bienNacional: "20689", serial: "CNN72418ZH" }]
      },
      {
      usuario: { nombre: "Yenixe", apellido: "Rodriguez", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Dirección de docencia" },
      equipos: [{ bienNacional: "29762", serial: "CNG1476PHX" }, { bienNacional: "29738", serial: "3CQ144C91K" }, { bienNacional: "25822", serial: "BAUVT0BHH2E6GZ" }, { bienNacional: "29762", serial: "133355496195" }, { bienNacional: "023642", serial: "CN976A51BV" }]
      },
      {
      usuario: { nombre: "Yurbi", apellido: "Amundaraim", rolId: 5, direccionNombre: "Dirección de talento humano", areaNombre: "Coordinación de nómina" },
      equipos: [{ bienNacional: "27699", serial: "A000679773" }, { bienNacional: "27666", serial: "C16D8BA000520" }, { bienNacional: "27650", serial: "KBD709K13017A" }, { bienNacional: "26983", serial: "21323435" }, { bienNacional: "20120530017998", serial: "20120530017998" }, { bienNacional: "27398", serial: "13355499895" }]
      },
      {
      usuario: { nombre: "Zaleidy", apellido: "Matos", rolId: 5, direccionNombre: "Dirección general de investigación y docencia", areaNombre: "Biblioteca" },
      equipos: [{ bienNacional: "25925", serial: "MJMMKFF" }, { bienNacional: "25915", serial: "ZT14H4LC203226X" }, { bienNacional: "30979", serial: "GZK500L200600319" }, { bienNacional: "32016", serial: "230331-0560764" }]
      },  

      //Planta Baja
      {
      usuario: { nombre: "Belkis", apellido: "Pinto", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Red de laboratorio de salud pública" },
      equipos: [{ bienNacional: "29683", serial: "CNG1476VML" }, { bienNacional: "29266", serial: "02EYHCLG205262N" }, { bienNacional: "29375", serial: "543256363" }, { id:1502 }]
      },
      {
      usuario: { nombre: "Blanca", apellido: "Marquez", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Dirección de estadística y análisis estratégico" },
      equipos: [{ bienNacional: "021712", serial: "MXL8210G0P" }, { bienNacional: "28965", serial: "3CQ144C2H6" }, { bienNacional: "27809", serial: "KBD624K10849A" }, { bienNacional: "27516", serial: "13355494913" }]
      },
      {
      usuario: { nombre: "Angi", apellido: "Nuñez", rolId: 5, direccionNombre: "Coordinación de atención al ciudadano", areaNombre: "Oficina de atención al ciudadano" },
      equipos: [{ bienNacional: "27904", serial: "A000679629" }, { bienNacional: "27908", serial: "C16D8BA000509" }, { bienNacional: "165113", serial: "C0403121809" }, { bienNacional: "14887", serial: "759145100532" }, { bienNacional: "06GM26023604", serial: "06GM26023604" }]
      },
      {
      usuario: { nombre: "Blas", apellido: "Sanchez", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos,cosméticos, productos médicos y otras tecnologías ", areaNombre: "División de fisicoquímica de medicamentos (Oficina de la jefatura de división)" },
      equipos: [{ bienNacional: "27863", serial: "A000679605" }, { bienNacional: "2879", serial: "C16D8BA000480" }, { bienNacional: "021701", serial: "BC3370DVBVL06OA" }, { bienNacional: "04928", serial: "RP11281281" }, { bienNacional: "18914", serial: "061635013797" }, { bienNacional: "ZF5610655649", serial: "ZF5610655649" }]
      }, 
      {
      usuario: { nombre: "Cenia", apellido: "Monsalbe", rolId: 5, direccionNombre: "Dirección de regulación de productos de uso y consumo humano", areaNombre: "Unidad de manejo de muestras e integración de resultados" },
      equipos: [{ bienNacional: "20365", serial: "3L0650X31197" }, { bienNacional: "27592", serial: "13355496070" }, { bienNacional: "27591", serial: "13355496073" }, { bienNacional: "26109", serial: "A59C6BA005761" }, { bienNacional: "26049", serial: "A000403825" }, { bienNacional: "26165", serial: "T9CSSYNYYLLUNNJ" }, { bienNacional: "26048", serial: "KBC525K10195A" }, { bienNacional: "301097", serial: "212077001021871" }, { bienNacional: "29583", serial: "CNG1476VRR" }, { bienNacional: "29607", serial: "3CQ144C3DD" }, { bienNacional: "20364", serial: "B94540KGASX338" }, { bienNacional: "020362", serial: "MXJ702076L" }, { bienNacional: "025169", serial: "ZT14H9NB909922B" }, { bienNacional: "024776", serial: "KBAB26Q41601A" }, { bienNacional: "11125", serial: "RP10797518" }, { id:1510 }, { bienNacional: "024777", serial: "A0000919964" }, { bienNacional: "024781", serial: "778ACBA014997" }, { bienNacional: "25990", serial: "KBC518K11062A" }, { bienNacional: "20120620005038", serial: "20120620005038" }, { bienNacional: "MAE510378", serial: "MAE510378" }, { bienNacional: "021519", serial: "211HR11151" }, { bienNacional: "29582", serial: "234235235" }, { bienNacional: "29639", serial: "43656765" }, { bienNacional: "25991", serial: "A0004093810" }]
      },
      {
      usuario: { nombre: "Gilma", apellido: "Moreno", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos,cosméticos, productos médicos y otras tecnologías (planta baja)", areaNombre: "División de fisicoquímica de medicamentos (Área instrumental I)" },
      equipos: [{ bienNacional: "CN-0HN22V-FCC00-96G-E2PI-A07", serial: "CN-0HN22V-FCC00-96G-E2PI-A07" }, { bienNacional: "K15001295020045", serial: "K15001295020045" }, { bienNacional: "221208-0940098", serial: "221208-0940098" }, { bienNacional: "X5E8220271", serial: "X5E8220271" }, { bienNacional: "19949", serial: "MXJ7020793" }, { bienNacional: "024722", serial: "778ACBA015001" }, { bienNacional: "26102", serial: "KBC525K10460A" }, { bienNacional: "021717", serial: "58277-00066" }, { bienNacional: "021698", serial: "803MXXD12045" }, { bienNacional: "26217", serial: "A000403867" }, { id:1674 }, { bienNacional: "020144", serial: "MXJ702079Z" }, { bienNacional: "022920", serial: "CNC807PNPM" }, { bienNacional: "020146", serial: "B94540KGASX31Y" }, { bienNacional: "221202-0940928", serial: "221202-0940928" }, { bienNacional: "32187", serial: "WCAPENFKH93Q3" }, { bienNacional: "32187", serial: "CN-020WVC-TV100-34E-037B-A21" }, { bienNacional: "32187", serial: "CN-00FRXW-PRC00-1C7-00XM-A00" }, { bienNacional: "32187", serial: "CN-0DMV3P-CH400-1CS-06EO-A01" }, { bienNacional: "32022", serial: "230331-0560765" }, { bienNacional: "024023", serial: "MXL0050Q55" }, { bienNacional: "024022", serial: "CNC935R7MR" }, { bienNacional: "PU-V101010656", serial: "PU-V101010656" }, { bienNacional: "221208-0940097", serial: "221208-0940097" }, { bienNacional: "19934", serial: "MXJ702078R" }, { bienNacional: "19939", serial: "CNN64622RW" }, { bienNacional: "020093", serial: "B94540AVBSX4XS" }, { bienNacional: "04964", serial: "RP11299359" }, { bienNacional: "15461", serial: "PB0228320419" }, { bienNacional: "14392", serial: "CNBRB26361" }, { bienNacional: "26251", serial: "A000403750" }, { bienNacional: "020064", serial: "CNN64623KS" }, { bienNacional: "29930", serial: "856634523" }]
      },
      {
      usuario: { nombre: "Gilma", apellido: "Moreno", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos,cosméticos, productos médicos y otras tecnologías (planta baja)", areaNombre: "División de fisicoquímica de medicamentos (Área instrumental II)" },
      equipos: [{ bienNacional: "31735", serial: "TN292023030161" }, { bienNacional: "AC2643020056A", serial: "AC2643020056A" }, { id:1932}, { bienNacional: "210472500143", serial: "210472500143" }]
      },
      {
      usuario: { nombre: "Gilma", apellido: "Moreno", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos,cosméticos, productos médicos y otras tecnologías (planta baja)", areaNombre: "División de fisicoquímica de medicamentos (Área de transcripción)" },
      equipos: [{ bienNacional: "29929", serial: "CNG146696R" }, { bienNacional: "29906", serial: "3CQ144DD2B" }, { bienNacional: "26250", serial: "KBC525K10746A" }, { bienNacional: "29577", serial: "CNG1476TXZ" }, { bienNacional: "26136", serial: "A59C6BA008038" }, { bienNacional: "29918", serial: "432563645" }, { bienNacional: "26241", serial: "A000403725" }, { bienNacional: "024030", serial: "MY19H9NSA14811M" }, { bienNacional: "17931", serial: "ZM5527023270" }, { bienNacional: "27388", serial: "13355496160" }, { bienNacional: "29925", serial: "CNG1476W46" }, { bienNacional: "29560", serial: "3CQ143B0H9" }, { bienNacional: "020069", serial: "B94540KGASX32YA" }, { bienNacional: "18400", serial: "075030008204" }, { bienNacional: "ZF5X1A104270", serial: "ZF5X1A104270" }, { bienNacional: "024796", serial: "A000091962" }, { bienNacional: "29907", serial: "3CQ144C2MM" }, { bienNacional: "27864", serial: "KBD624K11234A" }, { bienNacional: "13075", serial: "RP11274436" }, { bienNacional: "CH9382131", serial: "CH9382131" }, { bienNacional: "20120620007465", serial: "20120620007465" }, { bienNacional: "26031", serial: "A000403760" }, { bienNacional: "26174", serial: "A59C6BA005308" }, { bienNacional: "26030", serial: "KBC523K10917A" }, { bienNacional: "020066", serial: "3L0651X26627" }, { bienNacional: "26277", serial: "A000403938" }, { id:1353 }, { bienNacional: "TH-025PGG-37171-16L-1979", serial: "TH-025PGG-37171-16L-1979" }, { bienNacional: "17932", serial: "KL0441126592" }, { bienNacional: "29917", serial: "CNG1476VV6L" }, { bienNacional: "0246660", serial: "778ACBA015011" }, { bienNacional: "17890", serial: "ZCA638400933" }, { bienNacional: "17934", serial: "KL044112500R" }, { bienNacional: "29602", serial: "CNG1476V71" }, { bienNacional: "26150", serial: "A59C6BA004262" }, { bienNacional: "26222", serial: "KBC518K11703A" }, { bienNacional: "27523", serial: "13355496088" }, { bienNacional: "ZF58106Z4281", serial: "ZF58106Z4281" }, { bienNacional: "29933", serial: "CNG1476WGC" }, { bienNacional: "29905", serial: "3CQ144C29L" }, { bienNacional: "26228", serial: "KBC523K10914A" }, { bienNacional: "CH9409002", serial: "CH9409002" }, { bienNacional: "17080", serial: "ZM3916903361" }, { bienNacional: "020063", serial: "MXJ70207B0" }]
      },
      {
      usuario: { nombre: "Gilma", apellido: "Moreno", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos,cosméticos, productos médicos y otras tecnologías (planta baja)", areaNombre: "División de fisicoquímica de medicamentos (Oficina de la jefatura de división)" },
      equipos: [{ bienNacional: "27871", serial: "A000679608" }, { bienNacional: "27877", serial: "C16D8BA000508" }, { bienNacional: "27872", serial: "KBD624K10828A" }, { bienNacional: "13007", serial: "IP112811285" }, { bienNacional: "2013062500037", serial: "2013062500037" }, { bienNacional: "19071", serial: "MNQ32218" }]
      },
      {
      usuario: { nombre: "Coromoto", apellido: "Pineda", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos,cosméticos, productos médicos y otras tecnologías (planta baja)", areaNombre: "División de fisicoquímica de medicamentos (Oficina de la jefatura de división)" },
      equipos: [{ bienNacional: "31819", serial: "A001332499" }, { id:1359 }, { bienNacional: "31820", serial: "KBHC12K16789A" }]
      }, 
      {
      usuario: { nombre: "Gladys", apellido: "Amelis", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Laboratorio de programas especiales hepatitis y sida" },
      equipos: [{ bienNacional: "024698", serial: "A0009195" }, { bienNacional: "024688", serial: "778ABA015000" }, { bienNacional: "024697", serial: "KBAB26Q41603A" }, { bienNacional: "020443", serial: "9532AY0BC523700673" }, { bienNacional: "020626", serial: "J5V057981" }, { bienNacional: "ZF5610651361", serial: "ZF5610651361" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Amelis", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Laboratorio de programas especiales hepatitis y sida" },
      equipos: [{ bienNacional: "27774", serial: "A000679606" }, { bienNacional: "27758", serial: "C16D8BA000475" }, { bienNacional: "27771", serial: "KBD624K10821A" }, { bienNacional: "30265", serial: "1432900503375" }, { bienNacional: "2013062500795", serial: "2013062500795" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Amelis", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Laboratorio de programas especiales hepatitis y sida" },
      equipos: [{ bienNacional: "27772", serial: "A000679588" }, { bienNacional: "27759", serial: "C16D8BA000535" }, { bienNacional: "27773", serial: "KBD624K10909A" }, { bienNacional: "27501", serial: "13355499214" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Amelis", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Laboratorio de programas especiales hepatitis y sida" },
      equipos: [{ bienNacional: "27770", serial: "A000679540" }, { bienNacional: "27756", serial: "C16D8BA000491" }, { bienNacional: "27775", serial: "KBD624K10829A" }, { bienNacional: "20130530004975", serial: "20130530004975" }, { bienNacional: "28035", serial: "NXV90713" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Amelis", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Laboratorio de programas especiales hepatitis y sida" },
      equipos: [{ bienNacional: "27768", serial: "A000679568" }, { bienNacional: "27757", serial: "C16D8BA000507" }, { bienNacional: "024165", serial: "PUAV095300653" }]
      },
      {
      usuario: { nombre: "Gladys", apellido: "Amelis", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Laboratorio de programas especiales hepatitis y sida" },
      equipos: [{ bienNacional: "25005", serial: "CCP56312091066009" }, { bienNacional: "2013062500795", serial: "2013062500795" }]
      },
      {
      usuario: { nombre: "Gloria", apellido: "Correa", rolId: 5, direccionNombre: "Dirección general de producción (planta baja)", areaNombre: "Departamento de medios de cultivos y reactivos" },
      equipos: [{ bienNacional: "29590", serial: "CNG1476TW" }, { bienNacional: "29235", serial: "3CQ145B9PH" }, { bienNacional: "16522", serial: "C0403117036" }]
      },
      {
      usuario: { nombre: "Greimar", apellido: "Ortega", rolId: 5, direccionNombre: "Dirección general de producción (planta baja)", areaNombre: "Departamento de medios de cultivos y reactivos" },
      equipos: [{ bienNacional: "020794", serial: "MXL7270DBH" }]
      },
      {
      usuario: { nombre: "Henrry", apellido: "Sanchez", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Inmunocerología viral" },
      equipos: [{ bienNacional: "11044", serial: "534654645" }, { bienNacional: "30259", serial: "219CA33000078" }]
      },
      {
      usuario: { nombre: "Julio", apellido: "Zambrano", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Inmunocerología viral" },
      equipos: [{ bienNacional: "27314", serial: "A000091925" }, { bienNacional: "27361", serial: "C16D9BA000518" }, { bienNacional: "27315", serial: "KBD624K14490A" }]
      },
      {
      usuario: { nombre: "Leonardo", apellido: "Guerrera", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Dirección de estadística y análisis estratégico" },
      equipos: [{ bienNacional: "31827", serial: "A001332944" }, { bienNacional: "31828", serial: "KBHC12K16936A" }, { bienNacional: "024044", serial: "090701-0660459" }, { bienNacional: "30350", serial: "1434100505623" }]
      },
      {
      usuario: { nombre: "Juan Carlos", apellido: "Brea", rolId: 5, direccionNombre: "Coordinación de atención al ciudadano", areaNombre: "Oficina de atención al ciudadano" },
      equipos: [{ bienNacional: "29856", serial: "CNG1476VCX" }, { bienNacional: "29839", serial: "3CQ143CF4F" }, { bienNacional: "27028", serial: "ZM2520002642" }, { bienNacional: "27436", serial: "13355498907" }]
      },
      {
      usuario: { nombre: "Lisbeth", apellido: "Rivas", rolId: 5, direccionNombre: "Dirección de laboratorio nacional de control de medicamentos,cosméticos, productos médicos y otras tecnologías (planta baja)", areaNombre: "División de fisicoquímica de medicamentos (Cuarto de patrones)" },
      equipos: [{ bienNacional: "25989", serial: "A000403808" }, { bienNacional: "022925", serial: "809NDYG9J514" }, { bienNacional: "25133", serial: "WE1692042371" }, { bienNacional: "020070", serial: "2391321423" }]
      },
      {
      usuario: { nombre: "Lairet", apellido: "Rauseo", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano (planta baja)", areaNombre: "Dirección de vigilancia sanitaria" },
      equipos: [{ bienNacional: "29646", serial: "CNG1476PZH" }, { bienNacional: "279876", serial: "C16D89BA000469" }, { bienNacional: "020174", serial: "B994540KGASX0WD" }, { bienNacional: "021331", serial: "W-AB07366532" }, { bienNacional: "021937", serial: "6563423432" }]
      }, 
      {
      usuario: { nombre: "Magalis", apellido: "Castro", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Dirección de estadística y análisis estratégico" },
      equipos: [{ bienNacional: "27808", serial: "A000679722" }, { bienNacional: "27810", serial: "C16D8BA001980" }, { bienNacional: "020781", serial: "BC3370BVBUMK07" }, { bienNacional: "30339", serial: "1434300504855" }]
      },
      {
      usuario: { nombre: "Maria Gabriela", apellido: "Ungulo", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Dirección de estadística y análisis estratégico" },
      equipos: [{ bienNacional: "27804", serial: "A000679657" }, { bienNacional: "27817", serial: "C16D8BA000522" }, { bienNacional: "27805", serial: "KBD624K14524A" }, { bienNacional: "30349", serial: "143270050193" }, { id:1535 }]
      },
      {
      usuario: { nombre: "Michell", apellido: "Barreto", rolId: 5, direccionNombre: "Dirección medios de cultivo y reactivos", areaNombre: "División de medios de cultivos" },
      equipos: [{ bienNacional: "024671", serial: "A000092029" }, { bienNacional: "020697", serial: "CNN72419DS" }, { bienNacional: "16910", serial: "C040311527" }, { id:1658 }, { id:1506 }]
      },
      {
      usuario: { nombre: "Marisol", apellido: "Marquez", rolId: 5, direccionNombre: "Dirección general de producción (planta baja)", areaNombre: "Departamento de medios de cultivos y reactivos" },
      equipos: [{ bienNacional: "29785", serial: "CNG146698Q" }, { bienNacional: "29810", serial: "3CQ143CFHT" }, { bienNacional: "022998", serial: "BC3370GVBWV1P9" }, { bienNacional: "27429", serial: "13355499096" }, {id:1482 }]
      },
      {
      usuario: { nombre: "Maria", apellido: "Centeno", rolId: 5, direccionNombre: "Dirección general de producción (planta baja)", areaNombre: "Departamento de medios de cultivos y reactivos" },
      equipos: [{ bienNacional: "020780", serial: "MXL72405S3" }, { bienNacional: "020720", serial: "CNN72419GS" }, { bienNacional: "16372", serial: "C0403116790" }, { id:1663 }]
      },
      {
      usuario: { nombre: "Michelle", apellido: "Barreto", rolId: 5, direccionNombre: "Dirección general de producción (planta baja)", areaNombre: "Departamento de medios de cultivos y reactivos" },
      equipos: [{ bienNacional: "28950", serial: "CNG1476V0L" }, { bienNacional: "28964", serial: "3CQ144C29C" }, { bienNacional: "28951", serial: "34242342342" }, { id:1807 }, { bienNacional: "024046", serial: "0907010660458" }]
      },
      {
      usuario: { nombre: "Maria", apellido: "Martinez", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano (planta baja)", areaNombre: "Dirección de vigilancia sanitaria" },
      equipos: [{ bienNacional: "27857", serial: "A000679767" }, { bienNacional: "26117", serial: "A59C6BA005806" }, { bienNacional: "27858", serial: "KBD624K10967A" }]
      },
      {
      usuario: { nombre: "Mirta", apellido: "Puente", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano (planta baja)", areaNombre: "Dirección de vigilancia sanitaria" },
      equipos: [{ bienNacional: "29783", serial: "CNG1476PXQ" }, { bienNacional: "26130", serial: "A59C6BA005785" }, { bienNacional: "16386", serial: "C0403116787" }, { bienNacional: "0294633", serial: "A000091923" }, { bienNacional: "020830", serial: "MXL7270D8Z" }, { bienNacional: "26158", serial: "A59C6BA008041" }, { bienNacional: "020252", serial: "B9949540AVBSX4XR" }, { bienNacional: "27829", serial: "A000679574" }, { bienNacional: "27840", serial: "C16D8BA000468" }, { bienNacional: "27830", serial: "KBD624K10822A" }, { bienNacional: "31610", serial: "221716347225" }, { id:1512 }, { id:1895 }, { bienNacional: "12997", serial: "MX1CD8F1MG" }, { bienNacional: "020403", serial: "CNB1B01139" }, { bienNacional: "023814", serial: "etle10d092951015a98503" }, { bienNacional: "020713", serial: "CNN72419GL" }, { bienNacional: "020096", serial: "CNN6430K1R" }, { bienNacional: "26171", serial: "A59C6BA005268" }, { bienNacional: "26112", serial: "A59C6BA005827" }, { bienNacional: "022880", serial: "HA17HVKS205940D" }, { bienNacional: "25814", serial: "ZUHJHTMC400115W" }, { bienNacional: "28949", serial: "5634543534" }, { bienNacional: "26242", serial: "KBC518K11702A" }, { bienNacional: "29374", serial: "9823754932" }, { bienNacional: "17842", serial: "ZM5527023267" }, { bienNacional: "020649", serial: "FJP1Y81U1S71X01914OA40" }, { bienNacional: "024787", serial: "KBAB23Q47075A" }, { bienNacional: "16722", serial: "ZM5327085965" }]
      }, 
      {
      usuario: { nombre: "Neribet", apellido: "Ruiz", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Red de laboratorio de salud pública" },
      equipos: [{ bienNacional: "020752", serial: "MXL7270DB4" }, { bienNacional: "27845", serial: "C16D8BA001976" }, { bienNacional: "27795", serial: "KBD624K10036A" }, { bienNacional: "27400", serial: "13355499893" }]
      },
      {
      usuario: { nombre: "Steffany", apellido: "Diaz", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Inmunocerología viral" },
      equipos: [{ bienNacional: "27340", serial: "2600+J21:N21" }, { bienNacional: "27359", serial: "C16D8BA000528" }, { bienNacional: "024680", serial: "KBAB26Q42232A" }, { bienNacional: "13069", serial: "RP113081" }]
      },
      {
      usuario: { nombre: "Noraidys", apellido: "Porras", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Inmunocerología viral" },
      equipos: [{ bienNacional: "024681", serial: "A000092074" }, { bienNacional: "273312", serial: "C16D8BA000532" }, { bienNacional: "27347", serial: "KBD624K14510A" }, { bienNacional: "27346", serial: "A000679737" }, { bienNacional: "16619", serial: "MXD41808P6" }, { bienNacional: "27358", serial: "C16D8BA000516" }, { bienNacional: "14234", serial: "TH-094PCU-37171-21B-1207" }, { bienNacional: "27423", serial: "13355499099" }, { bienNacional: "27425", serial: "13355499098" }, { bienNacional: "14994", serial: "34243243245" }, { bienNacional: "13771", serial: "7591451200185" }, { id:1503 }, { bienNacional: "32370", serial: "Q77Y321373" }, { bienNacional: "32371", serial: "Q77Y371911" }]
      },
      {
      usuario: { nombre: "Rosaria", apellido: "Quevara", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Inmunocerología viral" },
      equipos: [{ bienNacional: "27388", serial: "A000679729" }, { bienNacional: "024696", serial: "T9AKM5NQH4LUNNJ" }, { bienNacional: "27339", serial: "KBD624K10911A" }]
      },
      {
      usuario: { nombre: "Nathalie", apellido: "Rizzi", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Dirección de estadística y análisis estratégico" },
      equipos: [{ bienNacional: "27800", serial: "A00679742" }, { bienNacional: "27812", serial: "C16D8BA000608" }, { bienNacional: "28858", serial: "32544543" }, { id:1504 }]
      },
      {
      usuario: { nombre: "Nairys", apellido: "Gimenez", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Dirección de estadística y análisis estratégico" },
      equipos: [{ bienNacional: "025795", serial: "A000092016" }, { bienNacional: "024761", serial: "778ACBA015026" }, { bienNacional: "27807", serial: "KBD624K18836A" }, { bienNacional: "021538", serial: "W-AB073662323" }, { bienNacional: "18982", serial: "00040DF5DA5" }, { bienNacional: "30345", serial: "1432000600701" }]
      },
      {
      usuario: { nombre: "Oswaldo", apellido: "Graterol", rolId: 5, direccionNombre: "Dirección general de producción (planta baja)", areaNombre: "Sección de reactivos y colorantes" },
      equipos: [{ bienNacional: "29799", serial: "CNG1476TWC" }, { bienNacional: "29819", serial: "3CQ144C90Q" }, { bienNacional: "020923", serial: "BC3370BGAUH0C6" }, { bienNacional: "27404", serial: "13355499888" }, { bienNacional: "021928", serial: "43534534" }]
      },
      {
      usuario: { nombre: "Rafael", apellido: "Rodriguez", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano (planta baja)", areaNombre: "Dirección de vigilancia sanitaria" },
      equipos: [{ bienNacional: "26285", serial: "A000403726" }, { bienNacional: "26201", serial: "A59C6BA005797" }, { bienNacional: "26266", serial: "KBC521K13208A" }]
      }, 
      {
      usuario: { nombre: "Yenizet", apellido: "Blanco", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Inmunocerología viral" },
      equipos: [{ bienNacional: "27348", serial: "A000679753" }, { bienNacional: "27360", serial: "C16D8BA000466" }, { bienNacional: "27349", serial: "KBD624K18817A" }]
      },
      {
      usuario: { nombre: "Steffany", apellido: "Diaz", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Inmunocerología viral" },
      equipos: [{ bienNacional: "27340", serial: "2600+J21:N21" }, { bienNacional: "27359", serial: "C16D8BA000528" }, { bienNacional: "024680", serial: "KBAB26Q42232A" }, { bienNacional: "13069", serial: "RP113081" }]
      },
      {
      usuario: { nombre: "Rosaria", apellido: "Quevara", rolId: 5, direccionNombre: "Dirección de diagnóstico y vigilancia epidemiológica", areaNombre: "Inmunocerología viral" },
      equipos: [{ bienNacional: "27388", serial: "A000679729" }, { bienNacional: "024696", serial: "T9AKM5NQH4LUNNJ" }, { bienNacional: "27339", serial: "KBD624K10911A" }]
      },
      {
      usuario: { nombre: "Yuraima", apellido: "Materan", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Dirección de estadística y análisis estratégico" },
      equipos: [{ bienNacional: "27806", serial: "A000679666" }, { bienNacional: "27818", serial: "C0BB809150000105" }, { bienNacional: "27801", serial: "KBD624K10961A" }, { bienNacional: "30333", serial: "1434300504876" }]
      },
      {
      usuario: { nombre: "Tahismar", apellido: "Aquino", rolId: 5, direccionNombre: "Dirección general de diagnóstico y vigilancia epidemiológica (planta baja)", areaNombre: "Dirección de estadística y análisis estratégico" },
      equipos: [{ bienNacional: "28783", serial: "CNG1476WMG" }, { bienNacional: "28770", serial: "3CK134C9LY" }, { bienNacional: "17440", serial: "0402345104" }, { bienNacional: "30356", serial: "1434100503767" }]
      },
      {
      usuario: { nombre: "Vanderlin", apellido: "Cumana", rolId: 5, direccionNombre: "Dirección medios de cultivo y reactivos", areaNombre: "Unidad de control de calidad de medios y reactivos" },
      equipos: [{ bienNacional: "29787", serial: "CNG1476PKD" }, { bienNacional: "29817", serial: "3CQ144C4WQ" }, { bienNacional: "24703", serial: "KBAB26Q41578A" }, { bienNacional: "07775", serial: "DH1014840" }]
      },
      {
      usuario: { nombre: "Yenny", apellido: "Urdaneta", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano (planta baja)", areaNombre: "Dirección de vigilancia sanitaria" },
      equipos: [{ bienNacional: "26281", serial: "A000403930" }, { bienNacional: "26163", serial: "A59C5BA005766" }, { bienNacional: "259988", serial: "KBC523K10965A" }, { bienNacional: "020094", serial: "3L0651X29570" }]
      },
      {
      usuario: { nombre: "Ydalid", apellido: "Alvarez", rolId: 5, direccionNombre: "Dirección general de regulación sanitaria de productos de uso y consumo humano (planta baja)", areaNombre: "Dirección de vigilancia sanitaria" },
      equipos: [{ bienNacional: "299642", serial: "CNG1476TSN" }, { bienNacional: "29664", serial: "3CQ143B0ZT" }, { bienNacional: "31617", serial: "221716341398" }, { id:1514 }]
      },
      {
      usuario: { nombre: "Wilmer", apellido: "Caruci", rolId: 5, direccionNombre: "Dirección de seguridad y transporte", areaNombre: "Centro comunicación y monitoreo (CECOM)" },
      equipos: [{ bienNacional: "27644", serial: "A000679686" }, { bienNacional: "28012", serial: "432423524534" }, { bienNacional: "023495", serial: "018060056583" }, { bienNacional: "31618", serial: "22176341397" }, { bienNacional: "31512", serial: "NA9RLLR1" }, { bienNacional: "27642", serial: "A000679584" }, { bienNacional: "28694", serial: "5647675656" }, { bienNacional: "27024", serial: "ZM2620007225" }, { bienNacional: "31545", serial: "AW22151A0626" }, { bienNacional: "28742", serial: "CNG1476PGM" }, { bienNacional: "30121", serial: "AW40N1SM18071377" }, { bienNacional: "26234", serial: "KBC525K10152A" }, { bienNacional: "31547", serial: "AW22151A0627" }]
      }, 
      {
      usuario: { nombre: "Maria", apellido: "Sanchez", rolId: 5, direccionNombre: "Dirección general de diagnóstico", areaNombre: "Dirección general de diagnóstico" },
      equipos: [{ bienNacional: "27796", serial: "A000679777" }, { bienNacional: "27813", serial: "C16D8BA000511" }, { bienNacional: "27797", serial: "KBD624K10857" }, { bienNacional: "27581", serial: "5346543" }, { bienNacional: "19288", serial: "8754542342" }]
      },
      {
      usuario: { nombre: "Lieska", apellido: "Rodriguez", rolId: 5, direccionNombre: "Dirección general de diagnóstico", areaNombre: "Dirección general de diagnóstico" },
      equipos: [{ bienNacional: "30031", serial: "4703006710" }, { bienNacional: "30032", serial: "MMT3FAA0027030026F3B00" }, { bienNacional: "30030", serial: "1708MR049868" }, { bienNacional: "27580", serial: "13355495050" }, { bienNacional: "31692", serial: "A001332809" }, { bienNacional: "27799", serial: "KBD624K10825A" }, { bienNacional: "020039", serial: "3L0651X26251" }, { bienNacional: "30191", serial: "X5NQ063259" }, { bienNacional: "18942", serial: "061635010039" }, { bienNacional: "024668", serial: "A000092042" }, { bienNacional: "021695", serial: "803MX0A12036" }, { bienNacional: "16378", serial: "C0403116803" }, { bienNacional: "28832", serial: "CNG1476PGX" }, { bienNacional: "28774", serial: "3CQ144DCNJ" }, { bienNacional: "020106", serial: "B94540KGASX0V2A" }, { bienNacional: "27412", serial: "87563456353" }, { bienNacional: "19998", serial: "3L0650X29182" }, { bienNacional: "19263", serial: "9876544235" }, { bienNacional: "24763", serial: "A000091982" }, { bienNacional: "24667", serial: "778ACBA015008" }, { bienNacional: "13027", serial: "863464363" }, { bienNacional: "25794", serial: "414114003249" }, { bienNacional: "26023", serial: "A000403821" }, { bienNacional: "17238", serial: "MJ17HCJY402943H" }, { bienNacional: "16475", serial: "C0403115246" }, { bienNacional: "14867", serial: "591451000532" }, { bienNacional: "25793", serial: "41J114003264" }, { bienNacional: "024790", serial: "778ACBA015049" }, { bienNacional: "020150", serial: "B94540KGASX31MA" }, { bienNacional: "27573", serial: "13355495060" }, { bienNacional: "30264", serial: "1434100505655" }, { bienNacional: "25828", serial: "41J114500648" }, { bienNacional: "024775", serial: "A000091916" }, { bienNacional: "19996", serial: "CNN604012Y" }, { bienNacional: "27045", serial: "ZM2520001123" }, { bienNacional: "13002", serial: "46365434523453" }, { bienNacional: "30260", serial: "1434100505468" }]
      },
      {
      usuario: { nombre: "Pierina", apellido: "D'Angelo", rolId: 5, direccionNombre: "Dirección general de diagnóstico", areaNombre: "Departamento de virología" },
      equipos: [{ bienNacional: "27792", serial: "A000679529" }, { bienNacional: "27724", serial: "C16D8BA000494" }, { bienNacional: "27793", serial: "KBD624K1418A" }, { bienNacional: "11798", serial: "RP11299355" }, { bienNacional: "27484", serial: "133554988331" }]
      }, 

      //Sotano
      {
      usuario: { nombre: "Francisca", apellido: "Canchica", rolId: 5, direccionNombre: "Servicio médico", areaNombre: "Servicio médico" },
      equipos: [{ bienNacional: "27802", serial: "A000679667" }, { bienNacional: "020672", serial: "CNN7140JDQ" }, { bienNacional: "16070", serial: "C0403117011" }]
      },
      {
      usuario: { nombre: "Danny", apellido: "Hernandez", rolId: 5, direccionNombre: "SUNEP", areaNombre: "Secretaría general" },
      equipos: [{ bienNacional: "020128", serial: "MXJ702077J" }, { bienNacional: "18529", serial: "CNC6120QRY" }, { bienNacional: "16098", serial: "C0403116809" }, { bienNacional: "27408", serial: "13355499177" }]
      },
      {
      usuario: { nombre: "Alejandro", apellido: "Bastidas", rolId: 5, direccionNombre: "Dirección de talento humano (sotano)", areaNombre: "Coordinación de cultura" },
      equipos: [{ bienNacional: "29673", serial: "CNG1476TWP" }, { bienNacional: "29708", serial: "3CQ144C90T" }, { bienNacional: "31625", serial: "221716347194" }]
      },
      {
      usuario: { nombre: "Abihail", apellido: "Marinez", rolId: 5, direccionNombre: "Dirección de producción", areaNombre: "Dirección procesamiento de agua y material de laboratorio" },
      equipos: [{ bienNacional: "024176", serial: "MXL0050TWS" }, { bienNacional: "024145", serial: "MY19H9NZ125496E" }, { bienNacional: "30462", serial: "7591186002016" }, { bienNacional: "021945", serial: "321312312" }]
      },
      {
      usuario: { nombre: "Caren", apellido: "Romero", rolId: 5, direccionNombre: "Dirección de producción", areaNombre: "Dirección procesamiento de agua y material de laboratorio" },
      equipos: [{ bienNacional: "29854", serial: "CNN1476V11" }, { bienNacional: "29846", serial: "3CQ143CDNR" }, { bienNacional: "25167", serial: "ZT14H9NB908748D" }, { bienNacional: "30105", serial: "212079001008313" }, { id:1695 }]
      }, 
      {
      usuario: { nombre: "Zoraida", apellido: "Alvarado", rolId: 5, direccionNombre: "Dirección administración (sotano)", areaNombre: "Coordinación de cocina" },
      equipos: [{ bienNacional: "29793", serial: "CNG1476Q8B" }, { bienNacional: "024747", serial: "778ACBA007749" }, { bienNacional: "31382", serial: "0065818882891" }, { bienNacional: "024038", serial: "090701-0660466" }]
      },
      {
      usuario: { nombre: "Rito", apellido: "Gonzalez", rolId: 5, direccionNombre: "Dirección administración (sotano)", areaNombre: "Coordinación de cocina" },
      equipos: [{ bienNacional: "29216", serial: "CNG1476Q9F" }, { bienNacional: "29913", serial: "3CQ143B1FN" }, { bienNacional: "021516", serial: "21THR11478" }, { bienNacional: "19232", serial: "9876453" }]
      },
      {
      usuario: { nombre: "Julio", apellido: "Moreno", rolId: 5, direccionNombre: "Dirección general de seguridad y transporte", areaNombre: "Coordinación de seguridad" },
      equipos: [{ bienNacional: "27715", serial: "A000679731" }, { bienNacional: "27731", serial: "C16D8BA000495" }, { bienNacional: "020652", serial: "FJP1Y81U1S71X01920OA0000" }, { bienNacional: "30502", serial: "CN07O1773D" }, { bienNacional: "29014", serial: "75545343" }, { bienNacional: "021927", serial: "2342342" }, { bienNacional: "28748", serial: "CNG14669CW" }, { bienNacional: "28753", serial: "3CQ144C9JJ" }, { bienNacional: "024041", serial: "090701-0660462" }, { bienNacional: "020237", serial: "3121231223" }, { bienNacional: "29013", serial: "1435234235" }, { bienNacional: "023000", serial: "3CQ828NVB" }, { bienNacional: "020412", serial: "CND1D01055" }, { bienNacional: "25131", serial: "WE1692042373" }]
      },
      {
      usuario: { nombre: "Moya", apellido: "", rolId: 5, direccionNombre: "Dirección de producción", areaNombre: "Dirección procesamiento de agua y material de laboratorio" },
      equipos: [{ bienNacional: "29858", serial: "CNG1476TVM" }, { bienNacional: "020212", serial: "MXJ70207CQ" }, { bienNacional: "024702", serial: "778ACBA006992" }, { bienNacional: "024782", serial: "KBAB26Q41647A" }, { bienNacional: "024689", serial: "A000091897" }, { bienNacional: "29844", serial: "3CQ143CFJ0" }]
      },
      {
      usuario: { nombre: "Lilibeth", apellido: "Leottao", rolId: 5, direccionNombre: "CENAVIF", areaNombre: "Caja de ahorro" },
      equipos: [{ id:2295 }, { id:2296 }, { bienNacional: "23797", serial: "95101782585" }, { bienNacional: "32015", serial: "230331-0560766" }]
      }, 

      //Area Externa
      {
      usuario: { nombre: "Carmen", apellido: "Martinez", rolId: 5, direccionNombre: "Regulación sanitaria (area externa)", areaNombre: "Dirección de regulación y consumo humano" },
      equipos: [{ bienNacional: "27855", serial: "A000679668" }, { bienNacional: "27882", serial: "C16D8BA000578" }, { bienNacional: "31994", serial: "02007046667556" }, { bienNacional: "19979", serial: "936741832" }]
      },
      {
      usuario: { nombre: "Carmen", apellido: "Figueroa", rolId: 5, direccionNombre: "Regulación sanitaria (area externa)", areaNombre: "Dirección de regulación y consumo humano" },
      equipos: [{ bienNacional: "19938", serial: "MXJ70207BS" }, { bienNacional: "26187", serial: "A59C6BA005327" }, { bienNacional: "27856", serial: "KBD624K11233A" }, { bienNacional: "17881", serial: "KL0441122300" }]
      },
      {
      usuario: { nombre: "Cesar", apellido: "Albarran", rolId: 5, direccionNombre: "Administracion", areaNombre: "Coordinación de almacén" },
      equipos: [{ bienNacional: "29681", serial: "CNG1476W74" }, { bienNacional: "29711", serial: "3CQ144C9LL" }, { bienNacional: "022793", serial: "BC3370GVBW838Y" }, { bienNacional: "27396", serial: "13355499892" }]
      },
      {
      usuario: { nombre: "Aleiram", apellido: "Chaurio", rolId: 5, direccionNombre: "Departamento de micología", areaNombre: "Área de diagnóstico" },
      equipos: [{ bienNacional: "31897", serial: "A001336216" }, { id:1433 }, { id:505 }, { bienNacional: "24037", serial: "090701-0660465" }]
      },
      {
      usuario: { nombre: "Carmen", apellido: "Estévez", rolId: 5, direccionNombre: "Bioterio", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "27334", serial: "A000670589" }, { bienNacional: "24139", serial: "MY19H9NZ125176P" }, { bienNacional: "20170", serial: "B94540KGASX31Z" }, { bienNacional: "27409", serial: "13355499175" }, { id:1440 }, { bienNacional: "20295", serial: "CNN6430HYL" }, { bienNacional: "24699", serial: "778ACBA015025" }, { bienNacional: "21319", serial: "HA17HVBQ114194Y" }, { bienNacional: "17583", serial: "ZM4314503652" }, { id:1518 }]
      }, 
      {
      usuario: { nombre: "Dulce", apellido: "Navarro", rolId: 5, direccionNombre: "Oficina de infraestructura y proyecto", areaNombre: "Electricidad" },
      equipos: [{ bienNacional: "28954", serial: "CNG1476WB8" }, { bienNacional: "29265", serial: "02EYYCLG205549R" }, { bienNacional: "21089", serial: "BC3370BVBUI4I6" }]
      },
      {
      usuario: { nombre: "Felipe", apellido: "Diaz", rolId: 5, direccionNombre: "Administracion", areaNombre: "Coordinación de almacén" },
      equipos: [{ bienNacional: "29697", serial: "CNG1476Q5X" }, { bienNacional: "29182", serial: "3CQ144C4DX" }, { bienNacional: "31372", serial: "0065818882459" }, { bienNacional: "27542", serial: "13355496313" }, {id:502 }, { id:1705 }, { id:1706 }, { bienNacional: "020433", serial: "CNGD1F00339" }, { bienNacional: "29774", serial: "3CQ145B9PB" }, { bienNacional: "29709", serial: "3CQ144D9J3" }, { bienNacional: "024730", serial: "A000092064" }, { bienNacional: "26015", serial: "A000403891" }, { bienNacional: "25779", serial: "367AL19CA012989" }, { bienNacional: "021028", serial: "E8BY257217" }, { id:1515 }, { bienNacional: "32079", serial: "223A1M9003204" }, { bienNacional: "32030", serial: "2EH32268" }]
      },
      {
      usuario: { nombre: "Evelyn", apellido: "Gonzalez", rolId: 5, direccionNombre: "Bioterio", areaNombre: "Secretaría" },
      equipos: [{ bienNacional: "29850", serial: "CNG1476V84" }, { bienNacional: "29847", serial: "3CQ143CF4N" }, { bienNacional: "24164", serial: "PUAV10010115211" }, { bienNacional: "25658", serial: "13355496041" }, { bienNacional: "18930", serial: "061635013790" }]
      },
      {
      usuario: { nombre: "Edgar", apellido: "Mujica", rolId: 5, direccionNombre: "Bioterio", areaNombre: "Mecánica" },
      equipos: [{ bienNacional: "19316", serial: "06DT25016004" }, { bienNacional: "24739", serial: "A000091950" }, { bienNacional: "20343", serial: "CNN64622RS" }, { bienNacional: "24778", serial: "KBAB23Q47501A" }, { bienNacional: "27465", serial: "13355496406" }]
      }, 
      {
      usuario: { nombre: "Jorge", apellido: "Torres", rolId: 5, direccionNombre: "Oficina de infraestructura y proyecto", areaNombre: "Asistente de dirección" },
      equipos: [{ bienNacional: "24657", serial: "A000091999" }, { bienNacional: "26205", serial: "A59C6BA005786" }, { bienNacional: "29831", serial: "CNG1466932" }, { bienNacional: "27842", serial: "C16D8BA000467" }, { bienNacional: "16374", serial: "C0403116805" }, { bienNacional: "20050", serial: "3L0651X26575" }, { bienNacional: "29835", serial: "CNG147TYC" }, { bienNacional: "21722", serial: "CND1R74187" }]
      },
      {
      usuario: { nombre: "Gabriel", apellido: "Gomez", rolId: 5, direccionNombre: "Oficina de infraestructura y proyecto", areaNombre: "Electrónica" },
      equipos: [{ bienNacional: "29693", serial: "CNG1476W7X" }, { bienNacional: "28751", serial: "3CQ145BCFW" }, { bienNacional: "20735", serial: "BC3370BVBUMJZ8A" }]
      },
      {
      usuario: { nombre: "Iliana", apellido: "Osal", rolId: 5, direccionNombre: "Regulación sanitaria (area externa)", areaNombre: "Dirección de regulación y consumo humano" },
      equipos: [{ bienNacional: "26269", serial: "A000403812" }, { bienNacional: "27717", serial: "C16D8BA000470" }, { bienNacional: "31993", serial: "0200704666757" }, { bienNacional: "021539", serial: "4357434" }, { bienNacional: "19238", serial: "3242355" }]
      },
      {
      usuario: { nombre: "Liria", apellido: "Urdaneta", rolId: 5, direccionNombre: "Regulación sanitaria (area externa)", areaNombre: "Dirección de regulación y consumo humano" },
      equipos: [{ bienNacional: "26209", serial: "A000403907" }, { bienNacional: "26160", serial: "A59C6BA005216" }, { bienNacional: "17820", serial: "ZM5527023263" }, { bienNacional: "27451", serial: "13355499936" }]
      },
      {
      usuario: { nombre: "Jennifer", apellido: "Cantillos", rolId: 5, direccionNombre: "Departamento de micología", areaNombre: "Área de diagnóstico" },
      equipos: [{ bienNacional: "30376", serial: "A000907103" }, { bienNacional: "20017", serial: "CNN6430J84" }, { bienNacional: "24676", serial: "KBAB23Q46998A" }]
      },
      {
      usuario: { nombre: "Leinder", apellido: "Leon", rolId: 5, direccionNombre: "Departamento de micología", areaNombre: "Atención al paciente" },
      equipos: [{ bienNacional: "26249", serial: "A000403948" }, { bienNacional: "26178", serial: "A59C6BA005764" }, { bienNacional: "32018", serial: "230331-0560760" }]
      }, 
      {
      usuario: { nombre: "Roberto", apellido: "Hernandez", rolId: 5, direccionNombre: "Oficina de infraestructura y proyecto", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "27624", serial: "A000679554" }, { bienNacional: "28771", serial: "3CQ144C3BM" }, { bienNacional: "26046", serial: "KBC220K11144A" }, { bienNacional: "16692", serial: "ZM5327085980" }, { bienNacional: "27514", serial: "13355494912" }, { bienNacional: "27578", serial: "13355495053" }, { bienNacional: "21697", serial: "803MXHB12009" }, { bienNacional: "20111", serial: "3L0651X26630" }, { bienNacional: "26233", serial: "A000403960" }, { bienNacional: "32355", serial: "240632510744" }, { bienNacional: "20055", serial: "MXJ602076Q" }, { bienNacional: "24844", serial: "A000092055" }, { bienNacional: "24279", serial: "YC5RH9LZ603605X" }, { bienNacional: "26058", serial: "KBC220K12722A" }, { bienNacional: "20058", serial: "3L0651X26435" }, { bienNacional: "24238", serial: "21DQS01511" }, { bienNacional: "23001", serial: "CNWDF42917" }]
      },
      {
      usuario: { nombre: "Nelitza", apellido: "Reyes", rolId: 5, direccionNombre: "Oficina de infraestructura y proyecto", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "28826", serial: "CNG1476VC8" }, { bienNacional: "29825", serial: "3CQ144C3S2" }, { bienNacional: "16469", serial: "K0403116631" }, { bienNacional: "20054", serial: "2132143123" }, { bienNacional: "20910", serial: "CND1N08481" }]
      },
      {
      usuario: { nombre: "Raquel", apellido: "Machado", rolId: 5, direccionNombre: "Administracion", areaNombre: "Caja" },
      equipos: [{ bienNacional: "31843", serial: "A001333867" }, { bienNacional: "31844", serial: "KBHC12K12662A" }, { bienNacional: "20219", serial: "3L0651X26585" }, { bienNacional: "18426", serial: "E8BY157228" }, { bienNacional: "29775", serial: "CNG1476PJY" }, { bienNacional: "25815", serial: "ZUHJHTKC401586T" }, { bienNacional: "31373", serial: "0065818882455" }, { bienNacional: "32163", serial: "9L2213A00105" }]
      },
      {
      usuario: { nombre: "Mariela", apellido: "Tovar", rolId: 5, direccionNombre: "Administracion", areaNombre: "Coordinación de almacén" },
      equipos: [{ bienNacional: "29699", serial: "CNG1476PVF" }, { bienNacional: "28707", serial: "3CQ144C4L8" }, { bienNacional: "16694", serial: "KD0441122304" }]
      },
      {
      usuario: { nombre: "Natali", apellido: "Rios", rolId: 5, direccionNombre: "Administracion", areaNombre: "Coordinación de almacén" },
      equipos: [{ bienNacional: "26025", serial: "A000403741" }, { bienNacional: "29777", serial: "3CQ144C91N" }, { bienNacional: "020102", serial: "B94540AVBSX4WEA" }, { bienNacional: "32165", serial: "9L2213A00108" }]
      },
      {
      usuario: { nombre: "Richard", apellido: "Alvarado", rolId: 5, direccionNombre: "Administracion", areaNombre: "Coordinación de almacén" },
      equipos: [{ bienNacional: "29778", serial: "CNG146691J" }, { bienNacional: "26173", serial: "A59C6BA005275" }, { bienNacional: "26014", serial: "KBC523K10961A" }, { bienNacional: "020884", serial: "070527-1291870" }]
      },
      {
      usuario: { nombre: "Maribel", apellido: "Dolande", rolId: 5, direccionNombre: "Departamento de micología", areaNombre: "Dirección" },
      equipos: [{ bienNacional: "31919", serial: "A001336193" }, { bienNacional: "32112", serial: "223B5B6000723" }, { bienNacional: "32019", serial: "230331-0560762" }, { bienNacional: "30379", serial: "A000907189" }, { bienNacional: "30384", serial: "D72E6BA000514" }, { bienNacional: "17772", serial: "KL0441126590" }]
      }, 
      {
      usuario: { nombre: "Ruben", apellido: "Monsalve", rolId: 5, direccionNombre: "Oficina de infraestructura y proyecto", areaNombre: "Infraestructura" },
      equipos: [{ bienNacional: "27312", serial: "A000679716" }, { bienNacional: "28763", serial: "3CQ144DC0W" }, { bienNacional: "24738", serial: "KBAB23Q47506A" }]
      },
      {
      usuario: { nombre: "Yatzury", apellido: "Olivar", rolId: 5, direccionNombre: "Administracion", areaNombre: "Caja" },
      equipos: [{ bienNacional: "31845", serial: "A001332789" }, { bienNacional: "31846", serial: "KBHC12K16995A" }, { bienNacional: "30103", serial: "423534432" }, { id:2581 }, { bienNacional: "12526", serial: "21324234" }]
      },
      {
      usuario: { nombre: "Rossana", apellido: "Martinez", rolId: 5, direccionNombre: "Regulación sanitaria (area externa)", areaNombre: "Dirección de regulación y consumo humano" },
      equipos: [{ bienNacional: "27853", serial: "A000679652" }, { bienNacional: "27875", serial: "C16D8BA000529" }, { bienNacional: "16450", serial: "C0403117018" }, { bienNacional: "17818", serial: "KL044120614" }]
      },
      {
      usuario: { nombre: "Victor", apellido: "Larez", rolId: 5, direccionNombre: "Regulación sanitaria (area externa)", areaNombre: "Dirección de regulación y consumo humano" },
      equipos: [{ bienNacional: "26021", serial: "A000403895" }, { bienNacional: "27723", serial: "C16D8BA000530" }, { bienNacional: "20825", serial: "BC3370BVBUEDHHA" }, { bienNacional: "27381", serial: "13355495294" }]
      },
      {
      usuario: { nombre: "Zuleidy", apellido: "Marrero", rolId: 5, direccionNombre: "Regulación sanitaria (area externa)", areaNombre: "Dirección de regulación y consumo humano" },
      equipos: [{ bienNacional: "27821", serial: "A000679552" }, { bienNacional: "29823", serial: "3CQ144D9YX" }, { bienNacional: "26210", serial: "KBC220K12721A" }, { bienNacional: "20837", serial: "070527-1291912" }]
      },
      {
      usuario: { nombre: "Zuraima", apellido: "Rodriguez", rolId: 5, direccionNombre: "Regulación sanitaria (area externa)", areaNombre: "Dirección de regulación y consumo humano" },
      equipos: [{ bienNacional: "27851", serial: "A000679671" }, { bienNacional: "27878", serial: "C16D8BA000500" }, { bienNacional: "27854", serial: "KBD624K11231A" }, { bienNacional: "32085", serial: "21312312321" }, { bienNacional: "20082", serial: "3L0651X26535" }, { bienNacional: "27572", serial: "13355495061" }, { bienNacional: "18915", serial: "061635010047" }, { bienNacional: "30076", serial: "VNB6Z07941" }, { bienNacional: "25999", serial: "A000403744" }, { bienNacional: "20088", serial: "CNN64623KB" }, { bienNacional: "26020", serial: "KBC518K11066A" }, { bienNacional: "27434", serial: "13355498909" }, { bienNacional: "20839", serial: "070527-1290912" }, { bienNacional: "21930", serial: "8123612733431" }, { bienNacional: "19240", serial: "1243432" }, { bienNacional: "27716", serial: "KBD624K14531A" }, { bienNacional: "27822", serial: "KBD624K14407A" }, { bienNacional: "32142", serial: "CNB1S334QB" }, { bienNacional: "32114", serial: "223B5B6000717" }, { bienNacional: "31733", serial: "05XD3CUJ301063A" }, { bienNacional: "31551", serial: "18101HFDD31R8S" }]
      },
      {
      usuario: { nombre: "Roselia", apellido: "Garcia", rolId: 5, direccionNombre: "Departamento de micología", areaNombre: "Secretaría" },
      equipos: [{ bienNacional: "26231", serial: "A000403724" }, { bienNacional: "30374", serial: "FSEEAHA028282" }, { bienNacional: "18292", serial: "CNBK768953" }, { id:1516}, { bienNacional: "27488", serial: "13355498326" }]
      },
      {
      usuario: { nombre: "Soyimar", apellido: "Abreu", rolId: 5, direccionNombre: "Departamento de micología", areaNombre: "Atención al paciente" },
      equipos: [{ bienNacional: "26069", serial: "A000403884" }, { bienNacional: "30371", serial: "D72E6BA000529" }, { bienNacional: "30372", serial: "KBD917K11368A" }, { bienNacional: "25791", serial: "932843274823" }, { id:1711 }]
      },
    ];

      // Crear Usuarios
    const createUsuarios = async () => {
      console.log("Iniciando creación de usuarios...");
      
      for (const dataUsuario of dataUsuarios) {
        console.log(`Procesando usuario: ${dataUsuario.usuario.nombre}`);
        
        // 1. Buscar dirección
        const direccion = await prismadb.direcciones.findFirst({
          where: { direccion: dataUsuario.usuario.direccionNombre },
          include: { areas: true }
        });

        if (!direccion) {
          console.log(`Dirección no encontrada para: ${dataUsuario.usuario.nombre}`);
          continue;
        }

        // 2. Buscar área dentro de la dirección
        let areaId = null;
        if (dataUsuario.usuario.areaNombre && direccion.areas) {
          const area = direccion.areas.find(a => a.nombre === dataUsuario.usuario.areaNombre);
          if (area) {
            areaId = area.id;
          } else {
            console.log(`Área no encontrada: ${dataUsuario.usuario.areaNombre}`);
          }
        }

        // 3. HASHEAR CONTRASEÑA ANTES DE CREAR USUARIO
        let hashedPassword = dataUsuario.usuario.password;
        
        // Solo hashear si la contraseña existe y no está ya hasheada
        if (dataUsuario.usuario.password && !dataUsuario.usuario.password.startsWith('$2a$')) {
          try {
            hashedPassword = await bcrypt.hash(dataUsuario.usuario.password, 12);
            console.log(`Contraseña hasheada para: ${dataUsuario.usuario.nombre}`);
          } catch (error) {
            console.log(`❌ Error hasheando contraseña para ${dataUsuario.usuario.nombre}:`, error);
            // Mantener la contraseña original si hay error (fallback)
            hashedPassword = dataUsuario.usuario.password;
          }
        } else if (dataUsuario.usuario.password) {
          console.log(`⏭️ Contraseña ya hasheada para: ${dataUsuario.usuario.nombre}`);
        }

        // 4. Crear usuario con contraseña hasheada
        const usuario = await prismadb.usuario.create({
          data: {
            nombre: dataUsuario.usuario.nombre,
            apellido: dataUsuario.usuario.apellido,
            email: dataUsuario.usuario.email, 
            password: hashedPassword, // ← Ahora hasheada
            rolId: dataUsuario.usuario.rolId,
            direccionId: direccion.id,
            areaId: areaId
          }
        });

        console.log(`Usuario creado: ${usuario.nombre} ${usuario.apellido} (ID: ${usuario.id})`);

        // 5. Asignar equipos (tu código existente)
        let equiposAsignados = 0;
        for (const equipo of dataUsuario.equipos) {
          
          let result;
          
          // LÓGICA DUAL: Puedes usar ID directo O bienNacional/serial
          if (equipo.id) {
            // Opción 1: Usar ID directo del equipo
            try {
              result = await prismadb.equipos.update({
                where: { id: equipo.id },
                data: { usuarioId: usuario.id }
              });
              console.log(`Equipo actualizado por ID: ${equipo.id}`);
              equiposAsignados += 1;
            } catch (error) {
              console.log(`Error actualizando equipo por ID ${equipo.id}:`, error);
            }
          } else if (equipo.bienNacional && equipo.serial) {
            // Opción 2: Buscar por bienNacional y serial
            const whereCondition = {
              bienNacional: equipo.bienNacional,
              serial: equipo.serial
            };
            
            try {
              result = await prismadb.equipos.updateMany({
                where: whereCondition,
                data: { usuarioId: usuario.id }
              });
            
              equiposAsignados += result.count;
              
              if (result.count === 0) {
                console.log(`Equipo no encontrado con bienNacional: ${equipo.bienNacional} y serial: ${equipo.serial}`);
              }
              
            } catch (error) {
              console.log(`Error actualizando equipo:`, error);
            }
          } else {
            console.log(`Equipo sin formato válido:`, equipo);
          }
        }
        console.log(`✅ Total equipos asignados a ${usuario.nombre}: ${equiposAsignados}`);
      }
    };

    // EJECUTAR la función
    createUsuarios()
      .then(() => console.log("Script ejecutado exitosamente"))
      .catch((error) => console.error("Error:", error));
    

  } catch (error) {
    console.log(error);
  }
}
