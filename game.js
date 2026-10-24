/**
 * ============================================================================
 * TREASURE PIRATE - 2D RETRO PLATFORMER GAME
 * ============================================================================
 * Pure Vanilla JavaScript (Hech qanday tashqi kutubxona yoki rasmlarsiz)
 * Barcha grafikalar Canvas 2D orqali kod bilan chizilgan (procedural pixel-art)
 * Barcha ovoz effektlari Web Audio API orqali sintez qilingan
 * ============================================================================
 */

'use strict';

/* ==========================================================================
   1. OVOZ TIZIMI (WEB AUDIO API)
   ========================================================================== */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('treasure_pirate_sound') !== 'false';
  }

  // Brauzer siyosatiga binoan birinchi foydalanuvchi bosishida AudioContext ochiladi
  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('treasure_pirate_sound', this.enabled);
    return this.enabled;
  }

  // Sakrash ovozi (yoqimli ko'tariluvchi chastota)
  playJump() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Tanga yig'ish ovozi (retro metall qo'ng'iroq)
  playCoin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [987.77, 1318.51].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.2, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.1);
    });
  }

  // Kalit topish ovozi (triumfal 4 notali arpedjio)
  playKey() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.25, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.16);
    });
  }

  // Dushman ustiga sakrab uni yengish ovozi (pop / squish)
  playStomp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Qahramonga zarba yetganda (past jaranglovchi tovush)
  playHurt() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Suvga yoki chuqurga tushish ovozi (splash swoosh)
  playSplash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Nazorat nuqtasi (checkpoint) faollashuvi
  playCheckpoint() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.15);
    });
  }

  // Qulfli sandiq ovozi (kalit yetishmasa chertish)
  playLocked() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(110, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sandiq ochilishi va bosqich g'alabasi (triumfal fanfara)
  playChestOpen() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.3, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + (idx === notes.length - 1 ? 0.6 : 0.2));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + (idx === notes.length - 1 ? 0.6 : 0.2));
    });
  }

  // O'yin tugashi ovozi (g'amgin ohang)
  playGameOver() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [311.13, 293.66, 261.63, 246.94];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0.2, now + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.18 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.25);
    });
  }

  // Yakuniy g'alaba musiqasi
  playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5];
    const times = [0, 0.15, 0.3, 0.45, 0.6, 0.8];
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + times[i]);

      gain.gain.setValueAtTime(0.3, now + times[i]);
      gain.gain.exponentialRampToValueAtTime(0.01, now + times[i] + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + times[i]);
      osc.stop(now + times[i] + 0.4);
    });
  }

  // Qilich siltash ovozi (aerodinamik o'tkir shuvillash)
  playSwordSlash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.13);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, now);
    filter.frequency.linearRampToValueAtTime(350, now + 0.13);
    filter.Q.value = 2.5;

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Qilichlar to'qnashuvi (po'lat jiringlashi va aks-sadosi)
  playSwordClash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [2200, 3200, 4600].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.88, now + 0.24);

      const vol = 0.28 / (idx + 1);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx === 0 ? 0.28 : 0.18));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + (idx === 0 ? 0.28 : 0.18));
    });
  }

  // Bochkalar sinishi ovozi (yog'och parchalanishi)
  playWoodBreak() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Dushman qaroqchi payqaganda ogohlantirish tovushi
  playPirateAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(660, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Qaroqchi yengilganda ingrash tovushi (Arrr!)
  playPirateGroan() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(55, now + 0.26);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }
}

/* ==========================================================================
   2. PIKSEL-ART GRAFIKA VA PROSEDURA CHIZISH (CANVAS 2D)
   ========================================================================== */
class SpriteRenderer {
  // Realistik Qaroqchi Shamshiri (Naval Cutlass)
  static drawRealisticCutlass(ctx, handX, handY, angle, isAttacking, attackProgress, opts = {}) {
    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(angle);

    const scale = opts.scale || 1;
    ctx.scale(scale, scale);

    const isGoldHilt = opts.isGoldHilt || false;
    const bladeLen = opts.bladeLength || 16;
    const animTimer = opts.animTimer || 0;

    // 1. DASTA VA HIMOYACHI GARDISH (BASKET HILT & POMMEL)
    // Pommel (dasta uchi yumaloq bo'rtmasi)
    ctx.fillStyle = isGoldHilt ? '#f1c40f' : '#d48806';
    ctx.beginPath();
    ctx.arc(-2, 1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Dasta (teri/arqon bilan o'ralgan tutqich)
    ctx.fillStyle = '#2d1d11';
    ctx.fillRect(0, -1, 5, 4);
    ctx.fillStyle = '#4a2f13';
    ctx.fillRect(1, -1, 1, 4);
    ctx.fillRect(3, -1, 1, 4);

    // Katta jez/oltin himoya gardishi (Curved Basket Guard / Knuckle-bow)
    ctx.strokeStyle = isGoldHilt ? '#f1c40f' : '#e67e22';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(2, 2, 4.5, 0, Math.PI);
    ctx.stroke();

    // Gardish asosi (Crossguard)
    ctx.fillStyle = isGoldHilt ? '#f39c12' : '#d35400';
    ctx.fillRect(4, -3, 2.5, 8);
    // Gardishdagi yaltiroq aks
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, -1, 1, 3);

    // 2. EGRI PO'LAT SHAMSHIR TIG'I (CURVED DAMASCUS/STEEL BLADE)
    // Tig' orqasi (qalin toblangan quyuq po'lat)
    ctx.fillStyle = '#57606f';
    ctx.beginPath();
    ctx.moveTo(6, -1);
    ctx.lineTo(6 + bladeLen * 0.7, -1);
    ctx.lineTo(6 + bladeLen, -3.5);
    ctx.lineTo(6 + bladeLen + 2.5, -4);
    ctx.lineTo(6 + bladeLen, -1);
    ctx.lineTo(6, 1.5);
    ctx.closePath();
    ctx.fill();

    // Tig' asosiy yuzi (Yaltiroq po'lat gradienti)
    const bladeGrad = ctx.createLinearGradient(6, -2, 6, 2.5);
    bladeGrad.addColorStop(0, '#747d8c');
    bladeGrad.addColorStop(0.35, '#dcdde1');
    bladeGrad.addColorStop(0.7, '#f5f6fa');
    bladeGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = bladeGrad;

    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(6 + bladeLen * 0.7, 0);
    ctx.lineTo(6 + bladeLen, -2.5);
    ctx.lineTo(6 + bladeLen + 3.5, -3.5); // o'tkir qaroqchi tig' uchi (clip point)
    ctx.lineTo(6 + bladeLen + 1, 0.5);
    ctx.lineTo(6 + bladeLen * 0.6, 2);
    ctx.lineTo(6, 2);
    ctx.closePath();
    ctx.fill();

    // O'rtadagi qon oqish chuqurligi (Fuller)
    ctx.strokeStyle = '#4b6584';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(7, 0.5);
    ctx.lineTo(6 + bladeLen * 0.7, 0.2);
    ctx.stroke();

    // O'tkir pichoq qirrasi va nuri (Razor Edge)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(6, 2);
    ctx.lineTo(6 + bladeLen * 0.6, 2);
    ctx.lineTo(6 + bladeLen + 1, 0.5);
    ctx.lineTo(6 + bladeLen + 3.5, -3.5);
    ctx.stroke();

    // Vaqti-vaqti bilan tig' bo'ylab yuguruvchi yorqin nurlar (Blade Glint)
    const glintPhase = (animTimer * 3.5) % 2;
    if (glintPhase < 1) {
      const glintX = 7 + glintPhase * bladeLen;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(glintX, -0.5, 2.5, 1.5);
      ctx.fillRect(6 + bladeLen + 2.5, -4.5, 2, 2);
    }

    ctx.restore();

    // 3. ZARBA VAQTIDAGI YARIM OY KESISH NURI (SLASH ARC TRAIL)
    if (isAttacking && attackProgress !== undefined) {
      ctx.save();
      ctx.translate(handX, handY);
      const arcRadius = bladeLen + 10;
      const startAngle = -0.7;
      const endAngle = 0.8;
      const currentAngle = startAngle + (endAngle - startAngle) * attackProgress;

      const trailGrad = ctx.createLinearGradient(0, -arcRadius, arcRadius, arcRadius);
      trailGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      trailGrad.addColorStop(0.5, isGoldHilt ? 'rgba(255, 215, 0, 0.65)' : 'rgba(72, 219, 251, 0.65)');
      trailGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, arcRadius, currentAngle - 0.9, currentAngle + 0.2);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, arcRadius + 2, currentAngle - 0.5, currentAngle);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Qahramon (Kichkina Qaroqchi) ni chizish
  static drawPirate(ctx, x, y, width, height, state, facingRight, animTimer, isHurt, isAttacking = false, attackProgress = 0) {
    ctx.save();
    ctx.translate(Math.round(x + width / 2), Math.round(y + height / 2));
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    // Shikastlanganda miltillash effekti
    if (isHurt && Math.floor(animTimer * 15) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const bob = (state === 'run') ? Math.sin(animTimer * 12) * 2 : Math.sin(animTimer * 3) * 1;
    const legSwing = (state === 'run') ? Math.sin(animTimer * 12) * 4 : 0;
    const isJumping = state === 'jump';

    // 1. OYOQLAR VA ETICHLAR / YOG'OCH OYOQ
    // Chap oyoq (Yog'och tayoq oyoq - Peg Leg!)
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(-8 - legSwing, 8 + bob, 4, 8);
    ctx.fillStyle = '#4a2f13';
    ctx.fillRect(-8 - legSwing, 14 + bob, 4, 2); // temir uchi

    // O'ng oyoq (Qora qaroqchi etik)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(4 + legSwing, 8 + (isJumping ? -2 : bob), 6, 6);
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(4 + legSwing, 12 + (isJumping ? -2 : bob), 8, 4);
    ctx.fillStyle = '#f1c40f'; // tilla to'qa
    ctx.fillRect(5 + legSwing, 11 + (isJumping ? -2 : bob), 2, 2);

    // 2. TANA / QIZIL QAROQCHI KO'YLAK VA KAMZUL
    ctx.fillStyle = '#c0392b'; // Qizil kamzul
    ctx.fillRect(-9, -6 + bob, 18, 15);
    ctx.fillStyle = '#e74c3c'; // Yorug'roq qizil qatlam
    ctx.fillRect(-7, -4 + bob, 14, 11);

    // Oq ko'ylak yoqasi
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -5 + bob, 6, 5);

    // Tilla tugmalar
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(-2, -1 + bob, 2, 2);
    ctx.fillRect(-2, 3 + bob, 2, 2);

    // Qora belbog' va tilla to'qa
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-9, 5 + bob, 18, 4);
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(-4, 4 + bob, 8, 6);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-2, 5 + bob, 4, 4);

    // 3. BOSHQARUV / QAROQCHI SHLYAPASI VA YUZI
    // Yuz (Issiq teri rangi)
    ctx.fillStyle = '#f5cd79';
    ctx.fillRect(-6, -14 + bob, 12, 9);

    // Soch / Soqol
    ctx.fillStyle = '#4a2f13';
    ctx.fillRect(-7, -13 + bob, 2, 8); // chakka sochi
    ctx.fillRect(-4, -6 + bob, 8, 3);  // qaroqchi mo'ylovi/soqoli

    // Ko'z bog'lagich (Eye Patch)
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(-7, -12 + bob, 14, 1); // ipi
    ctx.fillRect(-4, -13 + bob, 4, 4);  // chap ko'z qora bog'lagichi

    // O'ng ko'z (Sog' ko'z)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, -12 + bob, 3, 3);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(3, -12 + bob, 2, 2);

