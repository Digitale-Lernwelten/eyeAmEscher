import Marisa from "../../assets/img/mundZu.png";
import Eyes from "../../assets/img/Pupillen.png";
import MarisaEyesWideShut from "../../assets/img/augenZu.png";
import MarisaMouth from "../../assets/img/Kiefer.png";

const loadImage = (src: string):Promise<HTMLImageElement> => {
	return new Promise(res => {
		const img = new Image();
		img.onload = () => {
			res(img);
		};
		img.src = src;
	});
}

let started = false;
let audioCtx: AudioContext | undefined;
let bufferLength = 0;
let dataArray = new Uint8Array(0);
let analyser: AnalyserNode | undefined;
let track: MediaElementAudioSourceNode | undefined;
let audioElement: HTMLAudioElement | undefined;

export interface EscherOpts {
	audioSource: string;
}

export const updateEscher = (opts: Partial<EscherOpts>) => {
	if(audioElement){
		audioElement.pause();
	}
	if(opts.audioSource){
		audioElement = new Audio(opts.audioSource);
		if(!audioCtx){
			audioCtx = new AudioContext();
		}
		track = audioCtx.createMediaElementSource(audioElement);
		analyser = audioCtx.createAnalyser();
		track.connect(analyser);
		analyser.connect(audioCtx.destination);

		analyser.fftSize = 32;
		bufferLength = analyser.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);

		if (audioCtx.state === "suspended") {
			audioCtx.resume();
		}
		audioElement.play();
	}
};

export const initTalkingEscher = async (canvas: HTMLCanvasElement) => {
	if(started){
		throw new Error("Can only start Escher once");
	}
	started = true;
	const ctx = canvas.getContext("2d");
	if(!ctx){
		throw new Error("Cant initialize context");
	}
	const marisa = await loadImage(Marisa.src);
	const marisaMouth = await loadImage(MarisaMouth.src);
	const marisaEyes = await loadImage(Eyes.src);
	const marisaEyesShut = await loadImage(MarisaEyesWideShut.src);

	let i = 0;
	let mi = 0;
	let aff = 0;
	let eyesShut = 120;
	ctx.font = "12px monospace";
	ctx.fillStyle = "#fff";

	const drawFrame = () => {
		ctx.fillStyle = "#000";
		ctx.clearRect(0,0,480,640);
		ctx.fill();
		i++;

		if(analyser){
			analyser.getByteTimeDomainData(dataArray);
		}
		let avg = 0;
		for(let ii=0;ii<dataArray.length;ii++){
			avg += dataArray[ii] || 0;
		}
		avg = (128 - (avg / dataArray.length))*0.1;
		const af = Math.abs(Math.min(1,avg));
		if(af <= 0.01){
			mi++;
		} else {
			mi = 0;
		}
		aff = Math.min(1, aff*0.7 + af * 0.3);
		aff = Math.max(0, aff-0.1);
		aff = aff * (1.0/0.9);
		if(!analyser){
			aff = 0;
		}

		const ex = Math.cos(i / 19) * 8;
		const ey = Math.sin(i / 13) * 8;
		
		const f = Math.abs(Math.sin(i/5)) * aff;
		ctx.drawImage(marisaMouth, ex + 49 + Math.abs(f)*3 , ey + 350 + Math.abs(f) * 7, 300 - Math.abs(f)*4, 200 + Math.abs(f) * 19);
		let baseImg = marisa;
		if((mi > 2) && (eyesShut > 150)){
			eyesShut = 0;
		}
		if(++eyesShut < 6){
			baseImg = marisaEyesShut;
		}
		const eex = Math.cos(i/23) * 2;
		const eey = Math.sin(i/29);
		ctx.drawImage(marisaEyes, eex + ex + 118 + Math.abs(f), eey + 242 + ey, 156, 38  + Math.abs(f)*2);
		ctx.drawImage(baseImg, ex + 40 + Math.abs(f) * 2, 10 + ey, 320 - Math.abs(f)*4, 400 + Math.abs(f)*4);

		

		window.requestAnimationFrame(drawFrame);
	};
	drawFrame();
};