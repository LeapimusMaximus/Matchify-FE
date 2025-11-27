const Users= [{
    spotifyId: "1234567890abcdef", // ID does not have to be ligitimate,  must be unique.
    displayName: "Jane Doe", //randomly generated name, each must be unique.
    email: "janedoe@example.com", //randomly generated email,  must be unique.
    profileImage: "https://picsum.photos/200", //real profile image,  free to use stock photos.
    profileSongs: [
        {
            trackId: "3n3Ppam7vgaVa1iaRUc9Lp",
            trackName: "Lights",
            artistName: "The Weekend",
            albumArt: "https://picsum.photos/seed/blindinglights/200",
            previewUrl:"https://p.scdn.co/mp3-preview/1234567890abcdef1234567890abcdef123456?cid=774b29d4f13844c495f206cafdad9c86",
        },
        
    ] // profileSongs is an array of 5 user's "top songs", each song must be a  legitimate song on spotify and have a valid url etc. 
}]