    // Qizil bandana tasma
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-7, -16 + bob, 14, 3);
    // Bandana tuguni orqada
    ctx.fillRect(-10, -15 + bob, 3, 4);

    // Katta qaroqchi shlyapasi (Tricorn Captain Hat)
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(-11, -19 + bob, 22, 4); // quloqlari keng
    ctx.fillRect(-8, -23 + bob, 16, 5);  // shlyapa tepasi

    // Oltin tilla hoshiya
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(-11, -18 + bob, 22, 1);
    ctx.fillRect(-8, -24 + bob, 16, 1);

    // Shlyapadagi oq bosh suyagi nishoni (Skull)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -22 + bob, 4, 3);
    ctx.fillRect(-1, -19 + bob, 2, 1);

    // 4. QO'LLAR VA REALISTIK SHAMSHIR
    const armX = 8 + (isAttacking ? 3 : 0);
    const armY = 1 + bob;
    ctx.fillStyle = '#f5cd79';
    ctx.fillRect(armX - 2, armY - 2, 4, 4);

    let swordAngle = 0.2;
    if (isAttacking) {
      swordAngle = -0.55 + attackProgress * 1.7;
    } else {
      swordAngle = isJumping ? -0.4 : (state === 'run' ? Math.sin(animTimer * 12) * 0.35 : 0.15);
    }

    SpriteRenderer.drawRealisticCutlass(
      ctx,
      armX,
      armY,
      swordAngle,
      isAttacking,
      attackProgress,
      {
        animTimer,
        bladeLength: 17,
        isGoldHilt: false,
        scale: 1.05
      }
    );

    ctx.restore();
  }

  // Dushman Qaroqchilar (Qilichboz va Kapitan) ni chizish
  static drawEnemyPirate(ctx, x, y, width, height, type, state, facingRight, animTimer, isHurt, isAttacking, attackProgress, hp, maxHp) {
    ctx.save();
    ctx.translate(Math.round(x + width / 2), Math.round(y + height / 2));
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    if (isHurt && Math.floor(animTimer * 16) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    const isCaptain = type === 'captain';
    const bob = (state === 'chase' || state === 'patrol') ? Math.sin(animTimer * 12) * 2 : Math.sin(animTimer * 3);
    const legSwing = (state === 'chase' || state === 'patrol') ? Math.sin(animTimer * 12) * 4 : 0;

    // 1. OYOQLAR
    ctx.fillStyle = isCaptain ? '#1e272e' : '#2f3542';
    ctx.fillRect(-8 - legSwing, 8 + bob, 5, 8);
    ctx.fillRect(4 + legSwing, 8 + bob, 5, 8);
    ctx.fillStyle = isCaptain ? '#f1c40f' : '#747d8c';
    ctx.fillRect(4 + legSwing, 12 + bob, 7, 4);

    // 2. TANA / KO'YLAK
    if (isCaptain) {
      // Kapitan qora-tilla kamzuli
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(-10, -8 + bob, 20, 17);
      ctx.fillStyle = '#9b111e'; // Qirmizi astar
      ctx.fillRect(-8, -6 + bob, 16, 13);
      // Oltin tugmalar va epauletlar
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(-10, -8 + bob, 4, 3);
      ctx.fillRect(6, -8 + bob, 4, 3);
      ctx.fillRect(-1, -3 + bob, 2, 2);
      ctx.fillRect(-1, 1 + bob, 2, 2);
    } else {
      // Qaroqchi dengizchi yo'l-yo'l ko'ylagi
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-9, -6 + bob, 18, 15);
      ctx.fillStyle = '#2980b9'; // Moviy chiziqlar
      ctx.fillRect(-9, -4 + bob, 18, 3);
      ctx.fillRect(-9, 1 + bob, 18, 3);
    }

    // Belbog' va to'qa
    ctx.fillStyle = isCaptain ? '#57606f' : '#4a2f13';
    ctx.fillRect(-9, 5 + bob, 18, 4);
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(-3, 4 + bob, 6, 6);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-1, 5 + bob, 2, 4);

    // 3. BOSHQARUV / YUZ VA BOSH
    ctx.fillStyle = '#e5a663';
    ctx.fillRect(-6, -15 + bob, 12, 10);

    // Quyuq soqol va mo'ylov
    ctx.fillStyle = isCaptain ? '#1e272e' : '#4b2c11';
    ctx.fillRect(-6, -8 + bob, 12, 4);
    ctx.fillRect(-4, -6 + bob, 8, 3);

    // Ko'z bog'lagich (Eye patch)
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(-6, -13 + bob, 12, 1);
    ctx.fillRect(-4, -14 + bob, 4, 4);

    // Sog' ko'z (G'azabli qaroqchi nigohi)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, -13 + bob, 3, 3);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(3, -13 + bob, 2, 2);
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(1, -15 + bob, 4, 1.5);

    if (isCaptain) {
      // Kapitan Shlyapasi (Grand Tricorn)
      ctx.fillStyle = '#0f141d';
      ctx.fillRect(-12, -21 + bob, 24, 4);
      ctx.fillRect(-8, -25 + bob, 16, 5);
      // Oltin hoshiya
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(-12, -20 + bob, 24, 1.5);
      // Qizil pat (Feather plume)
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.moveTo(-7, -25 + bob);
      ctx.quadraticCurveTo(-13, -32 + bob, -8, -35 + bob);
      ctx.lineTo(-5, -27 + bob);
      ctx.fill();
    } else {
      // Qaroqchi Bandanasi (Yashil/Firuzarang bosh ro'mol)
      ctx.fillStyle = '#16a085';
      ctx.fillRect(-7, -18 + bob, 14, 4);
      ctx.fillRect(-10, -17 + bob, 3, 5);
    }

    // 4. REALISTIK QILICH VA ZARBA
    const armX = 8;
    const armY = 1 + bob;
    ctx.fillStyle = '#e5a663';
    ctx.fillRect(6, armY - 2, 4, 4);

    let swordAngle = 0.2;
    if (isAttacking) {
      swordAngle = -0.6 + attackProgress * 1.8;
    } else if (state === 'alert' || state === 'chase') {
      swordAngle = -0.3 + Math.sin(animTimer * 10) * 0.15;
    } else {
      swordAngle = 0.2 + (state === 'patrol' ? Math.sin(animTimer * 12) * 0.2 : 0);
    }

    SpriteRenderer.drawRealisticCutlass(
      ctx,
      armX,
      armY,
      swordAngle,
      isAttacking,
      attackProgress,
      {
        animTimer,
        bladeLength: isCaptain ? 20 : 16,
        isGoldHilt: isCaptain,
        scale: isCaptain ? 1.15 : 1.0
      }
    );

    // 5. ALERT KO'RSATKICHI (!)
    if (state === 'alert') {
      ctx.save();
      const alertY = -28 + Math.sin(animTimer * 15) * 2;
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(0, alertY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('!', -2.5, alertY + 3);
      ctx.restore();
    }

    // 6. HEALTH BAR (JON KO'RSATKICHI)
    if (hp < maxHp || state === 'alert' || state === 'chase' || isCaptain) {
      ctx.save();
      const barW = isCaptain ? 26 : 18;
      const barH = 3;
      const barX = -barW / 2;
      const barY = isCaptain ? -33 : -24;

      ctx.fillStyle = '#1e272e';
      ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(barX, barY, Math.max(0, (hp / maxHp)) * barW, barH);
      ctx.restore();
    }

    ctx.restore();
  }

  // Yog'och Bochkalar (Destructible Barrels)
  static drawBarrel(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Yog'och bochka tanasi
    ctx.fillStyle = '#6d4c28';
    ctx.fillRect(2, 0, width - 4, height);
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 4, width, height - 8);

    // Bochkalar taxtalari vertikal chiziqlari
    ctx.fillStyle = '#4a2f13';
    ctx.fillRect(5, 0, 1.5, height);
    ctx.fillRect(Math.round(width / 2) - 1, 0, 1.5, height);
    ctx.fillRect(width - 7, 0, 1.5, height);

    // Temir chambarlar (qora/kulrang temir xalqalar)
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(0, 3, width, 4);
    ctx.fillRect(0, height - 7, width, 4);
    ctx.fillStyle = '#636e72';
    ctx.fillRect(0, 4, width, 1.5);
    ctx.fillRect(0, height - 6, width, 1.5);

    // Temir mixlar (rivets)
    ctx.fillStyle = '#dfe6e9';
    ctx.fillRect(3, 4, 1.5, 1.5);
    ctx.fillRect(width - 5, 4, 1.5, 1.5);
    ctx.fillRect(3, height - 6, 1.5, 1.5);
    ctx.fillRect(width - 5, height - 6, 1.5, 1.5);

    // Markaziy tiqin (Bung hole)
    ctx.fillStyle = '#2d1d11';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Mash'ala (Flickering Torch)
  static drawTorch(ctx, x, y, animTimer) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // 1. Yumshoq alangali radial nurlanish
    const glowRadius = 18 + Math.sin(animTimer * 10) * 3;
    const glowGrad = ctx.createRadialGradient(8, 4, 2, 8, 4, glowRadius);
    glowGrad.addColorStop(0, 'rgba(255, 177, 66, 0.35)');
    glowGrad.addColorStop(0.5, 'rgba(238, 82, 83, 0.15)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(8, 4, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Yog'och / temir tayanch
    ctx.fillStyle = '#4a2f13';
    ctx.fillRect(6, 10, 4, 16);
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(5, 7, 6, 4);

    // 3. Yonayotgan olov piksellari
    const f1 = Math.sin(animTimer * 14) * 1.5;
    const f2 = Math.cos(animTimer * 18) * 1.2;

    ctx.fillStyle = '#ee5253';
    ctx.beginPath();
    ctx.moveTo(4, 7);
    ctx.lineTo(8 + f1, -4);
    ctx.lineTo(12, 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ff9f43';
    ctx.beginPath();
    ctx.moveTo(5, 7);
    ctx.lineTo(8 + f2, -1);
    ctx.lineTo(11, 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#feca57';
    ctx.fillRect(6, 2, 4, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7, 3, 2, 3);

    ctx.restore();
  }

  // O'simliklar va Gullar (Foliage & Flowers)
  static drawFoliage(ctx, x, y, animTimer, type = 'bush') {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    const sway = Math.sin(animTimer * 3 + x * 0.05) * 2;

    if (type === 'flower') {
      ctx.fillStyle = '#10ac84';
      ctx.fillRect(sway, -4, 2, 6);
      ctx.fillStyle = '#ee5253';
      ctx.beginPath();
      ctx.arc(sway + 1, -6, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#feca57';
      ctx.fillRect(sway, -7, 2, 2);
    } else if (type === 'fern') {
      ctx.fillStyle = '#1dd1a1';
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(i * 9 + sway, -9);
        ctx.lineTo(i * 3, 0);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#10ac84';
      ctx.beginPath();
      ctx.arc(-4 + sway * 0.5, -4, 5, 0, Math.PI * 2);
      ctx.arc(3 + sway * 0.8, -5, 6, 0, Math.PI * 2);
      ctx.arc(9 + sway * 0.5, -3, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2ed573';
      ctx.fillRect(-2 + sway * 0.5, -8, 6, 2);
    }
    ctx.restore();
  }

  // Qisqichbaqa dushman (Crab)
  static drawCrab(ctx, x, y, width, height, facingRight, animTimer) {
    ctx.save();
    ctx.translate(Math.round(x + width / 2), Math.round(y + height / 2));
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    const clawPinch = Math.sin(animTimer * 8) * 3;
    const legWalk = Math.sin(animTimer * 12) * 2;

    // Oyoqchalari (4 ta mayda oyoq)
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-12, 4 + legWalk, 3, 5);
    ctx.fillRect(-6, 4 - legWalk, 3, 5);
    ctx.fillRect(3, 4 + legWalk, 3, 5);
    ctx.fillRect(9, 4 - legWalk, 3, 5);

    // Qisqichbaqa qobig'i (Asosiy tanasi)
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-11, -4, 22, 10);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-13, -2, 26, 6);
    // Qobiq tepasi yorug'ligi
    ctx.fillStyle = '#ff7675';
    ctx.fillRect(-8, -4, 16, 2);

    // Ko'zlari (stalks)
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-6, -8, 3, 4);
    ctx.fillRect(3, -8, 3, 4);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, -10, 5, 4);
    ctx.fillRect(2, -10, 5, 4);

    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-5, -9, 2, 2);
    ctx.fillRect(4, -9, 2, 2);

    // Qisqichlari (Claws)
    // Chap qisqich
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-16, -6, 4, 4);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-19, -9 - clawPinch * 0.3, 4, 5);
    ctx.fillRect(-19, -4 + clawPinch * 0.3, 4, 4);

    // O'ng qisqich
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(12, -6, 4, 4);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(15, -9 - clawPinch * 0.3, 4, 5);
    ctx.fillRect(15, -4 + clawPinch * 0.3, 4, 4);

    ctx.restore();
  }

  // Qush / To'tiqush dushman (Bird)
  static drawBird(ctx, x, y, width, height, facingRight, animTimer) {
    ctx.save();
    ctx.translate(Math.round(x + width / 2), Math.round(y + height / 2));
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    const wingCycle = Math.sin(animTimer * 10);
    const wingY = wingCycle * 6;

    // Dum patlari (Zumrad yashil va ko'k)
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(-14, 0, 6, 4);
    ctx.fillStyle = '#00cec9';
    ctx.fillRect(-16, 2, 6, 2);

    // Tanasi (Yorqin ko'k va sariq qorin)
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(-8, -5, 15, 10);
    ctx.fillStyle = '#fdcb6e'; // sariq qorin
    ctx.fillRect(-3, 1, 9, 4);

    // Bosh qismi
    ctx.fillStyle = '#d63031'; // qizil toj patlari
    ctx.fillRect(4, -10, 4, 3);
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(4, -8, 6, 6);

    // Ko'z
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, -7, 3, 3);
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(8, -7, 1, 2);

    // Sariq egri tumshug'
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(10, -6, 4, 3);
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(12, -4, 2, 2);

    // Qanot (Qoqish animatsiyasi)
    ctx.fillStyle = '#74b9ff';
    ctx.fillRect(-4, -6 + wingY, 10, 4);
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(-6, -4 + wingY, 8, 3);

    ctx.restore();
  }

  // Tanga (Oltin aylanuvchi tanga)
  static drawCoin(ctx, x, y, width, height, animTimer) {
    ctx.save();
    ctx.translate(Math.round(x + width / 2), Math.round(y + height / 2));

    const scaleX = Math.cos(animTimer * 6);
    const floatY = Math.sin(animTimer * 4) * 2;
    ctx.translate(0, floatY);
    ctx.scale(scaleX, 1);

    // Tanga asosi
    ctx.fillStyle = '#d48806';
    ctx.beginPath();
    ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Ichki tilla jilo
    ctx.fillStyle = '#ffd666';
    ctx.beginPath();
    ctx.arc(0, 0, width / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Markaziy ramz
    ctx.fillStyle = '#d48806';
    ctx.fillRect(-1.5, -3, 3, 6);
    ctx.fillRect(-3, -1.5, 6, 3);

    // Yaltiroq uchqun
    if (Math.abs(scaleX) > 0.7) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2, -4, 2, 2);
    }

    ctx.restore();
  }

  // Kalit (Sandiqni ochuvchi oltin qaroqchi kaliti)
  static drawKey(ctx, x, y, width, height, animTimer) {
    ctx.save();
    ctx.translate(Math.round(x + width / 2), Math.round(y + height / 2));

    const floatY = Math.sin(animTimer * 4) * 3;
    const rotate = Math.sin(animTimer * 2) * 0.15;
    ctx.translate(0, floatY);
    ctx.rotate(rotate);

    // Orqa fonidagi tilla yorug'lik g'ubori (Aura)
    ctx.fillStyle = 'rgba(255, 204, 0, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Kalit xalqasi (Boshy)
    ctx.strokeStyle = '#d48806';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -6, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#ffd666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -6, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Kalit stvoli
    ctx.fillStyle = '#ffd666';
    ctx.fillRect(-1.5, -1, 3, 11);
    ctx.fillStyle = '#d48806';
    ctx.fillRect(0.5, -1, 1, 11);

    // Kalit tishlari
    ctx.fillStyle = '#ffd666';
    ctx.fillRect(1.5, 4, 4, 2.5);
    ctx.fillRect(1.5, 7.5, 3, 2.5);

    // Yaltirash
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -9, 2, 2);

    ctx.restore();
  }

  // Xazina sandig'i (Treasure Chest)
  static drawChest(ctx, x, y, width, height, isOpen, animTimer, keysCollected) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    if (isOpen) {
      // 1. OCHIQ SANDIQDAN CHIQUVCHI OLTIN NURLAR
      const rayCount = 6;
      for (let i = 0; i < rayCount; i++) {
        const angle = (animTimer * 1.5 + (i * Math.PI * 2) / rayCount) % (Math.PI * 2);
        if (Math.sin(angle) < 0) { // faqat tepaga qaragan nurlar
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(width / 2, 12);
          ctx.lineTo(width / 2 + Math.cos(angle) * 35, 12 + Math.sin(angle) * 35);
          ctx.stroke();
        }
      }

      // Ochiq qopqoq (yuqoriga ochilgan)
      ctx.fillStyle = '#5d3a1a';
      ctx.fillRect(2, -8, width - 4, 8);
      ctx.fillStyle = '#8b572a';
      ctx.fillRect(4, -6, width - 8, 5);
      // Temir halqalar
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(6, -8, 3, 8);
      ctx.fillRect(width - 9, -8, 3, 8);

      // Sandiq tubi
      ctx.fillStyle = '#5d3a1a';
      ctx.fillRect(0, 10, width, height - 10);
      ctx.fillStyle = '#3b230d';
      ctx.fillRect(2, 12, width - 4, height - 14);

      // ICHIDAGI LIQ TO'LA OLTIN VA JAVOHIRLAR!
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(3, 8, width - 6, 7);
      // Tilla tangalar va yoqut/zumradlar
      const gemColors = ['#e74c3c', '#2ecc71', '#3498db', '#f39c12', '#ffffff'];
      for (let gx = 5; gx < width - 6; gx += 5) {
        ctx.fillStyle = gemColors[(gx + Math.floor(animTimer * 4)) % gemColors.length];
        ctx.fillRect(gx, 6 + (gx % 3), 3, 3);
      }
    } else {
      // 2. YOPILGAN QULF SANDIQ
      // Qopqoq
      ctx.fillStyle = '#5d3a1a';
      ctx.fillRect(0, 2, width, 12);
      ctx.fillStyle = '#8b572a';
      ctx.fillRect(2, 4, width - 4, 8);

      // Qopqoq kamarlari
      ctx.fillStyle = '#34495e';
      ctx.fillRect(6, 2, 4, 12);
      ctx.fillRect(width - 10, 2, 4, 12);

      // Sandiq asosi
      ctx.fillStyle = '#5d3a1a';
      ctx.fillRect(0, 14, width, height - 14);
      ctx.fillStyle = '#8b572a';
      ctx.fillRect(2, 16, width - 4, height - 18);

      // Pastki temir kamarlar
      ctx.fillStyle = '#34495e';
      ctx.fillRect(6, 14, 4, height - 14);
      ctx.fillRect(width - 10, 14, 4, height - 14);

      // Katta oltin qulf
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(width / 2 - 5, 10, 10, 11);
      ctx.fillStyle = '#d68910';
      ctx.fillRect(width / 2 - 1.5, 14, 3, 4);

      // Qulf qadami (Arch)
      ctx.strokeStyle = '#bdc3c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width / 2, 10, 4, Math.PI, 0);
      ctx.stroke();

      // Qancha kalit yig'ilganini bildiruvchi 3 ta tilla nuqta
      for (let k = 0; k < 3; k++) {
        const dotX = width / 2 - 8 + k * 8;
        ctx.fillStyle = k < keysCollected ? '#2ecc71' : '#e74c3c';
        ctx.fillRect(dotX, height - 5, 4, 3);
      }
    }

    ctx.restore();
  }

  // Tosh to'siq (Rock obstacle)
  static drawRock(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Asosiy tosh qoya soyasi
    ctx.fillStyle = '#57606f';
    ctx.beginPath();
    ctx.moveTo(3, height);
    ctx.lineTo(0, height - 10);
    ctx.lineTo(6, 4);
    ctx.lineTo(width - 8, 2);
    ctx.lineTo(width, height - 8);
    ctx.lineTo(width - 2, height);
    ctx.closePath();
    ctx.fill();

    // Tosh yorug'lik yuzasi
    ctx.fillStyle = '#747d8c';
    ctx.beginPath();
    ctx.moveTo(6, 4);
    ctx.lineTo(width - 10, 3);
    ctx.lineTo(width - 6, 14);
    ctx.lineTo(10, 18);
    ctx.closePath();
    ctx.fill();

    // Toshdagi yashil mox (Moss)
    ctx.fillStyle = '#2ed573';
    ctx.fillRect(8, 3, 6, 2);
    ctx.fillRect(16, 2, 7, 3);

    // Qorong'i yoriqlar (Cracks)
    ctx.strokeStyle = '#2f3542';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(14, 10);
    ctx.lineTo(18, 16);
    ctx.lineTo(15, 24);
    ctx.stroke();

    ctx.restore();
  }

  // Nazorat nuqtasi bayrog'i (Checkpoint Flag)
  static drawFlag(ctx, x, y, isActivated, animTimer) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    // Yog'och ustun
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(2, 0, 4, 48);
    ctx.fillStyle = '#4a2f13';
    ctx.fillRect(4, 0, 2, 48);

    // Cho'qqi oltin shar
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(4, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    if (isActivated) {
      // Faol qaroqchi qora bayrog'i (Jolly Roger hilpirashi)
      const wave = Math.sin(animTimer * 8) * 3;
      const wave2 = Math.cos(animTimer * 8) * 2;

      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.moveTo(6, 4);
      ctx.lineTo(26 + wave2, 4 + wave);
      ctx.lineTo(24 + wave2, 20 + wave);
      ctx.lineTo(6, 18);
      ctx.closePath();
      ctx.fill();

      // Bayroqdagi oq kalla suyagi
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12 + wave2 * 0.5, 8 + wave * 0.5, 6, 5);
      ctx.fillRect(13 + wave2 * 0.5, 13 + wave * 0.5, 4, 2);
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(13 + wave2 * 0.5, 10 + wave * 0.5, 2, 2);
      ctx.fillRect(16 + wave2 * 0.5, 10 + wave * 0.5, 2, 2);
    } else {
      // Yig'ilgan oppoq passiv bayroqcha
      ctx.fillStyle = '#dcdde1';
      ctx.fillRect(6, 4, 8, 14);
      ctx.fillStyle = '#718093';
      ctx.fillRect(10, 4, 4, 14);
    }

    ctx.restore();
  }

  // Palma daraxti (Palm Tree bezagi)
  static drawPalmTree(ctx, x, y, animTimer) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const sway = Math.sin(animTimer * 2) * 4;

    // Egri tanasi
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.quadraticCurveTo(-12, -40, sway - 4, -80);
    ctx.lineTo(sway + 4, -80);
    ctx.quadraticCurveTo(-4, -40, 6, 0);
    ctx.closePath();
    ctx.fill();

    // Po'stloq halqalari
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 2;
    for (let h = -15; h > -75; h -= 12) {
      const offsetX = (h / -80) * sway;
      ctx.beginPath();
      ctx.moveTo(offsetX - 5, h);
      ctx.lineTo(offsetX + 5, h);
      ctx.stroke();
    }

    // Kokos yong'oqlari
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.arc(sway - 3, -78, 4, 0, Math.PI * 2);
    ctx.arc(sway + 3, -78, 4, 0, Math.PI * 2);
    ctx.arc(sway, -75, 4, 0, Math.PI * 2);
    ctx.fill();

    // Palma yaproqlari (Fronds)
    const leaves = [
      { dx: -38, dy: 10, cpx: -25, cpy: -20 },
      { dx: -30, dy: -25, cpx: -18, cpy: -35 },
      { dx: 38, dy: 10, cpx: 25, cpy: -20 },
      { dx: 30, dy: -25, cpx: 18, cpy: -35 },
      { dx: 0, dy: -38, cpx: 0, cpy: -40 },
    ];

    ctx.fillStyle = '#2ecc71';
    leaves.forEach(leaf => {
      ctx.beginPath();
      ctx.moveTo(sway, -80);
      ctx.quadraticCurveTo(sway + leaf.cpx, -80 + leaf.cpy, sway + leaf.dx, -80 + leaf.dy);
      ctx.quadraticCurveTo(sway + leaf.cpx * 0.8, -80 + leaf.cpy * 0.8, sway, -80);
      ctx.fill();
    });

    ctx.restore();
  }

  // Plitka / Yer bloklarini chizish (Tiles)
  static drawTile(ctx, tileType, x, y, size) {
    if (tileType === 0) return; // Bo'sh havo

    if (tileType === 1) {
      // 1: Qumloq orol yuzasi (Ustida maysazor bilan)
      // Asosiy qum tanasi
      ctx.fillStyle = '#f4c465';
      ctx.fillRect(x, y, size, size);

      // Qum toshchalari
      ctx.fillStyle = '#e5ab42';
      ctx.fillRect(x + 4, y + 14, 3, 2);
      ctx.fillRect(x + 18, y + 22, 4, 2);
      ctx.fillRect(x + 24, y + 12, 2, 2);

      // Ustki yashil maysa qatlami
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(x, y, size, 6);
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(x, y + 5, size, 2);

      // Osilib turgan maysa uchlari
      for (let i = 0; i < size; i += 8) {
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(x + i, y + 6, 4, 3);
      }
    } else if (tileType === 2) {
      // 2: Qum osti chuqur qatlami (Toshli va chig'anoqli qum)
      ctx.fillStyle = '#de9b35';
      ctx.fillRect(x, y, size, size);

      // Qora toshlar
      ctx.fillStyle = '#b87b22';
      ctx.fillRect(x + 6, y + 8, 8, 6);
      ctx.fillRect(x + 20, y + 18, 6, 6);

      // Yaltiroq chig'anoq
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 14, y + 24, 3, 2);
    } else if (tileType === 3) {
      // 3: Yog'och ko'prik / iskala (Wooden Dock Platform)
      ctx.fillStyle = '#5d3a1a';
      ctx.fillRect(x, y, size, 12);
      ctx.fillStyle = '#8b572a';
      ctx.fillRect(x, y + 2, size, 8);

      // Yog'och taxtalar chiziqlari
      ctx.fillStyle = '#3b230d';
      ctx.fillRect(x, y, 2, 12);
      ctx.fillRect(x + size - 2, y, 2, 12);

      // Qoziq mixlari
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(x + 4, y + 4, 2, 2);
      ctx.fillRect(x + size - 6, y + 4, 2, 2);
    } else if (tileType === 4) {
      // 4: Qattiq tosh qoya bloki
      ctx.fillStyle = '#57606f';
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = '#747d8c';
      ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(x + 8, y + 8, 4, 4);
      ctx.fillRect(x + 18, y + 16, 6, 4);
    }
  }

  // Chuqur / Okean suvi to'lqinlari
  static drawWater(ctx, x, y, width, height, animTimer) {
    ctx.save();
    // Chuqur moviy suv
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(x, y + 6, width, height - 6);

    // To'lqin ko'pigi (Animated foam crest)
    ctx.fillStyle = '#74b9ff';
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    for (let px = 0; px <= width; px += 16) {
      const wave = Math.sin((x + px) * 0.1 + animTimer * 4) * 3;
      ctx.lineTo(x + px, y + 4 + wave);
    }
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fill();

    // Oq ko'pik chiziqlari
    ctx.fillStyle = '#ffffff';
    for (let px = 0; px < width; px += 32) {
      const wave = Math.sin((x + px) * 0.1 + animTimer * 4) * 3;
      ctx.fillRect(x + px, y + 3 + wave, 12, 2);
    }

    ctx.restore();
  }

  // Parallaks fon: Har bir bosqich uchun maxsus muhit (Kun, Quyi Quyosh, Shom, Tungi Qal'a)
  static drawParallaxBackground(ctx, cameraX, cameraY, viewWidth, viewHeight, animTimer, levelIndex = 0) {
    // 1. Osmon gradienti (Bosqichga qarab atmosferik o'zgaradi)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    if (levelIndex === 1) {
      // 2-Bosqich: Quyi Quyosh / Oltin Shom (Sunset)
      skyGrad.addColorStop(0, '#d35400');
      skyGrad.addColorStop(0.4, '#e67e22');
      skyGrad.addColorStop(0.7, '#f39c12');
      skyGrad.addColorStop(1, '#f8c291');
    } else if (levelIndex === 2) {
      // 3-Bosqich: Qorong'u Tumanli Ko'rfaz (Misty Twilight)
      skyGrad.addColorStop(0, '#192a56');
      skyGrad.addColorStop(0.45, '#273c75');
      skyGrad.addColorStop(0.8, '#40739e');
      skyGrad.addColorStop(1, '#487eb0');
    } else if (levelIndex === 3) {
      // 4-Bosqich: Qora Soqol Qal'asi / Tungi Osmon va Oltin Oy (Night Fortress)
      skyGrad.addColorStop(0, '#0a1128');
      skyGrad.addColorStop(0.5, '#001f54');
      skyGrad.addColorStop(0.8, '#034078');
      skyGrad.addColorStop(1, '#1282a2');
    } else {
      // 1-Bosqich: Tropik Quyoshli Sohil (Tropical Midday)
      skyGrad.addColorStop(0, '#38a3a5');
      skyGrad.addColorStop(0.4, '#57cc99');
      skyGrad.addColorStop(0.8, '#80ed99');
      skyGrad.addColorStop(1, '#c7f9cc');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // 2. Tungi Yulduzlar (Faqat 4-bosqichda)
    if (levelIndex === 3) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const stars = [
        { x: 30, y: 20, s: 2 }, { x: 90, y: 45, s: 1.5 }, { x: 160, y: 15, s: 2 },
        { x: 230, y: 35, s: 1 }, { x: 320, y: 22, s: 2 }, { x: 390, y: 40, s: 1.5 },
        { x: 470, y: 18, s: 2.5 }, { x: 550, y: 32, s: 1 }, { x: 610, y: 25, s: 2 }
      ];
      stars.forEach(st => {
        const twinkle = (Math.sin(animTimer * 4 + st.x) + 1) * 0.4 + 0.3;
        ctx.globalAlpha = twinkle;
        ctx.fillRect(st.x, st.y, st.s, st.s);
      });
      ctx.globalAlpha = 1.0;
    }

    // 3. Quyosh yoki Oy (Sun / Moon)
    const celestialX = viewWidth * 0.78;
    const celestialY = 55;
    if (levelIndex === 3) {
      // Yarim oy (Luminous Crescent Moon)
      ctx.fillStyle = 'rgba(245, 246, 250, 0.2)';
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f5f6fa';
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a1128';
      ctx.beginPath();
      ctx.arc(celestialX + 8, celestialY - 4, 18, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Quyosh
      const sunColor = levelIndex === 1 ? '#e67e22' : (levelIndex === 2 ? '#f1c40f' : '#ffeaa7');
      const glowColor = levelIndex === 1 ? 'rgba(230, 126, 34, 0.3)' : 'rgba(255, 230, 100, 0.25)';
      ctx.fillStyle = glowColor;
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = sunColor;
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Uzoqdagi uchuvchi dengiz chaykalari (Distant Flying Seagulls)
    if (levelIndex === 0 || levelIndex === 1) {
      const gulls = [
        { x: 140, y: 70, speed: 24 },
        { x: 330, y: 48, speed: 20 },
        { x: 510, y: 85, speed: 26 }
      ];
      ctx.strokeStyle = levelIndex === 1 ? '#6d4c28' : '#2c3e50';
      ctx.lineWidth = 1.6;
      gulls.forEach(g => {
        const gx = ((g.x + animTimer * g.speed - cameraX * 0.05) % (viewWidth + 80)) - 40;
        const wingFlap = Math.sin(animTimer * 7 + g.x) * 3;
        ctx.beginPath();
        ctx.moveTo(gx - 6, g.y + wingFlap);
        ctx.quadraticCurveTo(gx - 3, g.y - 2, gx, g.y);
        ctx.quadraticCurveTo(gx + 3, g.y - 2, gx + 6, g.y + wingFlap);
        ctx.stroke();
      });
    }

    // 5. Sekin harakatlanuvchi oppoq bulutlar (Distant Parallax Clouds)
    const cloudSpeed = animTimer * 12;
    const clouds = [
      { x: 40, y: 35, w: 75, h: 22 },
      { x: 220, y: 60, w: 90, h: 26 },
      { x: 420, y: 25, w: 65, h: 20 },
      { x: 600, y: 70, w: 85, h: 24 },
    ];

    const cloudColor = levelIndex === 1 ? 'rgba(250, 177, 160, 0.7)' : (levelIndex === 3 ? 'rgba(113, 128, 147, 0.45)' : 'rgba(255, 255, 255, 0.75)');
    ctx.fillStyle = cloudColor;
    clouds.forEach(c => {
      const px = ((c.x + cloudSpeed - cameraX * 0.08) % (viewWidth + 120)) - 60;
      ctx.beginPath();
      ctx.arc(px, c.y, c.h * 0.7, 0, Math.PI * 2);
      ctx.arc(px + c.w * 0.35, c.y - c.h * 0.2, c.h * 0.9, 0, Math.PI * 2);
      ctx.arc(px + c.w * 0.7, c.y, c.h * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });

    // 6. Uzoqdagi zumrad orol qoyalari / qal'a silueti (Distant Mountains)
    const mountainOffset = -(cameraX * 0.15) % 360;
    ctx.fillStyle = levelIndex === 3 ? '#131e29' : (levelIndex === 1 ? '#8b4513' : (levelIndex === 2 ? '#222f3e' : '#2c7a7b'));
    for (let i = -1; i < 4; i++) {
      const mx = mountainOffset + i * 360;
      ctx.beginPath();
      ctx.moveTo(mx, viewHeight * 0.72);
      ctx.lineTo(mx + 90, viewHeight * 0.45);
      ctx.lineTo(mx + 180, viewHeight * 0.72);
      ctx.lineTo(mx + 270, viewHeight * 0.50);
      ctx.lineTo(mx + 360, viewHeight * 0.72);
      ctx.fill();
    }

    // 7. Uzoqdagi dengiz gorizonti (Ocean Horizon)
    const oceanY = viewHeight * 0.68;
    const oceanColor = levelIndex === 3 ? '#07162c' : (levelIndex === 1 ? '#b83b1d' : (levelIndex === 2 ? '#1b2a47' : '#0077b6'));
    ctx.fillStyle = oceanColor;
    ctx.fillRect(0, oceanY, viewWidth, viewHeight - oceanY);

    // Suv yaltirashi
    ctx.fillStyle = levelIndex === 1 ? 'rgba(255, 234, 167, 0.45)' : 'rgba(255, 255, 255, 0.4)';
    for (let wy = oceanY + 4; wy < oceanY + 36; wy += 8) {
      const shift = Math.sin(wy + animTimer * 3) * 12;
      for (let wx = 10; wx < viewWidth; wx += 48) {
        ctx.fillRect(wx + shift, wy, 16, 2);
      }
    }
  }
}

/* ==========================================================================
   3. ZARRALAR TIZIMI (PARTICLE EFFECTS)
   ========================================================================== */
class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  // Qilich zarbasi yoki to'qnashuvida chaqnaydigan po'lat uchqunlari
  spawnSparks(x, y, count = 10) {
    const colors = ['#ffffff', '#ffd32a', '#ff9f43', '#ff5252'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 150;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.25 + Math.random() * 0.25,
        maxLife: 0.25 + Math.random() * 0.25,
        size: 2.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'spark'
      });
    }
  }

  // Bochkalar singanda uchuvchi yog'och qirindilari
  spawnWoodSplinters(x, y, count = 12) {
    const colors = ['#5d3a1a', '#8b5a2b', '#b87b22', '#3b230d'];
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI * 0.2 - Math.random() * Math.PI * 0.6;
      const speed = 70 + Math.random() * 110;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.5 + Math.random() * 0.3,
        size: 3 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'confetti',
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 15
      });
    }
  }

  // Mash'aladan ko'tariluvchi olov uchqunlari (Embers)
  spawnEmbers(x, y) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y,
      vx: (Math.random() - 0.5) * 15,
      vy: -25 - Math.random() * 20,
      life: 0.5 + Math.random() * 0.3,
      maxLife: 0.5 + Math.random() * 0.3,
      size: 2,
      color: Math.random() > 0.5 ? '#feca57' : '#ff9f43',
      type: 'dust'
    });
  }

  // Tanga yoki kalit yig'ilganda oltin yulduzchalar
  spawnSparkles(x, y, count = 8, color = '#f1c40f') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 0.6 + Math.random() * 0.4,
        size: 3 + Math.random() * 3,
        color: color,
        type: 'star'
      });
    }
  }

  // Sakrash yoki yerga tushishdagi chang tutuni
  spawnDust(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y,
        vx: (Math.random() - 0.5) * 40,
        vy: -15 - Math.random() * 30,
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.35 + Math.random() * 0.2,
        size: 4 + Math.random() * 3,
        color: '#f8efba',
        type: 'dust'
      });
    }
  }

  // Suvga tushgandagi sachrash tomchilari (Splash)
  spawnSplash(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI * 0.2 - Math.random() * Math.PI * 0.6; // yuqoriga
      const speed = 70 + Math.random() * 120;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6 + Math.random() * 0.3,
        maxLife: 0.6 + Math.random() * 0.3,
        size: 3 + Math.random() * 3,
        color: '#74b9ff',
        type: 'splash'
      });
    }
  }

  // Dushman yengilganda pufakcha va yulduzlar
  spawnStomp(x, y) {
    this.spawnSparkles(x, y, 10, '#ff7675');
    this.spawnDust(x, y, 6);
  }

  // Sandiq ochilganda tilla zar qog'ozlar (Confetti)
  spawnConfetti(x, y, count = 35) {
    const colors = ['#f1c40f', '#e74c3c', '#2ecc71', '#3498db', '#ffffff', '#e67e22'];
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI * 0.15 - Math.random() * Math.PI * 0.7;
      const speed = 90 + Math.random() * 160;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.2 + Math.random() * 0.6,
        maxLife: 1.2 + Math.random() * 0.6,
        size: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'confetti',
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 10
      });
    }
  }

  // Suzuvchi matn (masalan, +10, +50, "Nazorat nuqtasi!")
  spawnFloatingText(text, x, y, color = '#f1c40f') {
    this.particles.push({
      text: text,
      x: x,
      y: y,
      vx: 0,
      vy: -40,
      life: 0.9,
      maxLife: 0.9,
      color: color,
      type: 'text'
    });
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.type === 'splash' || p.type === 'confetti' || p.type === 'spark') {
        p.vy += 360 * dt; // gravitatsiya
      }
      if (p.type === 'confetti' && p.rot !== undefined) {
        p.rot += p.vRot * dt;
      }
    }
  }

  draw(ctx, cameraX, cameraY) {
    ctx.save();
    for (const p of this.particles) {
      const screenX = p.x - cameraX;
      const screenY = p.y - cameraY;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;

      if (p.type === 'text') {
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#000000';
        ctx.fillText(p.text, Math.round(screenX) + 1, Math.round(screenY) + 1);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, Math.round(screenX), Math.round(screenY));
      } else if (p.type === 'confetti') {
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(p.rot || 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      } else if (p.type === 'spark') {
        ctx.fillStyle = p.color;
        ctx.fillRect(screenX - p.size / 2, screenY - p.size / 2, p.size, p.size * 1.5);
      } else if (p.type === 'star') {
        ctx.fillStyle = p.color;
        ctx.fillRect(screenX - p.size / 2, screenY - p.size / 2, p.size, p.size);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  clear() {
    this.particles = [];
  }
}

/* ==========================================================================
   4. O'YIN ENTITY'LARI (PLAYER, ENEMIES, COLLECTIBLES)
   ========================================================================== */

// 1. QAHRAMON QAROQCHI (PLAYER)
class Player {
  constructor(x, y) {
    this.spawnX = x;
    this.spawnY = y;
    this.x = x;
    this.y = y;
    this.width = 22;   // AABB hitbox kengligi
    this.height = 32;  // AABB hitbox balandligi
    this.drawWidth = 32;
    this.drawHeight = 36;

    this.vx = 0;
    this.vy = 0;
    this.speed = 205;
    this.accel = 1250;
    this.friction = 1400;
    this.gravity = 1050;
    this.jumpForce = -475;

    this.isGrounded = false;
    this.facingRight = true;
    this.animTimer = 0;
    this.state = 'idle'; // 'idle', 'run', 'jump', 'fall'

    this.prevY = y;
    this.prevVy = 0;

    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.invincibleTimer = 0;

    // Realistik Qilich Zarbalari (Combat System)
    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackDuration = 0.22;
    this.attackCooldownTimer = 0;
    this.attackCooldown = 0.30;
    this.hitEnemies = new Set();
  }

  resetToCheckpoint(checkpointX, checkpointY) {
    this.x = checkpointX;
    this.y = checkpointY;
    this.prevY = checkpointY;
    this.vx = 0;
    this.vy = 0;
    this.prevVy = 0;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.invincibleTimer = 1.6;
    this.hitEnemies.clear();
  }

  // Qilich zarbasi maydoni (Sword slash hitbox)
  getSwordHitbox() {
    if (!this.isAttacking) return null;
    const progress = 1 - (this.attackTimer / this.attackDuration);
    if (progress < 0.1 || progress > 0.9) return null;
    const range = 36;
    return {
      x: this.facingRight ? this.x + this.width - 4 : this.x - range + 4,
      y: this.y + 4,
      width: range,
      height: this.height - 8
    };
  }

  update(dt, input, tilemap, sounds, particles) {
    this.prevY = this.y;
    this.prevVy = this.vy;
    this.animTimer += dt;
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
    }

    // Qilich hujumi vaqtlari
    if (this.attackCooldownTimer > 0) {
      this.attackCooldownTimer -= dt;
    }
    if (this.isAttacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        this.hitEnemies.clear();
      }
    }

    // Zarba berish
    if (input.attackPressed && this.attackCooldownTimer <= 0) {
      this.isAttacking = true;
      this.attackTimer = this.attackDuration;
      this.attackCooldownTimer = this.attackCooldown;
      this.hitEnemies.clear();
      sounds.playSwordSlash();
      // O'tkir po'lat chaqnashi
      particles.spawnSparkles(
        this.facingRight ? this.x + this.width + 12 : this.x - 12,
        this.y + 14,
        4,
        '#ffffff'
      );
    }

    // 1. GORIZONTAL HARAKAT
    let moveDir = 0;
    if (input.left) moveDir -= 1;
    if (input.right) moveDir += 1;

    if (moveDir !== 0) {
      this.vx += moveDir * this.accel * dt;
      if (Math.abs(this.vx) > this.speed) {
        this.vx = Math.sign(this.vx) * this.speed;
      }
      this.facingRight = moveDir > 0;
    } else {
      if (Math.abs(this.vx) > 0) {
        const decel = this.friction * dt;
        if (Math.abs(this.vx) <= decel) {
          this.vx = 0;
        } else {
          this.vx -= Math.sign(this.vx) * decel;
        }
      }
    }

    // 2. SAKRASH VA GRAVITATSIYA
    if (this.isGrounded) {
      this.coyoteTimer = 0.12;
    } else {
      this.coyoteTimer -= dt;
    }

    if (input.jumpPressed) {
      this.jumpBufferTimer = 0.14;
    } else {
      this.jumpBufferTimer -= dt;
    }

    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.vy = this.jumpForce;
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
      this.isGrounded = false;
      sounds.playJump();
      particles.spawnDust(this.x + this.width / 2, this.y + this.height, 6);
    }

    if (!input.jump && this.vy < -320) {
      this.vy = -320;
    }

    this.vy += this.gravity * dt;
    if (this.vy > 550) this.vy = 550;

    // 3. TO'QNASHUVLARNI TEKSHIRISH (AABB)
    this.x += this.vx * dt;
    this.checkHorizontalCollisions(tilemap);

    const wasGrounded = this.isGrounded;
    this.isGrounded = false;
    this.y += this.vy * dt;
    this.checkVerticalCollisions(tilemap, particles, wasGrounded);

    if (!this.isGrounded) {
      this.state = this.vy < 0 ? 'jump' : 'fall';
    } else if (Math.abs(this.vx) > 15) {
      this.state = 'run';
    } else {
      this.state = 'idle';
    }
  }

  checkHorizontalCollisions(tilemap) {
    if (this.x < 0) {
      this.x = 0;
      this.vx = 0;
    }
    if (this.x + this.width > tilemap.width) {
      this.x = tilemap.width - this.width;
      this.vx = 0;
    }

    const box = {
      x: this.x,
      y: this.y + 3,
      width: this.width,
      height: this.height - 6
    };
    const tiles = tilemap.getSolidBoxesInRange(box);

    for (const t of tiles) {
      if (this.vx > 0) {
        this.x = t.x - this.width;
        this.vx = 0;
      } else if (this.vx < 0) {
        this.x = t.x + t.width;
        this.vx = 0;
      }
    }
  }

  checkVerticalCollisions(tilemap, particles, wasGrounded) {
    const box = {
      x: this.x + 2,
      y: this.y,
      width: this.width - 4,
      height: this.height
    };

    const solidTiles = tilemap.getSolidBoxesInRange(box);
    for (const t of solidTiles) {
      if (this.vy > 0) {
        this.y = t.y - this.height;
        this.vy = 0;
        this.isGrounded = true;
        if (!wasGrounded) {
          particles.spawnDust(this.x + this.width / 2, this.y + this.height, 4);
        }
      } else if (this.vy < 0) {
        this.y = t.y + t.height;
        this.vy = 0;
      }
    }

    if (this.vy >= 0 && !this.isGrounded) {
      const oneWays = tilemap.getOneWayPlatformsInRange(box);
      for (const p of oneWays) {
        const playerBottom = this.y + this.height;
        const prevBottom = this.prevY + this.height;
        if (prevBottom <= p.y + 12 && playerBottom >= p.y) {
          this.y = p.y - this.height;
          this.vy = 0;
          this.isGrounded = true;
          if (!wasGrounded) {
            particles.spawnDust(this.x + this.width / 2, this.y + this.height, 4);
          }
          break;
        }
      }
    }
  }

  draw(ctx, cameraX, cameraY) {
    const drawX = this.x - cameraX - (this.drawWidth - this.width) / 2;
    const drawY = this.y - cameraY - (this.drawHeight - this.height);
    const attackProgress = this.isAttacking ? 1 - (this.attackTimer / this.attackDuration) : 0;
    SpriteRenderer.drawPirate(
      ctx,
      drawX,
      drawY,
      this.drawWidth,
      this.drawHeight,
      this.state,
      this.facingRight,
      this.animTimer,
      this.invincibleTimer > 0,
      this.isAttacking,
      attackProgress
    );
  }
}

