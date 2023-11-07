//getting the required elements
let	wrapper = document.querySelector(".wrapper"),
	imgTag = document.querySelector(".img-box img"),
	songName = document.querySelector(".music-details h3"),
	artist = document.querySelector(".music-details h4"),
	audioTag = document.querySelector("#audio"),
	playPauseBtn = document.querySelector(".play-pause"),
	prevBtn = document.querySelector(".prev"),
	nextBtn = document.querySelector(".next"),
	progressBar = document.querySelector(".progress"),
	currentTag = document.querySelector(".current"),
	durationTag = document.querySelector(".duration"),
	flowBtns = document.querySelectorAll(".flow"),
	shuffleBtn = document.querySelector(".shuffle"),
	musicListTag = document.querySelector(".music-list"),
	listIcon = document.querySelector(".list-icon"),
	closeIcon = document.querySelector(".close"),
	songsBox = document.querySelector(".songs"),
	current,
	duration,
	activeSongTime;

// Import The default songs
import { musicList } from "./music.js";

//Get Random song index
let randomSongIndex = Math.floor(Math.random() * musicList.length);

//get song data and insert it in the html elements
function getSongData(index) {
	imgTag.src = `imgs/${musicList[index].src}.jpg`;
	songName.textContent = musicList[index].name;
	artist.textContent = musicList[index].artist;
	audioTag.src = `music/${musicList[index].src}.mp3`;
	getDuration(audioTag, "")
}

// Get Song Duration
function getDuration(audio,tag) {
	audio.addEventListener("loadeddata", () => {
		let durationTime = audio.duration,
			durationtMin = Math.floor(durationTime / 60),
			durationSec = Math.floor(durationTime % 60);
			if(tag === "") {
				durationTag.textContent = `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
			} else {
				tag.textContent = `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
				tag.setAttribute("time", tag.textContent)
			}
	});
}

//when the song is playing add movement to the progress bar and change the value of the current and duration
audioTag.addEventListener("timeupdate", (e) => {
	current = e.target.currentTime;
	duration = e.target.duration;
	let	progress = (current / duration) * 100,
		currentMin = Math.floor(current / 60),
		currentSec = Math.floor(current % 60);
	progressBar.style.width = `${progress}%`;
	currentTag.textContent = `${currentMin}:${currentSec < 10 ? "0" + currentSec : currentSec}`;
		//if the song ended play the next one
		let currentBtn = document.querySelector(".show");
		if (currentBtn.classList.contains("long") && current === duration) {
			nextBtn.click();
		} else if (currentBtn.classList.contains("repeat") && current === duration) {
			audioTag.currentTime = 0;
			audioTag.play();
		}
});

// when the progress bar is click move the song to specific time
progressBar.parentElement.addEventListener("click", (e) => {
	let progressBarWidth = progressBar.parentElement.clientWidth,
		progressOffset = e.offsetX;
	audioTag.currentTime = (progressOffset / progressBarWidth) * audioTag.duration;
});

//insert the songs in the list
function insertSongs(list) {
	list.forEach((song, index) => {	
		let songTag = `<div class="song" number=${index}>
			<div class="info">
				<h4>${song.name}</h4>
				<h5>${song.artist}</h5>
			</div>
			<audio id="${song.src}" src="music/${song.src}.mp3"></audio>
			<div>
			<span class="${song.src} time-num"></span>
			</div>
		</div>`;	
		songsBox.insertAdjacentHTML("beforeend", songTag)
		let songAudio = document.querySelector(`#${song.src}`),
		songDurationTag = document.querySelector(`.${song.src}`);
		// get the duration for each song
		getDuration(songAudio, songDurationTag)
	});
}
insertSongs(musicList);

//reload the page function
let reloadIcon = document.querySelector(".reload")
reloadIcon.addEventListener("click", e => {
	window.location.reload();
})

//dark mode function
let modeBtn = document.querySelector(".mode"),
songNameTag = document.querySelectorAll(".info h4"),
timeTag = document.querySelectorAll(".time-num"),
listHeader = document.querySelector(".list-header");
modeBtn.addEventListener("click", e => {
	let elements = [wrapper, musicListTag, listHeader, currentTag, durationTag]
	e.stopPropagation();
	if (modeBtn.textContent == "Dark Mode") {
		modeBtn.textContent = "Ligth Mode";
		elements.forEach(el => {
			if(el.classList.contains("current") || el.classList.contains("duration")) {
				el.style.color = "#FFF"
			} else {
				el.style.backgroundColor = "#222"
			}
		})
		songNameTag.forEach(el => {
			el.style.color = "#FFF"
		})
		timeTag.forEach(el => {
			el.style.color = "#FFF"
		})
	} else {
		modeBtn.textContent = "Dark Mode";
		elements.forEach(el => {
			if(el.classList.contains("current") || el.classList.contains("duration")) {
				el.style.color = "#222"
			} else {
				el.style.backgroundColor = "#FFF"
			}
		})
		songNameTag.forEach(el => {
			el.style.color = "#222"
		})
		timeTag.forEach(el => {
			el.style.color = "#222"
		})
	}
})

