
type BpmHandle = (time: number, isBeat: boolean) => void;

export class BPMController {
    private bpm: number;
    private lastTaps: number[] = [];
    private clearTapsTimeout: number | undefined;
    private handels: Array<BpmHandle> = [];
    private lastBeatTime: number = 0;
    constructor() {
        this.bpm = 180/4;
    }
    setBPM(bpm: number) {
        this.bpm = bpm;
    }
    getBPM() {
        return this.bpm;
    }

    tap() {
        const now = Date.now();
        this.lastTaps.push(now);
        if (this.lastTaps.length > 4) {
            this.lastTaps.shift();
        }
        if (this.lastTaps.length > 1) {
            const average = this.lastTaps.reduce((a, b) => a + b) / this.lastTaps.length;
            const bpm = 60000 / (average - this.lastTaps[0]);
            this.bpm = bpm;
        }
        if (this.clearTapsTimeout) {
            clearTimeout(this.clearTapsTimeout);
        }
        this.clearTapsTimeout = setTimeout(() => {
            this.clearTaps();
        }, 5000);
    }

    clearTaps() {
        this.lastTaps = [];
    }

    registerHandle(handle: BpmHandle) {
        this.handels.push(handle);
    }

    update(time: number) {
        let beat = false;
        if (time - this.lastBeatTime > 60000 / this.bpm) {
            this.lastBeatTime = time;
            beat = true;
        }
        this.handels.forEach(handle => handle(time, beat));
    }
}