// 2. DUSHMANLAR (CRAB, BIRD, PIRATE SWORDSMAN, PIRATE CAPTAIN)
class Enemy {
  constructor(type, x, y, minX, maxX) {
    this.type = type; // 'crab', 'bird', 'pirate', 'captain'
    this.x = x;
    this.y = y;
    this.initialY = y;
    this.minX = minX;
    this.maxX = maxX;
    this.alive = true;
    this.animTimer = Math.random() * 5;
    this.hurtTimer = 0;

    if (type === 'crab') {
      this.width = 24;
      this.height = 16;
      this.speed = 45;
      this.facingRight = true;
      this.hp = 1;
      this.maxHp = 1;
    } else if (type === 'bird') {
      this.width = 22;
      this.height = 18;
      this.speed = 65;
      this.facingRight = true;
      this.hp = 1;
      this.maxHp = 1;
    } else if (type === 'captain') {
      this.width = 26;
      this.height = 36;
      this.speed = 45;
      this.chaseSpeed = 80;
      this.facingRight = true;
      this.hp = 4;
      this.maxHp = 4;
      this.state = 'patrol';
      this.alertTimer = 0;
      this.attackTimer = 0;
      this.attackDuration = 0.32;
      this.attackCooldownTimer = 0;
      this.attackCooldown = 1.25;
      this.isAttacking = false;
    } else {
      // type === 'pirate' (Qaroqchi Qilichboz)
      this.type = 'pirate';
      this.width = 22;
      this.height = 32;
      this.speed = 40;
      this.chaseSpeed = 70;
      this.facingRight = true;
      this.hp = 2;
      this.maxHp = 2;
      this.state = 'patrol';
      this.alertTimer = 0;
      this.attackTimer = 0;
      this.attackDuration = 0.30;
      this.attackCooldownTimer = 0;
      this.attackCooldown = 1.45;
      this.isAttacking = false;
    }
  }

