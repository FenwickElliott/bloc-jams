var createSongRow = function(songNumber, songName, songLength){
	var template = 
		'<tr class="album-view-song-item">' +
	' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
	' <td class="song-item-title">' + songName + '</td>' +
	' <td class="song-item-duration">' + songLength + '</td>' +
	'</tr>'
	;
	
	var $row = $(template);
	
	var clickHandler = function() {
		
	var songNumber = parseInt($(this).attr('data-song-number'));
	if (currentlyPlayingSongNumber  !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
	if (currentlyPlayingSongNumber  !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		setSong(songNumber);
		updatePlayerBarSong();
		currentSoundFile.play();
		updateSeekBarWhileSongPlays();
		
		var $volumeFill = $('.volume .fill');
		var $volumeThumb = $('.volume .thumb');
		$volumeFill.width(currentVolume + '%');
		$volumeThumb.css({left: currentVolume + '%'});
		
	} else if (currentlyPlayingSongNumber  === songNumber) {
		// Switch from Pause -> Play button to pause currently playing song.
		$(this).html(playButtonTemplate);
		$('.main-controls .play-pause').html(playerBarPlayButton);
		if(currentSoundFile.isPaused()){
			currentSoundFile.play();
			$(this).html(pauseButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPauseButton);
		} else {
			currentSoundFile.pause();
			$(this).html(playButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPlayButton);
		}

	}
};
	
	var onHover = function(){
		var songNumberCell = $(this).find('.song-item-number');
		var songNumber = parseInt(songNumberCell.attr('data-song-number'));
		if(songNumber !== currentlyPlayingSongNumber ){
			songNumberCell.html(playButtonTemplate);
		}
	};
	
	var offHover = function(){
		var songNumberCell = $(this).find('.song-item-number');
		var songNumber = parseInt(songNumberCell.attr('data-song-number'));
		if (songNumber !== currentlyPlayingSongNumber ){
			songNumberCell.html(songNumber);
		}
	};
	
	$row.find('.song-item-number').click(clickHandler);
	$row.hover(onHover, offHover);
	return $row;
};

var setCurrentAlbum = function(album){
	currentAlbum = album;
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list');
	
	$albumTitle.text(album.title);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);
	
	$albumSongList.empty();
	
	for (var i=0; i< album.songs.length; i++){
		var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow);
	}
	
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        // #10
        currentSoundFile.bind('timeupdate', function(event) {
            // #11
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
   var offsetXPercent = seekBarFillRatio * 100;
   // #1
   offsetXPercent = Math.max(0, offsetXPercent);
   offsetXPercent = Math.min(100, offsetXPercent);

   // #2
   var percentageString = offsetXPercent + '%';
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        // #3
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4
        var seekBarFillRatio = offsetX / barWidth;
		
		if($(this).parent().attr('class') == 'seek-control'){
			seek(seekBarFillRatio * currentSoundFile.getDuration());
		} else {
			setVolume(seekBarFillRatio*100);
		}

        // #5
        updateSeekPercentage($(this), seekBarFillRatio);
	});
	$seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();
 
         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
 
			 if($seekBar.parent().attr('class') == 'seek-control'){
				 seek(seekBarFillRatio * currentSoundFile.getDuration());
			 } else {
				 setVolume(seekBarFillRatio);
			 }
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
};

var trackIndex = function(album, song){
	return album.songs.indexOf(song);
};

var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
	setSong(currentSongIndex+1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell( currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {
    
    // Note the difference between this implementation and the one in
    // nextSong()
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
	setSong(currentSongIndex+1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function(){
	
	if (currentSoundFile === null){
		//play first track
		setSong(1);
		$("[data-song-number='1']").html(pauseButtonTemplate);
	}
		
	if (currentSoundFile.isPaused()) {
		//resume currently playing song
		currentSoundFile.play();
		updateSeekBarWhileSongPlays();
		$('.main-controls .play-pause').html(playerBarPauseButton);
		$('.album-song-button').html(pauseButtonTemplate);
	} else {
		//pause currently playing song
		currentSoundFile.pause();
		$('.main-controls .play-pause').html(playerBarPlayButton);
		$('.album-song-button').html(playButtonTemplate);
	}
	
};
    
var updatePlayerBarSong = function (){
	$('.player-bar .currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.player-bar .currently-playing .artist-name').text(currentAlbum.artist);
	$('.player-bar .currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
	$('.main-controls .play-pause').html(playerBarPauseButton);
};

var setSong = function (songNumber){
	
	if (currentSoundFile){
		currentSoundFile.stop();
	}
	currentSongFromAlbum = currentAlbum.songs[songNumber-1];
	currentlyPlayingSongNumber = parseInt(songNumber);
	
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
		formats: ['mp3'],
		preload: true
	});
	setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume){
	if (currentSoundFile){
		currentSoundFile.setVolume(volume);
	}
};

var getSongNumberCell = function (number){
	return $('.song-item-number[data-song-number="' + number + '"]');
};
	
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

$(document).ready(function(){
	setCurrentAlbum(albumGrey); // I prefer seeing 
	setupSeekBars();
	$previousButton.click(previousSong);
    $nextButton.click(nextSong);
	$playPause.click(togglePlayFromPlayerBar);
});

