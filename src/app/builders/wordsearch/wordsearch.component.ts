import { Component, OnInit, inject } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { WordSearchResult } from '../../lib';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserSettingsService } from '../../services/user-settings.service';
import { PdfService } from '../../services/pdf.service';
import { shuffle } from 'lodash';

interface LevelEntry { id: number, level: string }
interface TopicEntry { id: number, topic: string }
interface VocabularyEntry { id: number, topic_id: number, level_id: number, vocabulary: string[] }

@Component({
  selector: 'app-wordsearch',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './wordsearch.component.html',
  styleUrl: './wordsearch.component.scss'
})
export class WordsearchComponent implements OnInit {

  gamesService = inject(GamesService);
  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName: string = '';
  schoolName: string = '';
  wordsearch: WordSearchResult | null = null;
  includedWords: string[] = [];
  wordLists: VocabularyEntry[] = [
    {
      id: 1,
      topic_id: 1,
      level_id: 1,
      vocabulary: [
        "perro",
        "gato",
        "pez",
        "pájaro",
        "conejo",
        "ratón",
        "tortuga",
        "pollo",
        "pato",
        "oveja",
        "vaca",
        "caballo",
        "cerdo",
        "mono",
        "oso",
        "elefante",
        "jirafa",
        "cebra",
        "tigre",
        "león"
      ]
    },
    {
      id: 2,
      topic_id: 1,
      level_id: 2,
      vocabulary: [
        "cocodrilo",
        "hipopótamo",
        "rinoceronte",
        "ballena",
        "delfín",
        "pingüino",
        "canguro",
        "koala",
        "puma",
        "murciélago",
        "camaleón",
        "avestruz",
        "ornitorrinco",
        "tarántula",
        "escorpión",
        "tiburón",
        "murciélago",
        "cóndor",
        "boa",
        "anaconda"
      ]
    },
    {
      id: 1,
      topic_id: 2,
      level_id: 1,
      vocabulary: [
        "manzana",
        "plátano",
        "naranja",
        "uva",
        "pera",
        "sandía",
        "fresa",
        "kiwi",
        "melón",
        "piña",
        "mango",
        "cereza",
        "mandarina",
        "ciruela",
        "limón",
        "coco",
        "papaya",
        "higo",
        "guayaba",
        "durazno"
      ]
    },
    {
      id: 2,
      topic_id: 2,
      level_id: 2,
      vocabulary: [
        "granada",
        "kiwi",
        "guanábana",
        "membrillo",
        "frambuesa",
        "zarzamora",
        "maracuyá",
        "níspero",
        "mora",
        "carambola",
        "lichí",
        "pomelo",
        "tamarindo",
        "caqui",
        "toronja",
        "mangostán",
        "zapote",
        "chirimoya",
        "guayabo",
        "jaca"
      ]
    },
    {
      id: 1,
      topic_id: 3,
      level_id: 1,
      vocabulary: [
        "Argentina",
        "Brasil",
        "Canadá",
        "Chile",
        "China",
        "Colombia",
        "Ecuador",
        "España",
        "Estados Unidos",
        "Francia",
        "Italia",
        "Japón",
        "México",
        "Perú",
        "Reino Unido",
        "Rusia",
        "Suiza",
        "Uruguay",
        "Venezuela",
        "Australia"
      ]
    },
    {
      id: 2,
      topic_id: 3,
      level_id: 2,
      vocabulary: [
        "Alemania",
        "India",
        "Indonesia",
        "Irán",
        "Irak",
        "Arabia Saudita",
        "Turquía",
        "Sudáfrica",
        "Nigeria",
        "Corea del Sur",
        "Vietnam",
        "Filipinas",
        "Tailandia",
        "Polonia",
        "Ucrania",
        "Canadá",
        "Argentina",
        "Egipto",
        "Suecia",
        "Dinamarca"
      ]
    },
    {
      id: 1,
      topic_id: 4,
      level_id: 1,
      vocabulary: [
        "rojo",
        "azul",
        "verde",
        "amarillo",
        "naranja",
        "morado",
        "rosa",
        "blanco",
        "negro",
        "gris",
        "marrón"
      ]
    },
    {
      id: 2,
      topic_id: 4,
      level_id: 2,
      vocabulary: [
        "turquesa",
        "celeste",
        "añil",
        "cian",
        "lavanda",
        "esmeralda",
        "carmesí",
        "ocre",
        "ámbar",
        "granate",
        "orquídea"
      ]
    },
    {
      id: 1,
      topic_id: 5,
      level_id: 1,
      vocabulary: [
        "fútbol",
        "baloncesto",
        "tenis",
        "natación",
        "atletismo",
        "béisbol",
        "voleibol",
        "gimnasia",
        "ciclismo",
        "esgrima",
        "boxeo",
        "golf",
        "rugby",
        "hockey",
        "surf",
        "patinaje",
        "escalada",
        "karate",
        "yoga",
        "ajedrez"
      ]
    },
    {
      id: 2,
      topic_id: 5,
      level_id: 2,
      vocabulary: [
        "remo",
        "piragüismo",
        "taekwondo",
        "bádminton",
        "lucha libre",
        "polo",
        "salto de altura",
        "snowboard",
        "squash",
        "tiro con arco",
        "wakeboard",
        "billar",
        "patinaje artístico",
        "pentatlón",
        "parkour",
        "softball",
        "tiro al blanco",
        "esquí acuático",
        "buceo",
        "sumo"
      ]
    },
    {
      id: 1,
      topic_id: 6,
      level_id: 1,
      vocabulary: [
        "médico",
        "maestro",
        "policía",
        "bombero",
        "enfermero",
        "ingeniero",
        "abogado",
        "veterinario",
        "carnicero",
        "panadero",
        "electricista",
        "plomero",
        "carpintero",
        "mecánico",
        "arquitecto",
        "jardinero",
        "cajero",
        "repartidor",
        "cocinero",
        "camarero"
      ]
    },
    {
      id: 2,
      topic_id: 6,
      level_id: 2,
      vocabulary: [
        "astronauta",
        "biólogo",
        "químico",
        "piloto",
        "actor",
        "cantante",
        "escritor",
        "director de cine",
        "fotógrafo",
        "periodista",
        "programador",
        "diseñador gráfico",
        "músico",
        "pintor",
        "atleta",
        "economista",
        "científico",
        "psicólogo",
        "cirujano",
        "dentista"
      ]
    },
    {
      id: 1,
      topic_id: 7,
      level_id: 1,
      vocabulary: [
        "piano",
        "guitarra",
        "violín",
        "flauta",
        "trompeta",
        "batería",
        "saxofón",
        "clarinete",
        "bajo",
        "teclado",
        "tambor",
        "acordeón",
        "arpa",
        "trombón",
        "órgano",
        "gaita",
        "ukelele",
        "violonchelo",
        "fagot",
        "harmónica"
      ]
    },
    {
      id: 2,
      topic_id: 7,
      level_id: 2,
      vocabulary: [
        "djembe",
        "didgeridoo",
        "hang",
        "cuatro",
        "kalimba",
        "sitar",
        "tabla",
        "bagpipes",
        "guzheng",
        "erhu",
        "pipa",
        "dulzaina",
        "zampoña",
        "sarangi",
        "koto",
        "oud",
        "nai",
        "theremin",
        "clavecín",
        "concertina"
      ]
    },
    {
      id: 1,
      topic_id: 8,
      level_id: 1,
      vocabulary: [
        "pizza",
        "hamburguesa",
        "ensalada",
        "pasta",
        "arroz",
        "sopa",
        "pollo",
        "pescado",
        "carne",
        "verduras",
        "frutas",
        "huevos",
        "pan",
        "queso",
        "yogur",
        "helado",
        "galletas",
        "torta",
        "sándwich",
        "patatas fritas"
      ]
    },
    {
      id: 2,
      topic_id: 8,
      level_id: 2,
      vocabulary: [
        "sushi",
        "taco",
        "kebab",
        "dim sum",
        "paella",
        "curry",
        "sashimi",
        "nachos",
        "ramen",
        "lasaña",
        "quiche",
        "ratatouille",
        "risotto",
        "falafel",
        "couscous",
        "ceviche",
        "pad thai",
        "kimchi",
        "borscht",
        "pierogi"
      ]
    },
    {
      id: 1,
      topic_id: 9,
      level_id: 1,
      vocabulary: [
        "coche",
        "bicicleta",
        "autobús",
        "tren",
        "avión",
        "barco",
        "metro",
        "taxi",
        "camión",
        "moto",
        "patineta",
        "triciclo",
        "helicoptero",
        "caminando",
        "patines",
        "caravana",
        "trotinete",
        "monociclo",
        "tranvía",
        "tren de alta velocidad"
      ]
    },
    {
      id: 2,
      topic_id: 9,
      level_id: 2,
      vocabulary: [
        "dirigible",
        "submarino",
        "hovercraft",
        "transbordador espacial",
        "carro de caballos",
        "tuk-tuk",
        "trineo",
        "bicitaxi",
        "camello",
        "bulldozer",
        "carretilla elevadora",
        "catamarán",
        "segway",
        "velero",
        "góndola",
        "rickshaw",
        "tanque",
        "montaña rusa",
        "funicular",
        "jetpack"
      ]
    },
    {
      id: 1,
      topic_id: 10,
      level_id: 1,
      vocabulary: [
        "Toy Story",
        "Frozen",
        "Coco",
        "Shrek",
        "Moana",
        "Buscando a Nemo",
        "El Rey León",
        "Harry Potter",
        "Up",
        "Ratatouille",
        "Cars",
        "La Sirenita",
        "Los Increíbles",
        "El Libro de la Selva",
        "Zootopia",
        "Aladdin",
        "La Bella y la Bestia",
        "Intensamente",
        "Monsters, Inc.",
        "Mulan"
      ]
    },
    {
      id: 2,
      topic_id: 10,
      level_id: 2,
      vocabulary: [
        "Piratas del Caribe",
        "El Señor de los Anillos",
        "Jurassic Park",
        "Star Wars",
        "Indiana Jones",
        "Matrix",
        "Avatar",
        "El Padrino",
        "Titanic",
        "Forrest Gump",
        "El Silencio de los Corderos",
        "Gladiador",
        "Interestelar",
        "El Gran Showman",
        "El Caballero de la Noche",
        "La La Land",
        "Búsqueda implacable",
        "El Código Da Vinci",
        "Shutter Island",
        "La Red Social"
      ]
    },
    {
      id: 1,
      topic_id: 11,
      level_id: 1,
      vocabulary: [
        "Nueva York",
        "París",
        "Londres",
        "Tokio",
        "Roma",
        "Madrid",
        "Berlín",
        "Sídney",
        "Moscú",
        "Pekín",
        "Río de Janeiro",
        "Los Ángeles",
        "Atenas",
        "Toronto",
        "Ciudad de México",
        "Seúl",
        "Buenos Aires",
        "Estambul",
        "Bangkok",
        "Dubái"
      ]
    },
    {
      id: 2,
      topic_id: 11,
      level_id: 2,
      vocabulary: [
        "Barcelona",
        "Chicago",
        "Singapur",
        "Viena",
        "San Francisco",
        "Las Vegas",
        "Ámsterdam",
        "Dublín",
        "Praga",
        "Venecia",
        "Múnich",
        "Helsinki",
        "Lisboa",
        "Varsovia",
        "Oslo",
        "Edimburgo",
        "Zurich",
        "Kioto",
        "Budapest",
        "Sevilla"
      ]
    },
    {
      id: 1,
      topic_id: 12,
      level_id: 1,
      vocabulary: [
        "sartén",
        "cuchillo",
        "tenedor",
        "cuchara",
        "plato",
        "olla",
        "sacacorchos",
        "rallador",
        "tostadora",
        "batidora",
        "colador",
        "mortero",
        "taza",
        "tabla de cortar",
        "espátula",
        "horno",
        "microondas",
        "tetera",
        "cafetera",
        "exprimidor"
      ]
    },
    {
      id: 2,
      topic_id: 12,
      level_id: 2,
      vocabulary: [
        "picadora",
        "mandolina",
        "soplete",
        "thermomix",
        "cacerola",
        "wok",
        "molinillo",
        "báscula",
        "freidora",
        "plancha",
        "termómetro",
        "parrilla",
        "hervidor",
        "crepera",
        "estufa",
        "vaporera",
        "cápsulas de café",
        "sandwichera",
        "raviolera",
        "hervidor de arroz"
      ]
    },
    {
      id: 1,
      topic_id: 13,
      level_id: 1,
      vocabulary: [
        "rosa",
        "margarita",
        "girasol",
        "tulipán",
        "lirio",
        "clavel",
        "violeta",
        "peonía",
        "hortensia",
        "lirio de los valles",
        "azucena",
        "jacinto",
        "geranio",
        "orquídea",
        "mimosa",
        "magnolia",
        "camelia",
        "flor de cerezo",
        "caléndula",
        "dalia"
      ]
    },
    {
      id: 2,
      topic_id: 13,
      level_id: 2,
      vocabulary: [
        "crocus",
        "anémona",
        "alhelí",
        "lupino",
        "alcatraz",
        "amapola",
        "lino",
        "cladonia",
        "crisantemo",
        "lantana",
        "diente de león",
        "narciso",
        "primavera",
        "lupino",
        "delfinio",
        "lila",
        "lavanda",
        "peonía",
        "flor de la pasión",
        "gladiolo"
      ]
    },
    {
      id: 1,
      topic_id: 14,
      level_id: 1,
      vocabulary: [
        "martillo",
        "destornillador",
        "llave inglesa",
        "alicate",
        "sierra",
        "tornillo",
        "clavo",
        "metro",
        "nivel",
        "tijeras",
        "cinta métrica",
        "cepillo",
        "destornillador de estrella",
        "brocha",
        "escalera",
        "alicates de punta",
        "destornillador de punta plana",
        "sierra eléctrica",
        "taladro",
        "pinzas"
      ]
    },
    {
      id: 2,
      topic_id: 14,
      level_id: 2,
      vocabulary: [
        "amoladora",
        "compresor de aire",
        "radial",
        "soplete",
        "sargento",
        "grapadora",
        "esmeriladora",
        "nivel láser",
        "atornillador eléctrico",
        "sierra de calar",
        "cizalla",
        "pistola de silicona",
        "serrucho",
        "cúter",
        "pulidora",
        "soldador",
        "lápiz de carpintero",
        "pala",
        "torno",
        "yunque"
      ]
    },
    {
      id: 1,
      topic_id: 15,
      level_id: 1,
      vocabulary: [
        "Michael Jackson",
        "Madonna",
        "Beyoncé",
        "Tom Hanks",
        "Jennifer Lopez",
        "Will Smith",
        "Taylor Swift",
        "Cristiano Ronaldo",
        "Angelina Jolie",
        "Leonardo DiCaprio",
        "Oprah Winfrey",
        "David Beckham",
        "Justin Bieber",
        "Rihanna",
        "Jennifer Aniston",
        "Katy Perry",
        "Selena Gomez",
        "Lady Gaga",
        "Brad Pitt",
        "Meryl Streep"
      ]
    },
    {
      id: 2,
      topic_id: 15,
      level_id: 2,
      vocabulary: [
        "Elon Musk",
        "Jeff Bezos",
        "Bill Gates",
        "Kanye West",
        "Kylie Jenner",
        "Barack Obama",
        "Donald Trump",
        "Emma Watson",
        "Emma Stone",
        "Scarlett Johansson",
        "Robert Downey Jr.",
        "Dwayne Johnson",
        "Jennifer Lawrence",
        "Ariana Grande",
        "Mark Zuckerberg",
        "Stephen Hawking",
        "Nelson Mandela",
        "Michael Jordan",
        "Bruce Lee",
        "Albert Einstein"
      ]
    }
  ];
  