  // Dushman shamshirining urish maydoni (Enemy sword hitbox)
  getSwordHitbox() {
    if (!this.isAttacking) return null;
    const progress = 1 - (this.attackTimer / this.attackDuration);
    if (progress < 0.2 || progress > 0.85) return null;
    const range = this.type === 'captain' ? 40 : 32;
    return {
      x: this.facingRight ? this.x + this.width - 2 : this.x - range + 2,
      y: this.y + 4,
      width: range,
      height: this.height - 8
    };
  }

  update(dt, player, sounds, particles) {
    if (!this.alive) return;
    this.animTimer += dt;

    if (this.hurtTimer > 0) {
      this.hurtTimer -= dt;
    }
    if (this.attackCooldownTimer > 0) {
      this.attackCooldownTimer -= dt;
    }

    if (this.type === 'crab') {
      if (this.facingRight) {
        this.x += this.speed * dt;
        if (this.x >= this.maxX) {
          this.x = this.maxX;
          this.facingRight = false;
        }
      } else {
        this.x -= this.speed * dt;
        if (this.x <= this.minX) {
          this.x = this.minX;
          this.facingRight = true;
        }
      }
    } else if (this.type === 'bird') {
      if (this.facingRight) {
        this.x += this.speed * dt;
        if (this.x >= this.maxX) {
          this.x = this.maxX;
          this.facingRight = false;
        }
      } else {
        this.x -= this.speed * dt;
        if (this.x <= this.minX) {
          this.x = this.minX;
          this.facingRight = true;
        }
      }
      this.y = this.initialY + Math.sin(this.animTimer * 4) * 12;
    } else {
      // Qaroqchilar AI'si (Pirate Swordsman & Captain)
      if (this.isAttacking) {
        this.attackTimer -= dt;
        if (this.attackTimer <= 0) {
          this.isAttacking = false;
          this.state = 'chase';
        }
      } else if (this.state === 'alert') {
        this.alertTimer -= dt;
        if (this.alertTimer <= 0) {
          this.state = 'chase';
        }
      } else if (player) {
        const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
        const dy = Math.abs((player.y + player.height / 2) - (this.y + this.height / 2));
        const dist = Math.abs(dx);
        const detectRange = this.type === 'captain' ? 175 : 135;
        const attackReach = this.type === 'captain' ? 40 : 32;

        if (dy < 55 && dist < detectRange && this.x >= this.minX - 30 && this.x <= this.maxX + 30) {
          if (this.state === 'patrol') {
            this.state = 'alert';
            this.alertTimer = 0.35;
            this.facingRight = dx > 0;
            if (sounds) sounds.playPirateAlert();
          } else if (this.state === 'chase') {
            this.facingRight = dx > 0;
            if (dist <= attackReach && this.attackCooldownTimer <= 0) {
              this.state = 'attack';
              this.isAttacking = true;
              this.attackTimer = this.attackDuration;
              this.attackCooldownTimer = this.attackCooldown;
              if (sounds) sounds.playSwordSlash();
            } else if (dist > attackReach - 4) {
              const moveDir = Math.sign(dx);
              this.x += moveDir * this.chaseSpeed * dt;
              if (this.x < this.minX) this.x = this.minX;
              if (this.x > this.maxX) this.x = this.maxX;
            }
          }
        } else {
          // Oddiy patrullash
          this.state = 'patrol';
          if (this.facingRight) {
            this.x += this.speed * dt;
            if (this.x >= this.maxX) {
              this.x = this.maxX;
              this.facingRight = false;
            }
          } else {
            this.x -= this.speed * dt;
            if (this.x <= this.minX) {
              this.x = this.minX;
              this.facingRight = true;
            }
          }
        }
      }
    }
  }

