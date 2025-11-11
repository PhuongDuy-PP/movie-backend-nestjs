import { config } from 'dotenv';
import dataSource from '../config/data-source';
import { Movie } from '../movie/entities/movie.entity';

config();

async function seedMovies() {

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Connected to database');

    const movieRepository = dataSource.getRepository(Movie);

    // Check if movies already exist
    const existingMovies = await movieRepository.count();
    if (existingMovies > 0) {
      console.log(`⚠️  Database already has ${existingMovies} movies. Skipping seed.`);
      await dataSource.destroy();
      process.exit(0);
    }

    const movies = [
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        director: 'Denis Villeneuve',
        actors: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Josh Brolin'],
        genre: 'Sci-Fi',
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIhbkgXON4YeP1mZ.jpg',
        trailer: 'https://www.youtube.com/watch?v=U2Qp5pL3FZA',
        rating: 8.7,
        isActive: true,
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        director: 'Christopher Nolan',
        actors: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
        genre: 'Biography',
        duration: 180,
        releaseDate: new Date('2023-07-21'),
        poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        trailer: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        rating: 8.3,
        isActive: true,
      },
      {
        title: 'The Batman',
        description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
        director: 'Matt Reeves',
        actors: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell'],
        genre: 'Action',
        duration: 176,
        releaseDate: new Date('2022-03-04'),
        poster: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
        trailer: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
        rating: 7.8,
        isActive: true,
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
        director: 'Joaquim Dos Santos',
        actors: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
        genre: 'Animation',
        duration: 140,
        releaseDate: new Date('2023-06-02'),
        poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        trailer: 'https://www.youtube.com/watch?v=shW9i6k8cB0',
        rating: 8.7,
        isActive: true,
      },
      {
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, training a new generation of pilots.',
        director: 'Joseph Kosinski',
        actors: ['Tom Cruise', 'Jennifer Connelly', 'Miles Teller', 'Val Kilmer'],
        genre: 'Action',
        duration: 130,
        releaseDate: new Date('2022-05-27'),
        poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        trailer: 'https://www.youtube.com/watch?v=giXco2jaZ_4',
        rating: 8.2,
        isActive: true,
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully lives with his newfound family formed on the planet of Pandora. Once a familiar threat returns to finish what was previously started.',
        director: 'James Cameron',
        actors: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
        genre: 'Sci-Fi',
        duration: 192,
        releaseDate: new Date('2022-12-16'),
        poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        trailer: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
        rating: 7.6,
        isActive: true,
      },
      {
        title: 'Everything Everywhere All at Once',
        description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what\'s important to her by connecting with the lives she could have led.',
        director: 'Daniel Kwan',
        actors: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan', 'Jamie Lee Curtis'],
        genre: 'Comedy',
        duration: 139,
        releaseDate: new Date('2022-03-25'),
        poster: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVln5LFLYUnf3hc.jpg',
        trailer: 'https://www.youtube.com/watch?v=wxN1T1uxQ2g',
        rating: 8.1,
        isActive: true,
      },
      {
        title: 'John Wick: Chapter 4',
        description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances.',
        director: 'Chad Stahelski',
        actors: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård', 'Laurence Fishburne'],
        genre: 'Action',
        duration: 169,
        releaseDate: new Date('2023-03-24'),
        poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
        trailer: 'https://www.youtube.com/watch?v=qEVUtrk8_B4',
        rating: 7.7,
        isActive: true,
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'Wade Wilson and Logan team up for a wild adventure that will change the Marvel Cinematic Universe forever.',
        director: 'Shawn Levy',
        actors: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Morena Baccarin'],
        genre: 'Action',
        duration: 127,
        releaseDate: new Date('2024-07-26'),
        poster: 'https://image.tmdb.org/t/p/w500/7Py8hsCR7B0IJCS7psBga8hxZ9x.jpg',
        trailer: 'https://www.youtube.com/watch?v=73_1biulkYk',
        rating: 8.5,
        isActive: true,
      },
      {
        title: 'The Matrix Resurrections',
        description: 'Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct.',
        director: 'Lana Wachowski',
        actors: ['Keanu Reeves', 'Carrie-Anne Moss', 'Yahya Abdul-Mateen II', 'Jonathan Groff'],
        genre: 'Sci-Fi',
        duration: 148,
        releaseDate: new Date('2021-12-22'),
        poster: 'https://image.tmdb.org/t/p/w500/8c4a8kE7PizaGQQnditMmI1xbRp.jpg',
        trailer: 'https://www.youtube.com/watch?v=9ix7TUGVYIo',
        rating: 5.7,
        isActive: true,
      },
      {
        title: 'Interstellar',
        description: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.',
        director: 'Christopher Nolan',
        actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        genre: 'Sci-Fi',
        duration: 169,
        releaseDate: new Date('2014-11-07'),
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        rating: 8.4,
        isActive: true,
      },
      {
        title: 'Inception',
        description: 'A skilled thief is given a chance at redemption if he can pull off an impossible heist: planting an idea in someone\'s mind through dream-sharing technology.',
        director: 'Christopher Nolan',
        actors: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
        genre: 'Sci-Fi',
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        rating: 8.8,
        isActive: true,
      },
    ];

    console.log('🌱 Seeding movies...');
    for (const movieData of movies) {
      const movie = movieRepository.create(movieData);
      await movieRepository.save(movie);
      console.log(`✅ Created: ${movie.title}`);
    }

    console.log(`\n✅ Successfully seeded ${movies.length} movies!`);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

seedMovies();

