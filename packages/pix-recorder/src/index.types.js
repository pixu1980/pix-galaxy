/* eslint-disable getter-return -- type declaration file: getters are JSDoc signatures, not implementations */
/**
 * @typedef {'idle' | 'recording' | 'paused' | 'done'} PixRecorderState
 * Current recording state.
 */

/**
 * @typedef {'webm' | 'ogg'} PixRecorderFormat
 * Audio encoding format.
 */

/**
 * @fires PixRecorder#recorder-start
 * @type {CustomEvent<void>}
 */

/**
 * @fires PixRecorder#recorder-pause
 * @type {CustomEvent<void>}
 */

/**
 * @fires PixRecorder#recorder-resume
 * @type {CustomEvent<void>}
 */

/**
 * @fires PixRecorder#recorder-complete
 * @type {CustomEvent<{ blob: Blob, duration: number }>}
 */

/**
 * @fires PixRecorder#recorder-error
 * @type {CustomEvent<{ message: string }>}
 */

/**
 * Browser-native accessible audio recorder custom element.
 * Waveform visualization, pause/resume, download, and WCAG 2.2 AA support.
 */
export class PixRecorder extends HTMLElement {
  /** @returns {PixRecorderState} The current recording state. */
  get state() {}
  /** @returns {number} Elapsed recording duration in seconds. */
  get duration() {}
  /** @returns {Blob | null} The recorded audio blob when complete. */
  get blob() {}
}
