export const travelPlaces = [
  // --- Original Places (0-3) ---
  {
    id: "fuzhou",
    place: "Fuzhou",
    country: "China",
    continent: "Asia",
    lat: 26.0745,
    lng: 119.2965,
  }, // 0
  {
    id: "toronto",
    place: "Toronto",
    country: "Canada",
    continent: "North America",
    lat: 43.6532,
    lng: -79.3832,
  }, // 1
  {
    id: "iceland",
    place: "Reykjavik", // Updated from Iceland
    country: "Iceland",
    continent: "Europe",
    lat: 64.1466,
    lng: -21.9426,
  }, // 2
  {
    id: "san-francisco",
    place: "San Francisco",
    country: "United States",
    continent: "North America",
    lat: 37.7749,
    lng: -122.4194,
  }, // 3

  // --- New Places for Routes (4-26) ---
  {
    id: "berlin",
    place: "Berlin",
    country: "Germany",
    continent: "Europe",
    lat: 52.5200,
    lng: 13.4050,
  }, // 4
  {
    id: "rome",
    place: "Rome",
    country: "Italy",
    continent: "Europe",
    lat: 41.9028,
    lng: 12.4964,
  }, // 5
  {
    id: "phuket",
    place: "Phuket",
    country: "Thailand",
    continent: "Asia",
    lat: 7.8804,
    lng: 98.3923,
  }, // 6
  {
    id: "halifax",
    place: "Halifax",
    country: "Canada",
    continent: "North America",
    lat: 44.6488,
    lng: -63.5752,
  }, // 7
  {
    id: "tokyo",
    place: "Tokyo",
    country: "Japan",
    continent: "Asia",
    lat: 35.6762,
    lng: 139.6503,
  }, // 8
  {
    id: "manila",
    place: "Manila",
    country: "Philippines",
    continent: "Asia",
    lat: 14.5995,
    lng: 120.9842,
  }, // 9
  {
    id: "sabah",
    place: "Sabah",
    country: "Malaysia",
    continent: "Asia",
    lat: 5.9804,
    lng: 116.0735, // Using Kota Kinabalu for coordinates
  }, // 10
  {
    id: "kuala-lumpur",
    place: "Kuala Lumpur",
    country: "Malaysia",
    continent: "Asia",
    lat: 3.1390,
    lng: 101.6869,
  }, // 11
  {
    id: "singapore",
    place: "Singapore",
    country: "Singapore",
    continent: "Asia",
    lat: 1.3521,
    lng: 103.8198,
  }, // 12
  {
    id: "taipei",
    place: "Taipei",
    country: "China",
    continent: "Asia",
    lat: 25.0330,
    lng: 121.5654,
  }, // 13
  {
    id: "shanghai",
    place: "Shanghai",
    country: "China",
    continent: "Asia",
    lat: 31.2304,
    lng: 121.4737,
  }, // 14
  {
    id: "beijing",
    place: "Beijing",
    country: "China",
    continent: "Asia",
    lat: 39.9042,
    lng: 116.4074,
  }, // 15
  {
    id: "xian",
    place: "Xi'an",
    country: "China",
    continent: "Asia",
    lat: 34.3416,
    lng: 108.9398,
  }, // 16
  {
    id: "harbin",
    place: "Harbin",
    country: "China",
    continent: "Asia",
    lat: 45.8038,
    lng: 126.5350,
  }, // 17
  {
    id: "chengdu",
    place: "Chengdu",
    country: "China",
    continent: "Asia",
    lat: 30.5723,
    lng: 104.0665,
  }, // 18
  {
    id: "zhejiang",
    place: "Hangzhou", // Hangzhou is the capital of Zhejiang
    country: "China",
    continent: "Asia",
    lat: 30.2741,
    lng: 120.1551,
  }, // 19
  {
    id: "xiamen",
    place: "Xiamen",
    country: "China",
    continent: "Asia",
    lat: 24.4798,
    lng: 118.0894,
  }, // 20
  {
    id: "shenzhen",
    place: "Shenzhen",
    country: "China",
    continent: "Asia",
    lat: 22.5431,
    lng: 114.0579,
  }, // 21
  {
    id: "changchun",
    place: "Changchun",
    country: "China",
    continent: "Asia",
    lat: 43.8171,
    lng: 125.3235,
  }, // 22
  {
    id: "montreal",
    place: "Montreal",
    country: "Canada",
    continent: "North America",
    lat: 45.5017,
    lng: -73.5673,
  }, // 23
  {
    id: "banff",
    place: "Banff",
    country: "Canada",
    continent: "North America",
    lat: 51.1784,
    lng: -115.5708,
  }, // 24
  {
    id: "los-angeles",
    place: "Los Angeles",
    country: "United States",
    continent: "North America",
    lat: 34.0522,
    lng: -118.2437,
  }, // 25
  {
    id: "hong-kong",
    place: "Hong Kong",
    country: "China",
    continent: "Asia",
    lat: 22.3193,
    lng: 114.1694,
  }, // 26

  // --- No-Route Places (27-40) ---
  {
    id: "salzburg",
    place: "Salzburg",
    country: "Austria",
    continent: "Europe",
    lat: 47.8095,
    lng: 13.0550,
  }, // 27
  {
    id: "cologne",
    place: "Cologne",
    country: "Germany",
    continent: "Europe",
    lat: 50.9375,
    lng: 6.9603,
  }, // 28
  {
    id: "amsterdam",
    place: "Amsterdam",
    country: "Netherlands",
    continent: "Europe",
    lat: 52.3676,
    lng: 4.9041,
  }, // 29
  {
    id: "milan",
    place: "Milan",
    country: "Italy",
    continent: "Europe",
    lat: 45.4642,
    lng: 9.1900,
  }, // 30
  {
    id: "florence",
    place: "Florence",
    country: "Italy",
    continent: "Europe",
    lat: 43.7696,
    lng: 11.2558,
  }, // 31
  {
    id: "osaka",
    place: "Osaka",
    country: "Japan",
    continent: "Asia",
    lat: 34.6937,
    lng: 135.5023,
  }, // 32
  {
    id: "nagoya",
    place: "Nagoya",
    country: "Japan",
    continent: "Asia",
    lat: 35.1815,
    lng: 136.9066,
  }, // 33
  {
    id: "chiang-mai",
    place: "Chiang Mai",
    country: "Thailand",
    continent: "Asia",
    lat: 18.7883,
    lng: 98.9853,
  }, // 34
  {
    id: "bangkok",
    place: "Bangkok",
    country: "Thailand",
    continent: "Asia",
    lat: 13.7563,
    lng: 100.5018,
  }, // 35
  {
    id: "cebu",
    place: "Cebu",
    country: "Philippines",
    continent: "Asia",
    lat: 10.3157,
    lng: 123.8854,
  }, // 36
  {
    id: "vienna",
    place: "Vienna",
    country: "Austria",
    continent: "Europe",
    lat: 48.2082,
    lng: 16.3738,
  }, // 37
  {
    id: "munich",
    place: "Munich",
    country: "Germany",
    continent: "Europe",
    lat: 48.1351,
    lng: 11.5820,
  }, // 38
  {
    id: "dresden",
    place: "Dresden",
    country: "Germany",
    continent: "Europe",
    lat: 51.0504,
    lng: 13.7373,
  }, // 39
  {
    id: "prague",
    place: "Prague",
    country: "Czechia",
    continent: "Europe",
    lat: 50.0755,
    lng: 14.4378,
  }, // 40
  {
    id: "charlottetown",
    place: "Charlottetown",
    country: "Canada",
    continent: "North America",
    lat: 46.2382,
    lng: -63.1311,
  }, // 41
  {
    id: "moncton",
    place: "Moncton",
    country: "Canada",
    continent: "North America",
    lat: 46.0878,
    lng: -64.7782,
  }, // 42
  {
    id: "ottawa",
    place: "Ottawa",
    country: "Canada",
    continent: "North America",
    lat: 45.4215,
    lng: -75.6972,
  }, // 43
  {
    id: "kingston",
    place: "Kingston",
    country: "Canada",
    continent: "North America",
    lat: 44.2312,
    lng: -76.4860,
  }, // 44
  {
    id: "venice",
    place: "Venice",
    country: "Italy",
    continent: "Europe",
    lat: 45.4408,
    lng: 12.3155,
  }, // 45
  {
    id: "tianjin",
    place: "Tianjin",
    country: "China",
    continent: "Asia",
    lat: 39.0842,
    lng: 117.2010,
  }, // 46
  {
    id: "suzhou",
    place: "Suzhou",
    country: "China",
    continent: "Asia",
    lat: 31.2989,
    lng: 120.5853,
  }, // 47
  {
    id: "wuyuan",
    place: "Wuyuan",
    country: "China",
    continent: "Asia",
    lat: 29.2560,
    lng: 117.8485,
  }, // 48
  {
    id: "ningde",
    place: "Ningde",
    country: "China",
    continent: "Asia",
    lat: 26.6656,
    lng: 119.5479,
  }, // 49
  {
    id: "phnom-penh",
    place: "Phnom Penh", // 金边
    country: "Cambodia",
    continent: "Asia",
    lat: 11.5564,
    lng: 104.9282,
  }, // 50
  {
    id: "quebec-city",
    place: "Quebec City",
    country: "Canada",
    continent: "North America",
    lat: 46.8139,
    lng: -71.2080,
  }, // 51
];

