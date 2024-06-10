import React, { useEffect, useRef } from "react";
import { initTalkingEscher, updateEscher } from "./Escher";

interface EscherProps {
	audio: string;
}

export const TalkingEscher: React.FC<EscherProps> = ({audio}) => {
	const canvasRef:any = useRef(null);

	const start = () => {
		updateEscher({
			audioSource: audio
		});
	};

	useEffect(() => {
		setTimeout(() => {
			if(canvasRef.current){
				initTalkingEscher(canvasRef.current);
			}
		},10);
	});

	return <div onClick={start}>
		<canvas ref={canvasRef} width={400} height={600}></canvas>
	</div>
};