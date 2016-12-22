var albumPicasso={
	title: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
		{title: 'Blue', duration: '4:26'},
		{title: 'Green', duration: '3:14'},
		{title: 'Red', duration: '5:01'},
		{title: 'Pink', duration: '3:21'},
		{title: 'Magenta', duration: '2:15'}
	]
};

var albumGrey = {
	title: 'The Grey Album',
	artist: 'The Beatles vs Jay-z',
	label: 'bootleg',
	year: '2004',
	albumArtUrl: 'assets/images/album_covers/Grey.jpg',
	songs: [
		{title: 'Public Service Announcement', duration: '2:45'},
		{title: 'What More Can I Say', duration: '4:25'},
		{title: 'Encore', duration: '2:40'},
		{title: 'December 4th', duration: '3:34'},
		{title: '99 Problems', duration: '4:06'},
		{title: 'Dirt Off Your Shoulder', duration: '3:59'},
		{title: 'Change Clothes', duration: '4:00'},
		{title: 'Allure', duration: '4:04'},
		{title: 'Justify My Thug', duration: '4:06'},
		{title: 'Lucifer 9 (Interlude)', duration: '4:12'},
		{title: 'My 1st Song', duration: '2:01'}
	]
};

var albumMarconi = {
	title: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
		{title: 'Hello, Operator?', duration: '1:01'},
		{title: 'Ring, ring, ring', duration: '5:01'},
		{title: 'Fits in your pocket', duration: '3:21'},
		{title: 'Can you hear me now?', duration: '3:14'},
		{title: 'Wrong phone number', duration: '2:15'}
	]
};

var createSongRow = function(songNumber, songName, songLength){
	var template = 
		'<tr class="album-view-song-item">'
	+ ' <td class="song-item-number">' + songNumber + '</td>'
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
	+ '</tr>'
	;
	
	return template;
};

var setCurrentAlbum = function(album){
	var albumTitle = document.getElementsByClassName('album-view-title')[0];
	var albumArtist = document.getElementsByClassName('album-view-artist')[0];
	var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
	var albumImage = document.getElementsByClassName('album-cover-art')[0];
	var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
	
	albumTitle.firstChild.nodeValue = album.title;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);
	
	albumSongList.innerHTML = '';
	
	for (var i=0; i< album.songs.length; i++){
		albumSongList.innerHTML += createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
	}
	
};

var albums = [albumMarconi, albumPicasso, albumGrey];

document.getElementById("next").addEventListener("click", scroll);

var i=0;

function scroll(){
	if(i>=3){
		i=-1;
	}
	i++;
	setCurrentAlbum(albums[i]);

}

window.onload = function(){
	setCurrentAlbum(albums[i]);

};