  draw(ctx, cameraX, cameraY) {
    if (!this.alive) return;
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;

    if (this.type === 'crab') {
      SpriteRenderer.drawCrab(ctx, screenX, screenY, this.width, this.height, this.facingRight, this.animTimer);
    } else if (this.type === 'bird') {
      SpriteRenderer.drawBird(ctx, screenX, screenY, this.width, this.height, this.facingRight, this.animTimer);
    } else {
      const attackProgress = this.isAttacking ? 1 - (this.attackTimer / this.attackDuration) : 0;
      SpriteRenderer.drawEnemyPirate(
        ctx,
        screenX,
        screenY,
        this.width,
        this.height,
        this.type,
        this.state,
        this.facingRight,
        this.animTimer,
        this.hurtTimer > 0,
        this.isAttacking,
        attackProgress,
        this.hp,
        this.maxHp
      );
    }
  }
}

// 3. YOG'OCH BOCHKALAR (DESTRUCTIBLE BARRELS)
class Barrel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 28;
    this.alive = true;
  }

  draw(ctx, cameraX, cameraY) {
    if (!this.alive) return;
    SpriteRenderer.drawBarrel(ctx, this.x - cameraX, this.y - cameraY, this.width, this.height);
  }
}

// 4. MASH'ALA (TORCHES)
class Torch {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.animTimer = Math.random() * 5;
  }

  update(dt, particles) {
    this.animTimer += dt;
    if (particles && Math.random() < dt * 3) {
      particles.spawnEmbers(this.x + 8, this.y + 4);
    }
  }

  draw(ctx, cameraX, cameraY) {
    SpriteRenderer.drawTorch(ctx, this.x - cameraX, this.y - cameraY, this.animTimer);
  }
}

// 5. O'SIMLIK VA GULLAR (FOLIAGE)
class Foliage {
  constructor(x, y, type = 'bush') {
    this.x = x;
    this.y = y;
    this.type = type; // 'bush', 'flower', 'fern'
  }

  draw(ctx, cameraX, cameraY, animTimer) {
    SpriteRenderer.drawFoliage(ctx, this.x - cameraX, this.y - cameraY, animTimer, this.type);
  }
}

// 3. TANGALAR (COINS)
class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.collected = false;
    this.animTimer = Math.random() * 5;
  }

  update(dt) {
    this.animTimer += dt;
  }

  draw(ctx, cameraX, cameraY) {
    if (this.collected) return;
    SpriteRenderer.drawCoin(ctx, this.x - cameraX, this.y - cameraY, this.width, this.height, this.animTimer);
  }
}

// 4. KALITLAR (KEYS - 3 TA HAR BOSQICHDA)
class Key {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 18;
    this.height = 20;
    this.collected = false;
    this.animTimer = Math.random() * 5;
  }

  update(dt) {
    this.animTimer += dt;
  }

  draw(ctx, cameraX, cameraY) {
    if (this.collected) return;
    SpriteRenderer.drawKey(ctx, this.x - cameraX, this.y - cameraY, this.width, this.height, this.animTimer);
  }
}

// 5. NAZORAT NUQTASI (CHECKPOINT)
class Checkpoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 48;
    this.activated = false;
    this.animTimer = 0;
  }

  update(dt) {
    this.animTimer += dt;
  }

  draw(ctx, cameraX, cameraY) {
    SpriteRenderer.drawFlag(ctx, this.x - cameraX, this.y - cameraY, this.activated, this.animTimer);
  }
}

// 6. XAZINA SANDIG'I (TREASURE CHEST)
class Chest {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 28;
    this.isOpen = false;
    this.animTimer = 0;
  }

  update(dt) {
    this.animTimer += dt;
  }

  draw(ctx, cameraX, cameraY, keysCollected) {
    SpriteRenderer.drawChest(ctx, this.x - cameraX, this.y - cameraY, this.width, this.height, this.isOpen, this.animTimer, keysCollected);
  }
}

// 7. TO'SIQ TOSHLAR (ROCKS)
class Rock {
  constructor(x, y, width = 32, height = 32) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx, cameraX, cameraY) {
    SpriteRenderer.drawRock(ctx, this.x - cameraX, this.y - cameraY, this.width, this.height);
  }
}

/* ==========================================================================
   5. TILEMAP VA BOSQICHLAR TIZIMI (LEVEL DATA)
   ========================================================================== */
class TileMap {
  constructor(grid, tileSize = 32) {
    this.grid = grid;
    this.tileSize = tileSize;
    this.rows = grid.length;
    this.cols = grid[0].length;
    this.width = this.cols * tileSize;
    this.height = this.rows * tileSize;
    this.rocks = [];
  }

  setRocks(rocks) {
    this.rocks = rocks;
  }

  // To'liq qattiq bloklar (Yer, toshlar, qoyalar) - har tomondan to'sadi
  getSolidBoxesInRange(box) {
    const solidBoxes = [];

    const startCol = Math.max(0, Math.floor(box.x / this.tileSize));
    const endCol = Math.min(this.cols - 1, Math.floor((box.x + box.width - 0.001) / this.tileSize));
    const startRow = Math.max(0, Math.floor(box.y / this.tileSize));
    const endRow = Math.min(this.rows - 1, Math.floor((box.y + box.height - 0.001) / this.tileSize));

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.grid[r][c];
        // 1 (qum/maysa), 2 (chuqur qum), 4 (qoya tosh) - to'liq qattiq
        if (tile === 1 || tile === 2 || tile === 4) {
          solidBoxes.push({
            x: c * this.tileSize,
            y: r * this.tileSize,
            width: this.tileSize,
            height: this.tileSize
          });
        }
      }
    }

    // Tosh to'siqlarni ham to'liq qattiq jism deb hisoblash
    for (const rock of this.rocks) {
      if (
        box.x < rock.x + rock.width &&
        box.x + box.width > rock.x &&
        box.y < rock.y + rock.height &&
        box.y + box.height > rock.y
      ) {
        solidBoxes.push({
          x: rock.x,
          y: rock.y,
          width: rock.width,
          height: rock.height
        });
      }
    }

    return solidBoxes;
  }

  // Bir tomonlama (One-way) yog'och platformalar - pastdan sakrab o'tib, ustiga qo'nadi
  getOneWayPlatformsInRange(box) {
    const platforms = [];

    const startCol = Math.max(0, Math.floor(box.x / this.tileSize));
    const endCol = Math.min(this.cols - 1, Math.floor((box.x + box.width - 0.001) / this.tileSize));
    const startRow = Math.max(0, Math.floor(box.y / this.tileSize));
    const endRow = Math.min(this.rows - 1, Math.floor((box.y + box.height - 0.001) / this.tileSize));

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.grid[r][c];
        if (tile === 3) {
          platforms.push({
            x: c * this.tileSize,
            y: r * this.tileSize,
            width: this.tileSize,
            height: 12
          });
        }
      }
    }

    return platforms;
  }

  draw(ctx, cameraX, cameraY, viewWidth, viewHeight, animTimer) {
    const startCol = Math.max(0, Math.floor(cameraX / this.tileSize));
    const endCol = Math.min(this.cols - 1, Math.floor((cameraX + viewWidth) / this.tileSize) + 1);

    for (let r = 0; r < this.rows; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.grid[r][c];
        if (tile > 0) {
          SpriteRenderer.drawTile(
            ctx,
            tile,
            Math.round(c * this.tileSize - cameraX),
            Math.round(r * this.tileSize - cameraY),
            this.tileSize
          );
        }
      }
    }

    // Toshlarni chizish
    for (const rock of this.rocks) {
      if (rock.x + rock.width >= cameraX && rock.x <= cameraX + viewWidth) {
        rock.draw(ctx, cameraX, cameraY);
      }
    }

    // Pastdagi chuqurlikdagi suv to'lqinlarini chizish
    const waterY = (this.rows - 1) * this.tileSize;
    SpriteRenderer.drawWater(ctx, 0, Math.round(waterY - cameraY + 12), viewWidth, this.tileSize + 30, animTimer);
  }
}

/**
 * 3 TA QIZIQARLI BOSQICH MA'LUMOTLARI (LEVEL CONFIGURATIONS)
 * Yangi bosqich qo'shish oson bo'lishi uchun ob'ektlar ko'rinishida tuzilgan
 */
/**
 * 4 TA QIZIQARLI VA BOSQICHMA-BOSQICH QIYINLASHUVCHI BOSQICHLAR (LEVELS)
 * Har bir bosqichda zinapoyasimon qulay yo'laklar, bir tomonlama sakrab o'tuvchi platformalar
 * va har xil dushmanlar joylashtirilgan.
 */
