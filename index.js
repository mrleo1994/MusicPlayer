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

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");

const app = {
  currentIndex: 0,
  isPlaying: false,
  songs: [
    {
      name: "Lối Nhỏ",
      singer: "Đen Vâu",
      path: "./assets/music/LoiNho.mp3",
      image: "path_to_loi_nho_image.jpg",
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
    const htmls = this.songs.map((song) => {
      return `<div class="song">
        <div class="thumb"
            style="background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg')">
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
    $(".playlist").innerHTML = htmls.join("");
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
      // Khi song được play
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
      };
      // Khi song pause
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
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
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  start: function () {
    this.defineProperties(); //  Định nghĩa thuộc tính
    this.handleEvents(); // lắng nghe / xử lý các sự kiện (DOM events)
    this.loadCurrentSong(); // tải thông tin bài hát đầu tiên
    this.render(); // render playlist
  },
};

app.start();
