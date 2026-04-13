// functions/src/tts.ts
import { protos } from "@google-cloud/text-to-speech";
import { ttsClient } from "./shared";

export const VOICE_POOLS = [
  { A: { name: "en-US-Neural2-D", gender: "MALE", hostName: "Alex" },   B: { name: "en-US-Neural2-F", gender: "FEMALE", hostName: "Sam" } },
  { A: { name: "en-US-Neural2-I", gender: "MALE", hostName: "Marcus" }, B: { name: "en-US-Neural2-C", gender: "FEMALE", hostName: "Elena" } },
  { A: { name: "en-US-Neural2-J", gender: "MALE", hostName: "David" },  B: { name: "en-US-Neural2-H", gender: "FEMALE", hostName: "Chloe" } },
  { A: { name: "en-US-Journey-D", gender: "MALE", hostName: "James" },  B: { name: "en-US-Journey-F", gender: "FEMALE", hostName: "Sarah" } }
];

export type VoiceConfig = typeof VOICE_POOLS[0];

export async function synthesizePodcastAudio(
  script: { speaker: string; text: string }[],
  voiceConfig: VoiceConfig
): Promise<Buffer> {
  const voices: Record<string, protos.google.cloud.texttospeech.v1.IVoiceSelectionParams> = {
    A: { languageCode: "en-US", name: voiceConfig.A.name, ssmlGender: voiceConfig.A.gender as any },
    B: { languageCode: "en-US", name: voiceConfig.B.name, ssmlGender: voiceConfig.B.gender as any },
  };

  const audioChunks: Buffer[] = [];

  for (const line of script) {
    const speakerKey =
      line.speaker === "B" || /^(sam|elena|chloe|sarah|host\s*b)/i.test(line.speaker) ? "B" : "A";
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

    const [response] = await ttsClient.synthesizeSpeech({
      input: { ssml: `<speak>${ssmlText}</speak>` },
      voice,
      audioConfig: {
        audioEncoding: "MP3" as any,
        speakingRate: 1.05,
      },
    });

    if (response.audioContent) {
      audioChunks.push(Buffer.from(response.audioContent as Uint8Array));
    }
  }

  return Buffer.concat(audioChunks);
}