  topics: TopicEntry[] = [
    { id: 1, topic: "Animales" },
    { id: 2, topic: "Frutas" },
    { id: 3, topic: "Países" },
    { id: 4, topic: "Colores" },
    { id: 5, topic: "Deportes" },
    { id: 6, topic: "Profesiones" },
    { id: 7, topic: "Instrumentos musicales" },
    { id: 8, topic: "Comida" },
    { id: 9, topic: "Transporte" },
    { id: 10, topic: "Nombres de películas" },
    { id: 11, topic: "Nombres de ciudades" },
    { id: 12, topic: "Instrumentos de cocina" },
    { id: 13, topic: "Flores" },
    { id: 14, topic: "Herramientas" },
    { id: 15, topic: "Nombres de famosos" },
    // { id: 16, topic: "Instrumentos de escritura" },
    // { id: 17, topic: "Tecnología" },
    // { id: 18, topic: "Partes del cuerpo" },
    // { id: 19, topic: "Nombres de libros" },
    // { id: 20, topic: "Instrumentos científicos" },
    // { id: 21, topic: "Ropa" },
    // { id: 22, topic: "Marcas comerciales" },
    // { id: 23, topic: "Juegos de mesa" },
    // { id: 24, topic: "Nombres de artistas" },
    // { id: 25, topic: "Instrumentos de arte" },
    // { id: 26, topic: "Profesiones" },
    // { id: 27, topic: "Cosas de la casa" },
    // { id: 28, topic: "Nombres de bandas de música" },
    // { id: 29, topic: "Muebles" },
    // { id: 30, topic: "Nombres de deportistas" },
    // { id: 31, topic: "Ciudades del mundo" },
    // { id: 32, topic: "Idiomas" },
    // { id: 33, topic: "Peliculas de terror" },
    // { id: 34, topic: "Instrumentos quirúrgicos" },
    // { id: 35, topic: "Nombres de dinosaurios" },
    // { id: 36, topic: "Instrumentos de laboratorio" },
    // { id: 37, topic: "Bebidas" },
    // { id: 38, topic: "Platos de comida típica" },
    // { id: 39, topic: "Canciones populares" },
    // { id: 40, topic: "Capitales del mundo" },
    // { id: 41, topic: "Marcas de automóviles" },
    // { id: 42, topic: "Personajes de cuentos de hadas" },
    // { id: 43, topic: "Constelaciones" },
    // { id: 44, topic: "Nombres de inventores famosos" },
    // { id: 45, topic: "Frases célebres" },
    // { id: 46, topic: "Juegos de cartas" },
    // { id: 47, topic: "Atracciones turísticas" },
    // { id: 48, topic: "Técnicas de dibujo" },
    // { id: 49, topic: "Días festivos" },
    // { id: 50, topic: "Países europeos" }
  ];

