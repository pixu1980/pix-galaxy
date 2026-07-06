/**
 * <pix-recorder></pix-recorder>
 *
 * Accessible audio recorder Web Component with waveform visualization.
 * Uses MediaRecorder + Web Audio API (AnalyserNode) + Canvas.
 *
 * States: idle → recording → paused → done
 *
 * @fires recorder-start — recording started
 * @fires recorder-pause — recording paused
 * @fires recorder-resume — recording resumed
 * @fires recorder-complete — { blob, duration } recording finished
 * @fires recorder-error — { message } error occurred
 */
import componentCSS from './PixRecorder.css?raw';

const ELEMENT_NAME = 'pix-recorder';
const SVG_RECORD = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg>';
const SVG_PAUSE = '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';
const SVG_STOP = '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>';
const SVG_DOWNLOAD = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13M8 12l4 4 4-4"/><path d="M4 19h16"/></svg>';

let componentStyleSheet = null;
function adoptComponentStyles() {
  if (typeof document === 'undefined' || !('adoptedStyleSheets' in document) || typeof CSSStyleSheet !== 'function') return null;
  if (!componentStyleSheet) { componentStyleSheet = new CSSStyleSheet(); componentStyleSheet.replaceSync(componentCSS); }
  if (!document.adoptedStyleSheets.includes(componentStyleSheet)) document.adoptedStyleSheets = [...document.adoptedStyleSheets, componentStyleSheet];
  return componentStyleSheet;
}

class PixRecorder extends HTMLElement {
  static observedAttributes = ['max-duration', 'format', 'filename'];

  static ensureComponentStyles() { return adoptComponentStyles(); }
  static {
    this.ensureComponentStyles();
    if (!globalThis.customElements?.get(ELEMENT_NAME)) globalThis.customElements.define(ELEMENT_NAME, this);
  }

  /* ── State ────────────────────────────────────────────────────── */

  #state = 'idle'; // idle | recording | paused | done
  #mediaRecorder = null;
  #stream = null;
  #chunks = [];
  #recordingStartTime = 0;
  #pausedDuration = 0;
  #pauseStartTime = 0;
  #timerRAF = 0;
  #maxDuration = 0;
  #format = 'webm';
  #filename = 'recording';
  #blob = null;
  #analyserNode = null;
  #audioContext = null;
  #animationId = 0;

  /* ── Bound handlers ───────────────────────────────────────────── */

  #onKeyDown = this.#handleKeyDown.bind(this);

  constructor() {
    super();
  }

  connectedCallback() {
    this.constructor.ensureComponentStyles();
    this.#render();
  }

