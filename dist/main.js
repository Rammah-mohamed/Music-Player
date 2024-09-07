var _a;
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
	if (imgTag === null || songName === null || artist === null || audioTag === null) return;
	imgTag.src = `../imgs/${musicList[index].src}.jpg`;
	songName.textContent = musicList[index].name;
	artist.textContent = musicList[index].artist;
	audioTag.src = `../music/${musicList[index].src}.mp3`;
	getDuration(audioTag, null);
}
// 1- Get the current song duration
// 2- Get the duration for the list songs
// 3- Store the duration in the time attribute so it can be used later
function getDuration(audio, tag) {
	audio.addEventListener("loadeddata", () => {
		let durationTime = audio.duration,
			durationtMin = Math.floor(durationTime / 60),
			durationSec = Math.floor(durationTime % 60);
		if (tag !== null && durationTag !== null) {
			durationTag.textContent = `${durationtMin}:${
				durationSec < 10 ? "0" + durationSec : durationSec
			}`;
		} else {
			if (tag === null) return;
			tag.textContent = `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
			tag.setAttribute("time", tag.textContent);
		}
	});
}
// 1- Make a real time song duration and progress bar
// 2- Check if the current song end (play the next song, repeat the current song or get a random song) depending on the current button type
audioTag === null || audioTag === void 0
	? void 0
	: audioTag.addEventListener("timeupdate", (e) => {
			const target = e.target;
			current = target.currentTime;
			duration = target.duration;
			let progress = (current / duration) * 100,
				currentMin = Math.floor(current / 60),
				currentSec = Math.floor(current % 60);
			if (progressBar === null || currentTag === null) return;
			progressBar.style.width = `${progress}%`;
			currentTag.textContent = `${currentMin}:${currentSec < 10 ? "0" + currentSec : currentSec}`;
			//Check the type of the current button
			let currentBtn = document.querySelector(".show");
			if (
				(currentBtn === null || currentBtn === void 0
					? void 0
					: currentBtn.classList.contains("long")) &&
				current === duration
			) {
				nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.click();
			} else if (
				(currentBtn === null || currentBtn === void 0
					? void 0
					: currentBtn.classList.contains("repeat")) &&
				current === duration
			) {
				audioTag.currentTime = 0;
				audioTag.play();
			}
	  });
// When the progress bar is clicked move the song to click position
(_a = progressBar === null || progressBar === void 0 ? void 0 : progressBar.parentElement) ===
	null || _a === void 0
	? void 0
	: _a.addEventListener("click", (e) => {
			var _a, _b;
			if (
				((_a =
					progressBar === null || progressBar === void 0 ? void 0 : progressBar.parentElement) ===
					null || _a === void 0
					? void 0
					: _a.clientWidth) === undefined ||
				audioTag === null
			)
				return;
			let progressBarWidth =
					(_b =
						progressBar === null || progressBar === void 0 ? void 0 : progressBar.parentElement) ===
						null || _b === void 0
						? void 0
						: _b.clientWidth,
				progressOffset = e.offsetX;
			audioTag.currentTime = (progressOffset / progressBarWidth) * audioTag.duration;
	  });
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
		songsBox === null || songsBox === void 0
			? void 0
			: songsBox.insertAdjacentHTML("beforebegin", songTag);
		let songAudio = document.querySelector(`#${song.src}`),
			songDurationTag = document.querySelector(`.${song.src}`);
		// Get the duration for each song in the list
		if (songAudio === null || songDurationTag == null) return;
		getDuration(songAudio, songDurationTag || null);
	});
}
insertSongs(musicList);
//Reload the page when
let reloadIcon = document.querySelector(".reload");
reloadIcon === null || reloadIcon === void 0
	? void 0
	: reloadIcon.addEventListener("click", (e) => {
			window.location.reload();
	  });
//Apply The Dark mode
let modeBtn = document.querySelector(".mode"),
	songNameTag = document.querySelectorAll(".info h4"),
	timeTag = document.querySelectorAll(".time-num"),
	listHeader = document.querySelector(".list-header");
modeBtn === null || modeBtn === void 0
	? void 0
	: modeBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			let elements = [wrapper, musicListTag, listHeader, currentTag, durationTag];
			if (modeBtn.textContent == "Dark Mode") {
				modeBtn.textContent = "Ligth Mode";
				elements.forEach((el) => {
					if (el === null) return;
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
					if (el === null) return;
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
listIcon === null || listIcon === void 0
	? void 0
	: listIcon.addEventListener("click", () => {
			musicListTag === null || musicListTag === void 0
				? void 0
				: musicListTag.classList.add("show");
	  });
//When the close button is clicked close the songs list
closeIcon === null || closeIcon === void 0
	? void 0
	: closeIcon.addEventListener("click", (e) => {
			musicListTag === null || musicListTag === void 0
				? void 0
				: musicListTag.classList.remove("show");
	  });
//1- Add active class to the song
//2- Get a song date that the user was clicked and set active class to it
function setActiveSong(index) {
	let songs = document.querySelectorAll(".song");
	songs.forEach((s) => {
		const song = s;
		song.classList.remove("active");
		song.style.backgroundColor = "transparent";
	});
	songs[index].classList.add("active");
	songs[index].style.backgroundColor = "#57c5b64f";
	activeSongTime = document.querySelector(".active .time-num");
	//Apply the click event to list songs
	songs.forEach((song, id) => {
		song.addEventListener("click", (e) => {
			e.stopPropagation();
			const ActiveSong = document.querySelector(".song.active");
			if (
				ActiveSong === null || ActiveSong === void 0 ? void 0 : ActiveSong.hasAttribute("number")
			) {
			}
			const activeSongIndex =
				ActiveSong === null || ActiveSong === void 0 ? void 0 : ActiveSong.getAttribute("number");
			if (activeSongTime === null || activeSongIndex === null || activeSongIndex === undefined)
				return;
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
			if (
				(playPauseBtn === null || playPauseBtn === void 0
					? void 0
					: playPauseBtn.classList.contains("playing")) &&
				activeSongTime !== null
			) {
				activeSongTime.textContent = "Playing";
				audioTag === null || audioTag === void 0 ? void 0 : audioTag.play();
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
playPauseBtn === null || playPauseBtn === void 0
	? void 0
	: playPauseBtn.addEventListener("click", () => {
			//check if the play pause button contains playing class
			if (activeSongTime == null) return;
			if (!playPauseBtn.classList.contains("playing")) {
				wrapper === null || wrapper === void 0 ? void 0 : wrapper.classList.add("bounce");
				playPauseBtn.classList.add("playing");
				audioTag === null || audioTag === void 0 ? void 0 : audioTag.play();
				activeSongTime.textContent = "Playing";
			} else {
				wrapper === null || wrapper === void 0 ? void 0 : wrapper.classList.remove("bounce");
				playPauseBtn.classList.remove("playing");
				audioTag === null || audioTag === void 0 ? void 0 : audioTag.pause();
				activeSongTime.textContent = activeSongTime.getAttribute("time");
			}
	  });
//Switch between previous and next song
function switchSong(button) {
	button === null || button === void 0
		? void 0
		: button.addEventListener("click", () => {
				if (activeSongTime === null) return;
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
				if (
					playPauseBtn === null || playPauseBtn === void 0
						? void 0
						: playPauseBtn.classList.contains("playing")
				) {
					activeSongTime.textContent = "Playing";
					audioTag === null || audioTag === void 0 ? void 0 : audioTag.play();
				}
		  });
}
switchSong(prevBtn);
switchSong(nextBtn);
//When shuffle button was clicked get a random song
shuffleBtn === null || shuffleBtn === void 0
	? void 0
	: shuffleBtn.addEventListener("click", () => {
			let randomIndex = Math.floor(Math.random() * musicList.length);
			while (randomIndex === randomSongIndex) {
				randomIndex = Math.floor(Math.random() * musicList.length);
			}
			getSongData(randomIndex);
			if (activeSongTime === null) return;
			activeSongTime.textContent = activeSongTime.getAttribute("time");
			setActiveSong(randomIndex);
			randomSongIndex = randomIndex;
			if (
				playPauseBtn === null || playPauseBtn === void 0
					? void 0
					: playPauseBtn.classList.contains("playing")
			) {
				activeSongTime.textContent = "Playing";
				audioTag === null || audioTag === void 0 ? void 0 : audioTag.play();
			}
	  });
//When flow buttons were clicked change listening mode to(repeat, shuffle or next)
flowBtns.forEach((btn, index) => {
	btn.addEventListener("click", (e) => {
		var _a, _b;
		const Button = e.target;
		Button.classList.remove("show");
		//check if the element
		if (index == flowBtns.length - 1) {
			(_a = document.querySelector(".long")) === null || _a === void 0
				? void 0
				: _a.classList.add("show");
		} else {
			(_b = Button.nextElementSibling) === null || _b === void 0
				? void 0
				: _b.classList.add("show");
		}
	});
});
