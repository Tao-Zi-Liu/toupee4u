"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOICE_POOLS = void 0;
exports.synthesizePodcastAudio = synthesizePodcastAudio;
const shared_1 = require("./shared");
exports.VOICE_POOLS = [
    { A: { name: "en-US-Neural2-D", gender: "MALE", hostName: "Alex" }, B: { name: "en-US-Neural2-F", gender: "FEMALE", hostName: "Sam" } },
    { A: { name: "en-US-Neural2-I", gender: "MALE", hostName: "Marcus" }, B: { name: "en-US-Neural2-C", gender: "FEMALE", hostName: "Elena" } },
    { A: { name: "en-US-Neural2-J", gender: "MALE", hostName: "David" }, B: { name: "en-US-Neural2-H", gender: "FEMALE", hostName: "Chloe" } },
    { A: { name: "en-US-Journey-D", gender: "MALE", hostName: "James" }, B: { name: "en-US-Journey-F", gender: "FEMALE", hostName: "Sarah" } }
];
async function synthesizePodcastAudio(script, voiceConfig) {
    const voices = {
        A: { languageCode: "en-US", name: voiceConfig.A.name, ssmlGender: voiceConfig.A.gender },
        B: { languageCode: "en-US", name: voiceConfig.B.name, ssmlGender: voiceConfig.B.gender },
    };
    const audioChunks = [];
    for (const line of script) {
        const speakerKey = line.speaker === "B" || /^(sam|elena|chloe|sarah|host\s*b)/i.test(line.speaker) ? "B" : "A";
        const voice = voices[speakerKey];
        const truncatedText = line.text.slice(0, 800);
        const ssmlText = truncatedText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\. /g, '.<break time="400ms"/> ')
            .replace(/\? /g, '?<break time="400ms"/> ')
            .replace(/! /g, '!<break time="400ms"/> ')
            .replace(/\.\.\. /g, '...<break time="600ms"/> ')
            .replace(/, /g, ',<break time="150ms"/> ');
        const [response] = await shared_1.ttsClient.synthesizeSpeech({
            input: { ssml: `<speak>${ssmlText}</speak>` },
            voice,
            audioConfig: {
                audioEncoding: "MP3",
                speakingRate: 1.05,
            },
        });
        if (response.audioContent) {
            audioChunks.push(Buffer.from(response.audioContent));
        }
    }
    return Buffer.concat(audioChunks);
}
//# sourceMappingURL=tts.js.map