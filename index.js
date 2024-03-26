/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8 Player";

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  setting: JSON.stringify(),
  songs: [
    {
      name: "Lối Nhỏ",
      singer: "Đen Vâu",
      path: "./assets/music/LoiNho.mp3",
      image: "./assets/img/loi_nho.jpg",
    },
    {
      name: "Đưa Nhau Đi Trốn",
      singer: "Đen Vâu",
      path: "./assets/music/DuaNhauDiTron.mp3",
      image: "path_to_dua_nhau_di_tron_image.jpg",
    },
    {
      name: "Hai Triệu Năm",
      singer: "Đen Vâu",
      path: "./assets/music/HaiTrieuNam.mp3",
      image: "path_to_hai_trieu_nam_image.jpg",
    },
    {
      name: "Đi Theo Bóng Mặt Trời",
      singer: "Đen Vâu",
      path: "./assets/music/DiTheoBongMatTroi.mp3",
      image: "path_to_di_theo_bong_mat_troi_image.jpg",
    },
    {
      name: "Ánh Nắng Của Anh",
      singer: "Đen Vâu",
      path: "./assets/music/AnhNangCuaAnh.mp3",
      image: "path_to_anh_nang_cua_anh_image.jpg",
    },
    {
      name: "Điều Khác Lạ",
      singer: "Đen Vâu",
      path: "./assets/music/DieuKhacLa.mp3",
      image: "path_to_ngay_khac_la_image.jpg",
    },
    {
      name: "Mơ",
      singer: "Đen Vâu",
      path: "./assets/music/Mo.mp3",
      image: "path_to_mo_image.jpg",
    },
    {
      name: "Cho Tôi Lang Thang",
      singer: "Đen Vâu",
      path: "./assets/music/ChoToiLangThang.mp3",
      image: "path_to_bai_nay_chill_phet_image.jpg",
    },
    {
      name: "They Said",
      singer: "Đen Vâu",
      path: "./assets/music/TheySaid.mp3",
      image: "path_to_sao_chang_phai_la_anh_image.jpg",
    },
    {
      name: "Đừng Hỏi Em",
      singer: "Đen Vâu",
      path: "./assets/music/DungHoiEm.mp3",
      image: "path_to_dung_hoi_em_image.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index = "${index}">
        <div class="thumb"
            style="background-image: url('${song.image}')">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    // xử lý phóng to thu nhỏ
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10s
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xử lý phóng to / thu nhỏ
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // xử lý khi click play
    playBtn.onclick = function () {
      // if (_this.isPlaying) {
      //   _this.isPlaying = false;
      //   audio.pause();
      //   player.classList.remove("playing");
      // } else {
      //   _this.isPlaying = true;
      //   audio.play();
      //   player.classList.add("playing");
      // }

      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // Khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    // Tiến độ bài hát
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };
    // khi next bài hát
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // khi prev bài hát
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // khi random bài hát
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    // khi repeat bài hát
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    // khi song ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // lắng nghe click playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // xử lý khi click vào bài hát
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    this.defineProperties(); //  Định nghĩa thuộc tính
    this.handleEvents(); // lắng nghe / xử lý các sự kiện (DOM events)
    this.loadCurrentSong(); // tải thông tin bài hát đầu tiên
    this.render(); // render playlist
  },
};

app.start();