const LEVELS = [
  // ==========================================================================
  // BOSQICH 1: QUMLOQ SOHIL (Oson)
  // Xususiyat: Keng qumloq yer, yog'och platformalar, qisqichbaqalar, bochkalar va 1 ta qaroqchi qilichboz!
  // ==========================================================================
  {
    name: "1-Bosqich: Qumloq Sohil (Oson)",
    theme: 0,
    widthCols: 65,
    rows: 12,
    playerStart: { x: 50, y: 220 },
    generateMap: function() {
      const rows = 12;
      const cols = this.widthCols;
      const map = Array.from({ length: rows }, () => Array(cols).fill(0));

      for (let c = 0; c < cols; c++) {
        if (c >= 22 && c <= 25) continue;
        map[9][c] = 1;
        map[10][c] = 2;
        map[11][c] = 2;
      }

      map[8][6] = 3; map[8][7] = 3;
      map[6][8] = 3; map[6][9] = 3; map[6][10] = 3; map[6][11] = 3; map[6][12] = 3;
      map[4][13] = 3; map[4][14] = 3; map[4][15] = 3; map[4][16] = 3;

      map[8][22] = 3; map[8][23] = 3; map[8][24] = 3; map[8][25] = 3;
      map[6][23] = 3; map[6][24] = 3; map[6][25] = 3;

      map[8][37] = 3; map[8][38] = 3;
      map[6][39] = 3; map[6][40] = 3; map[6][41] = 3;
      map[5][45] = 3; map[5][46] = 3; map[5][47] = 3;

      return map;
    },
    palms: [
      { x: 130, y: 288 },
      { x: 450, y: 288 },
      { x: 950, y: 288 },
      { x: 1550, y: 288 }
    ],
    rocks: [
      { x: 540, y: 256, w: 32, h: 32 },
      { x: 1150, y: 256, w: 32, h: 32 }
    ],
    checkpoints: [
      { x: 740, y: 240 }
    ],
    torches: [
      { x: 190, y: 262 },
      { x: 740, y: 262 },
      { x: 1320, y: 262 },
      { x: 1720, y: 262 }
    ],
    barrels: [
      { x: 380, y: 260 },
      { x: 960, y: 260 },
      { x: 1650, y: 260 }
    ],
    foliage: [
      { x: 120, y: 288, type: 'bush' },
      { x: 260, y: 288, type: 'flower' },
      { x: 620, y: 288, type: 'fern' },
      { x: 1040, y: 288, type: 'flower' },
      { x: 1480, y: 288, type: 'bush' }
    ],
    enemies: [
      { type: 'crab', x: 280, y: 272, minX: 220, maxX: 360 },
      { type: 'pirate', x: 880, y: 256, minX: 810, maxX: 1020 },
      { type: 'crab', x: 1350, y: 272, minX: 1270, maxX: 1440 }
    ],
    coins: [
      { x: 200, y: 220 }, { x: 230, y: 160 }, { x: 290, y: 160 }, { x: 320, y: 160 },
      { x: 430, y: 90 }, { x: 460, y: 90 },
      { x: 720, y: 220 }, { x: 750, y: 160 }, { x: 780, y: 160 },
      { x: 1260, y: 160 }, { x: 1300, y: 160 }, { x: 1460, y: 130 }, { x: 1500, y: 130 }
    ],
    keys: [
      { id: 1, x: 305, y: 145 },
      { id: 2, x: 750, y: 145 },
      { id: 3, x: 1475, y: 115 }
    ],
    chest: { x: 1920, y: 260 }
  },

  // ==========================================================================
  // BOSQICH 2: QAROQCHILAR KO'RFAZI (O'rtacha)
  // Xususiyat: Oltin shom muhiti, 2 ta qurollangan qaroqchi, qushlar, mash'alalar va bochkalar!
  // ==========================================================================
  {
    name: "2-Bosqich: Qaroqchilar Ko'rfazi (O'rtacha)",
    theme: 1,
    widthCols: 85,
    rows: 12,
    playerStart: { x: 50, y: 220 },
    generateMap: function() {
      const rows = 12;
      const cols = this.widthCols;
      const map = Array.from({ length: rows }, () => Array(cols).fill(0));

      for (let c = 0; c < cols; c++) {
        if ((c >= 15 && c <= 18) || (c >= 33 && c <= 36) || (c >= 54 && c <= 58) || (c >= 71 && c <= 74)) {
          continue;
        }
        map[9][c] = 1;
        map[10][c] = 2;
        map[11][c] = 2;
      }

      map[8][13] = 3; map[8][14] = 3;
      map[6][15] = 3; map[6][16] = 3; map[6][17] = 3; map[6][18] = 3;
      map[4][16] = 3; map[4][17] = 3;

      map[8][28] = 3; map[8][29] = 3;
      map[6][30] = 3; map[6][31] = 3; map[6][32] = 3;
      map[6][34] = 3; map[6][35] = 3;

      map[8][48] = 3; map[8][49] = 3;
      map[6][50] = 3; map[6][51] = 3;
      map[6][55] = 3; map[6][56] = 3; map[6][57] = 3;
      map[4][51] = 3; map[4][52] = 3;

      map[7][72] = 3; map[7][73] = 3;
      map[5][66] = 3; map[5][67] = 3; map[5][68] = 3;

      return map;
    },
    palms: [
      { x: 100, y: 288 },
      { x: 700, y: 288 },
      { x: 1350, y: 288 },
      { x: 1980, y: 288 },
      { x: 2450, y: 288 }
    ],
    rocks: [
      { x: 280, y: 256, w: 32, h: 32 },
      { x: 1200, y: 256, w: 32, h: 32 },
      { x: 1850, y: 256, w: 32, h: 32 }
    ],
    checkpoints: [
      { x: 800, y: 240 },
      { x: 1650, y: 240 }
    ],
    torches: [
      { x: 260, y: 262 },
      { x: 780, y: 262 },
      { x: 1640, y: 262 },
      { x: 2260, y: 262 }
    ],
    barrels: [
      { x: 440, y: 260 },
      { x: 1080, y: 260 },
      { x: 1940, y: 260 },
      { x: 2380, y: 260 }
    ],
    foliage: [
      { x: 180, y: 288, type: 'flower' },
      { x: 720, y: 288, type: 'bush' },
      { x: 1300, y: 288, type: 'fern' },
      { x: 2020, y: 288, type: 'flower' }
    ],
    enemies: [
      { type: 'crab', x: 290, y: 272, minX: 250, maxX: 380 },
      { type: 'bird', x: 520, y: 155, minX: 470, maxX: 600 },
      { type: 'pirate', x: 860, y: 256, minX: 790, maxX: 960 },
      { type: 'crab', x: 1240, y: 272, minX: 1180, maxX: 1320 },
      { type: 'bird', x: 1760, y: 150, minX: 1680, maxX: 1860 },
      { type: 'pirate', x: 2150, y: 256, minX: 2050, maxX: 2260 }
    ],
    coins: [
      { x: 160, y: 250 }, { x: 420, y: 220 }, { x: 500, y: 160 }, { x: 530, y: 80 },
      { x: 920, y: 220 }, { x: 980, y: 160 }, { x: 1100, y: 160 },
      { x: 1560, y: 220 }, { x: 1620, y: 160 }, { x: 1780, y: 160 },
      { x: 2130, y: 130 }, { x: 2160, y: 130 }, { x: 2350, y: 250 }
    ],
    keys: [
      { id: 1, x: 530, y: 90 },
      { id: 2, x: 1790, y: 145 },
      { id: 3, x: 2145, y: 115 }
    ],
    chest: { x: 2580, y: 260 }
  },

  // ==========================================================================
  // BOSQICH 3: XAZINA QOYASI VA JARLIKLAR (Qiyin)
  // Xususiyat: Tumanli shom, tosh jarliklar, 2 ta qaroqchi qilichboz va 1 ta Kapitan (Mini-Boss)!
  // ==========================================================================
  {
    name: "3-Bosqich: Xazina Qoyasi va Jarliklar (Qiyin)",
    theme: 2,
    widthCols: 100,
    rows: 12,
    playerStart: { x: 50, y: 220 },
    generateMap: function() {
      const rows = 12;
      const cols = this.widthCols;
      const map = Array.from({ length: rows }, () => Array(cols).fill(0));

      for (let c = 0; c < cols; c++) {
        if ((c >= 13 && c <= 17) || (c >= 27 && c <= 31) || (c >= 45 && c <= 50) || (c >= 64 && c <= 69) || (c >= 83 && c <= 87)) {
          continue;
        }
        map[9][c] = 1;
        map[10][c] = 2;
        map[11][c] = 2;
      }

      map[8][11] = 3; map[8][12] = 3;
      map[6][14] = 3; map[6][16] = 3;
      map[5][19] = 3; map[5][20] = 3; map[5][21] = 3;

      map[8][25] = 3; map[8][26] = 3;
      map[6][28] = 3; map[6][30] = 3;
      map[6][36] = 3; map[6][37] = 3;

      map[7][42] = 4; map[6][42] = 4;
      map[6][46] = 3; map[5][48] = 3;
      map[6][52] = 3; map[6][53] = 3;

      map[8][62] = 3; map[8][63] = 3;
      map[6][65] = 3; map[5][67] = 3;
      map[5][73] = 3; map[5][74] = 3;

      map[7][84] = 3; map[6][86] = 3;
      map[7][93] = 4; map[7][94] = 4; map[8][93] = 4; map[8][94] = 4;

      return map;
    },
    palms: [
      { x: 100, y: 288 },
      { x: 680, y: 288 },
      { x: 1180, y: 288 },
      { x: 1750, y: 288 },
      { x: 2350, y: 288 },
      { x: 2900, y: 288 }
    ],
    rocks: [
      { x: 240, y: 256, w: 32, h: 32 },
      { x: 1120, y: 256, w: 32, h: 32 },
      { x: 1800, y: 256, w: 32, h: 32 },
      { x: 2420, y: 256, w: 32, h: 32 }
    ],
    checkpoints: [
      { x: 740, y: 240 },
      { x: 1800, y: 240 }
    ],
    torches: [
      { x: 230, y: 262 },
      { x: 740, y: 262 },
      { x: 1360, y: 262 },
      { x: 1800, y: 262 },
      { x: 2500, y: 262 }
    ],
    barrels: [
      { x: 380, y: 260 },
      { x: 940, y: 260 },
      { x: 1720, y: 260 },
      { x: 2420, y: 260 },
      { x: 2820, y: 260 }
    ],
    foliage: [
      { x: 140, y: 288, type: 'fern' },
      { x: 840, y: 288, type: 'bush' },
      { x: 1600, y: 288, type: 'fern' },
      { x: 2300, y: 288, type: 'flower' }
    ],
    enemies: [
      { type: 'crab', x: 260, y: 272, minX: 210, maxX: 330 },
      { type: 'bird', x: 480, y: 145, minX: 420, maxX: 560 },
      { type: 'pirate', x: 820, y: 256, minX: 750, maxX: 910 },
      { type: 'bird', x: 1520, y: 140, minX: 1440, maxX: 1600 },
      { type: 'pirate', x: 1980, y: 256, minX: 1910, maxX: 2070 },
      { type: 'bird', x: 2150, y: 145, minX: 2060, maxX: 2240 },
      { type: 'captain', x: 2600, y: 252, minX: 2510, maxX: 2720 }
    ],
    coins: [
      { x: 150, y: 250 }, { x: 360, y: 220 }, { x: 460, y: 160 }, { x: 620, y: 120 },
      { x: 900, y: 220 }, { x: 960, y: 160 }, { x: 1100, y: 160 },
      { x: 1480, y: 180 }, { x: 1540, y: 130 }, { x: 1720, y: 160 },
      { x: 2080, y: 220 }, { x: 2160, y: 120 }, { x: 2360, y: 120 },
      { x: 2700, y: 190 }, { x: 2760, y: 160 }
    ],
    keys: [
      { id: 1, x: 625, y: 115 },
      { id: 2, x: 1535, y: 115 },
      { id: 3, x: 2365, y: 115 }
    ],
    chest: { x: 3000, y: 195 }
  },

  // ==========================================================================
  // BOSQICH 4: QORA SOQOL QAL'ASI (Ekstremal Climax)
  // Xususiyat: Tungi qora qasr, yulduzlar va oy, 3 ta qilichboz va 2 ta qudratli Kapitan!
  // ==========================================================================
  {
    name: "4-Bosqich: Qora Soqol Qal'asi (Ekstremal)",
    theme: 3,
    widthCols: 115,
    rows: 12,
    playerStart: { x: 50, y: 220 },
    generateMap: function() {
      const rows = 12;
      const cols = this.widthCols;
      const map = Array.from({ length: rows }, () => Array(cols).fill(0));

      for (let c = 0; c < cols; c++) {
        if ((c >= 14 && c <= 19) || (c >= 32 && c <= 37) || (c >= 52 && c <= 57) || (c >= 72 && c <= 78) || (c >= 93 && c <= 98)) {
          continue;
        }
        map[9][c] = 4;
        map[10][c] = 4;
        map[11][c] = 4;
      }

      map[8][12] = 3; map[8][13] = 3;
      map[6][15] = 3; map[6][17] = 3;
      map[5][21] = 4; map[5][22] = 4; map[5][23] = 4;
      map[4][22] = 3;

      map[8][30] = 3; map[8][31] = 3;
      map[7][33] = 3; map[6][35] = 3;
      map[5][39] = 4; map[5][40] = 4;
      map[6][45] = 4; map[7][45] = 4;

      map[8][50] = 3; map[8][51] = 3;
      map[6][53] = 3; map[5][55] = 3;
      map[5][59] = 4; map[5][60] = 4; map[5][61] = 4;
      map[4][60] = 3;

      map[8][70] = 3; map[8][71] = 3;
      map[6][73] = 3; map[5][75] = 3; map[6][77] = 3;
      map[5][81] = 4; map[5][82] = 4;
      map[4][81] = 3; map[4][82] = 3;

      map[7][94] = 3; map[6][96] = 3;
      map[8][105] = 4; map[8][106] = 4; map[8][107] = 4; map[8][108] = 4;
      map[7][106] = 4; map[7][107] = 4; map[7][108] = 4;
      map[6][107] = 4; map[6][108] = 4;

      return map;
    },
    palms: [
      { x: 100, y: 288 },
      { x: 740, y: 288 },
      { x: 1400, y: 288 },
      { x: 2100, y: 288 },
      { x: 2750, y: 288 },
      { x: 3350, y: 288 }
    ],
    rocks: [
      { x: 260, y: 256, w: 32, h: 32 },
      { x: 920, y: 256, w: 32, h: 32 },
      { x: 1560, y: 256, w: 32, h: 32 },
      { x: 2220, y: 256, w: 32, h: 32 },
      { x: 2850, y: 256, w: 32, h: 32 }
    ],
    checkpoints: [
      { x: 700, y: 240 },
      { x: 1700, y: 240 },
      { x: 2650, y: 240 }
    ],
    torches: [
      { x: 240, y: 262 },
      { x: 700, y: 262 },
      { x: 1200, y: 262 },
      { x: 1700, y: 262 },
      { x: 2200, y: 262 },
      { x: 2650, y: 262 },
      { x: 3120, y: 262 },
      { x: 3400, y: 192 }
    ],
    barrels: [
      { x: 360, y: 260 },
      { x: 960, y: 260 },
      { x: 1600, y: 260 },
      { x: 2300, y: 260 },
      { x: 2850, y: 260 },
      { x: 3320, y: 260 }
    ],
    foliage: [
      { x: 160, y: 288, type: 'fern' },
      { x: 880, y: 288, type: 'bush' },
      { x: 1520, y: 288, type: 'fern' },
      { x: 2820, y: 288, type: 'fern' }
    ],
    enemies: [
      { type: 'crab', x: 280, y: 272, minX: 220, maxX: 350 },
      { type: 'bird', x: 500, y: 145, minX: 430, maxX: 580 },
      { type: 'pirate', x: 800, y: 256, minX: 730, maxX: 880 },
      { type: 'bird', x: 1100, y: 135, minX: 1020, maxX: 1200 },
      { type: 'pirate', x: 1480, y: 256, minX: 1410, maxX: 1550 },
      { type: 'bird', x: 1740, y: 145, minX: 1660, maxX: 1840 },
      { type: 'pirate', x: 2150, y: 256, minX: 2070, maxX: 2250 },
      { type: 'bird', x: 2400, y: 135, minX: 2320, maxX: 2500 },
      { type: 'captain', x: 2780, y: 252, minX: 2690, maxX: 2890 },
      { type: 'captain', x: 3200, y: 252, minX: 3100, maxX: 3320 }
    ],
    coins: [
      { x: 150, y: 250 }, { x: 380, y: 220 }, { x: 490, y: 160 }, { x: 710, y: 115 },
      { x: 980, y: 220 }, { x: 1060, y: 160 }, { x: 1260, y: 115 },
      { x: 1620, y: 220 }, { x: 1720, y: 160 }, { x: 1930, y: 115 },
      { x: 2280, y: 220 }, { x: 2380, y: 160 }, { x: 2600, y: 115 },
      { x: 3050, y: 190 }, { x: 3120, y: 160 }, { x: 3250, y: 160 }
    ],
    keys: [
      { id: 1, x: 710, y: 115 },
      { id: 2, x: 1930, y: 115 },
      { id: 3, x: 2600, y: 100 }
    ],
    chest: { x: 3450, y: 160 }
  }
];

/* ==========================================================================
   6. O'YIN ASOSIY BOSHQARUVCHISI VA SIKLI (GAME ENGINE)
   ========================================================================== */
