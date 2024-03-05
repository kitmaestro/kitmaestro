import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  QueryConstraint,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { DidacticResource } from '../interfaces/didactic-resource';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { OrderByOption, ResourceFilterOptions } from '../interfaces/resource-filter-options';
import { UserSettingsService } from './user-settings.service';
import { UserSettings } from '../interfaces/user-settings';

@Injectable({
  providedIn: 'root'
})
export class DidacticResourceService {

  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private userSettingsService = inject(UserSettingsService);

  private userSettings: UserSettings | null = null;
  private userSettings$ = this.userSettingsService.getSettings();
  private didacticResourcesColRef = collection(this.firestore, 'didactic-resources');
  didacticResources$ = collectionData(this.didacticResourcesColRef, { idField: 'id' }) as Observable<DidacticResource[]>;
  resources: DidacticResource[] = [];

  constructor() {
    this.userSettings$.subscribe(settings => {
      this.userSettings = settings;
    });
    const sus = this.didacticResources$.subscribe({
      next: (resources) => {
        this.resources = resources;
        sus.unsubscribe();
      },
      error: (err) => {
      }
    });
  }

  private updateUserSettings(property: 'likes' | 'dislikes' | 'bookmarks', resource: string) {
    if (!this.userSettings)
      return;

    if (property == 'likes') {
      const likedResources = this.userSettings.likedResources;
      likedResources.push(resource);
      return updateDoc(doc(this.firestore, 'user-settings/' + this.userSettings.id), { likedResources });
    }

    if (property == 'dislikes') {
      const dislikedResources = this.userSettings.dislikedResources;
      dislikedResources.push(resource);
      return updateDoc(doc(this.firestore, 'user-settings/' + this.userSettings.id), { dislikedResources });
    }

    const bookmarks = this.userSettings.bookmarks;
    bookmarks.push(resource);
    return updateDoc(doc(this.firestore, 'user-settings/' + this.userSettings.id), { bookmarks });
  }

  async addResource(resource: DidacticResource, file: File): Promise<Observable<DocumentReference>> {
    const docRef = ref(this.storage, file.name);
    uploadBytesResumable(docRef, file);
    const downloadLink = await getDownloadURL(docRef);
    resource.downloadLink = downloadLink;
    return from(addDoc(this.didacticResourcesColRef, resource));
  }

  removeResource(resourceId: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'didactic-resources/' + resourceId)));
  }

  filterResources(options: ResourceFilterOptions, sorting: OrderByOption) {
    const filters: QueryConstraint[] = [];

    if (options.topics) {
      filters.push(where('topic', 'in', options.topics));
    }
    if (options.grades) {
      filters.push(where('grade', 'in', options.grades));
    }
    if (options.subjects) {
      filters.push(where('subject', 'in', options.subjects));
    }

    this.didacticResources$ = (collectionData(query(this.didacticResourcesColRef, ...filters)) as Observable<DidacticResource[]>).pipe(
      map(resources => {
        return resources.sort((a, b) => {
          switch (sorting) {
            case OrderByOption.TitleAsc:
              return a.title.localeCompare(b.title);
            case OrderByOption.TitleDesc:
              return b.title.localeCompare(a.title);
            case OrderByOption.LikesDesc:
              return b.likes - a.likes;
            case OrderByOption.DownloadsDesc:
              return b.downloads - a.downloads;
            case OrderByOption.NewestFirst:
              return new Date(b.id).getTime() - new Date(a.id).getTime();
            default:
              return 0;
          }
        })
      })
    );
  }

  likeResource(resourceId: string) {
    const docRef = doc(this.firestore, 'didactic-resource/' + resourceId);
    const sus = (docData(docRef, { idField: 'id' }) as Observable<DidacticResource>).subscribe(resource => {
      const likes = resource.likes + 1;
      updateDoc(docRef, { likes: likes }).then(() => {
        this.updateUserSettings('likes', resource.id);
        sus.unsubscribe();
      });
    });
  }

  dislikeResource(resourceId: string) {
    const docRef = doc(this.firestore, 'didactic-resource/' + resourceId);
    const sus = (docData(docRef, { idField: 'id' }) as Observable<DidacticResource>).subscribe(resource => {
      const dislikes = resource.dislikes + 1;
      updateDoc(docRef, { dislikes: dislikes }).then(() => {
        this.updateUserSettings('dislikes', resource.id);
        sus.unsubscribe();
      });
    });
  }

  downloadResource(resourceId: string) {
    const docRef = doc(this.firestore, 'didactic-resource/' + resourceId);
    const sus = (docData(docRef, { idField: 'id' }) as Observable<DidacticResource>).subscribe(resource => {
      const downloads = resource.downloads + 1;
      updateDoc(docRef, { downloads: downloads }).then(() => {
        sus.unsubscribe();
      });
    });
  }

  bookmarkResource(resourceId: string) {
    const docRef = doc(this.firestore, 'didactic-resource/' + resourceId);
    const sus = (docData(docRef, { idField: 'id' }) as Observable<DidacticResource>).subscribe(resource => {
      const bookmarks = resource.bookmarks + 1;
      updateDoc(docRef, { bookmarks: bookmarks }).then(() => {
        this.updateUserSettings('bookmarks', resource.id);
        sus.unsubscribe();
      });
    });
  }
}
