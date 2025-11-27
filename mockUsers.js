
const firstNames = [
  "Ava","Liam","Noah","Emma","Mia","Sophia","Lucas","Ethan","Isabella","Harper",
  "Logan","Ella","Amelia","James","Benjamin","Oliver","Elijah","Grace","Chloe","Zoe",
  "Layla","Mason","Henry","Scarlett","Violet"
];

const lastNames = [
  "Smith","Johnson","Brown","Taylor","Anderson","Lee","Walker","Allen","Young","King",
  "Baker","Carter","Turner","Parker","Adams","Green","Morris","Hill","Ward","Cooper",
  "Mitchell","Rogers"
];

const songsPool = [
  {
    trackId: "3n3Ppam7vgaVa1iaRUc9Lp",
    trackName: "Blinding Lights",
    artistName: "The Weeknd",
    artistId: "1Xyo4u8uXC1ZmMpatF05PJ",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2732ff915e0e5bdf50f7c41d1da",
    previewUrl: "https://p.scdn.co/mp3-preview/1.mp3"
  },
  {
    trackId: "7ouMYWpwJ422jRcDASZB7P",
    trackName: "Die For You",
    artistName: "The Weeknd",
    artistId: "1Xyo4u8uXC1ZmMpatF05PJ",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273b4e0bb97f8814b6c2b8e4815",
    previewUrl: "https://p.scdn.co/mp3-preview/2.mp3"
  },
  {
    trackId: "2BgEsaKNfHUdlh97KmvFyo",
    trackName: "Save Your Tears",
    artistName: "The Weeknd",
    artistId: "1Xyo4u8uXC1ZmMpatF05PJ",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273f4aa0c2e8ae9d89c137c551c",
    previewUrl: "https://p.scdn.co/mp3-preview/3.mp3"
  },
  {
    trackId: "1EzrEOXmMH3G43AXT1y7pA",
    trackName: "Counting Stars",
    artistName: "OneRepublic",
    artistId: "5Pwc4xIPtQLFEnJriah9YJ",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2739e3a96e2ef749acd972d4b4c",
    previewUrl: "https://p.scdn.co/mp3-preview/4.mp3"
  },
  {
    trackId: "0VjIjW4GlUZAMYd2vXMi3b",
    trackName: "In Your Eyes",
    artistName: "The Weeknd",
    artistId: "1Xyo4u8uXC1ZmMpatF05PJ",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273fef2a0b052d4cb3ce8c0f95a",
    previewUrl: "https://p.scdn.co/mp3-preview/5.mp3"
  },

  {
    trackId: "4y4spB9m0Q602nU2nvZfhi",
    trackName: "Sunflower",
    artistName: "Post Malone & Swae Lee",
    artistId: "246dkjvS1zLTtiykXe5h60",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273ba3fa0a487dfc6181e82b07a",
    previewUrl: "https://p.scdn.co/mp3-preview/6.mp3"
  },
  {
    trackId: "2Fxmhks0bxGSBdJ92vM42m",
    trackName: "bad guy",
    artistName: "Billie Eilish",
    artistId: "6qqNVTkY8uBg9cP3Jd7DAH",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2737f6c00e4bde41defaf23a693",
    previewUrl: "https://p.scdn.co/mp3-preview/7.mp3"
  },
  {
    trackId: "6habFhsOp2NvshLv26DqMb",
    trackName: "Shape of You",
    artistName: "Ed Sheeran",
    artistId: "6eUKZXaKkcviH0Ku9w2n3V",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273e0eaa90bf34e66e4fabec65f",
    previewUrl: "https://p.scdn.co/mp3-preview/8.mp3"
  },
  {
    trackId: "0e7ipj03S05BNilyu5bRzt",
    trackName: "lovely",
    artistName: "Billie Eilish & Khalid",
    artistId: "6qqNVTkY8uBg9cP3Jd7DAH",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273b647f05aa47f7a7223f5a730",
    previewUrl: "https://p.scdn.co/mp3-preview/9.mp3"
  },
  {
    trackId: "3UmaczJpikHgJFyBTAJVoz",
    trackName: "Heat Waves",
    artistName: "Glass Animals",
    artistId: "4yvcSjfu4PC0CYQyLy4wSq",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273880b5cbf480b53ace67e1815",
    previewUrl: "https://p.scdn.co/mp3-preview/10.mp3"
  },

  {
    trackId: "6tDDoYIxWvMLTdKpjFkc1B",
    trackName: "STARBOY",
    artistName: "The Weeknd",
    artistId: "1Xyo4u8uXC1ZmMpatF05PJ",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27338632766952f4fb151797d88",
    previewUrl: "https://p.scdn.co/mp3-preview/11.mp3"
  },
  {
    trackId: "2xLMifQCjDGFmkHkpNLD9h",
    trackName: "Happier Than Ever",
    artistName: "Billie Eilish",
    artistId: "6qqNVTkY8uBg9cP3Jd7DAH",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273d118dbd8e02a0dfced5eb07b",
    previewUrl: "https://p.scdn.co/mp3-preview/12.mp3"
  },
  {
    trackId: "7qiZfU4dY1lWllzX7mPBI3",
    trackName: "Perfect",
    artistName: "Ed Sheeran",
    artistId: "6eUKZXaKkcviH0Ku9w2n3V",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27399a8e2f279b1091d651d4d77",
    previewUrl: "https://p.scdn.co/mp3-preview/13.mp3"
  },
  {
    trackId: "5p7ujcrUXASCNwRaWNHR1C",
    trackName: "Levitating",
    artistName: "Dua Lipa",
    artistId: "6M2wZ9GZgrQXHCFfjv46we",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273bc352269b4015da9e3cd39cf",
    previewUrl: "https://p.scdn.co/mp3-preview/14.mp3"
  },
  {
    trackId: "2XU0oxnq2qxCpomAAuJYRL",
    trackName: "Closer",
    artistName: "The Chainsmokers & Halsey",
    artistId: "69GGBxA162lTqCwzJG5jLp",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27349e927af6d506a5d01d9afcd",
    previewUrl: "https://p.scdn.co/mp3-preview/15.mp3"
  },
  {
    trackId: "0KKkJNfGyhkQ5aFogxQAPU",
    trackName: "Someone You Loved",
    artistName: "Lewis Capaldi",
    artistId: "4GNC7GD6oZMSxPGyXy4MNB",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273417d3aac06cdd0b5c8b39603",
    previewUrl: "https://p.scdn.co/mp3-preview/16.mp3"
  },
  {
    trackId: "6M9w2L24leOeV7UvSXZ2GQ",
    trackName: "Riptide",
    artistName: "Vance Joy",
    artistId: "10exVja0key0uqUkk6LJRT",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2734782555026a7566bbb6d6f74",
    previewUrl: "https://p.scdn.co/mp3-preview/17.mp3"
  },
  {
    trackId: "5ZBeML7Lf3FMEVviTyvi8l",
    trackName: "Industry Baby",
    artistName: "Lil Nas X & Jack Harlow",
    artistId: "7jVv8c5Fj3E9VhNjxT4snq",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273fa07a144760de6fbae4374d5",
    previewUrl: "https://p.scdn.co/mp3-preview/18.mp3"
  },
  {
    trackId: "2kJwzbxV2ppxnQoYw4GLBZ",
    trackName: "Peaches",
    artistName: "Justin Bieber",
    artistId: "1uNFoZAHBGtllmzznpCI3s",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273ed2ff1c3f0a60a76bebc1737",
    previewUrl: "https://p.scdn.co/mp3-preview/19.mp3"
  },
  {
    trackId: "4pvb0WLRcMtbPGmtejJJ6y",
    trackName: "Believer",
    artistName: "Imagine Dragons",
    artistId: "53XhwfbYqKCa1cC15pYq2q",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273a7918f0d4cf5b7cbdeb18f0e",
    previewUrl: "https://p.scdn.co/mp3-preview/20.mp3"
  }
];

// --- Utility ---

const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
const randomId = () => Math.random().toString(36).substring(2, 16);

function getRandomUniqueSongs() {
  const chosen = new Set();
  while (chosen.size < 5) {
    chosen.add(randomItem(songsPool));
  }
  return [...chosen];
}

const generateUsers = (count = 100) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);

    users.push({
      spotifyId: randomId(),
      displayName: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      profileImage: `https://picsum.photos/seed/user${i}/200`,
      profileSongs: getRandomUniqueSongs()
    });
  }
 
  return users;

};

const Users = generateUsers();
console.log(Users.length + " <+ Length")
console.log(Users[0])


module.exports = Users;
