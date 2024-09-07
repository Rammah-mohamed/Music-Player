//Getting the required elements
let wrapper = document.querySelector<HTMLDivElement>(".wrapper"),
	imgTag = document.querySelector<HTMLImageElement>(".img-box img"),
	songName = document.querySelector<HTMLHeadingElement>(".music-details h3"),
	artist = document.querySelector<HTMLHeadingElement>(".music-details h4"),
	audioTag = document.querySelector<HTMLAudioElement>("#audio"),
	playPauseBtn = document.querySelector<HTMLDivElement>(".play-pause"),
	prevBtn = document.querySelector<HTMLButtonElement>(".prev"),
	nextBtn = document.querySelector<HTMLButtonElement>(".next"),
	progressBar = document.querySelector<HTMLDivElement>(".progress"),
	currentTag = document.querySelector<HTMLSpanElement>(".current"),
	durationTag = document.querySelector<HTMLSpanElement>(".duration"),
	flowBtns = document.querySelectorAll<HTMLButtonElement>(".flow"),
	shuffleBtn = document.querySelector<HTMLButtonElement>(".shuffle"),
	musicListTag = document.querySelector<HTMLDivElement>(".music-list"),
	listIcon = document.querySelector<HTMLButtonElement>(".list-icon"),
	closeIcon = document.querySelector<HTMLButtonElement>(".close"),
	songsBox = document.querySelector<HTMLDivElement>(".songs"),
	current: number,
	duration: number,
	activeSongTime: HTMLSpanElement | null;

// Import The default songs
import { musicList } from "./music";

//Get Random song index
let randomSongIndex: number = Math.floor(Math.random() * musicList.length);

