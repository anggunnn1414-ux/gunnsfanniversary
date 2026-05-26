const CORRECT_PIN = "050625"; 
let currentPin = "";
let musicStarted = false;
let wrongCount = 0;

const pesanLucu = [
    "PIN SALAH! Masa lupa sih? 🙄",
    "Hayo, coba inget-inget lagi...",
    "Waduh, pacar siapa ini kok lupa 😭",
    "Tanggal jadian kita loh ini!",
    "Sistem curiga kamu bukan Sofia! 🤨",
    "Seriusan masih salah? Hadeh..."
];

// 1. KONTROL BRANKAS & DEKRIPSI TEKS
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
let decryptInterval = null;

function startDecryption(elementId, finalString) {
    let iteration = 0;
    const element = document.getElementById(elementId);
    clearInterval(decryptInterval);
    
    decryptInterval = setInterval(() => {
        element.innerText = finalString.split("").map((letter, index) => {
            if(index < iteration) { return letter; }
            return letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        
        if(iteration >= finalString.length){ clearInterval(decryptInterval); }
        iteration += 1 / 3; 
    }, 40);
}

function addNumber(num) {
    if (!musicStarted) {
        document.getElementById("bg-music").play();
        musicStarted = true;
    }
    if (currentPin.length < 6) {
        currentPin += num;
        updateDisplay();
    }
}

function clearPin() {
    currentPin = "";
    updateDisplay();
    document.getElementById("status-msg").innerText = "STATUS: TERKUNCI";
    document.getElementById("status-msg").style.color = "#ff3333";
}

function updateDisplay() {
    let displayString = currentPin.padEnd(6, '_').split('').join(' ');
    document.getElementById("pin-display").innerText = displayString;
}

function checkPin() {
    if (currentPin === CORRECT_PIN) {
        document.getElementById("status-msg").innerText = "AKSES DITERIMA... HALO SAYANG!";
        document.getElementById("status-msg").style.color = "#00ff00";
        
        setTimeout(() => {
            document.getElementById("lock-screen").style.display = "none";
            
            // Video Latar dimunculkan dan dimainkan hanya saat PIN Sukses
            let videoBgElement = document.getElementById("video-bg");
            if (videoBgElement) {
                videoBgElement.style.display = "block";
                videoBgElement.play().catch(err => console.log("Play block:", err));
            }
            
            let mainContent = document.getElementById("main-content");
            mainContent.style.display = "flex";
            mainContent.classList.add("fade-in-content");
            
            // Jalankan efek dekripsi teks judul
            startDecryption('judul-misi', 'MISSION: HAPPY ANNIVERSARY!');
        }, 1000);
    } else {
        let pesanSekarang = pesanLucu[wrongCount % pesanLucu.length];
        document.getElementById("status-msg").innerText = pesanSekarang;
        wrongCount++;
        setTimeout(() => { clearPin(); }, 1200);
    }
}

// 2. LOVE TIME COUNTER (Kalkulator Tanggal)
const startDate = new Date("2025-06-05T00:00:00"); 

setInterval(() => {
    const now = new Date();
    const difference = now - startDate;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const timerElement = document.getElementById("love-timer");
    if(timerElement) {
        timerElement.innerText = `${days} Days, ${hours} Hrs, ${minutes} Mins, ${seconds} Secs`;
    }
}, 1000);

// 3. EASTER EGG (Klik Gembok 5x)
let eggClicks = 0;
function triggerEasterEgg() {
    eggClicks++;
    if(eggClicks === 5) {
        alert("🎉 SYSTEM OVERRIDE SUCCESS! 🎉\n\nSelamat, Sofia! Kamu menemukan rahasia tersembunyi.\n\nKamu berhak mendapatkan: KUPON TRAKTIR MAKAN SEPUASNYA! Silakan screenshot pesan ini dan tukarkan ke pacar kamu! 💖");
        eggClicks = 0; 
    }
}

// 4. KONTROL POP-UP POLAROID
const detailedView = document.getElementById("detailed-polaroid-view");
const detailedImg = document.getElementById("detailed-img");
const detailedCaption = document.getElementById("detailed-caption");

function showDetailedPolaroid(imgSrc, captionText) {
    detailedImg.src = imgSrc;
    detailedCaption.innerText = captionText;
    detailedView.style.display = "flex";
    setTimeout(() => { detailedView.classList.add("active"); }, 50);
}

function closeDetailedPolaroid() {
    detailedView.classList.remove("active");
    setTimeout(() => { detailedView.style.display = "none"; }, 500);
}

// 5. KONTROL POP-UP VIDEO & MUSIK
const videoModal = document.getElementById("video-modal");
const voiceVideo = document.getElementById("voice-video");
const bgMusic = document.getElementById("bg-music");

function openVideoModal() {
    videoModal.style.display = "flex";
    setTimeout(() => { 
        videoModal.classList.add("active"); 
        voiceVideo.play(); 
    }, 50);
}

function closeVideoModal() {
    videoModal.classList.remove("active");
    voiceVideo.pause(); 
    setTimeout(() => { videoModal.style.display = "none"; }, 500);
}

if(voiceVideo && bgMusic) {
    voiceVideo.addEventListener("play", () => { bgMusic.pause(); });
    voiceVideo.addEventListener("pause", () => { bgMusic.play(); });
    voiceVideo.addEventListener("ended", () => { bgMusic.play(); });
}

// ====================================================================
// 6. KODE REVISI: SISTEM BACKGROUND VIDEO BERGANTIAN (PLAYLIST INFINITE)
// ====================================================================
const backgroundVideos = [
    "latar1.mp4", 
    "latar2.mp4", 
    "latar3.mp4"
]; 

let currentBgIndex = 0;
const videoBg = document.getElementById("video-bg");

if (videoBg) {
    videoBg.addEventListener("ended", () => {
        currentBgIndex++; 
        
        // Jika sudah melewati video terakhir, otomatis reset kembali ke video pertama
        if (currentBgIndex >= backgroundVideos.length) {
            currentBgIndex = 0;
        }
        
        // Mengubah source video, memaksa reload, lalu memutarnya lagi secara otomatis
        videoBg.src = backgroundVideos[currentBgIndex];
        videoBg.load(); // <--- KODE KUNCI: Memaksa browser me-refresh video baru agar tidak macet
        
        // Memutar kembali video dengan penanganan error/blocking dari browser
        videoBg.play().catch(error => {
            console.log("Memutar ulang otomatis dipicu kembali.");
            videoBg.play();
        });
    });
}