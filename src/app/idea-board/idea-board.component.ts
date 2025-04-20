import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Idea } from '../interfaces/idea';
import { IdeaService } from '../services/idea.service';
import { UserSettings } from '../interfaces/user-settings';
import { UserSettingsService } from '../services/user-settings.service';

@Component({
  selector: 'app-idea-board',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './idea-board.component.html',
  styleUrl: './idea-board.component.scss'
})
export class IdeaBoardComponent implements OnInit {
  private ideaService = inject(IdeaService);
  private fb = inject(FormBuilder);
  private userSettingsService = inject(UserSettingsService);
  
  ideas: Idea[] = [];
  user: UserSettings | null = null;
  ideaForm = this.fb.group({
    user: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  loadIdeas() {
    this.ideaService.findAll().subscribe({
      next: ideas => {
        this.ideas = ideas;
      }
    });
  }

  ngOnInit() {
    this.loadIdeas();
    this.userSettingsService.getSettings().subscribe({
      next: user => {
        this.user = user;
        this.ideaForm.get('user')?.setValue(user._id);
      }
    });
  }

  addIdea() {
    const idea: any = this.ideaForm.value;
    idea.votes = [];
    this.ideaService.create(idea).subscribe({
      next: () => {
        this.loadIdeas();
        this.ideaForm.setValue({ user: idea.user, title: '', description: '' });
      }
    });
  }

  like(idea: Idea) {
    if (!this.user)
      return;

    const votes: { user: string, like: boolean }[] = idea.votes.filter(v => v.user != this.user?._id);
    votes.push({
      user: this.user._id,
      like: true,
    });

    this.ideaService.update(idea._id, { votes }).subscribe({
      next: () => {
        this.loadIdeas();
      }
    });
  }

  dislike(idea: Idea) {
    if (!this.user)
      return;

    const votes: { user: string, like: boolean }[] = idea.votes.filter(v => v.user != this.user?._id);
    votes.push({
      user: this.user._id,
      like: false,
    });

    this.ideaService.update(idea._id, { votes }).subscribe({
      next: () => {
        this.loadIdeas();
      }
    });
  }

  likes(idea: Idea) {
    return idea.votes.filter(v => v.like === true).length;
  }

  dislikes(idea: Idea) {
    return idea.votes.filter(v => v.like === false).length;
  }

  didIVoteIt(idea: Idea) {
    return idea.votes.some(v => v.user === this.user?._id);
  }

  iLikedIt(idea: Idea) {
    return idea.votes.some(v => v.user === this.user?._id && v.like === true);
  }

  iDislikedIt(idea: Idea) {
    return idea.votes.some(v => v.user === this.user?._id && v.like === false);
  }
}
