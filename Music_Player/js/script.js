//Getting the required elements
let wrapper = document.querySelector(".wrapper"),
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

//get song data for the song with the random index
function getSongData(index) {
	imgTag.src = `imgs/${musicList[index].src}.jpg`;
	songName.textContent = musicList[index].name;
	artist.textContent = musicList[index].artist;
	audioTag.src = `music/${musicList[index].src}.mp3`;
	getDuration(audioTag, "");
}

// 1- Get the current song duration
// 2- Get the duration for the list songs
// 3- Store the duration in the time attribute so it can be used later
function getDuration(audio, tag) {
	audio.addEventListener("loadeddata", () => {
		let durationTime = audio.duration,
			durationtMin = Math.floor(durationTime / 60),
			durationSec = Math.floor(durationTime % 60);
		if (tag === "") {
			durationTag.textContent = `${durationtMin}:${
				durationSec < 10 ? "0" + durationSec : durationSec
			}`;
		} else {
			tag.textContent = `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
			tag.setAttribute("time", tag.textContent);
		}
	});
}

// 1- Make a real time song duration and progress bar
// 2- Check if the current song end (play the next song, repeat the current song or get a random song) depending on the current button type
audioTag.addEventListener("timeupdate", (e) => {
	current = e.target.currentTime;
	duration = e.target.duration;
	let progress = (current / duration) * 100,
		currentMin = Math.floor(current / 60),
		currentSec = Math.floor(current % 60);
	progressBar.style.width = `${progress}%`;
	currentTag.textContent = `${currentMin}:${currentSec < 10 ? "0" + currentSec : currentSec}`;

	//Check the type of the current button
	let currentBtn = document.querySelector(".show");
	if (currentBtn.classList.contains("long") && current === duration) {
		nextBtn.click();
	} else if (currentBtn.classList.contains("repeat") && current === duration) {
		audioTag.currentTime = 0;
		audioTag.play();
	}
});

// When the progress bar is clicked move the song to click position
progressBar.parentElement.addEventListener("click", (e) => {
	let progressBarWidth = progressBar.parentElement.clientWidth,
		progressOffset = e.offsetX;
	audioTag.currentTime = (progressOffset / progressBarWidth) * audioTag.duration;
});

//Insert the songs in the songs list
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
		songsBox.insertAdjacentHTML("beforebegin", songTag);
		let songAudio = document.querySelector(`#${song.src}`),
			songDurationTag = document.querySelector(`.${song.src}`);
		// Get the duration for each song in the list
		getDuration(songAudio, songDurationTag);
	});
}
insertSongs(musicList);

//Reload the page when
let reloadIcon = document.querySelector(".reload");
reloadIcon.addEventListener("click", (e) => {
	window.location.reload();
});

//Apply The Dark mode
let modeBtn = document.querySelector(".mode"),
	songNameTag = document.querySelectorAll(".info h4"),
	timeTag = document.querySelectorAll(".time-num"),
	listHeader = document.querySelector(".list-header");
modeBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	let elements = [wrapper, musicListTag, listHeader, currentTag, durationTag];
	if (modeBtn.textContent == "Dark Mode") {
		modeBtn.textContent = "Ligth Mode";
		elements.forEach((el) => {
			if (el.classList.contains("current") || el.classList.contains("duration")) {
				el.style.color = "#FFF";
			} else {
				el.style.backgroundColor = "#222";
			}
		});
		songNameTag.forEach((el) => {
			el.style.color = "#FFF";
		});
		timeTag.forEach((el) => {
			el.style.color = "#FFF";
		});
	} else {
		modeBtn.textContent = "Dark Mode";
		elements.forEach((el) => {
			if (el.classList.contains("current") || el.classList.contains("duration")) {
				el.style.color = "#222";
			} else {
				el.style.backgroundColor = "#FFF";
			}
		});
		songNameTag.forEach((el) => {
			el.style.color = "#222";
		});
		timeTag.forEach((el) => {
			el.style.color = "#222";
		});
	}
});

//When the playlist icon clicked show the songs list
listIcon.addEventListener("click", () => {
	musicListTag.classList.add("show");
});

//When the close button is clicked close the songs list
closeIcon.addEventListener("click", (e) => {
	musicListTag.classList.remove("show");
});

//1- Add active class to the song
//2- Get a song date that the user was clicked and set active class to it
function setActiveSong(index) {
	let songs = document.querySelectorAll(".song");
	songs.forEach((s) => {
		s.classList.remove("active");
		s.style.backgroundColor = "transparent";
	});
	songs[index].classList.add("active");
	songs[index].style.backgroundColor = "#57c5b64f";
	activeSongTime = document.querySelector(".active .time-num");
	//Apply the click event to list songs
	songs.forEach((song, id) => {
		song.addEventListener("click", (e) => {
			e.stopPropagation();
			let activeSongIndex = document.querySelector(".song.active").getAttribute("number");
			activeSongTime.textContent = activeSongTime.getAttribute("time");
			if (id !== +activeSongIndex) {
				songs.forEach((s) => {
					s.classList.remove("active");
					s.style.backgroundColor = "transparent";
				});
				//Set active class to the song that was clicked
				songs[id].classList.add("active");
				song.style.backgroundColor = "#57c5b64f";
				getSongData(id);
				activeSongTime = document.querySelector(".active .time-num");
			}
			//Auto play the current song
			if (playPauseBtn.classList.contains("playing")) {
				activeSongTime.textContent = "Playing";
				audioTag.play();
			}
		});
	});
}

// When the window get loaded insert a random song and set active class to it
window.addEventListener("load", () => {
	getSongData(randomSongIndex);
	setActiveSong(randomSongIndex);
});

// when play Pause button was clicked play or stop the current song
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
		activeSongTime.textContent = activeSongTime.getAttribute("time");
	}
});

//Switch between previous and next song
function switchSong(button) {
	button.addEventListener("click", () => {
		activeSongTime.textContent = activeSongTime.getAttribute("time");
		if (button == prevBtn) {
			if (randomSongIndex > 0) {
				randomSongIndex--;
			} else {
				randomSongIndex = musicList.length - 1;
			}
		} else {
			if (randomSongIndex < musicList.length - 1) {
				randomSongIndex++;
			} else {
				randomSongIndex = 0;
			}
		}
		getSongData(randomSongIndex);
		setActiveSong(randomSongIndex);
		if (playPauseBtn.classList.contains("playing")) {
			activeSongTime.textContent = "Playing";
			audioTag.play();
		}
	});
}
switchSong(prevBtn);
switchSong(nextBtn);

//When shuffle button was clicked get a random song
shuffleBtn.addEventListener("click", () => {
	let randomIndex = Math.floor(Math.random() * musicList.length);
	while (randomIndex === randomSongIndex) {
		randomIndex = Math.floor(Math.random() * musicList.length);
	}
	getSongData(randomIndex);
	activeSongTime.textContent = activeSongTime.getAttribute("time");
	setActiveSong(randomIndex);
	randomSongIndex = randomIndex;
	if (playPauseBtn.classList.contains("playing")) {
		activeSongTime.textContent = "Playing";
		audioTag.play();
	}
});

//When flow buttons were clicked change listening mode to(repeat, shuffle or next)
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
