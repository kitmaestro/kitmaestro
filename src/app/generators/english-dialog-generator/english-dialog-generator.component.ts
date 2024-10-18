import { Component, inject } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { MatButtonModule } from '@angular/material/button';
import { kindergartenDialogs } from '../../data/kindergarten-conversations';
import { EnglishConversation } from '../../interfaces/english-conversation';
import { easySpeakConversations } from '../../data/easyspeak-conversations';
import { easyDialogsConversations } from '../../data/easydialogs-conversations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-english-dialog-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './english-dialog-generator.component.html',
  styleUrl: './english-dialog-generator.component.scss'
})
export class EnglishDialogGeneratorComponent {
  fb = inject(FormBuilder);
  sb = inject(MatSnackBar);
  aiService = inject(AiService);

  generating = false;
  conversation: EnglishConversation | null = null;

  dialogLevels = [
    'Kindergarten',
    'Elementary',
    'Intermediate'
  ];

  generatorForm = this.fb.group({
    level: [0, Validators.required],
    topic: [''],
    useAi: [false]
  })

  get topics(): string[] {
    const { level } = this.generatorForm.value;
    if (level == 1) {
      return easySpeakConversations.map(d => d.topic).reduce((prev: string[], curr: string) => {
        if (prev.includes(curr)) {
          return prev;
        } else {
          prev.push(curr)
          return prev;
        }
      }, [] as string[]);
    } else if (level == 2) {
      return easyDialogsConversations.map(d => d.topic).reduce((prev: string[], curr: string) => {
        if (prev.includes(curr)) {
          return prev;
        } else {
          prev.push(curr)
          return prev;
        }
      }, [] as string[]);
    }
    return [];
  }

  randomKinderDialog(): EnglishConversation {
    const index = Math.round(Math.random() * (kindergartenDialogs.length - 1));
    return kindergartenDialogs[index];
  }

  randomEasySpeakDialog(topic?: string): EnglishConversation {
    const filtered = topic ? easySpeakConversations.filter(c => c.topic == topic) : easyDialogsConversations;
    const index = Math.round(Math.random() * (filtered.length - 1));
    const dialog = filtered[index];
    dialog.talk.sort((a,b) => a.id - b.id);
    return dialog;
  }

  randomEasyDialog(topic?: string): EnglishConversation {
    const filtered = topic ? easyDialogsConversations.filter(c => c.topic == topic) : easyDialogsConversations;
    const index = Math.round(Math.random() * (filtered.length - 1));
    const dialog = filtered[index];
    dialog.talk.sort((a,b) => a.id - b.id);
    return dialog;
  }

  generateConversationWithAI(topic: string, level: string, lines = 8) {
    this.aiService.geminiAi(`Write a ${level.toLowerCase()} level conversation between A and B about ${topic || 'anything'} with ${lines / 2} for each one. Your response must be a valid JSON with this interface: { dialog: { order: number, a?: string, b?: string }[], title: string }`).subscribe({
      next: result => {
        try {
          const { response } = result;
          const extract = response.slice(response.indexOf('{'), response.lastIndexOf('}') + 1);
          console.log(extract)
          const conversation = JSON.parse(extract) as { dialog: { order: number, a?: string, b?: string }[], title: string };
          console.log(conversation)
          this.conversation = {
            id: 0,
            level: this.generatorForm.get('level')?.value || 1,
            talk: conversation.dialog.map(d => ({ ...d, id: d.order })),
            title: conversation.title,
            topic,
          };
          this.generating = false;
        } catch (error) {
          this.sb.open('Hubo un error generando la conversación.', 'Ok', { duration: 3000 })
          console.log(error)
          this.generating = false;
        }
      },
      error: err => {
        this.sb.open('Hubo un error generando la conversación.', 'Ok', { duration: 3000 })
        console.log(err.message)
        this.generating = false;
      }
    });
  }

  onSubmit() {
    const { level, useAi, topic } = this.generatorForm.value;
    this.generating = true;

    const topics = [
      "Jobs",
      "School",
      "Housing",
      "Bus",
      "Network",
      "Bank",
      "Dating",
      "Driving",
      "Shop",
      "Sports",
      "Social",
      "Daily Life",
      "Family",
      "Food",
      "Eat Outside",
      "Health",
      "Nature",
      "Safety",
      "Voting",
      "Daily Life",
      "School Life",
      "Transportation",
      "Entertainment",
      "Dating",
      "Restaurant",
      "Sports",
      "Safety",
      "Travel",
      "Jobs",
      "Food",
      "Housing",
      "Health"
    ];

    const pickedTopic = topic ? topic : topics[Math.round(Math.random() * (topics.length - 1))];

    if (useAi) {
      this.generateConversationWithAI(pickedTopic.toLowerCase(), this.dialogLevels[level || 0], level == 0 ? 8 : level == 1 ? 12 : 16);
    } else {
      if (level == 0) {
        this.conversation = this.randomKinderDialog();
        this.generating = false;
      } else if (level == 1) {
        this.conversation = this.randomEasySpeakDialog(pickedTopic);
        this.generating = false;
      } else {
        this.conversation = this.randomEasyDialog(pickedTopic);
        this.generating = false;
      }
    }
  }
}
