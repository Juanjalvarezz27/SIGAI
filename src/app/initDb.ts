import prismadb from "@/lib/prismadb";
import seedEquipos from "../../seeds/equiposSeed"
import seedDirecciones from "../../seeds/direccionesSeed"
import seedMarcasModelos from "../../seeds/marcasModelosSeed"
import seedEspecificacionesAdicionales from "../../seeds/especificacionesAdicionalesSeed"


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
      equipos: [{ bienNacional: "20120", serial: "MXJ702078W" }, { bienNacional: "27732", serial: "C16D8BA000464" }, { bienNacional: "26063", serial: "A000403921" }, { bienNacional: "22612", serial: "17070044731" }, { bienNacional: "07N549502014", serial: "07N549502014" }]
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
      usuario: { nombre: "Jose", apellido: "Cardenas", rolId: 5, direccionNombre: "Dirección de tecnología e informatica", areaNombre: "Dirección de informatica" },
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

        console.log("Dirección encontrada");

        if (!direccion) {
          console.log(`❌ Dirección no encontrada para: ${dataUsuario.usuario.nombre}`);
          continue;
        }

        // 2. Buscar área dentro de la dirección
        let areaId = null;
        if (dataUsuario.usuario.areaNombre && direccion.areas) {
          const area = direccion.areas.find(a => a.nombre === dataUsuario.usuario.areaNombre);
          if (area) {
            areaId = area.id;
            console.log(`Área encontrada`);
          } else {
            console.log(`⚠️ Área no encontrada: ${dataUsuario.usuario.areaNombre}`);
          }
        }

        // 3. Crear usuario
        const usuario = await prismadb.usuario.create({
          data: {
            nombre: dataUsuario.usuario.nombre,
            apellido: dataUsuario.usuario.apellido,
            rolId: dataUsuario.usuario.rolId,
            direccionId: direccion.id,
            areaId: areaId
          }
        });

        console.log(`Usuario creado: ${usuario.nombre} ${usuario.apellido} (ID: ${usuario.id})`);

        // 4. Asignar equipos
        let equiposAsignados = 0;
        for (const equipo of dataUsuario.equipos) {
          console.log(`Buscando equipo:`, equipo);
          
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
              console.log(`❌ Error actualizando equipo por ID ${equipo.id}:`, error);
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
              
              console.log(`Equipos actualizados: ${result.count}`);
              equiposAsignados += result.count;
              
              if (result.count === 0) {
                console.log(`⚠️ Equipo no encontrado con bienNacional: ${equipo.bienNacional} y serial: ${equipo.serial}`);
              }
              
            } catch (error) {
              console.log(`Error actualizando equipo:`, error);
            }
          } else {
            console.log(`❌ Equipo sin formato válido:`, equipo);
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
