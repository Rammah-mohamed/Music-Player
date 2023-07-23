//getting the required elements
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
	activeSongTime;

//import musicList
import { musicList } from "./music.js";

let songIndex = Math.floor(Math.random() * musicList.length);

// when the window load get the song data
window.addEventListener("load", () => {
	getSongData(songIndex);
});

//get song data and insert it in the html elements
function getSongData(index) {
	imgTag.src = `imgs/${musicList[index].src}.jpg`;
	songName.textContent = musicList[index].name;
	artist.textContent = musicList[index].artist;
	audioTag.src = `music/${musicList[index].src}.mp3`;

	//add active class to the song
	songs.forEach((song) => {
		activeSongTime = document.querySelector(".active .time-num");
		if (activeSongTime != undefined || activeSongTime != null) {
			activeSongTime.textContent = activeSongTime.getAttribute("time");
		}
		song.classList.remove("active");
	});
	songs[index].classList.add("active");
	activeSongTime = document.querySelector(".active .time-num");
}

// when play Pause button click play and pause the song using playing class
playPauseBtn.addEventListener("click", () => {
	playPauseBtn.classList.toggle("playing");
	wrapper.classList.toggle("bounce");
	activeSongTime = document.querySelector(".active .time-num");

	//check if the play pause button contains playing class
	if (playPauseBtn.classList.contains("playing")) {
		audioTag.play();
		activeSongTime.textContent = "Playing";
	} else {
		audioTag.pause();
		activeSongTime.textContent = activeSongTime.getAttribute("time");
	}
});

//when prev button clicked play the previous song
prevBtn.addEventListener("click", () => {
	!playPauseBtn.classList.contains("playing") ? playPauseBtn.classList.add("playing") : "";
	wrapper.classList.add("bounce");

	if (songIndex > 0) {
		songIndex--;
		getSongData(songIndex), audioTag.play();
	} else {
		songIndex = musicList.length - 1;
		getSongData(songIndex);
		audioTag.play();
	}
});

//when next button clicked play the next song
nextBtn.addEventListener("click", () => {
	!playPauseBtn.classList.contains("playing") ? playPauseBtn.classList.add("playing") : "";
	wrapper.classList.add("bounce");

	if (songIndex < musicList.length - 1) {
		songIndex++;
		getSongData(songIndex), audioTag.play();
	} else {
		songIndex = 0;
		getSongData(songIndex);
		audioTag.play();
	}
});

//when shuffle button is click get a random song
shuffleBtn.addEventListener("click", () => {
	//play the random music
	if (!playPauseBtn.classList.contains("playing")) {
		playPauseBtn.click();
	}

	let randomIndex = Math.floor(Math.random() * musicList.length);
	if (randomIndex !== songIndex) {
		getSongData(randomIndex);
		audioTag.play();
		songIndex = randomIndex;
	}
});

//when the playlist icon clicked show the list (add show class)
listIcon.addEventListener("click", () => {
	musicListTag.classList.add("show");
});

// when the close button is clicked close the list (remove the show class)
closeIcon.addEventListener("click", (e) => {
	musicListTag.classList.remove("show");
});

//when the song is playing add movement to the progress bar and change the value of the current and duration
audioTag.addEventListener("timeupdate", (e) => {
	let current = e.target.currentTime,
		duration = e.target.duration,
		progress = (current / duration) * 100;
	progressBar.style.width = `${progress}%`;

	let currentMin = Math.floor(current / 60),
		currentSec = Math.floor(current % 60);

	currentTag.textContent = `${currentMin}:${currentSec < 10 ? "0" + currentSec : currentSec}`;

	//if the song ended play the next one
	let currentBtn = document.querySelector(".show");
	if (currentBtn.classList.contains("long")) {
		current == duration ? nextBtn.click() : "";
	} else if (currentBtn.classList.contains("repeat")) {
		if (current == duration) {
			audioTag.currentTime = 0;
			audioTag.play();
		}
	}
	//change the value of currentTag and DurationTag
	audioTag.addEventListener("loadeddata", () => {
		let durationTime = audioTag.duration,
			durationtMin = Math.floor(durationTime / 60),
			durationSec = Math.floor(durationTime % 60);
		durationTag.textContent = `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
	});
});

// when the progress bar is click move the song to specific time
progressBar.parentElement.addEventListener("click", (e) => {
	let progressBarWidth = progressBar.parentElement.clientWidth,
		progressOffset = e.offsetX;
	audioTag.currentTime = (progressOffset / progressBarWidth) * audioTag.duration;
	playPauseBtn.classList.add("playing");
	audioTag.play();
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

//insert the songs in the list
musicList.forEach((song) => {
	let songTag = `<div class="song"}>
                  <div class="info">
                    <h4>${song.name}</h4>
                    <h5>${song.artist}</h5>
                  </div>
                  <audio id="${song.src}" src="music/${song.src}.mp3"></audio>
                  <span class="time-num ${song.src}"></span>
                </div>`;
	songsBox.insertAdjacentHTML("beforeend", songTag);

	let songAudio = document.querySelector(`#${song.src}`),
		songDuration = document.querySelector(`.${song.src}`);

	// get the duration for each song
	songAudio.addEventListener("loadeddata", () => {
		let durationTime = songAudio.duration,
			durationtMin = Math.floor(durationTime / 60),
			durationSec = Math.floor(durationTime % 60);
		songDuration.textContent = `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
		songDuration.setAttribute("time", `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`);
	});
});

let songs = document.querySelectorAll(".song");

//when song clicked add active class and play the song
songs.forEach((song, index) => {
	song.addEventListener("click", (e) => {
		e.stopPropagation();
		wrapper.classList.add("bounce");
		songs.forEach((s, idx) => {
			s.classList.remove("active");
			let time = document.querySelectorAll(`.music-${idx + 1}`);
			if (time[0] != undefined) {
				time[0].textContent = time[0].getAttribute("time");
			}
		});

		//check if the children are clicked
		if (e.target.tagName == "H4" || e.target.tagName == "H5") {
			e.target.parentElement.parentElement.classList.add("active");
		} else if (e.target.tagName == "SPAN" || e.target.classList.contains("info")) {
			e.target.parentElement.classList.add("active");
		} else {
			e.target.classList.add("active");
		}

		//change the time text to playing
		activeSongTime = document.querySelector(".active .time-num");

		activeSongTime.textContent = "Playing";
		getSongData(index);
		playPauseBtn.classList.add("playing");
		audioTag.currentTime = 0;
		audioTag.play();
	});
});
