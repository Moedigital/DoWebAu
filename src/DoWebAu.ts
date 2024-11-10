// DoWebAu.ts
import axios from 'axios';

type Options = {
    instrumentalUrl: string;
    onRecorded: (blob: Blob) => void;
};

export class DoWebAu {
    private audioContext: AudioContext;
    private instrumentalBuffer: AudioBuffer | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];

    constructor(options: Options) {
        //@ts-ignore
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.loadInstrumental(options.instrumentalUrl);
        this.onRecorded = options.onRecorded;
    }

    private async loadInstrumental(url: string): Promise<void> {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            this.instrumentalBuffer = await this.audioContext.decodeAudioData(response.data);
            this.playInstrumental();
        } catch (error) {
            console.error('Failed to load instrumental:', error);
        }
    }

    private playInstrumental(): void {
        if (!this.instrumentalBuffer) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = this.instrumentalBuffer;
        source.connect(this.audioContext.destination);
        source.start();
    }

    public startRecording(): void {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = event => {
                    this.chunks.push(event.data);
                };
                this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.chunks, { type: 'audio/webm' });
                    this.onRecorded(blob);
                    this.chunks = [];
                };
                this.mediaRecorder.start();
            })
            .catch(error => {
                console.error('Failed to get user media:', error);
            });
    }

    public stopRecording(): void {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
        }
    }

    private onRecorded(blob: Blob): void {
        // This method should be overridden by the user
    }
}

export default DoWebAu;