//when the playlist icon clicked show the list (add show class)
listIcon.addEventListener("click", () => {
	musicListTag.classList.add("show");
});

// when the close button is clicked close the list (remove the show class)
closeIcon.addEventListener("click", (e) => {
	musicListTag.classList.remove("show");
});

//add active class to the song & apply click event
function setActiveSong(index) {
	let songs = document.querySelectorAll(".song");
	songs.forEach(s => {
		s.classList.remove("active")
		s.style.backgroundColor = "transparent"
	})
	songs[index].classList.add("active");
	songs[index].style.backgroundColor = "#57c5b64f"
	activeSongTime = document.querySelector(".active .time-num");
	songs.forEach((song, index) => {
		song.addEventListener("click", (e) => {
			e.stopPropagation();
			randomSongIndex = document.querySelector(".song.active").getAttribute("number");
			activeSongTime.textContent = activeSongTime.getAttribute("time");
			if(index !== +randomSongIndex) {
				songs.forEach(s => {
					s.classList.remove("active")
					s.style.backgroundColor = "transparent"
				})
				getSongData(index);
				songs[index].classList.add("active")
				song.style.backgroundColor = "#57c5b64f"
				activeSongTime = document.querySelector(".active .time-num");
				
			}
			if(playPauseBtn.classList.contains("playing")) {
				activeSongTime.textContent = "Playing"
				audioTag.play();
			} 
		});
	});
};

// when the window load get the song data and active it
window.addEventListener("load", () => {
	getSongData(randomSongIndex);
	setActiveSong(randomSongIndex);
});

// when play Pause button click play and pause the song using playing class
playPauseBtn.addEventListener("click", () => {
	//check if the play pause button contains playing class
	if (!playPauseBtn.classList.contains("playing")) {
		wrapper.classList.add("bounce");
		playPauseBtn.classList.add("playing");
		audioTag.play();
		activeSongTime.textContent = "Playing";
	} else {
		wrapper.classList.remove("bounce");
		playPauseBtn.classList.remove("playing");
		audioTag.pause();
		activeSongTime.textContent = activeSongTime.getAttribute("time")
	}
});

//switch between previous and next song
function switchSong(button) {
	button.addEventListener("click", () => {
		activeSongTime.textContent = activeSongTime.getAttribute("time");
		if(button == prevBtn) {
			if (randomSongIndex > 0) {
				randomSongIndex--;
			} else {
				randomSongIndex = musicList.length - 1;
			}
		} else {
			if (randomSongIndex < musicList.length - 1) {
				randomSongIndex++;
			} else {
				randomSongIndex = 0
			}
		}
		getSongData(randomSongIndex);
		setActiveSong(randomSongIndex);
		if(playPauseBtn.classList.contains("playing")) {
			activeSongTime.textContent = "Playing"
			audioTag.play();
		}
	})
}
switchSong(prevBtn)
switchSong(nextBtn)

//when shuffle button is click get a random song
shuffleBtn.addEventListener("click", () => {
	let randomIndex = Math.floor(Math.random() * musicList.length);
	while(randomIndex === randomSongIndex) {
		randomIndex = Math.floor(Math.random() * musicList.length);
	}
	getSongData(randomIndex);
	activeSongTime.textContent = activeSongTime.getAttribute("time");
	setActiveSong(randomIndex)
	randomSongIndex = randomIndex;
	if(playPauseBtn.classList.contains("playing")) {
		activeSongTime.textContent = "Playing"
		audioTag.play();
	}
});

//when flow buttons  are clicked add hide class to the other buttons
flowBtns.forEach((btn, index) => {
	btn.addEventListener("click", (e) => {
		e.target.classList.remove("show");
		//check if the element
		if (index == flowBtns.length - 1) {
			document.querySelector(".long").classList.add("show");
		} else {
			e.target.nextElementSibling.classList.add("show");
		}
	});
});