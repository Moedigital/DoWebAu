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
        this.instrumentalUrl = options.instrumentalUrl;
        this.onRecorded = options.onRecorded;
    }

    private instrumentalUrl: string;

    private async loadInstrumental(url: string): Promise<void> {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            this.instrumentalBuffer = await this.audioContext.decodeAudioData(response.data);
        } catch (error) {
            console.error('Failed to load instrumental:', error);
        }
    }

    private playInstrumental(): void {
        if (!this.instrumentalBuffer) {
            console.error('Instrumental buffer is not loaded.');
            return;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = this.instrumentalBuffer;
        source.connect(this.audioContext.destination);
        source.start();
    }

    public async startRecording(): Promise<void> {
        // Load the instrumental before starting the recording
        await this.loadInstrumental(this.instrumentalUrl);
        this.playInstrumental();

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        } catch (error) {
            console.error('Failed to get user media:', error);
        }
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