class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false; // Piksel-art aniqligi

    this.sounds = new SoundEngine();
    this.particles = new ParticleSystem();

    // Virtual piksellar o'lchami: 640x360
    this.viewWidth = 640;
    this.viewHeight = 360;

    // O'yin holatlari: 'menu', 'playing', 'paused', 'levelComplete', 'gameOver', 'win'
    this.state = 'menu';

    this.score = 0;
    this.coinsCount = 0;
    this.keysCount = 0;
    this.lives = 3;
    this.currentLevelIndex = 0;
    this.highScore = parseInt(localStorage.getItem('treasure_pirate_highscore') || '0', 10);

    // Nazorat nuqtasi (Checkpoint)
    this.activeCheckpoint = { x: 50, y: 220 };

    // Kamera koordinatasi
    this.camera = { x: 0, y: 0 };

    // Kiritish vositalari holati (Input state)
    this.input = {
      left: false,
      right: false,
      jump: false,
      jumpPressed: false,
      attack: false,
      attackPressed: false
    };

    // UI elementlari
    this.dom = {
      hud: document.getElementById('hud'),
      hudHearts: document.getElementById('hud-hearts'),
      hudKeys: document.getElementById('hud-keys'),
      hudCoins: document.getElementById('hud-coins'),
      hudScore: document.getElementById('hud-score'),
      hudLevel: document.getElementById('hud-level'),
      gameBanner: document.getElementById('game-banner'),
      btnSound: document.getElementById('btn-sound-toggle'),
      btnFullscreen: document.getElementById('btn-fullscreen-toggle'),
      btnPause: document.getElementById('btn-pause-toggle'),

      screenMenu: document.getElementById('screen-menu'),
      screenPause: document.getElementById('screen-pause'),
      screenLevelComplete: document.getElementById('screen-level-complete'),
      screenGameOver: document.getElementById('screen-game-over'),
      screenWin: document.getElementById('screen-win'),

      menuHighScore: document.getElementById('menu-high-score'),
      lcCoins: document.getElementById('lc-coins'),
      lcScore: document.getElementById('lc-score'),
      lcTotalScore: document.getElementById('lc-total-score'),
      goScore: document.getElementById('go-score'),
      goHighScore: document.getElementById('go-high-score'),
      winCoins: document.getElementById('win-coins'),
      winScore: document.getElementById('win-score'),
      winHighScore: document.getElementById('win-high-score'),
      winNewRecord: document.getElementById('win-new-record'),

      btnStart: document.getElementById('btn-start'),
      btnResume: document.getElementById('btn-resume'),
      btnRestartLevel: document.getElementById('btn-restart-level'),
      btnMainMenu: document.getElementById('btn-main-menu'),
      btnNextLevel: document.getElementById('btn-next-level'),
      btnRetry: document.getElementById('btn-retry'),
      btnGameOverMenu: document.getElementById('btn-game-over-menu'),
      btnPlayAgain: document.getElementById('btn-play-again'),

      touchControls: document.getElementById('touch-controls'),
      btnTouchLeft: document.getElementById('btn-touch-left'),
      btnTouchRight: document.getElementById('btn-touch-right'),
      btnTouchJump: document.getElementById('btn-touch-jump'),
      btnTouchAttack: document.getElementById('btn-touch-attack'),
      rotateHint: document.getElementById('rotate-hint'),
      btnMenuFullscreen: document.getElementById('btn-menu-fullscreen')
    };

    this.lastTime = 0;
    this.bannerTimeout = null;

    this.barrels = [];
    this.torches = [];
    this.foliage = [];

    this.bindEvents();
    this.updateHUD();
    this.showScreen('menu');

    // Asosiy siklni boshlash
    requestAnimationFrame((t) => this.loop(t));
  }

  // Voqealar bog'lanishi (Klaviaturaga, sensorga va tugmalarga)
  bindEvents() {
    // 1. Klaviaturani tinglash
    window.addEventListener('keydown', (e) => {
      this.sounds.init();

      if (e.code === 'KeyP') {
        this.togglePause();
        return;
      }

      if (e.code === 'KeyF') {
        this.toggleFullscreen();
        return;
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.input.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.input.right = true;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (!this.input.jump) {
          this.input.jumpPressed = true;
        }
        this.input.jump = true;
      }
      if (e.code === 'KeyJ' || e.code === 'KeyZ' || e.code === 'KeyX' || e.code === 'Enter') {
        if (!this.input.attack) {
          this.input.attackPressed = true;
        }
        this.input.attack = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.input.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.input.right = false;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.input.jump = false;
      }
      if (e.code === 'KeyJ' || e.code === 'KeyZ' || e.code === 'KeyX' || e.code === 'Enter') {
        this.input.attack = false;
      }
    });

    // Sichqoncha orqali zarba berish
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.state === 'playing') {
        this.sounds.init();
        if (!this.input.attack) this.input.attackPressed = true;
        this.input.attack = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.input.attack = false;
    });

    // 2. Sensorli tugmalar (Mobile Multi-Touch Controls + Haptics)
    const triggerHaptic = () => {
      if (navigator.vibrate) {
        try { navigator.vibrate(10); } catch (e) {}
      }
    };

    const setupTouchBtn = (elem, onDown, onUp) => {
      if (!elem) return;
      const startHandler = (e) => {
        if (e.cancelable) e.preventDefault();
        this.sounds.init();
        triggerHaptic();
        elem.classList.add('active');
        onDown();
      };
      const endHandler = (e) => {
        if (e.cancelable) e.preventDefault();
        elem.classList.remove('active');
        onUp();
      };

      elem.addEventListener('touchstart', startHandler, { passive: false });
      elem.addEventListener('touchend', endHandler, { passive: false });
      elem.addEventListener('touchcancel', endHandler, { passive: false });
      elem.addEventListener('mousedown', startHandler);
      elem.addEventListener('mouseup', endHandler);
      elem.addEventListener('mouseleave', endHandler);
    };

    setupTouchBtn(
      this.dom.btnTouchLeft,
      () => { this.input.left = true; },
      () => { this.input.left = false; }
    );
    setupTouchBtn(
      this.dom.btnTouchRight,
      () => { this.input.right = true; },
      () => { this.input.right = false; }
    );
    setupTouchBtn(
      this.dom.btnTouchJump,
      () => {
        if (!this.input.jump) this.input.jumpPressed = true;
        this.input.jump = true;
      },
      () => { this.input.jump = false; }
    );
    setupTouchBtn(
      this.dom.btnTouchAttack,
      () => {
        if (!this.input.attack) this.input.attackPressed = true;
        this.input.attack = true;
      },
      () => { this.input.attack = false; }
    );

    // 3. Menyu tugmalari
    this.dom.btnStart.addEventListener('click', () => {
      this.sounds.init();
      triggerHaptic();
      this.startNewGame();
    });

    this.dom.btnResume.addEventListener('click', () => {
      triggerHaptic();
      this.resumeGame();
    });

    this.dom.btnRestartLevel.addEventListener('click', () => {
      triggerHaptic();
      this.loadLevel(this.currentLevelIndex);
      this.state = 'playing';
      this.showScreen('hudOnly');
    });

    this.dom.btnMainMenu.addEventListener('click', () => {
      triggerHaptic();
      this.showScreen('menu');
    });

    this.dom.btnNextLevel.addEventListener('click', () => {
      triggerHaptic();
      this.currentLevelIndex++;
      if (this.currentLevelIndex >= LEVELS.length) {
        this.triggerFinalWin();
      } else {
        this.loadLevel(this.currentLevelIndex);
        this.state = 'playing';
        this.showScreen('hudOnly');
      }
    });

    this.dom.btnRetry.addEventListener('click', () => {
      triggerHaptic();
      this.startNewGame();
    });

    this.dom.btnGameOverMenu.addEventListener('click', () => {
      triggerHaptic();
      this.showScreen('menu');
    });

    this.dom.btnPlayAgain.addEventListener('click', () => {
      triggerHaptic();
      this.startNewGame();
    });

    // 4. Ovoz, To'liq ekran va Pauza tugmalari
    this.dom.btnSound.addEventListener('click', () => {
      triggerHaptic();
      const enabled = this.sounds.toggle();
      this.dom.btnSound.textContent = enabled ? '🔊' : '🔇';
    });

    if (this.dom.btnFullscreen) {
      this.dom.btnFullscreen.addEventListener('click', () => {
        triggerHaptic();
        this.toggleFullscreen();
      });
    }

    if (this.dom.btnMenuFullscreen) {
      this.dom.btnMenuFullscreen.addEventListener('click', () => {
        triggerHaptic();
        this.toggleFullscreen();
      });
    }

    if (this.dom.rotateHint) {
      this.dom.rotateHint.addEventListener('click', () => {
        triggerHaptic();
        this.toggleFullscreen();
      });
    }

    const handleFSChange = () => {
      const isStandardFS = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      const isPseudoFS = document.body.classList.contains('fullscreen-mode');
      const active = isStandardFS || isPseudoFS;

      const icon = active ? '✕' : '⛶';
      if (this.dom.btnFullscreen) this.dom.btnFullscreen.textContent = icon;
      if (this.dom.btnMenuFullscreen) {
        this.dom.btnMenuFullscreen.textContent = active ? '✕ ODATIY EKRAN' : '⛶ TO\'LIQ EKRAN';
      }
    };

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach((evt) => {
      document.addEventListener(evt, handleFSChange);
    });

    window.addEventListener('resize', () => {
      window.scrollTo(0, 0);
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 200);
    });

    this.dom.btnPause.addEventListener('click', () => {
      triggerHaptic();
      this.togglePause();
    });
  }

  // To'liq ekran rejimi (Cross-browser Fullscreen API + iOS/Mobile Pseudo-Fullscreen fallback + Orientation Lock)
  toggleFullscreen() {
    const isStandardFS = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    const isPseudoFS = document.body.classList.contains('fullscreen-mode') || document.body.classList.contains('pseudo-fullscreen');
    const isFS = isStandardFS || isPseudoFS;

    const setFullscreenUI = (active) => {
      const icon = active ? '✕' : '⛶';
      if (this.dom.btnFullscreen) this.dom.btnFullscreen.textContent = icon;
      if (this.dom.btnMenuFullscreen) {
        this.dom.btnMenuFullscreen.textContent = active ? '✕ ODATIY EKRAN' : '⛶ TO\'LIQ EKRAN';
      }

      if (active) {
        document.body.classList.add('fullscreen-mode', 'pseudo-fullscreen');
        document.documentElement.classList.add('fullscreen-mode');
        window.scrollTo(0, 0);
        if (screen.orientation && screen.orientation.lock) {
          try {
            screen.orientation.lock('landscape').catch(() => {});
          } catch (e) {}
        }
      } else {
        document.body.classList.remove('fullscreen-mode', 'pseudo-fullscreen');
        document.documentElement.classList.remove('fullscreen-mode');
        if (screen.orientation && screen.orientation.unlock) {
          try {
            screen.orientation.unlock();
          } catch (e) {}
        }
      }
    };

    if (!isFS) {
      const el = document.documentElement;
      const requestFS =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;

      if (requestFS) {
        try {
          const promise = requestFS.call(el);
          if (promise && promise.catch) {
            promise.catch(() => {
              setFullscreenUI(true);
            });
          }
        } catch (e) {
          setFullscreenUI(true);
        }
      } else {
        setFullscreenUI(true);
      }
      setFullscreenUI(true);
    } else {
      const exitFS =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;

      if (isStandardFS && exitFS) {
        try {
          const promise = exitFS.call(document);
          if (promise && promise.catch) {
            promise.catch(() => {});
          }
        } catch (e) {}
      }
      setFullscreenUI(false);
    }
  }

  // Ekranni almashtirish yordamchisi
  showScreen(name) {
    this.dom.screenMenu.classList.add('hidden');
    this.dom.screenPause.classList.add('hidden');
    this.dom.screenLevelComplete.classList.add('hidden');
    this.dom.screenGameOver.classList.add('hidden');
    this.dom.screenWin.classList.add('hidden');

    if (this.dom.touchControls) {
      if (name === 'hudOnly') {
        this.dom.touchControls.classList.remove('hidden');
      } else {
        this.dom.touchControls.classList.add('hidden');
      }
    }

    if (this.dom.rotateHint) {
      if (name === 'hudOnly') {
        this.dom.rotateHint.classList.remove('hidden');
      } else {
        this.dom.rotateHint.classList.add('hidden');
      }
    }

    if (name === 'menu') {
      this.state = 'menu';
      this.dom.hud.classList.add('hidden');
      this.dom.menuHighScore.textContent = this.highScore;
      this.dom.screenMenu.classList.remove('hidden');
    } else if (name === 'paused') {
      this.state = 'paused';
      this.dom.screenPause.classList.remove('hidden');
    } else if (name === 'levelComplete') {
      this.state = 'levelComplete';
      this.dom.screenLevelComplete.classList.remove('hidden');
    } else if (name === 'gameOver') {
      this.state = 'gameOver';
      this.dom.screenGameOver.classList.remove('hidden');
    } else if (name === 'win') {
      this.state = 'win';
      this.dom.screenWin.classList.remove('hidden');
    } else if (name === 'hudOnly') {
      this.dom.hud.classList.remove('hidden');
    }
  }

  // Ekranda vaqtinchalik xabar chiqarish (Notification Banner)
  showBanner(msg, duration = 1800) {
    if (this.bannerTimeout) clearTimeout(this.bannerTimeout);
    this.dom.gameBanner.textContent = msg;
    this.dom.gameBanner.classList.remove('hidden');

    this.bannerTimeout = setTimeout(() => {
      this.dom.gameBanner.classList.add('hidden');
      this.bannerTimeout = null;
    }, duration);
  }

  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.showScreen('paused');
    } else if (this.state === 'paused') {
      this.resumeGame();
    }
  }

  resumeGame() {
    this.state = 'playing';
    this.showScreen('hudOnly');
  }

  startNewGame() {
    this.score = 0;
    this.coinsCount = 0;
    this.lives = 3;
    this.currentLevelIndex = 0;
    this.loadLevel(0);
    this.state = 'playing';
    this.showScreen('hudOnly');
  }

  // Bosqichni yuklash
  loadLevel(levelIndex) {
    const lvl = LEVELS[levelIndex];
    this.tilemap = new TileMap(lvl.generateMap());

    // Ob'ektlarni yaratish
    this.rocks = lvl.rocks.map(r => new Rock(r.x, r.y, r.w, r.h));
    this.tilemap.setRocks(this.rocks);

    this.palms = lvl.palms || [];
    this.checkpoints = lvl.checkpoints.map(cp => new Checkpoint(cp.x, cp.y));
    this.enemies = lvl.enemies.map(e => new Enemy(e.type, e.x, e.y, e.minX, e.maxX));
    this.coins = lvl.coins.map(c => new Coin(c.x, c.y));
    this.keys = lvl.keys.map(k => new Key(k.id, k.x, k.y));
    this.chest = new Chest(lvl.chest.x, lvl.chest.y);

    // Bochkalar, mash'alalar va o'simliklar
    this.barrels = (lvl.barrels || []).map(b => new Barrel(b.x, b.y));
    this.torches = (lvl.torches || []).map(t => new Torch(t.x, t.y));
    this.foliage = (lvl.foliage || []).map(f => new Foliage(f.x, f.y, f.type));

    this.keysCount = 0;
    this.activeCheckpoint = { x: lvl.playerStart.x, y: lvl.playerStart.y };
    this.player = new Player(lvl.playerStart.x, lvl.playerStart.y);

    this.camera.x = 0;
    this.camera.y = 0;
    this.particles.clear();

    this.updateHUD();
    this.showBanner(`${lvl.name}! Barcha 3 ta kalitni toping! 🔑`, 2500);
  }

  // HUD ma'lumotlarini yangilash
  updateHUD() {
    let heartsStr = '';
    for (let i = 0; i < this.lives; i++) heartsStr += '❤️';
    for (let i = this.lives; i < 3; i++) heartsStr += '🖤';

    this.dom.hudHearts.textContent = heartsStr;
    this.dom.hudKeys.textContent = `${this.keysCount}/3`;
    this.dom.hudCoins.textContent = this.coinsCount;
    this.dom.hudScore.textContent = this.score;
    this.dom.hudLevel.textContent = `${this.currentLevelIndex + 1}/${LEVELS.length}`;
  }

  // Rekordni tekshirish va saqlash
  checkHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('treasure_pirate_highscore', this.highScore);
      return true;
    }
    return false;
  }

  // Bosqich yakunlanishi (Sandiq ochilganda)
  triggerLevelComplete() {
    this.sounds.playChestOpen();
    this.particles.spawnConfetti(this.chest.x + this.chest.width / 2, this.chest.y + 10, 45);

    setTimeout(() => {
      this.checkHighScore();
      this.dom.lcCoins.textContent = this.coinsCount;
      this.dom.lcScore.textContent = this.score;
      this.dom.lcTotalScore.textContent = this.score;
      this.showScreen('levelComplete');
    }, 1200);
  }

  // Yakuniy g'alaba
  triggerFinalWin() {
    this.sounds.playWin();
    const isNew = this.checkHighScore();

    this.dom.winCoins.textContent = this.coinsCount;
    this.dom.winScore.textContent = this.score;
    this.dom.winHighScore.textContent = this.highScore;

    if (isNew) {
      this.dom.winNewRecord.classList.remove('hidden');
    } else {
      this.dom.winNewRecord.classList.add('hidden');
    }

    this.showScreen('win');
  }

  // O'yin tugashi (Jonlar 0 bo'lganda)
  triggerGameOver() {
    this.sounds.playGameOver();
    this.checkHighScore();

    this.dom.goScore.textContent = this.score;
    this.dom.goHighScore.textContent = this.highScore;

    this.showScreen('gameOver');
  }

  // Qahramon zarba olganda yoki chuqurga tushganda
  handlePlayerDamage(isPit = false) {
    if (this.player.invincibleTimer > 0 && !isPit) return;

    this.lives--;
    this.updateHUD();

    if (isPit) {
      this.sounds.playSplash();
      this.particles.spawnSplash(this.player.x + this.player.width / 2, this.player.y + this.player.height, 16);
    } else {
      this.sounds.playHurt();
      // Orqaga itarilish (Knockback)
      this.player.vy = -260;
      this.player.vx = this.player.facingRight ? -170 : 170;
      this.player.invincibleTimer = 1.6;
    }

    if (this.lives <= 0) {
      this.triggerGameOver();
    } else if (isPit) {
      this.showBanner('Chuqurga tushib ketdingiz! -1 ❤️', 1400);
      this.player.resetToCheckpoint(this.activeCheckpoint.x, this.activeCheckpoint.y);
    }
  }

  // Harakat va to'qnashuvlar yangilanishi
  update(dt) {
    if (this.state !== 'playing') return;

    // 1. Qahramonni yangilash
    this.player.update(dt, this.input, this.tilemap, this.sounds, this.particles);
    this.input.jumpPressed = false;
    this.input.attackPressed = false;

    // 2. Chuqurga tushishni tekshirish
    if (this.player.y > this.tilemap.height + 10) {
      this.handlePlayerDamage(true);
      return;
    }

    // 3. Mash'alalarni yangilash
    for (const torch of this.torches) {
      torch.update(dt, this.particles);
    }

    // 4. Qahramonning qilich zarbasi to'qnashuvlari (Sword Hitbox)
    const swordBox = this.player.getSwordHitbox();
    if (swordBox) {
      // A. Bochkalar bilan to'qnashuv
      for (const barrel of this.barrels) {
        if (!barrel.alive) continue;
        if (
          swordBox.x < barrel.x + barrel.width &&
          swordBox.x + swordBox.width > barrel.x &&
          swordBox.y < barrel.y + barrel.height &&
          swordBox.y + swordBox.height > barrel.y
        ) {
          barrel.alive = false;
          this.sounds.playWoodBreak();
          this.particles.spawnWoodSplinters(barrel.x + barrel.width / 2, barrel.y + barrel.height / 2, 14);
          this.score += 25;
          this.updateHUD();
          this.particles.spawnFloatingText('+25 🪵', barrel.x + barrel.width / 2, barrel.y - 6, '#ffd666');
          // Tanga chiqishi
          this.coins.push(new Coin(barrel.x + 4, barrel.y + 4));
        }
      }

      // B. Dushmanlar bilan qilich zarbasi
      for (const enemy of this.enemies) {
        if (!enemy.alive || this.player.hitEnemies.has(enemy)) continue;

        if (
          swordBox.x < enemy.x + enemy.width &&
          swordBox.x + swordBox.width > enemy.x &&
          swordBox.y < enemy.y + enemy.height &&
          swordBox.y + swordBox.height > enemy.y
        ) {
          this.player.hitEnemies.add(enemy);

          // PARRY: Agar dushman ham qilich siltayotgan bo'lsa
          if (enemy.isAttacking) {
            this.sounds.playSwordClash();
            const clashX = (this.player.x + enemy.x) / 2 + 10;
            const clashY = (this.player.y + enemy.y) / 2 + 10;
            this.particles.spawnSparks(clashX, clashY, 16);
            this.particles.spawnFloatingText('PARRY! ⚔️', clashX, clashY - 14, '#ffffff');

            this.player.vx = this.player.facingRight ? -170 : 170;
            enemy.x += enemy.facingRight ? -25 : 25;
            enemy.isAttacking = false;
            enemy.attackCooldownTimer = 0.9;
          } else {
            // Dushmanga zarba yetdi
            enemy.hp--;
            enemy.hurtTimer = 0.35;
            this.sounds.playSwordClash();
            this.particles.spawnSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12);
            const knockDir = this.player.facingRight ? 1 : -1;
            enemy.x += knockDir * 26;

            if (enemy.hp <= 0) {
              enemy.alive = false;
              const isCapt = enemy.type === 'captain';
              const isPir = enemy.type === 'pirate';
              const pts = isCapt ? 200 : (isPir ? 100 : 50);
              this.score += pts;
              this.updateHUD();

              if (isCapt || isPir) {
                this.sounds.playPirateGroan();
                this.particles.spawnStomp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                this.particles.spawnFloatingText(`+${pts} YENGILDI!`, enemy.x + enemy.width / 2, enemy.y - 12, '#f1c40f');
                const dropCoins = isCapt ? 3 : 2;
                for (let c = 0; c < dropCoins; c++) {
                  this.coins.push(new Coin(enemy.x + (c - 1) * 12, enemy.y - 6));
                }
              } else {
                this.sounds.playStomp();
                this.particles.spawnStomp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                this.particles.spawnFloatingText(`+${pts}`, enemy.x + enemy.width / 2, enemy.y - 6, '#ff7675');
              }
            } else {
              this.particles.spawnFloatingText('-1 ⚔️', enemy.x + enemy.width / 2, enemy.y - 10, '#ff7675');
            }
          }
        }
      }
    }

    // 5. Dushmanlar harakati va to'qnashuvlari
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      enemy.update(dt, this.player, this.sounds, this.particles);

      // Dushman qilichi qahramonga tegishi
      const enemySword = enemy.getSwordHitbox ? enemy.getSwordHitbox() : null;
      if (enemySword && this.player.invincibleTimer <= 0) {
        if (
          enemySword.x < this.player.x + this.player.width &&
          enemySword.x + enemySword.width > this.player.x &&
          enemySword.y < this.player.y + this.player.height &&
          enemySword.y + enemySword.height > this.player.y
        ) {
          if (!this.player.isAttacking) {
            this.handlePlayerDamage(false);
            continue;
          }
        }
      }

      // Tana bilan AABB to'qnashuv
      if (
        this.player.x < enemy.x + enemy.width &&
        this.player.x + this.player.width > enemy.x &&
        this.player.y < enemy.y + enemy.height &&
        this.player.y + this.player.height > enemy.y
      ) {
        // Dushman ustiga sakralganmi? (Stomp)
        const wasAbove = (this.player.prevY + this.player.height) <= (enemy.y + 14);
        const isFalling = this.player.vy > 0 || this.player.prevVy > 0;

        if (isFalling && wasAbove) {
          enemy.hp--;
          this.player.vy = -380; // Yuqoriga qayta sakrash (Bounce)

          if (enemy.hp <= 0) {
            enemy.alive = false;
            const isCapt = enemy.type === 'captain';
            const isPir = enemy.type === 'pirate';
            const pts = isCapt ? 200 : (isPir ? 100 : 50);
            this.score += pts;
            this.updateHUD();

            if (isCapt || isPir) {
              this.sounds.playPirateGroan();
              this.particles.spawnStomp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
              this.particles.spawnFloatingText(`+${pts} YENGILDI!`, enemy.x + enemy.width / 2, enemy.y - 12, '#f1c40f');
              const dropCoins = isCapt ? 3 : 2;
              for (let c = 0; c < dropCoins; c++) {
                this.coins.push(new Coin(enemy.x + (c - 1) * 12, enemy.y - 6));
              }
            } else {
              this.sounds.playStomp();
              this.particles.spawnStomp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
              this.particles.spawnFloatingText(`+${pts}`, enemy.x + enemy.width / 2, enemy.y - 6, '#ff7675');
            }
          } else {
            enemy.hurtTimer = 0.35;
            this.sounds.playStomp();
            this.particles.spawnFloatingText('-1 👟', enemy.x + enemy.width / 2, enemy.y - 10, '#ff7675');
          }
        } else {
          // Yon tomondan tegsa: Qahramon shikastlanadi
          this.handlePlayerDamage(false);
        }
      }
    }

    // 6. Tangalar yig'ilishi
    for (const coin of this.coins) {
      if (coin.collected) continue;
      coin.update(dt);

      if (
        this.player.x < coin.x + coin.width &&
        this.player.x + this.player.width > coin.x &&
        this.player.y < coin.y + coin.height &&
        this.player.y + this.player.height > coin.y
      ) {
        coin.collected = true;
        this.coinsCount++;
        this.score += 10;
        this.updateHUD();
        this.sounds.playCoin();
        this.particles.spawnSparkles(coin.x + coin.width / 2, coin.y + coin.height / 2, 8, '#ffd700');
        this.particles.spawnFloatingText('+10', coin.x + coin.width / 2, coin.y - 2, '#ffd700');
      }
    }

    // 7. Kalitlar yig'ilishi
    for (const key of this.keys) {
      if (key.collected) continue;
      key.update(dt);

      if (
        this.player.x < key.x + key.width &&
        this.player.x + this.player.width > key.x &&
        this.player.y < key.y + key.height &&
        this.player.y + this.player.height > key.y
      ) {
        key.collected = true;
        this.keysCount++;
        this.score += 100;
        this.updateHUD();
        this.sounds.playKey();
        this.particles.spawnSparkles(key.x + key.width / 2, key.y + key.height / 2, 16, '#f1c40f');
        this.particles.spawnFloatingText(`KALIT! (${this.keysCount}/3)`, key.x, key.y - 10, '#ffffff');

        if (this.keysCount >= 3) {
          this.showBanner("Barcha 3 ta kalit yig'ildi! Endi sandiqni oching! 👑", 2800);
        } else {
          this.showBanner(`Kalit topildi! (${this.keysCount}/3) 🔑`, 1800);
        }
      }
    }

    // 8. Nazorat nuqtalari
    for (const cp of this.checkpoints) {
      cp.update(dt);
      if (
        !cp.activated &&
        this.player.x < cp.x + cp.width &&
        this.player.x + this.player.width > cp.x &&
        this.player.y < cp.y + cp.height &&
        this.player.y + this.player.height > cp.y
      ) {
        cp.activated = true;
        this.activeCheckpoint = { x: cp.x, y: cp.y - 4 };
        this.sounds.playCheckpoint();
        this.particles.spawnSparkles(cp.x + 12, cp.y + 12, 12, '#2ecc71');
        this.particles.spawnFloatingText('NAZORAT NUQTASI!', cp.x - 10, cp.y - 12, '#2ecc71');
        this.showBanner('Nazorat nuqtasi saqlandi! 🚩', 1600);
      }
    }

    // 9. Xazina sandig'i
    this.chest.update(dt);
    if (
      !this.chest.isOpen &&
      this.player.x < this.chest.x + this.chest.width + 4 &&
      this.player.x + this.player.width > this.chest.x - 4 &&
      this.player.y < this.chest.y + this.chest.height &&
      this.player.y + this.player.height > this.chest.y
    ) {
      if (this.keysCount >= 3) {
        this.chest.isOpen = true;
        this.triggerLevelComplete();
      } else {
        if (!this.bannerTimeout) {
          this.sounds.playLocked();
          this.showBanner(`Kalit yetishmaydi! (${this.keysCount}/3 ta kalit bor)`, 1600);
        }
      }
    }

    // 10. Kamera harakati
    const targetCamX = this.player.x + this.player.width / 2 - this.viewWidth * 0.42;
    this.camera.x += (targetCamX - this.camera.x) * (1 - Math.exp(-6 * dt));

    const maxCamX = Math.max(0, this.tilemap.width - this.viewWidth);
    if (this.camera.x < 0) this.camera.x = 0;
    if (this.camera.x > maxCamX) this.camera.x = maxCamX;
    this.camera.y = 0;

    // Zarrachalarni yangilash
    this.particles.update(dt);
  }

  // Chizish (Render loop)
  render() {
    this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
    const animTimer = performance.now() / 1000;

    // 1. Parallaks fon (Bosqich muhitiga mos osmon va dengiz)
    SpriteRenderer.drawParallaxBackground(
      this.ctx,
      this.camera.x,
      this.camera.y,
      this.viewWidth,
      this.viewHeight,
      animTimer,
      this.currentLevelIndex
    );

    // 2. O'simliklar va Gullar (Foliage)
    if (this.foliage) {
      for (const fol of this.foliage) {
        if (fol.x + 40 >= this.camera.x && fol.x - 40 <= this.camera.x + this.viewWidth) {
          fol.draw(this.ctx, this.camera.x, this.camera.y, animTimer);
        }
      }
    }

    // 3. Bezak palma daraxtlari
    if (this.palms) {
      for (const palm of this.palms) {
        if (palm.x + 80 >= this.camera.x && palm.x - 80 <= this.camera.x + this.viewWidth) {
          SpriteRenderer.drawPalmTree(this.ctx, palm.x - this.camera.x, palm.y - this.camera.y, animTimer);
        }
      }
    }

    // 4. Mash'alalar (Torches)
    if (this.torches) {
      for (const torch of this.torches) {
        if (torch.x + 30 >= this.camera.x && torch.x - 30 <= this.camera.x + this.viewWidth) {
          torch.draw(this.ctx, this.camera.x, this.camera.y);
        }
      }
    }

    // 5. Nazorat nuqtalari bayroqlari
    if (this.checkpoints) {
      for (const cp of this.checkpoints) {
        cp.draw(this.ctx, this.camera.x, this.camera.y);
      }
    }

    // 6. Dunyo plitkalari va toshlar
    if (this.tilemap) {
      this.tilemap.draw(this.ctx, this.camera.x, this.camera.y, this.viewWidth, this.viewHeight, animTimer);
    }

    // 7. Bochkalar (Destructible Barrels)
    if (this.barrels) {
      for (const barrel of this.barrels) {
        if (barrel.x + barrel.width >= this.camera.x && barrel.x <= this.camera.x + this.viewWidth) {
          barrel.draw(this.ctx, this.camera.x, this.camera.y);
        }
      }
    }

    // 8. Xazina sandig'i
    if (this.chest) {
      this.chest.draw(this.ctx, this.camera.x, this.camera.y, this.keysCount);
    }

    // 9. Tangalar va kalitlar
    if (this.coins) {
      for (const coin of this.coins) {
        coin.draw(this.ctx, this.camera.x, this.camera.y);
      }
    }
    if (this.keys) {
      for (const key of this.keys) {
        key.draw(this.ctx, this.camera.x, this.camera.y);
      }
    }

    // 10. Dushmanlar (Crab, Bird, Pirate Swordsman, Captain)
    if (this.enemies) {
      for (const enemy of this.enemies) {
        enemy.draw(this.ctx, this.camera.x, this.camera.y);
      }
    }

    // 11. Qahramon qaroqchi
    if (this.player && this.state !== 'menu') {
      this.player.draw(this.ctx, this.camera.x, this.camera.y);
    }

    // 12. Zarrachalar va suzuvchi matnlar
    this.particles.draw(this.ctx, this.camera.x, this.camera.y);
  }

  // O'yin sikli (requestAnimationFrame & deltaTime)
  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (dt > 0.1) dt = 0.1;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }
}

// O'yinni sahifa yuklanganda ishga tushirish
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
});
