import { PrismaClient } from "@prisma/client";

export default async function seedMarcasModelos(prisma: PrismaClient) {

    // Data de las Marcas
    const marcas = [
    'ABLEREX', 'ACER', 'AEOLUS', 'VITDOK', 'CLOM', 'AGILER', 'AIN', 'AIWA', 'AITEG', 'ALEXA', 'APC',
    'APS', 'AOC', 'ARAWAK', 'ARTEX', 'ASUS', 'AVR', 'AVAYA', 'AVETEK', 'AVTEK',
    'BENQ', 'CANON', 'CASIO', 'CDP', 'CHECK POINT', 'CLON', 'CLON (SELEKTRO)',
    'COLON', 'COMPAQ', 'COMPUCORP', 'CONON', 'CREATIVE', 'CPD', 'DELL', 'DELUXE',
    'DIAMOND', 'ELUX', 'EMERALD', 'ENERGY', 'ENERGY POWER', 'EPSON', 'EQQUS',
    'ERKU', 'EVOLIS', 'EXECELINE', 'FORZA', 'GENERICO', 'GENESIS', 'GENIUS',
    'HARMAN / KARDON', 'HARMAN KARDON', 'HONEYWELL', 'HP', 'HUNTKEY', 'I-SOURCE',
    'I-SORCE', 'I-SORECE', 'I-SOERCE', 'INTERCLNE', 'INTEGRA', 'INTEGRAL', 'JBL',
    'JEMIP', 'JVC', 'KARMAN (KARDON)', 'KODE', 'LENOVO', 'LG', 'LIFECHATLX-4000',
    'LOGITECH', 'LOGOTECH', 'MAC', 'MARSRIVA', 'MERCUSYS', 'MICROSFOT',
    'MICROSOFT', 'MINI2.1 USB', 'MONROE', 'MOTOROLA', 'Mouse', 'N/A', 'NAKAJIMA',
    'NO POSEE', 'OLAX LTE', 'ONE', 'PANASONIC', 'PC WORKS', 'PCWORKS',
    'PHASE ELECTRONICA', 'PHASE II', 'PHILIPS', 'POWER LINE', 'POWERLINE',
    'POWMAX', 'PYLE', 'ROOFULL', 'SAMSUMG', 'SAMSUNG', 'SEAGATE', 'SELEKTRO',
    'SIEMENS', 'SIRAGON', 'SONIC', 'SONY', 'SOUNDCRAFT', 'SPIRIT', 'SUPER POWER',
    'SYMBOL', 'TATTOO', 'TECAM', 'TEMP', 'THINKCENTRE', 'TONAL', 'TOSHIBA',
    'TP-LINK', 'TPELINK', 'TRIPP-LITE', 'TRUST', 'UMouse', 'U-Mouse', 'UP PRODUCTS',
    'UPRODUCTS', 'VAXUM', 'VIT', 'XEROX', 'ZEBRA', 'ZIP', 'ZUHIPOINT', 'SONICK', 'Q', 
    ];

    // Crear cada marca en la base de datos
    await prisma.marca.createMany({
        data: marcas.map(nombreMarca => ({ nombre: nombreMarca })),
        skipDuplicates: true, 
    });

    // Data de los Modelos
    const modelos = [
    '024748', '06941V', '1113', '1113AVR600', '1200LC-B118', '121739-016A',
    '1475', '151X RM', '151XRM', '1576', '190LM00006', '19B4LCS5',
    '1SVC PC-1005', '2020PLUSS', '215LME00019', '215LM00019', '215LM00041',
    '215LM33319', '215ML00020', '24MP60G-B', '2600', '2610WS IP', '2901-02',
    '2910-02', '3D OPTICAL Mouse', '3800G', '40610SWIP', '4260',
    '42PX 4RVH', '450NB', '4610 SW IP', '4610SW', '4610SW IP', '4610SWDPS',
    '4610WS IP', '4621SW', '4621SW IP', '4910SW IP', '4A507', '4A50B',
    '4A50B1', '5008MT', '5500', '5501', '55UP7500PSF', '6005 PRO', '6005PRO',
    '600VA', '6512-TW', '6512-WA', '6678-9VA', '710N', '740N', '740NW',
    '881D+', '943 SNXPLUS', '943SNXPLUS', 'AB-R1204', 'A1144', 'A1152',
    'A1186MC', 'A1243', 'A14S19A10N', 'AC1200', 'AE-640', 'AIO MT-1915',
    'AIOMT1915', 'ARCHER A10', 'ARCHER C80', 'AVR 600', 'AVR750U', 'AVR600',
    'AVR600BA', 'AW40N1SM', 'AX5 PRO', 'B-AVR 1005', 'B-AVR-1600',
    'B-AVR1006', 'BACK-UPS 1350LX-350', 'BACK-UPS 650', 'BACK-UPS650',
    'BACK-UPS PRO 1500', 'B21-Y3', 'B7W64E', 'BKPRO 1200', 'BR1300LCD',
    'CINEMA HD DISPLAY', 'CLON', 'COLOR LASER 150NW', 'COLOR LASERJETCP2025',
    'COMAPQ DX2300', 'COMPAC6005', 'COMPACQDE7700', 'COMPAQ 0505',
    'COMPAQ 500B MT', 'COMPAQ 5800', 'COMPAQ 6005', 'COMPAQ 6005 PRO',
    'COMPAQ 6005 PRO MT', 'COMPAQ 6005PRO', 'COMPAQ 6605', 'COMPAQ D220',
    'COMPAQ D220 MT', 'COMPAQ D220MT', 'COMPAQ DC 5100 MT', 'COMPAQ DC 7700',
    'COMPAQ DC5700', 'COMPAQ DC7700', 'COMPAQ DK5100 SFF', 'COMPAQ DX 2300',
    'COMPAQ DX 2301', 'COMPAQ DX2400', 'COMPAQ DX2300', 'COMPAQ LE 1901',
    'COMPAQ LE1901WL', 'COMPAQ LE1901WLK639M-QAE97', 'COMPAQ LE190',
    'COMPAQ LE19901WL', 'COMPAQ PRESARIO F75LA', 'COMPAQ d220 MT',
    'COMPAQTFT19W80PSDOK-K5313', 'COMPQ 500B MT', 'DATASAFE420', 'DC 5100',
    'DC 7700', 'DC770', 'DC7700', 'D8904', 'DESCONOCIDO', 'DESKJET 1056',
    'DESKJET 840C', 'DESKJET 920', 'DESKJET 920C', 'DESKJET 930C',
    'DESKJET INK ADVANTAGE 4625', 'DESKJETD430', 'DESKJETD431', 'DH10141',
    'DIK-K5313', 'DIK-M696', 'DOK-5313', 'DOK-5318U', 'DOK-K5313',
    'DOK-K5318U', 'DOK-K5318u', 'DOK-K5318UM-UAE962910-02', 'DOK-M5313',
    'DOK-M696', 'DOK/K5313N/A', 'DR-120TM', 'DR-140L', 'DTB540', 'DX 2400',
    'DX2300', 'E0VIT2220-03-01', 'E1210-01', 'E1900HQY-U0009', 'E1916HV',
    'E2020H', 'E2202-03', 'E2220-03', 'E2222H', 'E2420H', 'E6400',
    'ECONOMIC SERIES', 'EL1901WL', 'ENGAGE FLEX PRO', 'ESCANJER 8290',
    'ET-4750', 'F132500', 'F189204', 'FLATRON W1943C', 'FLATRON L194WS',
    'FQC-08909', 'FOR PCS', 'FVR-1211USB', 'FX-890', 'G5 A1144A1243A1152',
    'GENERICO', 'GENERICO EREGONOMICO', 'GK-100016', 'GK-100016M',
    'GM-03022P', 'GM-03022PXSCROLL', 'GM-040011P', 'GM-040013A', 'GM-04003A',
    'GM-04004P', 'GM-080008', 'GM-120014', 'GM-C400', 'GM1214', 'GSM-PC',
    'H170L', 'H430AFT-301', 'HC078611HV-DH10151X RM', 'HD 720P', 'HK195S',
    'HP 6005 PRO', 'HP COLOR LASER JET CP2025', 'HP COMPAQ 6005',
    'HP COMPAQ 6005PRO', 'HP COMPAQ LE1901WL', 'HP DESKJET 920C',
    'HP DESKJET D4360', 'HP L1706', 'HP LASERJET P3005N',
    'HP SCANJET G3110', 'HQ-TRE71025', 'HSTND-2L08', 'IMAGENCLASS MF4770N',
    'IMAGE RUNNER 1019J', 'IMAGERUNNER 1019J', 'IMAGE RUNNER1310',
    'IMAGERUNNER 2022i', 'IMAGERUNNE 1310', 'IMAGEUNNER-1019J', 'INT-7051',
    'ISPIRON 5400 AIO SERIES', 'ISO-EUK32SP', 'IZITK-105MM',
    'JHD-AD065B-BA-PD05', 'JKD6C72', 'JP-MHTV4001K', 'K627', 'K627M2400-01',
    'K639', 'K6939', 'KA190M320B-AVR1006', 'K-AVR 1006', 'K-AVR1006',
    'KB-0316', 'KB-06', 'KB-2971', 'KB-9970', 'KB212-B', 'KB216P', 'KB2971',
    'KBM-1500', 'KE11073597', 'KL-0210', 'KN-0316', 'KP3ARCHER C50',
    'KR-3502PSPQ', 'KU-0138', 'KU-0225', 'KU-0316', 'KU-03161', 'KU-0319',
    'KX-FT67', 'KX-FT931LA', 'L00U', 'L-B118', 'L120', 'L1706', 'L1707',
    'L1710', 'L1901wl', 'L1906', 'L194WS-BF', 'L194WS', 'L210', 'L3110',
    'LASER 1022', 'LASER 107W', 'LASERJET 1200', 'LASERJET 2100',
    'LASERJET 3600n', 'LASERJET CP1215', 'LASERJET M1212', 'LASERJET P1102W',
    'LASERJET P1606dn', 'LASERJET P2035', 'LASERJET P3005',
    'LASERJET P4515N', 'LASERJET PRO M12W', 'LASERJET PRO MFP M479FDW',
    'LASERT P3005n', 'Laser JetCP2025', 'LaserJet EnterpriseMFP M578',
    'Laserjet P3005', 'LATITUDE 3520', 'LC-B118', 'LE 1901WL', 'LE-706',
    'LE1851W', 'LE1901', 'LE1901Wl', 'LE1901WL', 'LE1901wL', 'LE19O1WL',
    'LED 1901', 'LED GAMING KEYBOARD', 'LED GAMING KEYBORN', 'LINE - R 300',
    'LINE-R 1200', 'LINE-R 300', 'LINE-R1200', 'LINE-R300', 'LINER- R1200',
    'LINER1200', 'LINER300', 'LJP3005', 'LNE-R 1200', 'LS 1200',
    'LS1200 LM60', 'LS1200-LM60', 'LX-350', 'M.UAE96', 'M-UAE 96',
    'M-UAE696', 'M-UAE96', 'M-UEA96', 'M-UARDEL7', 'M-BJ58', 'M-S34',
    'M-S48A', 'M-SBF696', 'M-SBF96', 'M-SBF996', 'M-SBJ86', 'M-SBJ96',
    'M106-PAUTTR-1000', 'M129H', 'M139', 'M2024ZP2200', 'M2400', 'M2400-01',
    'M2420', 'M2420-01', 'M2420-03-01', 'M2420ZP2200', 'M366', 'M800-P2M',
    'MODGUO', 'MO-67RP', 'MO42KC', 'MOAFUO', 'MOFYUO', 'MOJUUO', 'MOA-FUO',
    'MP11DX', 'MP41DHIIM2420-01', 'MR-AVR 600', 'MS111-L', 'MS116', 'MS116T',
    'MS116T1', 'MSK-1113', 'MSK-1113K-AVR1006', 'MSU07183', 'MSU0718T',
    'MSU0718TR', 'MSU07TT', 'MSVF96', 'MT-1916', 'MUAE96', 'MXL7500HRV',
    'N/A', 'N-20HBA', 'N-NETSCROLL 120', 'NETSCROLL 120', 'NETSCROLL120',
    'NETSCRO120', 'N910UA14S19A10N', 'NO INDICA', 'NO POSEE', 'NT-1011',
    'OFFICEJET 4000', 'OFFICEJET 4500', 'OPTICAL-Mouse', 'OPTIPLEX 3070',
    'OPTIPLEX 3080', 'OPTIPLEX 5040', 'OPTIPLEX 7010', 'OPTIPLEX XE3',
    'OPTIPLEX3000', 'P-16', 'P142065UP7500PSF', 'P1420LT-50KB534', 'P1917S',
    'P2417H', 'P2422H', 'P2460J', 'P3400HKA0939619021-8C', 'PABILIUN',
    'PC-1500-AVR', 'PC PLUS', 'PCG1200S', 'PC-R', 'PEV-B',
    'PHOTOSMART C4180', 'PL-600', 'PL-600A', 'PR1101U', 'PRIMACY', 'PRO 1300',
    'PRO 1500', 'PRO 3400', 'PRX500', 'PRX501', 'PSBV200BT', 'PXSCROLL',
    'PXB49AMSUU718T', 'QR-0816', 'RC-V 600', 'REV-B', 'REVA01', 'RL-103C',
    'RL-103E', 'RL-115', 'RL-115B', 'RL-NA', 'RLS-1500', 'RLS-2000',
    'RP-117B', 'RP5700', 'RPC PLUS -600', 'RPCPLUS-600', 'RT-1000', 'RT7D00',
    'RTL1000', 'RTL-1000', 'RTL 1000', 'RVC-600', 'S120', 'S1922A', 'S19A10N',
    'S19B300N', 'S22D300NY', 'SAFEVIEW -600VA', 'SAFEVIEW-600VA',
    'SAFETY MARK', 'SCANJET 3670', 'SCANJET 4400C', 'SCANJET 5590',
    'SCANJET G3010', 'SCANJET PRO 3600F1', 'SCANJET PRO N4000 SNW1', 'SBS52',
    'SBXW-166LAGE-6', 'SC-1688', 'SEK-1688', 'SBF-96', 'SHNGD-1401-00',
    'SIEP', 'SK-1688', 'SK-1688GM-04004P', 'SK-2085', 'SK-2880', 'SK-8120',
    'SK-8825', 'SK-BB27', 'SK-KB-108', 'SKKB-108', 'SL-2001UL',
    'SMART-UPS 1500', 'SMART-UPS3000', 'SP-9800AUCE000', 'SP-Q06S', 'SP-Q180',
    'SP-S110', 'SPIRIT FX16', 'SPOTLIGHT PRO', 'SQ-1688', 'SRD0PV1',
    'SVCPC-1005', 'SYMBOL', 'SYNCMASTER 510N', 'SYNCMASTER 540N',
    'SYNCMASTER 740N', 'SYNCMASTER 740NW', 'SYNCMASTER740N', 'T2224DA',
    'TFT19W', 'TFT19W80CS', 'TFT19W80FPS', 'TFT19W80PS',
    'TFT19W80PSDOK-K5313M-SBF96', 'TFT19WHP COMPAQ 6005PRO', 'TFT19WSOPS',
    'TFT20W90PS', 'THINKCENTER', 'THINKCENTRE', 'THINKCENTRE M71e', 'TIR825MVIT',
    'TL-GTF10080', 'TLP 2844', 'TL-SF1008D', 'TL-WR844NRW5427',
    'TP3005DR-140TM', 'TTR-1000', 'U-BTC1200', 'U-PTC 1200', 'U-PTC1200',
    'UAE96', 'UN85TU7000F', 'UPR 1000VA', 'UV-006', 'V173', 'V173 BS',
    'V19LW-B', 'V215EW-BN/AR', 'VECTRA VL400 DT', 'VIT 2600', 'VIT 2910-02',
    'VIT M2400', 'W1943C', 'W1942ST', 'W2371D', 'WEBCAM',
    'WIRED KEYBOARD 600MSK-1113', 'WIRED KEYBOARD 650', 'XEROX',
    'XEROX WORKCENTRE 3220', 'ZP220', 'ZP2200'
    ];
    
    // Primero crea una marca por defecto
    await prisma.marca.upsert({
      where: { nombre: "POR DEFINIR" },
      update: {},
      create: { nombre: "POR DEFINIR" }
    });

    // Data de Modelo + Marca
    const modelosConMarcaConocida = [
      { modelo: "LC-B118", marca: "VIT" }, { modelo: "DESKJET INK ADVANTAGE 4625", marca: "HP" }, { modelo: "COMPAQ 6005", marca: "HP" }, { modelo: "LE1901WL", marca: "HP" }, { modelo: "KU-0319", marca: "HP" }, { modelo: "NETSCROLL120", marca: "GENIUS" }, { modelo: "LINE-R 1200", marca: "APC" }, { modelo: "COMPQ 500B MT", marca: "HP" }, { modelo: "L1706", marca: "HP" }, { modelo: "SK-8120", marca: "DELL" },
      { modelo: "M-UAE96", marca: "HP" }, { modelo: "RL-115B", marca: "AVTEK" }, { modelo: "COMPAQ DC7700", marca: "HP" }, { modelo: "SYNCMASTER 740N", marca: "SAMSUNG" }, { modelo: "SC-1688", marca: "HP" }, { modelo: "DOK-M696", marca: "VIT" }, { modelo: "NO POSEE", marca: "COMPUCORP" }, { modelo: "KU-0316", marca: "HP" }, { modelo: "COMPAQ D220MT", marca: "HP" }, { modelo: "5500", marca: "HP" },
      { modelo: "2901-02", marca: "VIT" }, { modelo: "TFT19W80PS", marca: "VIT" }, { modelo: "DOK-K5313", marca: "VIT" }, { modelo: "1113", marca: "MICROSOFT" }, { modelo: "4621SW IP", marca: "AVAYA" }, { modelo: "M2400", marca: "VIT" }, { modelo: "ZP2200", marca: "ERKU" }, { modelo: "DOK-K5318U", marca: "VIT" }, { modelo: "4910SW IP", marca: "AVAYA" }, { modelo: "E2202-03", marca: "VIT" },
      { modelo: "215LM33319", marca: "VIT" }, { modelo: "2600", marca: "VIT" }, { modelo: "KB2971", marca: "VIT" }, { modelo: "MSU0718T", marca: "VIT" }, { modelo: "PCG1200S", marca: "ARAWAK" }, { modelo: "SP-Q180", marca: "GENIUS" }, { modelo: "4610SW IP", marca: "AVAYA" }, { modelo: "KX-FT67", marca: "PANASONIC" }, { modelo: "2020PLUSS", marca: "MONROE" }, { modelo: "SPOTLIGHT PRO", marca: "TRUST" },
      { modelo: "DTB540", marca: "TOSHIBA" }, { modelo: "IMAGERUNNER 1019J", marca: "CANON" }, { modelo: "LASERJET CP1215", marca: "HP" }, { modelo: "AC1200", marca: "MERCUSYS" }, { modelo: "COMPAQ d220 MT", marca: "HP" }, { modelo: "SK-1688", marca: "HP" }, { modelo: "RTL-1000", marca: "TONAL" }, { modelo: "2910-02", marca: "VIT" }, { modelo: "FVR-1211USB", marca: "FORZA" }, { modelo: "ET-4750", marca: "EPSON" },
      { modelo: "M366", marca: "DELUX" }, { modelo: "LNE-R 1200", marca: "APC" }, { modelo: "DOK-5318U", marca: "VIT" }, { modelo: "LINE-R 1200", marca: "APC" }, { modelo: "Laser JetCP2025", marca: "HP" }, { modelo: "LaserJet EnterpriseMFP M578", marca: "HP" }, { modelo: "GM-080008", marca: "GENIUS" }, { modelo: "JKD6C72", marca: "DELL" }, { modelo: "P2417H", marca: "DELL" }, { modelo: "MS116T", marca: "DELL" },
      { modelo: "VECTRA VL400 DT", marca: "HP" }, { modelo: "D8904", marca: "HP" }, { modelo: "151X RM", marca: "SAMSUMG" }, { modelo: "KB-9970", marca: "HP" }, { modelo: "LINE-R300", marca: "APC" }, { modelo: "4A507", marca: "KODE" }, { modelo: "RCV 600", marca: "AVTEK" }, { modelo: "RLS-2000", marca: "AVTEK" }, { modelo: "Laserjet P3005", marca: "HP" }, { modelo: "PRO 1300", marca: "APC" },
      { modelo: "B-AVR1006", marca: "CDP" }, { modelo: "LASER 107W", marca: "HP" }, { modelo: "ISO-EUK32SP", marca: "I-SOERCE" }, { modelo: "COMPAQ DX2400", marca: "HP" }, { modelo: "MO42KC", marca: "HP" }, { modelo: "19B4LCS5", marca: "PHILIPS" }, { modelo: "KB-0316", marca: "HP" }, { modelo: "FOR PCS", marca: "NO POSEE" }, { modelo: "LASERJET P1606dn", marca: "HP" }, { modelo: "4610WS IP", marca: "AVAYA" },
      { modelo: "M-S48A", marca: "HP" }, { modelo: "COMPAQ LE190", marca: "HP" }, { modelo: "1576", marca: "MICROSOFT" }, { modelo: "PR1101U", marca: "COMPAQ" }, { modelo: "K639", marca: "GENIUS" }, { modelo: "2610WS IP", marca: "AVAYA" }, { modelo: "LASERJET PRO M12W", marca: "HP" }, { modelo: "IMAGERUNNER 2022i", marca: "CANON" }, { modelo: "E2220-03", marca: "VIT" }, { modelo: "215LM00019", marca: "VIT" },
      { modelo: "SCANJET PRO 3600F1", marca: "HP" }, { modelo: "SCANJET 3670", marca: "HP" }, { modelo: "VIT 2600", marca: "VIT" }, { modelo: "RL-115", marca: "AVTEK" }, { modelo: "4610SW", marca: "AVAYA" }, { modelo: "OPTIPLEX 7010", marca: "DELL" }, { modelo: "REVA01", marca: "DELL" }, { modelo: "KB212-B", marca: "DELL" }, { modelo: "M-SBJ86", marca: "HP" }, { modelo: "SMART-UPS3000", marca: "APC" },
      { modelo: "OPTIPLEX 3070", marca: "DELL" }, { modelo: "E2222H", marca: "DELL" }, { modelo: "KB216P", marca: "DELL" }, { modelo: "MS116T1", marca: "DELL" }, { modelo: "FX-890", marca: "EPSON" }, { modelo: "OPTIPLEX 5040", marca: "DELL" }, { modelo: "24MP60G-B", marca: "LG" }, { modelo: "GENERICO", marca: "DELL" }, { modelo: "MS-111-P", marca: "DELL" }, { modelo: "RP-117B", marca: "AVTEK" },
      { modelo: "AVR600BA", marca: "INTEGRA" }, { modelo: "DATASAFE420", marca: "POWMAX" }, { modelo: "DX2300", marca: "HP" }, { modelo: "D220MT", marca: "HP" }, { modelo: "E6400", marca: "DELL" }, { modelo: "RLS-1500", marca: "AVTEK" }, { modelo: "RP5700", marca: "HP" }, { modelo: "S1922A", marca: "COMPAQ" }, { modelo: "M-SBF96", marca: "HP" }, { modelo: "BACK-UPS PRO 1500", marca: "APC" },
      { modelo: "SBXW-166LAGE-6", marca: "CHECK POINT" }, { modelo: "3800G", marca: "HONEYWELL" }, { modelo: "N/A", marca: "N/A" }, { modelo: "6005PRO", marca: "HP" }, { modelo: "LINE-R1200", marca: "APC" }, { modelo: "M2400-01", marca: "VIT" }, { modelo: "DOK-K5318u", marca: "VIT" }, { modelo: "B-AVR-1600", marca: "CDP" }, { modelo: "COMAPQ DX2300", marca: "HP" }, { modelo: "KE11073597", marca: "SONIC" },
      { modelo: "L-B118", marca: "VIT" }, { modelo: "DIK-M696", marca: "VIT" }, { modelo: "SAFEVIEW-600VA", marca: "COMPURCORP" }, { modelo: "FLATRON L194WS", marca: "LG" }, { modelo: "GENERICO EREGONOMICO", marca: "GENERICO" }, { modelo: "GSM-PC", marca: "EXECELINE" }, { modelo: "DOK-5313", marca: "VIT" }, { modelo: "K639", marca: "HP" }, { modelo: "NO INDICA", marca: "AVTEK" }, { modelo: "TLP 2844", marca: "EPSON" },
      { modelo: "ESCANJER 8290", marca: "HP" }, { modelo: "4621 SW IP", marca: "AVAYA" }, { modelo: "M2420", marca: "VIT" }, { modelo: "RVC-600", marca: "PHASE II ELECTRONICA" }, { modelo: "RL-NA", marca: "AVTEK" }, { modelo: "COMPAQ LE 1901", marca: "HP" }, { modelo: "TTR-1000", marca: "TECAM" }, { modelo: "CANOM", marca: "IMAGERUNNER 1019J" }, { modelo: "DESKJET 1056", marca: "HP" }, { modelo: "K627", marca: "GENIUS" },
      { modelo: "RL-103C", marca: "AVTEK" }, { modelo: "V19LW-B", marca: "VIT" }, { modelo: "H170L", marca: "ENVISION" }, { modelo: "5501", marca: "HP" }, { modelo: "LJP3005", marca: "HP" }, { modelo: "COMPAQ DX2301", marca: "HP" }, { modelo: "COMPAQ 500BMT", marca: "COMPAQ" }, { modelo: "DC 7700", marca: "HP" }, { modelo: "6678-9VA", marca: "BENQ" },
      { modelo: "DC770", marca: "HP" }, { modelo: "L1706", marca: "HP" }, { modelo: "K639", marca: "GENIUS" }, { modelo: "M366", marca: "DELUX" }, { modelo: "NO POSEE", marca: "INTEGRAL" }, { modelo: "06941V", marca: "HARMAN / KARDON" }, { modelo: "M2400-01", marca: "VIT" }, { modelo: "190LM00006", marca: "VIT" }, { modelo: "DOK-K5318U", marca: "VIT" }, { modelo: "RTL-1000", marca: "TONAL" },
      { modelo: "4621SW IP", marca: "AVAYA" }, { modelo: "LC-B118", marca: "VIT" }, { modelo: "B21-Y3", marca: "ROOFULL" }, { modelo: "DOK-M696", marca: "VIT" }, { modelo: "HP 6005 PRO", marca: "HP" }, { modelo: "HP L1706", marca: "HP" }, { modelo: "SQ-1688", marca: "HP" }, { modelo: "M-SBF96", marca: "HP" }, { modelo: "E2220-03", marca: "VIT" }, { modelo: "215LM00019", marca: "VIT" },
      { modelo: "DOK-K5313", marca: "VIT" }, { modelo: "M-UAE96", marca: "VIT" }, { modelo: "K-AVR 1006", marca: "KODE" }, { modelo: "COMPAQ DC7700", marca: "HP" }, { modelo: "HP  L1706", marca: "HP" }, { modelo: "HP LASERJET P3005N", marca: "HP" }, { modelo: "LASERJET P4515N", marca: "HP" }, { modelo: "COMPAQ 6005", marca: "HP" }, { modelo: "LE1901WL", marca: "HP" }, { modelo: "KU-0316", marca: "HP" },
      { modelo: "LINE-R 300", marca: "APC" }, { modelo: "SAFEVIEW-600VA", marca: "COMPUCORP" }, { modelo: "NO POSEE", marca: "ERKU" }, { modelo: "ECONOMIC SERIES", marca: "COMPUCORP" }, { modelo: "TFT19WSOPS", marca: "VIT" }, { modelo: "4610SW IP", marca: "AVAYA" }, { modelo: "2910-02", marca: "VIT" }, { modelo: "740NW", marca: "SAMSUNG" }, { modelo: "NP 1020", marca: "CANON" }, { modelo: "VIT 2910-02", marca: "VIT" },
      { modelo: "LE1901wl", marca: "HP" }, { modelo: "GENERICO", marca: "GENERICO" }, { modelo: "4610SW", marca: "AVAYA" }, { modelo: "LINE-R1200", marca: "APC" }, { modelo: "TFT19W80CS", marca: "VIT" }, { modelo: "PEV-B", marca: "AVTEK" }, { modelo: "LASERJET PRO MFP M479FDW", marca: "HP" }, { modelo: "ZP2200", marca: "ERKU" }, { modelo: "SP-S110", marca: "GENIUS" }, { modelo: "LINE-R 1200", marca: "APC" },
      { modelo: "S19A10N", marca: "SAMSUNG" }, { modelo: "DX2300", marca: "HP" }, { modelo: "943 SNXPLUS", marca: "SAMSUNG" }, { modelo: "SK-1688", marca: "HP" }, { modelo: "MSK-1113", marca: "MICROSOFT" }, { modelo: "MOAFUO", marca: "COMPAQ" }, { modelo: "LE1901Wl", marca: "HP" }, { modelo: "WIRED KEYBOARD 650", marca: "MICROSOFT" }, { modelo: "SHNGD-1401-00", marca: "HP" }, { modelo: "TFT19W80PS", marca: "VIT" },
      { modelo: "KN-0316", marca: "HP" }, { modelo: "HP COMPAQ 6005", marca: "HP" }, { modelo: "943SNXPLUS", marca: "SAMSUNG" }, { modelo: "COMPAQ LE1901WL", marca: "HP" }, { modelo: "VIT M2400", marca: "VIT" }, { modelo: "PR1101U", marca: "COMPAQ" }, { modelo: "GM-120014", marca: "GENIUS" }, { modelo: "NO POSEE", marca: "AVTEK" }, { modelo: "MO-67RP", marca: "CLON" }, { modelo: "PL-600", marca: "POWER LINE" },
      { modelo: "40610SWIP", marca: "AVAYA" }, { modelo: "VIT M2400", marca: "VIT" }, { modelo: "HP DESKJET 920C", marca: "HP" }, { modelo: "IMAGERUNNE 1310", marca: "CANON" }, { modelo: "COMPAQ 6005PRO", marca: "HP" }, { modelo: "KL-0210", marca: "GENIUS" }, { modelo: "TTR-1000", marca: "TECAM" }, { modelo: "4621SW", marca: "AVAYA" }, { modelo: "ZP220", marca: "ERKU" }, { modelo: "ALEXA", marca: "B7W64E" },
      { modelo: "ARCHER C80", marca: "TP-LINK" }, { modelo: "CINEMA HD DISPLAY", marca: "MAC" }, { modelo: "DESCONOCIDO", marca: "MAC" }, { modelo: "A1186MC", marca: "MAC" }, { modelo: "M.UAE96", marca: "HP" }, { modelo: "AGILER", marca: "GENERICO" }, { modelo: "TL-GTF10080", marca: "TP-LINK" }, { modelo: "GM-04011P", marca: "GENIUS" }, { modelo: "REV-B", marca: "AVTEK" }, { modelo: "KB-2971", marca: "VIT" },
      { modelo: "NETSCROLL 120", marca: "GENIUS" }, { modelo: "COMPAQ 6005 PRO", marca: "HP" }, { modelo: "RT7D00", marca: "DELL" }, { modelo: "600VA", marca: "POWERLINE" }, { modelo: "VIT 2600", marca: "VIT" }, { modelo: "4A50B", marca: "ARAWAK" }, { modelo: "M139", marca: "DELUXE" }, { modelo: "U-BTC1200", marca: "UP PRODUCTS" }, { modelo: "EQQUS", marca: "GENERICO" }, { modelo: "LASERJET PRO M12W", marca: "HP" },
      { modelo: "KR-3502PSPQ", marca: "DIAMOND" }, { modelo: "B-AVR 1005", marca: "CDP" }, { modelo: "1576", marca: "MICROSOFT" }, { modelo: "HD 720P", marca: "LOGOTECH" }, { modelo: "LIFECHATLX-4000", marca: "1475" }, { modelo: "SP-Q06S", marca: "GENIUS" }, { modelo: "SKKB-108", marca: "SELEKTRO" }, { modelo: "SCANJET G3010", marca: "HP" }, { modelo: "THINKCENTRE", marca: "NO POSEE" }, { modelo: "SAFETY MARK", marca: "LENOVO" },
      { modelo: "KU-0225", marca: "LENOVO" }, { modelo: "LE-706", marca: "HP" }, { modelo: "M2420-01", marca: "VIT" }, { modelo: "4A50B1", marca: "ARAWA" }, { modelo: "COMPAQ PRESARIO F75LA", marca: "HP" }, { modelo: "LASERJET 2100", marca: "HP" }, { modelo: "LASERJET 3600n", marca: "HP" }, { modelo: "COMPAQ DK5100 SFF", marca: "HP" }, { modelo: "M042KC", marca: "HP" }, { modelo: "ENGAGE FLEX PRO", marca: "HP" },
      { modelo: "E2020H", marca: "DELL" }, { modelo: "HQ-TRE71025", marca: "HP" }, { modelo: "MOFYUO", marca: "HP" }, { modelo: "SMART-UPS 1500", marca: "APC" }, { modelo: "OFFICEJET 4000", marca: "HP" }, { modelo: "SL-2001UL", marca: "FORZA" }, { modelo: "6512-WA", marca: "ACER" }, { modelo: "RL-103E", marca: "AVTEK" }, { modelo: "BR1300LCD", marca: "APS" }, { modelo: "GM-040013A", marca: "GENIUS" },
      { modelo: "PL-600A", marca: "POWER LINE" }, { modelo: "GM-04003A", marca: "GENIUS" }, { modelo: "AVR600", marca: "INTEGRA" }, { modelo: "BKPRO 1200", marca: "AVTEK" }, { modelo: "L1707", marca: "HP" }, { modelo: "UN85TU7000F", marca: "SAMSUNG" }, { modelo: "SPIRIT FX16", marca: "SOUNDCRAFT" }, { modelo: "PRX500", marca: "JBL" }, { modelo: "PRX501", marca: "JBL" }, { modelo: "KU-03161", marca: "HP" },
      { modelo: "4610WS IP", marca: "AVAYA" }, { modelo: "SYNCMASTER510N", marca: "SAMSUNG" }, { modelo: "GM-04004P", marca: "GENIUS" }, { modelo: "BACK-UPS650", marca: "APC" }, { modelo: "SIEP", marca: "AVTEK" }, { modelo: "PABILIUN", marca: "HP" }, { modelo: "W2371D", marca: "HP" }, { modelo: "SK-2085", marca: "HP" }, { modelo: "M-SBJ96", marca: "HP" }, { modelo: "IMAGEUNNER-1019J", marca: "CANON" },
      { modelo: "AE-640", marca: "NAKAJIMA" }, { modelo: "RT-1000", marca: "TONAL" }, { modelo: "K-AVR1006", marca: "KODE" }, { modelo: "MS111-L", marca: "DELL" }, { modelo: "THINKCENTER", marca: "LENOVO" }, { modelo: "T2224DA", marca: "LENOVO" }, { modelo: "SK-BB27", marca: "LENOVO" }, { modelo: "MOJUUO", marca: "LENOVO" }, { modelo: "PSBV200BT", marca: "PYLE" }, { modelo: "AEOLUS", marca: "NO POSEE" },
      { modelo: "L1906", marca: "HP" }, { modelo: "920NNL", marca: "SAMSUNG" }, { modelo: "450NB", marca: "SAMSUNG" }, { modelo: "121739-016A", marca: "COMPAQ" }, { modelo: "6512-TW", marca: "ACER" }, { modelo: "K330F", marca: "ASUS" },
      { modelo: "E2220-03", marca: "VIT" }, { modelo: "2600", marca: "VIT" }, { modelo: "COMPAC6005", marca: "HP" }, { modelo: "291002", marca: "VIT" }, { modelo: "2910-02", marca: "VIT" }, { modelo: "COMPAQ DX 2300", marca: "HP" }, { modelo: "NO POSEE", marca: "HP" }, { modelo: "COMPAQ 6005", marca: "HP" }, { modelo: "COMPAQ DC 5100 MT", marca: "HP" }, { modelo: "M2400-01", marca: "VIT" },
      { modelo: "M2420-01", marca: "VIT" }, { modelo: "HP COMPAQ 6005PRO", marca: "HP" }, { modelo: "M2420-03-01", marca: "VIT" }, { modelo: "NO POSEE", marca: "SIRAGON" }, { modelo: "E1210-01", marca: "VIT" }, { modelo: "E0VIT2220-03-01", marca: "VIT" }, { modelo: "M2400", marca: "VIT" }, { modelo: "COMPACQDE7700", marca: "HP" }, { modelo: "VIT 2910-02", marca: "VIT" }, { modelo: "VIT 2600", marca: "VIT" },
      { modelo: "COMPAQDC7700", marca: "HP" }, { modelo: "COMPAQ 6005 PRO", marca: "HP" }, { modelo: "COMPAQ 6605", marca: "HP" }, { modelo: "MXL7500HRV", marca: "HP" }, { modelo: "COMPAQ 5800", marca: "HP" }, { modelo: "PRO 3400", marca: "HP" }, { modelo: "COMPAQ D220MT", marca: "HP" }, { modelo: "COMPAQ DC5700", marca: "HP" }, { modelo: "A14", marca: "LENOVO" }, { modelo: "COMPAQ 0505", marca: "HP" },
      { modelo: "DC7700", marca: "HP" }, { modelo: "PC-1500", marca: "SIRAGON" }, { modelo: "THINKCENTRE M71e", marca: "LENOVO" }, { modelo: "E-1210-01", marca: "VIT" }, { modelo: "GENERICO", marca: "CLON" }, { modelo: "M2420", marca: "VIT" }, { modelo: "M2024", marca: "VIT" },
      { modelo: "E2220-03", marca: "VIT" }, { modelo: "2600", marca: "VIT" }, { modelo: "COMPAC6005", marca: "HP" }, { modelo: "291002", marca: "VIT" }, { modelo: "2910-02", marca: "VIT" }, { modelo: "COMPAQ DX 2300", marca: "HP" }, { modelo: "NO POSEE", marca: "HP" }, { modelo: "COMPAQ 6005", marca: "HP" }, { modelo: "COMPAQ DC 5100 MT", marca: "HP" }, { modelo: "M2400-01", marca: "VIT" },
      { modelo: "M2420-01", marca: "VIT" }, { modelo: "HP COMPAQ 6005PRO", marca: "HP" }, { modelo: "M2420-03-01", marca: "VIT" }, { modelo: "NO POSEE", marca: "SIRAGON" }, { modelo: "E1210-01", marca: "VIT" }, { modelo: "E0VIT2220-03-01", marca: "VIT" }, { modelo: "M2400", marca: "VIT" }, { modelo: "COMPACQDE7700", marca: "HP" }, { modelo: "VIT 2910-02", marca: "VIT" }, { modelo: "VIT 2600", marca: "VIT" },
      { modelo: "COMPAQDC7700", marca: "HP" }, { modelo: "COMPAQ 6005 PRO", marca: "HP" }, { modelo: "COMPAQ 6605", marca: "HP" }, { modelo: "MXL7500HRV", marca: "HP" }, { modelo: "COMPAQ 5800", marca: "HP" }, { modelo: "PRO 3400", marca: "HP" }, { modelo: "COMPAQ D220MT", marca: "HP" }, { modelo: "COMPAQ DC5700", marca: "HP" }, { modelo: "A14", marca: "LENOVO" }, { modelo: "COMPAQ 0505", marca: "HP" },
      { modelo: "DC7700", marca: "HP" }, { modelo: "PC-1500", marca: "SIRAGON" }, { modelo: "THINKCENTRE M71e", marca: "LENOVO" }, { modelo: "E-1210-01", marca: "VIT" }, { modelo: "GENERICO", marca: "CLON" }, { modelo: "M2420", marca: "VIT" }, { modelo: "M2024", marca: "VIT" },
      { modelo: "6005 PRO", marca: "HP" }, { modelo: "TFT19W80PS", marca: "VIT" }, { modelo: "MODGUO", marca: "HP" }, { modelo: "K-AVR1006", marca: "KODE" }, { modelo: "COMPAQ 6005PRO", marca: "HP" }, { modelo: "LE1901wl", marca: "HP" }, { modelo: "IMAGE RUNNER 1019J", marca: "CANON" }, { modelo: "4610SW", marca: "AVAYA" }, { modelo: "DPSN-20HBA", marca: "AVAYA" }, { modelo: "E2220-03", marca: "VIT" },
      { modelo: "215LM00019", marca: "VIT" }, { modelo: "L00U", marca: "BENQ" }, { modelo: "NO POSEE", marca: "CDP" }, { modelo: "OFFICEJET 4000", marca: "HP" }, { modelo: "4610SW IP", marca: "AVAYA" }, { modelo: "6005PRO", marca: "HP" }, { modelo: "PHOTOSMART C4180", marca: "HP" }, { modelo: "L1710", marca: "HP" }, { modelo: "NO INDICA", marca: "VIT" }, { modelo: "LASERJET P3005n", marca: "HP" },
      { modelo: "NO  INDICA", marca: "PC WORKS" }, { modelo: "L1706", marca: "HP" }, { modelo: "SK-1688", marca: "HP" }, { modelo: "DC7700", marca: "HP" }, { modelo: "RTL-1000", marca: "TONAL" }, { modelo: "ISO-EUK32SP", marca: "I-SORECE" }, { modelo: "SBF-96", marca: "HP" }, { modelo: "FVR-1211USB", marca: "FORZA" }, { modelo: "943SNXPLUS", marca: "SAMSUNG" }, { modelo: "SKKB-108", marca: "SELEKTRO" },
      { modelo: "SAFEVIEW-600VA", marca: "COMPUCORP" }, { modelo: "4610 SW IP", marca: "AVAYA" }, { modelo: "SBS52", marca: "CREATIVE" }, { modelo: "COMPAQ6005", marca: "HP" }, { modelo: "LE1901WL", marca: "HP" }, { modelo: "S19A10N", marca: "SAMSUNG" }, { modelo: "M-UAE96", marca: "HP" }, { modelo: "4A50B", marca: "ARAWAK" }, { modelo: "LINE-R1200", marca: "APC" }, { modelo: "KB-2971", marca: "VIT" },
      { modelo: "4A507", marca: "INTERCLNE" }, { modelo: "4610 WS IP", marca: "AVAYA" }, { modelo: "DOK-K5313", marca: "VIT" }, { modelo: "NO POSEE", marca: "NO POSEE" }, { modelo: "NO POSEE", marca: "TATTOO" }, { modelo: "NO POSEE", marca: "ELUX" }, { modelo: "NO POSEE", marca: "AITEG" }, { modelo: "V173 B", marca: "ACER" }, { modelo: "SE178WFPc", marca: "DELL" }, { modelo: "W1943CV", marca: "LG" },
      { modelo: "MSU0718T", marca: "VIT" }, { modelo: "DR-120TM", marca: "CASIO" }, { modelo: "LASERJET 1022", marca: "HP" }, { modelo: "U-PTC 1200", marca: "UPRODUCTS" },
      { modelo: "E2220-03", marca: "VIT" }, { modelo: "LE1901WL", marca: "HP" }, { modelo: "DOK-K5313", marca: "VIT" }, { modelo: "M-UAE96", marca: "HP" }, { modelo: "K627", marca: "GENIUS" }, { modelo: "RTL-1000", marca: "TONAL" }, { modelo: "COMPAQ 6005", marca: "HP" }, { modelo: "SK-1688", marca: "HP" }, { modelo: "M-SBF96", marca: "HP" }, { modelo: "LINE-R 1200", marca: "APC" },
      { modelo: "4610SW IP", marca: "AVAYA" }, { modelo: "LASERJET P3005", marca: "HP" }, { modelo: "L194WTS", marca: "LG" }, { modelo: "2910-02", marca: "VIT" }, { modelo: "BT-1001", marca: "FORZA" }, { modelo: "COMPAQ DC 7700", marca: "HP" }, { modelo: "2600", marca: "VIT" }, { modelo: "B1930N", marca: "SAMSUNG" }, { modelo: "DOK-M696", marca: "VIT" }, { modelo: "F190500", marca: "CANON" },
      { modelo: "LASERJET 3600N", marca: "HP" }, { modelo: "TFT19W80PS", marca: "VIT" }, { modelo: "KB-120", marca: "NO POSEE" }, { modelo: "215ML00019", marca: "VIT" }, { modelo: "PSC 1410 ALL-IN-ONE", marca: "HP" }, { modelo: "S22D300NY", marca: "SAMSUNG" }, { modelo: "KB-0316", marca: "HP" }, { modelo: "EM2400", marca: "VIT" }, { modelo: "ZP2200", marca: "ERKU" }, { modelo: "PCGPCG1200S", marca: "ARAWAK" },
      { modelo: "4610 SW IP", marca: "AVAYA" }, { modelo: "MP41DH", marca: "CANNON" }, { modelo: "M2400", marca: "VIT" }, { modelo: "DOK-K5318U", marca: "VIT" }, { modelo: "FX-890", marca: "EPSON" }, { modelo: "215LM00019", marca: "VIT" }, { modelo: "1406", marca: "MICROSOFT" }, { modelo: "GM-120014", marca: "GENIUS" }, { modelo: "NO POSEE", marca: "TECAM" }, { modelo: "LINE-1200", marca: "APC" },
      { modelo: "LINE-R 300", marca: "APC" }, { modelo: "B-AVR1006", marca: "CDP" }, { modelo: "B21-Y3", marca: "ROOFULL" }, { modelo: "4621SW IP", marca: "AVAYA" }, { modelo: "LASERJET PRO M12W", marca: "HP" }, { modelo: "L1706", marca: "HP" }, { modelo: "MSU0718T", marca: "VIT" }, { modelo: "LASER MFP 137FNW", marca: "HP" }, { modelo: "ARCHER C6U", marca: "TP-LINK" }, { modelo: "HG40NE477SFXZA", marca: "SAMSUNG" },
      { modelo: "GZRRN", marca: "GOOGLE" }, { modelo: "COMPAQ 6005 PRO", marca: "HP" }, { modelo: "SKKB-108", marca: "SELEKTRO" }, { modelo: "GENERICO", marca: "GENERICO" }, { modelo: "LINE-R300", marca: "APC" }, { modelo: "KU-0316", marca: "HP" }, { modelo: "LS1200-LM60", marca: "APC" }, { modelo: "GENERICO", marca: "HARMAN KARDON" }, { modelo: "1576", marca: "MICROSOFT" }, { modelo: "MSK-1113", marca: "MICROSOFT" },
      { modelo: "S19B300M", marca: "SAMSUNG" }, { modelo: "SAFEVIEW-600", marca: "COMPUCORP" }, { modelo: "PL-600A", marca: "POWERLINE" }, { modelo: "VIT 2600", marca: "VIT" }, { modelo: "DR-140TM", marca: "CASIO" }, { modelo: "FX890", marca: "EPSON" }, { modelo: "ARCHER C80", marca: "TP-LINK" }, { modelo: "F173300", marca: "CANON" }, { modelo: "TFT20W90PS1", marca: "VIT" }, { modelo: "NO POSEE", marca: "CLOM" },
      { modelo: "LASER JET 1020", marca: "HP" }, { modelo: "4619SW IP", marca: "AVAYA" }, { modelo: "M2420", marca: "VIT" }, { modelo: "NO POSEE", marca: "VIT" }, { modelo: "3D", marca: "VIT" }, { modelo: "U-PTC 1200", marca: "UPRODUCTS" }, { modelo: "E1210-02", marca: "VIT" }, { modelo: "V19EWD-B", marca: "VIT" }, { modelo: "K-AVR 1005", marca: "KODE" }, { modelo: "E1210-01", marca: "VIT" },
      { modelo: "NETSCROLL 120", marca: "GENIUS" }, { modelo: "TLP2844", marca: "ZEBRA" }, { modelo: "NO POSEE", marca: "POWER LINE" }, { modelo: "M-UAE 96", marca: "HP" }, { modelo: "PR1101U", marca: "COMPAQ" }, { modelo: "MSJ0718T", marca: "VIT" }, { modelo: "MOAFUO", marca: "COMPAQ" }, { modelo: "740NW", marca: "SAMSUNG" }, { modelo: "K640", marca: "GENIUS" }
    ];

    // Procesar los modelos con marca conocida
    for (const item of modelosConMarcaConocida) {
      const marcaDb = await prisma.marca.findFirst({
        where: { nombre: item.marca }
      });

      if (marcaDb) {
        await prisma.modelo.upsert({
          where: { nombre: item.modelo },
          update: { marcaId: marcaDb.id },
          create: {
            nombre: item.modelo,
            marcaId: marcaDb.id
          }
        });
      }
    }

    const marcaPorDefecto = await prisma.marca.findFirst({
      where: { nombre: "POR DEFINIR" }
    });

    if (marcaPorDefecto) {
      const modelosConocidos = modelosConMarcaConocida.map(item => item.modelo);
      const modelosRestantes = modelos.filter(nombreModelo => 
        !modelosConocidos.includes(nombreModelo)
      );

      for (const nombreModelo of modelosRestantes) {
        await prisma.modelo.upsert({
          where: { nombre: nombreModelo },
          update: {
            marcaId: marcaPorDefecto.id
          },
          create: {
            nombre: nombreModelo,
            marcaId: marcaPorDefecto.id
          }
        });
      }
    }


    console.log("Marcas y Modelos creados.");
}