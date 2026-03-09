const CONFIG = {
  avwxToken: "ersegQzkf2Dfal-o26B4b5uzMrXBeHK2jOpOaY7nffc", // <-- Remplacer par ta clé AVWX
  aviationApiKey: "035d39b3-ef7f-43de-b226-8e249b319516",

  airports: [
    { code: "EBLG", name: "Liège Airport", lat: 50.637, lon: 5.443 }
  ],

  // Couloirs : centre piste, caps, distance (km)
  corridors: {
    runway_center: { lat: 50.637, lon: 5.443 },
    dep_bearing_deg: 230, // Runway 23 départ
    arr_bearing_deg: 50,  // Runway 05 arrivée
    length_km: 30
  },

  // Sonomètres (bleu foncé)
  noiseMonitors: {
    EBLG: [
      { id:"F017", name:"F017 - Wonck", lat:50.764883, lon:5.630606 },
      { id:"F001", name:"F001 - Houtain", lat:50.738044, lon:5.608833 },
      { id:"F014", name:"F014 - Juprelle", lat:50.718894, lon:5.573164 },
      { id:"F015", name:"F015 - Juprelle", lat:50.688839, lon:5.526216 },
      { id:"F005", name:"F005 - Haneffe", lat:50.639331, lon:5.323519 },
      { id:"F003", name:"F003 - Saint-Georges", lat:50.601167, lon:5.381400 },
      { id:"F011", name:"F011 - Saint-Georges", lat:50.601142, lon:5.356006 },
      { id:"F008", name:"F008 - Saint-Georges", lat:50.594878, lon:5.358950 },
      { id:"F002", name:"F002 - Saint-Georges", lat:50.588414, lon:5.370522 },
      { id:"F007", name:"F007 - Saint-Georges", lat:50.590756, lon:5.344114 },
      { id:"F009", name:"F009 - Stockay",   lat:50.580831, lon:5.355417 },
      { id:"F004", name:"F004 - Verlaine", lat:50.605414, lon:5.321406 },
      { id:"F010", name:"F010 - Verlaine", lat:50.599392, lon:5.313492 },
      { id:"F013", name:"F013 - Verlaine", lat:50.586914, lon:5.308678 },
      { id:"F016", name:"F016 - Verlaine", lat:50.619617, lon:5.295344 },
      { id:"F006", name:"F006 - Seraing",  lat:50.609594, lon:5.271403 },
      { id:"F012", name:"F012 - Aineffe",  lat:50.621917, lon:5.254747 }
    ]
  }
};
