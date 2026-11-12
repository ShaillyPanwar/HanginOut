export const DELHI_NCR_ZONES = [
  {
    id: 'all',
    name: 'All Delhi NCR',
    category: 'Entire Region',
    description: 'Explore curated spots from every zone across Delhi, Gurugram, Noida, Ghaziabad & Faridabad',
    localities: ['All Areas'],
    coordinates: null
  },
  {
    id: 'north-delhi',
    name: 'North Delhi',
    category: 'Delhi',
    description: 'Student cafes, Tibetan culture & heritage colonial avenues',
    localities: ['Kamla Nagar', 'Civil Lines', 'Model Town', 'Hudson Lane', 'Majnu Ka Tilla', 'Mukherjee Nagar'],
    coordinates: { latitude: 28.6945, longitude: 77.2052 }
  },
  {
    id: 'north-west-delhi',
    name: 'North-West Delhi',
    category: 'Delhi',
    description: 'Lakeside parks, food hubs, multiplexes & sports arenas',
    localities: ['Rohini', 'Pitampura', 'Prashant Vihar', 'NSP / Netaji Subhash Place', 'Shalimar Bagh', 'Ashok Vihar'],
    coordinates: { latitude: 28.7180, longitude: 77.1130 }
  },
  {
    id: 'west-delhi',
    name: 'West Delhi',
    category: 'Delhi',
    description: 'Vibrant markets, cultural haats, malls & popular street food strips',
    localities: ['Rajouri Garden', 'Janakpuri', 'Punjabi Bagh', 'Paschim Vihar', 'Tilak Nagar', 'Tagore Garden'],
    coordinates: { latitude: 28.6475, longitude: 77.1215 }
  },
  {
    id: 'central-delhi',
    name: 'Central Delhi',
    category: 'Delhi',
    description: 'Colonial colonnades, historic bazaars, street shopping & theatre hubs',
    localities: ['Connaught Place', 'Karol Bagh', 'Paharganj', 'Mandi House', 'Chandni Chowk', 'Kashmere Gate'],
    coordinates: { latitude: 28.6328, longitude: 77.2197 }
  },
  {
    id: 'new-delhi',
    name: 'New Delhi',
    category: 'Delhi',
    description: 'Monumental boulevards, lush gardens, art galleries & upscale book cafes',
    localities: ['India Gate', 'Kartavya Path', 'Lodhi Garden', 'Khan Market', 'Pragati Maidan', 'National Gallery of Modern Art'],
    coordinates: { latitude: 28.6129, longitude: 77.2295 }
  },
  {
    id: 'south-delhi',
    name: 'South Delhi',
    category: 'Delhi',
    description: 'Medieval lake forts, indie boutiques, premium malls & forest trails',
    localities: ['Hauz Khas', 'Green Park', 'Saket', 'Malviya Nagar', 'Greater Kailash', 'Defence Colony', 'Nehru Place', 'Mehrauli', 'Vasant Kunj'],
    coordinates: { latitude: 28.5284, longitude: 77.2192 }
  },
  {
    id: 'south-east-delhi',
    name: 'South-East Delhi',
    category: 'Delhi',
    description: 'Lotus architecture, cultural enclaves, thrift markets & sanctuary trails',
    localities: ['Lajpat Nagar', 'Amar Colony', 'South Extension', 'Kalkaji', 'CR Park', 'Okhla'],
    coordinates: { latitude: 28.5535, longitude: 77.2588 }
  },
  {
    id: 'east-delhi',
    name: 'East Delhi',
    category: 'Delhi',
    description: 'Scenic lakes, grand cultural complexes & bustling commercial strips',
    localities: ['Preet Vihar', 'Laxmi Nagar', 'Mayur Vihar', 'Anand Vihar', 'Nirman Vihar'],
    coordinates: { latitude: 28.6250, longitude: 77.2950 }
  },
  {
    id: 'north-east-delhi',
    name: 'North-East Delhi',
    category: 'Delhi',
    description: 'Sports complexes, quiet garden tracks & neighborhood street markets',
    localities: ['Shahdara', 'Yamuna Vihar', 'Dilshad Garden', 'Seelampur'],
    coordinates: { latitude: 28.6825, longitude: 77.3215 }
  },
  {
    id: 'south-west-delhi',
    name: 'South-West Delhi',
    category: 'Delhi',
    description: 'Sprawling sub-city parks, sports venues, museums & family malls',
    localities: ['Dwarka', 'Palam', 'Najafgarh', 'Kapashera'],
    coordinates: { latitude: 28.5921, longitude: 77.0460 }
  },
  {
    id: 'shahdara',
    name: 'Shahdara',
    category: 'Delhi',
    description: 'Historic east bank bazaar corridors, modern malls & open grounds',
    localities: ['Vivek Vihar', 'Krishna Nagar', 'Karkardooma', 'Jhilmil'],
    coordinates: { latitude: 28.6582, longitude: 77.2882 }
  },
  {
    id: 'gurugram',
    name: 'Gurugram',
    category: 'Delhi NCR',
    description: 'CyberHub corporate promenades, live music hubs, food corridors & biodiversity walks',
    localities: ['Cyber Hub', 'Sector 29', 'MG Road', 'Golf Course Road', 'Galleria Market', 'Sohna Road', 'Sector 56'],
    coordinates: { latitude: 28.4950, longitude: 77.0895 }
  },
  {
    id: 'noida',
    name: 'Noida',
    category: 'Delhi NCR',
    description: 'Mega retail malls, amusement parks, artisan cafes & scenic biodiversity parks',
    localities: ['Sector 18', 'Sector 38A', 'Sector 62', 'Sector 104', 'Sector 50', 'Sector 137', 'Greater Noida'],
    coordinates: { latitude: 28.5675, longitude: 77.3210 }
  },
  {
    id: 'ghaziabad',
    name: 'Ghaziabad',
    category: 'Delhi NCR',
    description: 'Habitat centres, lakeside green belts, popular food strips & family complexes',
    localities: ['Indirapuram', 'Vaishali', 'Kaushambi', 'Raj Nagar', 'Crossings Republik'],
    coordinates: { latitude: 28.6385, longitude: 77.3685 }
  },
  {
    id: 'faridabad',
    name: 'Faridabad',
    category: 'Delhi NCR',
    description: 'Heritage craft grounds, lake resorts, lively sector markets & arcades',
    localities: ['Sector 15', 'Sector 16', 'Sector 21', 'Surajkund', 'Crown Interiorz area'],
    coordinates: { latitude: 28.4895, longitude: 77.2842 }
  }
];

export const CATEGORY_FALLBACK_IMAGES = {
  1: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', // Food & Cafes
  2: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', // Outdoors & Nature
  3: 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800&auto=format&fit=crop&q=80', // Adventure & Sports
  4: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80', // Games & Arcades
  5: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80', // Exploring & Heritage
  6: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80', // Movies & Cinema
  7: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80', // Creative & Arts
  8: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', // Chill & Hangouts
  default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
};
