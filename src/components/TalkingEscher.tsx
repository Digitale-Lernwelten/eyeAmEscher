import React, { useRef } from "react";
import { initTalkingEscher } from "./Escher";

interface EscherProps {
	audio: string;
}

export const TalkingEscher: React.FC<EscherProps> = ({audio}) => {
	const canvasRef:any = useRef(null);
	const audioRef:any = useRef(null);

	const start = () => {
		if(canvasRef.current && audioRef.current){
			initTalkingEscher(canvasRef.current, audioRef.current);
		}
	}

	return <div onClick={start}>
		<h3>Click to Start!</h3>
		<canvas ref={canvasRef} width={480} height={640}></canvas>
		<audio ref={audioRef} src={audio} style={{display: "none"}}></audio>
	</div>
};