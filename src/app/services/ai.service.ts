import { Injectable } from '@angular/core';
import { GradePeriod } from '../interfaces/grade-period';
import { HfInference } from '@huggingface/inference';
// import { ModelEntry, listModels } from '@huggingface/hub';
import { Text2TextGenerationPipeline, pipeline } from '@xenova/transformers';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private models = {
    textToImage: 'stabilityai/stable-diffusion-xl-base-1.0',
    text2TextGeneration: 'google/flan-t5-xxl',
    textGeneration: [
      "bigcode/starcoder",
      "meta-llama/Llama-2-7b-chat-hf",
      "mistralai/Mistral-7B-v0.1",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "microsoft/phi-2"
    ],
  }
  private token = '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'
  private inference = new HfInference(this.token);

  constructor() { }

  async generateText(input: string) {
    const randomPick = Math.round(Math.random() * (this.models.textGeneration.length - 1));
    const pipe = await pipeline('text-generation', this.models.textGeneration[randomPick]);
    const response = await pipe(input);
    return response;
  }

  getTextGenerator(): Observable<Text2TextGenerationPipeline> {
    return from(pipeline('text2text-generation', this.models.text2TextGeneration));
  }

  private getAgent() {
    // const agent = new HfAgent(
    //   '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',
    //   LLMFromHub('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'),
    //   [...defaultTools]
    // );

    // agent.generateCode("Write a javascript function to generate a random number between two given numbers").then(res => {
    //   console.log(res)
    // })
  }

  private async inferenceEnabled(modelName: string) {
    const res = await fetch(`https://api-inference.huggingface.co/status/${modelName}`);
    const data = await res.json();
    return data.state == 'Loadable';
  }

  // async research(task = 'text-to-image', minLikes = 1000) {
  //   const models: ModelEntry[] = [];

  //   for await (const model of listModels({
  //     credentials: {
  //       accessToken: this.token
  //     },
  //     search: {
  //       task: task as any,
  //     }
  //   })) {
  //     if (model.likes < minLikes)
  //       continue;

  //     if (await this.inferenceEnabled(model.name))
  //       models.push(model);
  //   }
  //   console.log(models)
  // }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  async generateImage(inputs: string) {
    const res = await this.inference.textToImage({
      model: this.models.textToImage,
      inputs
    })

    return await this.blobToBase64(res);
  }

  generatePeriod(config: { average?: number, min: number, max: number, elements: number, minGrade: number }): GradePeriod[] {
    const { average, min, max, elements, minGrade } = config;

    const range = max - min;

    const grades: { p: number, rp: number }[] = [];

    for (let i = 0; i < elements; i++) {
      const p = Math.round((Math.random() * range) + min);
      const rp = p < minGrade ? Math.round((Math.random() * range) + p) : 0;
      grades.push({ p, rp });
    }

    if (average) {
      let currentAverage: number = Math.round(grades.reduce((acc, curr) => acc + (curr.rp > 0 ? curr.rp : curr.p), 0) / elements);
      let adjustment: number = average - currentAverage;
      let adjustedNumbers: GradePeriod[] = grades.map(num => num.rp > 0 ? ({ rp: num.rp + adjustment, p: num.p }) : ({ p: num.p + adjustment, rp: 0 }));
  
      while (true) {
        currentAverage = Math.round(adjustedNumbers.reduce((acc, curr) => acc + (curr.rp > 0 ? curr.rp : curr.p), 0) / elements);
        if (currentAverage == average) {
          break;
        }
        adjustment = average - currentAverage;
        adjustedNumbers = grades.map(num => num.rp > 0 ? ({ rp: num.rp + adjustment, p: num.p }) : ({ p: num.p + adjustment, rp: 0 }));;
      }
      return adjustedNumbers;
    }

    return grades;
  }
}