export const travelRoutes = [
  // --- Original Routes ---
  {
    id: "fuzhou-toronto",
    from: travelPlaces[0],
    to: travelPlaces[1],
  },
  {
    id: "toronto-iceland",
    from: travelPlaces[1],
    to: travelPlaces[2], // Now Reykjavik
  },
  {
    id: "iceland-toronto",
    from: travelPlaces[2],
    to: travelPlaces[1],
  },
  {
    id: "toronto-san-francisco",
    from: travelPlaces[1],
    to: travelPlaces[3],
  },

  // --- New Routes ---
  {
    id: "fuzhou-berlin",
    from: travelPlaces[0],
    to: travelPlaces[4],
  },
  {
    id: "fuzhou-rome",
    from: travelPlaces[0],
    to: travelPlaces[5],
  },
  {
    id: "fuzhou-phuket",
    from: travelPlaces[0],
    to: travelPlaces[6],
  },
  {
    id: "toronto-halifax",
    from: travelPlaces[1],
    to: travelPlaces[7],
  },
  {
    id: "fuzhou-tokyo",
    from: travelPlaces[0],
    to: travelPlaces[8],
  },
  {
    id: "fuzhou-manila",
    from: travelPlaces[0],
    to: travelPlaces[9],
  },
  {
    id: "fuzhou-sabah",
    from: travelPlaces[0],
    to: travelPlaces[10],
  },
  {
    id: "sabah-kuala-lumpur",
    from: travelPlaces[10],
    to: travelPlaces[11],
  },
  {
    id: "kuala-lumpur-singapore",
    from: travelPlaces[11],
    to: travelPlaces[12],
  },
  {
    id: "singapore-fuzhou",
    from: travelPlaces[12],
    to: travelPlaces[0],
  },
  {
    id: "fuzhou-taipei",
    from: travelPlaces[0],
    to: travelPlaces[13],
  },
  {
    id: "fuzhou-shanghai",
    from: travelPlaces[0],
    to: travelPlaces[14],
  },
  {
    id: "fuzhou-beijing",
    from: travelPlaces[0],
    to: travelPlaces[15],
  },
  {
    id: "fuzhou-xian",
    from: travelPlaces[0],
    to: travelPlaces[16],
  },
  {
    id: "fuzhou-harbin",
    from: travelPlaces[0],
    to: travelPlaces[17],
  },
  {
    id: "fuzhou-chengdu",
    from: travelPlaces[0],
    to: travelPlaces[18],
  },
  {
    id: "fuzhou-zhejiang",
    from: travelPlaces[0],
    to: travelPlaces[19],
  },
  {
    id: "fuzhou-xiamen",
    from: travelPlaces[0],
    to: travelPlaces[20],
  },
  {
    id: "fuzhou-shenzhen",
    from: travelPlaces[0],
    to: travelPlaces[21],
  },
  {
    id: "fuzhou-changchun",
    from: travelPlaces[0],
    to: travelPlaces[22],
  },
  {
    id: "toronto-montreal",
    from: travelPlaces[1],
    to: travelPlaces[23],
  },
  {
    id: "montreal-banff",
    from: travelPlaces[23],
    to: travelPlaces[24],
  },
  {
    id: "san-francisco-la",
    from: travelPlaces[3],
    to: travelPlaces[25],
  },
  {
    id: "san-francisco-hk",
    from: travelPlaces[3],
    to: travelPlaces[26],
  },
  {
    id: "fuzhou-phnom-penh",
    from: travelPlaces[0], // Fuzhou
    to: travelPlaces[50],  // Phnom Penh
  },
  {
    id: "milan-salzburg",
    from: travelPlaces[30], // Milan
    to: travelPlaces[27],   // Salzburg
  },
  {
    id: "vienna-prague",
    from: travelPlaces[37], // Vienna
    to: travelPlaces[40],   // Prague
  },
  {
    id: "prague-amsterdam",
    from: travelPlaces[40], // Prague
    to: travelPlaces[29],   // Amsterdam
  },
  {
    id: "phuket-chiang-mai",
    from: travelPlaces[6],  // Phuket
    to: travelPlaces[34],   // Chiang Mai
  },
  {
    id: "chiang-mai-bangkok",
    from: travelPlaces[34], // Chiang Mai
    to: travelPlaces[35],   // Bangkok
  },
  {
    id: "bangkok-fuzhou",
    from: travelPlaces[35], // Bangkok
    to: travelPlaces[0],    // Fuzhou
  },
  {
    id: "montreal-quebec-city",
    from: travelPlaces[23], // Montreal
    to: travelPlaces[51],   // Quebec City
  },
  // add halifax to moncton, moncton to charlottetown, charlottetown halifax, toronto to kingston, kingston to ottowa, ottowa to montreal
    {
    id: "halifax-moncton",
    from: travelPlaces[7], // Halifax
    to: travelPlaces[42],   // Moncton
  },
  {
    id: "moncton-charlottetown",
    from: travelPlaces[42], // Moncton
    to: travelPlaces[41],   // Charlottetown
  },
  {
    id: "charlottetown-halifax",
    from: travelPlaces[41], // Charlottetown
    to: travelPlaces[7],   // Halifax
  },
  {
    id: "toronto-kingston",
    from: travelPlaces[1], // Toronto
    to: travelPlaces[44],   // Kingston
  },
  {
    id: "kingston-ottawa",
    from: travelPlaces[44], // Kingston
    to: travelPlaces[43],   // Ottawa
  },
  {
    id: "ottawa-montreal",
    from: travelPlaces[43], // Ottawa
    to: travelPlaces[23],   // Montreal
  },
];