  disconnectedCallback() {
    this.#stopMedia();
    cancelAnimationFrame(this.#timerRAF);
    cancelAnimationFrame(this.#animationId);
    document.removeEventListener('keydown', this.#onKeyDown);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'max-duration') this.#maxDuration = parseInt(newVal) || 0;
    if (name === 'format') this.#format = (newVal === 'ogg' || newVal === 'wav') ? newVal : 'webm';
    if (name === 'filename') this.#filename = newVal || 'recording';
  }

  /* ── Public API ───────────────────────────────────────────────── */

  get state() { return this.#state; }
  get duration() { return this.#elapsed(); }
  get blob() { return this.#blob; }

  start() { this.#doRecord(); }
  pause() { this.#doPause(); }
  resume() { this.#doResume(); }
  stop() { this.#doStop(); }

  /* ── Render ───────────────────────────────────────────────────── */

  #render() {
    this.innerHTML = '';

    const announce = document.createElement('div');
    announce.setAttribute('data-part', 'announce');
    announce.setAttribute('role', 'status');
    announce.setAttribute('aria-live', 'polite');
    announce.setAttribute('aria-atomic', 'true');

    const toolbar = document.createElement('div');
    toolbar.setAttribute('data-part', 'toolbar');
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Audio recorder controls');

    // Record button
    const recordBtn = this.#makeBtn('record', 'Start recording', SVG_RECORD);
    recordBtn.addEventListener('click', () => {
      if (this.#state === 'idle') this.#doRecord();
    });

    // Pause button
    const pauseBtn = this.#makeBtn('pause', 'Pause recording', SVG_PAUSE);
    pauseBtn.addEventListener('click', () => {
      if (this.#state === 'recording') this.#doPause();
      else if (this.#state === 'paused') this.#doResume();
    });

    // Stop button
    const stopBtn = this.#makeBtn('stop', 'Stop recording', SVG_STOP);
    stopBtn.addEventListener('click', () => {
      if (this.#state === 'recording' || this.#state === 'paused') this.#doStop();
    });

    // Download button
    const downloadBtn = this.#makeBtn('download', 'Download recording', SVG_DOWNLOAD);
    downloadBtn.addEventListener('click', () => this.#doDownload());
    downloadBtn.hidden = true;

    const timer = document.createElement('span');
    timer.setAttribute('data-part', 'timer');
    timer.textContent = '00:00';

    const status = document.createElement('span');
    status.setAttribute('data-part', 'status');
    status.textContent = 'Ready';

    toolbar.append(recordBtn, pauseBtn, stopBtn, downloadBtn, timer, status);

    // Waveform canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('data-part', 'waveform');
    canvas.width = 400;
    canvas.height = 64;
    canvas.hidden = true;

    // Playback
    const playback = document.createElement('div');
    playback.setAttribute('data-part', 'playback');
    const audioEl = document.createElement('audio');
    audioEl.setAttribute('controls', '');
    audioEl.setAttribute('aria-label', 'Recording preview');
    playback.append(audioEl);

    this.append(announce, toolbar, canvas, playback);
    document.addEventListener('keydown', this.#onKeyDown);
  }

  #makeBtn(action, label, svg) {
    const btn = document.createElement('button');
    btn.setAttribute('data-part', 'btn');
    btn.setAttribute('data-action', action);
    btn.setAttribute('aria-label', label);
    btn.title = label;
    btn.innerHTML = svg;
    return btn;
  }

  #announce(msg) {
    const el = this.querySelector('[data-part="announce"]');
    if (el) el.textContent = msg;
  }

  #setTimer(seconds) {
    const el = this.querySelector('[data-part="timer"]');
    if (!el) return;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  #setStatus(msg) {
    const el = this.querySelector('[data-part="status"]');
    if (el) el.textContent = msg;
  }

  /* ── Recording logic ──────────────────────────────────────────── */

  async #doRecord() {
    if (this.#state !== 'idle') return;

    try {
      this.#stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      this.#setStatus('Microphone access denied');
      this.#announce('Microphone access denied');
      this.dispatchEvent(new CustomEvent('recorder-error', { detail: { message: 'Microphone access denied' }, bubbles: true }));
      return;
    }

    this.#chunks = [];
    this.#recordingStartTime = performance.now();
    this.#pausedDuration = 0;

    // Set up waveform
    this.#setupWaveform();

    const mimeType = this.#format === 'ogg' ? 'audio/ogg; codecs=opus' :
                     this.#format === 'wav' ? 'audio/wav' :
                     'audio/webm; codecs=opus';

    try {
      this.#mediaRecorder = new MediaRecorder(this.#stream, { mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined });
    } catch {
      this.#mediaRecorder = new MediaRecorder(this.#stream);
    }

    this.#mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.#chunks.push(e.data);
    };

    this.#mediaRecorder.onstop = () => {
      this.#blob = new Blob(this.#chunks, { type: this.#mediaRecorder.mimeType });
      this.#showDone();
    };

    this.#mediaRecorder.start(100);
    this.#state = 'recording';
    this.#updateButtons();
    this.#setStatus('Recording…');
    this.#announce('Recording started');
    this.#startTimer();
    this.dispatchEvent(new CustomEvent('recorder-start', { bubbles: true }));
  }

  #doPause() {
    if (this.#state !== 'recording' || !this.#mediaRecorder || this.#mediaRecorder.state !== 'recording') return;
    this.#pauseStartTime = performance.now();
    this.#mediaRecorder.pause();
    this.#state = 'paused';
    this.#updateButtons();
    this.#setStatus('Paused');
    this.#announce('Recording paused');
    cancelAnimationFrame(this.#timerRAF);
    this.dispatchEvent(new CustomEvent('recorder-pause', { bubbles: true }));
  }

  #doResume() {
    if (this.#state !== 'paused' || !this.#mediaRecorder || this.#mediaRecorder.state !== 'paused') return;
    this.#pausedDuration += performance.now() - this.#pauseStartTime;
    this.#mediaRecorder.resume();
    this.#state = 'recording';
    this.#updateButtons();
    this.#setStatus('Recording…');
    this.#announce('Recording resumed');
    this.#startTimer();
    this.dispatchEvent(new CustomEvent('recorder-resume', { bubbles: true }));
  }

  #doStop() {
    if ((this.#state !== 'recording' && this.#state !== 'paused') || !this.#mediaRecorder) return;
    this.#state = 'done';
    cancelAnimationFrame(this.#timerRAF);
    cancelAnimationFrame(this.#animationId);
    this.#mediaRecorder.stop();
    this.#stopMedia();
    this.#setStatus('Recording complete');
    this.#announce('Recording complete');
  }

  #doDownload() {
    if (!this.#blob) return;
    const ext = this.#mediaRecorder?.mimeType.includes('ogg') ? 'ogg' : this.#mediaRecorder?.mimeType.includes('wav') ? 'wav' : 'webm';
    const url = URL.createObjectURL(this.#blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.#filename}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  #stopMedia() {
    if (this.#stream) {
      this.#stream.getTracks().forEach((t) => t.stop());
      this.#stream = null;
    }
    if (this.#audioContext) {
      this.#audioContext.close();
      this.#audioContext = null;
      this.#analyserNode = null;
    }
  }

  /* ── Waveform ─────────────────────────────────────────────────── */

  #setupWaveform() {
    const canvas = this.querySelector('[data-part="waveform"]');
    if (!canvas) return;
    canvas.hidden = false;

    try {
      this.#audioContext = new AudioContext();
      const source = this.#audioContext.createMediaStreamSource(this.#stream);
      this.#analyserNode = this.#audioContext.createAnalyser();
      this.#analyserNode.fftSize = 256;
      source.connect(this.#analyserNode);
      this.#drawWaveform(canvas);
    } catch {
      // Waveform silently disabled if AudioContext fails
    }
  }

  #drawWaveform(canvas) {
    if (!this.#analyserNode) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = this.#analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const w = canvas.width, h = canvas.height;

    const draw = () => {
      if (this.#state === 'done') return;
      this.#animationId = requestAnimationFrame(draw);
      this.#analyserNode.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.strokeStyle = lightDark('#2563eb', '#60a5fa');
      ctx.lineWidth = 2;

      const sliceWidth = w / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128;
        const y = (v * h) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.stroke();
    };

    function lightDark(light, dark) {
      if (typeof document === 'undefined') return light;
      return document.documentElement.dataset.colorScheme === 'dark' || 
        (document.documentElement.dataset.colorScheme !== 'light' &&
         window.matchMedia?.('(prefers-color-scheme: dark)').matches)
        ? dark : light;
    }

    draw();
  }

  /* ── Timer ────────────────────────────────────────────────────── */

  #startTimer() {
    const tick = () => {
      if (this.#state !== 'recording') return;
      this.#timerRAF = requestAnimationFrame(tick);
      const elapsed = this.#elapsed();
      this.#setTimer(elapsed);

      if (this.#maxDuration > 0 && elapsed >= this.#maxDuration) {
        this.#doStop();
      }
    };
    tick();
  }

  #elapsed() {
    if (this.#state === 'idle') return 0;
    const now = performance.now();
    const elapsed = (now - this.#recordingStartTime - this.#pausedDuration) / 1000;
    return Math.max(0, elapsed);
  }

  /* ── UI updates ───────────────────────────────────────────────── */

  #updateButtons() {
    const recordBtn = this.querySelector('[data-action="record"]');
    const pauseBtn = this.querySelector('[data-action="pause"]');
    const stopBtn = this.querySelector('[data-action="stop"]');
    const downloadBtn = this.querySelector('[data-action="download"]');

    if (recordBtn) {
      recordBtn.hidden = this.#state !== 'idle';
      recordBtn.toggleAttribute('data-recording', this.#state === 'recording');
    }
    if (pauseBtn) {
      pauseBtn.hidden = this.#state !== 'recording' && this.#state !== 'paused';
      pauseBtn.innerHTML = this.#state === 'paused' ? SVG_RECORD : SVG_PAUSE;
      pauseBtn.setAttribute('aria-label', this.#state === 'paused' ? 'Resume recording' : 'Pause recording');
      pauseBtn.title = pauseBtn.getAttribute('aria-label');
    }
    if (stopBtn) stopBtn.hidden = this.#state !== 'recording' && this.#state !== 'paused';
    if (downloadBtn) downloadBtn.hidden = this.#state !== 'done';
  }

  #showDone() {
    this.#state = 'done';
    const canvas = this.querySelector('[data-part="waveform"]');
    if (canvas) canvas.hidden = true;

    const playback = this.querySelector('[data-part="playback"]');
    const audio = playback?.querySelector('audio');
    if (playback && audio && this.#blob) {
      audio.src = URL.createObjectURL(this.#blob);
      playback.setAttribute('data-visible', '');
    }

    this.#updateButtons();
    this.#setTimer(this.#elapsed());
    this.#setStatus('Recording complete');

    const total = this.#elapsed();
    this.#announce(`Recording complete — ${Math.floor(total / 60)} minutes ${Math.floor(total % 60)} seconds`);
    this.dispatchEvent(new CustomEvent('recorder-complete', {
      detail: { blob: this.#blob, duration: total },
      bubbles: true,
    }));
  }

  /* ── Keyboard ─────────────────────────────────────────────────── */

  #handleKeyDown(event) {
    const btn = this.querySelector('[data-part="toolbar"] [data-action]:not([hidden])');
    if (event.key === ' ' || event.key === 'Enter') {
      // Space/Enter handled by button's own click; prevent page scroll on Space
      if (event.target.closest('pix-recorder') && event.key === ' ') {
        event.preventDefault();
      }
    }
  }
}

export { PixRecorder };