//get song data for the song with the random index
function getSongData(index: number) {
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
function getDuration(audio: HTMLAudioElement, tag: HTMLSpanElement | null) {
	audio.addEventListener("loadeddata", () => {
		let durationTime: number = audio.duration,
			durationtMin: number = Math.floor(durationTime / 60),
			durationSec: number = Math.floor(durationTime % 60);
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
audioTag?.addEventListener("timeupdate", (e) => {
	const target = e.target as HTMLAudioElement;
	current = target.currentTime;
	duration = target.duration;
	let progress: number = (current / duration) * 100,
		currentMin: number = Math.floor(current / 60),
		currentSec: number = Math.floor(current % 60);
	if (progressBar === null || currentTag === null) return;
	progressBar.style.width = `${progress}%`;
	currentTag.textContent = `${currentMin}:${currentSec < 10 ? "0" + currentSec : currentSec}`;

	//Check the type of the current button
	let currentBtn = document.querySelector<HTMLButtonElement>(".show");
	if (currentBtn?.classList.contains("long") && current === duration) {
		nextBtn?.click();
	} else if (currentBtn?.classList.contains("repeat") && current === duration) {
		audioTag.currentTime = 0;
		audioTag.play();
	}
});

// When the progress bar is clicked move the song to click position
progressBar?.parentElement?.addEventListener("click", (e) => {
	if (progressBar?.parentElement?.clientWidth === undefined || audioTag === null) return;
	let progressBarWidth: number = progressBar?.parentElement?.clientWidth,
		progressOffset: number = e.offsetX;
	audioTag.currentTime = (progressOffset / progressBarWidth) * audioTag.duration;
});

//Insert the songs in the songs list
type music = {
	id: Date;
	artist: string;
	name: string;
	src: string;
};
function insertSongs(list: music[]) {
	list.forEach((song, index) => {
		let songTag: string = `<div class="song" number=${index}>
			<div class="info">
				<h4>${song.name}</h4>
				<h5>${song.artist}</h5>

			</div>
			<audio id="${song.src}" src="music/${song.src}.mp3"></audio>
			<div>
			<span class="${song.src} time-num"></span>
			</div>
		</div>`;
		songsBox?.insertAdjacentHTML("beforebegin", songTag);
		let songAudio = document.querySelector<HTMLAudioElement>(`#${song.src}`),
			songDurationTag = document.querySelector<HTMLSpanElement>(`.${song.src}`);
		// Get the duration for each song in the list
		if (songAudio === null || songDurationTag == null) return;
		getDuration(songAudio, songDurationTag || null);
	});
}
insertSongs(musicList);

//Reload the page when
let reloadIcon = document.querySelector<HTMLButtonElement>(".reload");
reloadIcon?.addEventListener("click", (e) => {
	window.location.reload();
});

//Apply The Dark mode
let modeBtn = document.querySelector<HTMLButtonElement>(".mode"),
	songNameTag = document.querySelectorAll(".info h4") as NodeListOf<HTMLHeadingElement>,
	timeTag = document.querySelectorAll(".time-num") as NodeListOf<HTMLSpanElement>,
	listHeader = document.querySelector(".list-header") as HTMLHeadElement;
modeBtn?.addEventListener("click", (e) => {
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
listIcon?.addEventListener("click", () => {
	musicListTag?.classList.add("show");
});

//When the close button is clicked close the songs list
closeIcon?.addEventListener("click", (e) => {
	musicListTag?.classList.remove("show");
});

//1- Add active class to the song
//2- Get a song date that the user was clicked and set active class to it
function setActiveSong(index: number) {
	let songs = document.querySelectorAll(".song") as NodeListOf<HTMLDivElement>;
	songs.forEach((s) => {
		const song = s as HTMLElement;
		song.classList.remove("active");
		song.style.backgroundColor = "transparent";
	});
	songs[index].classList.add("active");
	songs[index].style.backgroundColor = "#57c5b64f";
	activeSongTime = document.querySelector<HTMLSpanElement>(".active .time-num");
	//Apply the click event to list songs
	songs.forEach((song, id) => {
		song.addEventListener("click", (e) => {
			e.stopPropagation();
			const ActiveSong = document.querySelector<HTMLDivElement>(".song.active");
			if (ActiveSong?.hasAttribute("number")) {
			}
			const activeSongIndex = ActiveSong?.getAttribute("number");
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
			if (playPauseBtn?.classList.contains("playing") && activeSongTime !== null) {
				activeSongTime.textContent = "Playing";
				audioTag?.play();
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
playPauseBtn?.addEventListener("click", () => {
	//check if the play pause button contains playing class
	if (activeSongTime == null) return;
	if (!playPauseBtn.classList.contains("playing")) {
		wrapper?.classList.add("bounce");
		playPauseBtn.classList.add("playing");
		audioTag?.play();
		activeSongTime.textContent = "Playing";
	} else {
		wrapper?.classList.remove("bounce");
		playPauseBtn.classList.remove("playing");
		audioTag?.pause();
		activeSongTime.textContent = activeSongTime.getAttribute("time");
	}
});

//Switch between previous and next song
function switchSong(button: HTMLButtonElement | null) {
	button?.addEventListener("click", () => {
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
		if (playPauseBtn?.classList.contains("playing")) {
			activeSongTime.textContent = "Playing";
			audioTag?.play();
		}
	});
}
switchSong(prevBtn);
switchSong(nextBtn);

//When shuffle button was clicked get a random song
shuffleBtn?.addEventListener("click", () => {
	let randomIndex: number = Math.floor(Math.random() * musicList.length);
	while (randomIndex === randomSongIndex) {
		randomIndex = Math.floor(Math.random() * musicList.length);
	}
	getSongData(randomIndex);
	if (activeSongTime === null) return;
	activeSongTime.textContent = activeSongTime.getAttribute("time");
	setActiveSong(randomIndex);
	randomSongIndex = randomIndex;
	if (playPauseBtn?.classList.contains("playing")) {
		activeSongTime.textContent = "Playing";
		audioTag?.play();
	}
});

//When flow buttons were clicked change listening mode to(repeat, shuffle or next)
flowBtns.forEach((btn, index) => {
	btn.addEventListener("click", (e) => {
		const Button = e.target as HTMLButtonElement;
		Button.classList.remove("show");
		//check if the element
		if (index == flowBtns.length - 1) {
			document.querySelector(".long")?.classList.add("show");
		} else {
			Button.nextElementSibling?.classList.add("show");
		}
	});
});