  levels: LevelEntry[] = [
    {
      id: 1,
      level: 'Primaria'
    },
    {
      id: 2,
      level: 'Secundaria'
    },
  ];

  wsForm = this.fb.group({
    words: [0],
    level: [1],
    topic: [1],
    size: [10],
    name: [false],
    grade: [false],
    date: [false],
  });

  ngOnInit() {
    this.userSettingsService.getSettings().subscribe(settings => {
      this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
      this.schoolName = settings.schoolName;
    });
  }

  generateWordSearch() {
    const { words, level, topic, size } = this.wsForm.value;
    
    if (!level || !topic || !size)
      return;
    
    const list = this.wordLists.find(l => l.level_id == level && l.topic_id == topic);

    if (!list)
      return;

    const selection: string[] = shuffle(list.vocabulary).slice(0, size);

    const longerWord = selection.reduce((l, n) => n.length > l ? n.length : l, 0) + 3;
    this.wordsearch = this.gamesService.generateWordSearch(selection, { w: longerWord, h: longerWord });
    this.includedWords = selection.filter(w => !this.wordsearch?.unplaced.includes(w));
  }

  toggleName() {
    const val = this.wsForm.get('name')?.value;
    if (!val) {
      this.wsForm.get('name')?.setValue(true);
    } else {
      this.wsForm.get('name')?.setValue(false);
    }
  }

  toggleGrade() {
    const val = this.wsForm.get('grade')?.value;
    if (!val) {
      this.wsForm.get('grade')?.setValue(true);
    } else {
      this.wsForm.get('grade')?.setValue(false);
    }
  }

  toggleDate() {
    const val = this.wsForm.get('date')?.value;
    if (!val) {
      this.wsForm.get('date')?.setValue(true);
    } else {
      this.wsForm.get('date')?.setValue(false);
    }
  }

  print() {
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    const topic = this.topics.find(t => t.id == this.wsForm.get('topic')?.value);
    this.pdfService.createAndDownloadFromHTML("wordsearch", `Sopa de Letras - ${topic?.topic}`);
  }
}
