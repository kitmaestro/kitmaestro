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
import { Auth, authState } from '@angular/fire/auth';
import { settings } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class DidacticResourceService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private storage = inject(Storage);
  private userSettingsService = inject(UserSettingsService);

  private userSettings: UserSettings | null = null;
  private userSettings$ = this.userSettingsService.getSettings();
  private didacticResourcesColRef = collection(this.firestore, 'didactic-resources');
  didacticResources$ = collectionData(this.didacticResourcesColRef, { idField: 'id' }) as Observable<DidacticResource[]>;
  resources: DidacticResource[] = [];

  constructor() {
    authState(this.auth).subscribe(user => {
      if (user) {
        (collectionData(
          query(
            collection(this.firestore, 'user-settings'),
            where('uid', '==', user.uid)
            ),
            { idField: 'id' }
          ) as Observable<UserSettings[]>
        ).subscribe(settings => {
          this.userSettings = settings[0];
        });
      }
    })
    const sus = this.didacticResources$.subscribe({
      next: (resources) => {
        this.resources = resources;
        sus.unsubscribe();
      },
      error: (err) => {
      }
    });
  }

  private updateUserSettings(property: 'likes' | 'dislikes' | 'bookmarks', resource: string): number {
    if (!this.userSettings)
      return 0;
    
    let likedResources: string[] = this.userSettings.likedResources;
    let dislikedResources: string[] = this.userSettings.dislikedResources;
    let res = 0;

    if (!likedResources) {
      likedResources = [];
    }
    if (!dislikedResources) {
      dislikedResources = [];
    }

    if (property == 'likes') {
      if (!likedResources.includes(resource)) {
        likedResources.push(resource);
        res = 1;
      }
      if (dislikedResources.includes(resource)) {
        dislikedResources = dislikedResources.filter(d => d != resource);
      }
      updateDoc(doc(this.firestore, 'user-settings/' + this.userSettings.id), { likedResources, dislikedResources }).then(() => {});
      return res;
    }

    if (property == 'dislikes') {
      if (!dislikedResources.includes(resource)) {
        dislikedResources.push(resource);
        res = 1;
      }
      if (likedResources.includes(resource)) {
        likedResources = likedResources.filter(r => r != resource);
      }
      updateDoc(doc(this.firestore, 'user-settings/' + this.userSettings.id), { dislikedResources, likedResources }).then(() => {});
      return res;
    }

    let bookmarks: string[] = this.userSettings.bookmarks;
    if (!bookmarks) {
      bookmarks = [];
    }
    if (bookmarks.includes(resource)) {
      bookmarks = bookmarks.filter(b => b != resource);
      res = -1;
    } else {
      bookmarks.push(resource);
      res = 1;
    }
    updateDoc(doc(this.firestore, 'user-settings/' + this.userSettings.id), { bookmarks }).then(() => { });
    return res;
  }

  resourcesByUser(author: string) {
    return collectionData(query(this.didacticResourcesColRef, where('author', '==', author))) as Observable<DidacticResource[]>;
  }

  async addResource(resource: DidacticResource, file?: File): Promise<Observable<DocumentReference>> {
    if (file) {
      const docRef = ref(this.storage, file.name);
      await uploadBytesResumable(docRef, file);
      const downloadLink = await getDownloadURL(docRef);
      resource.downloadLink = downloadLink;
    }
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

    return this.didacticResources$;
  }

  likeResource(resourceId: string) {
    const docRef = doc(this.firestore, 'didactic-resources/' + resourceId);
    const sus = (docData(docRef, { idField: 'id' }) as Observable<DidacticResource>).subscribe(resource => {
      const likes = resource.likes + 1;
      updateDoc(docRef, { likes: likes }).then(() => {
        sus.unsubscribe();
        this.updateUserSettings('likes', resource.id);
      });
    });
  }

  dislikeResource(resourceId: string) {
    const docRef = doc(this.firestore, 'didactic-resources/' + resourceId);
    const sus = (docData(docRef, { idField: 'id' }) as Observable<DidacticResource>).subscribe(resource => {
      const dislikes = resource.dislikes + 1;
      updateDoc(docRef, { dislikes: dislikes }).then(() => {
        sus.unsubscribe();
        this.updateUserSettings('dislikes', resource.id);
      });
    });
  }

  downloadResource(resourceId: string) {
    const docRef = doc(this.firestore, 'didactic-resources/' + resourceId);
    const sus = (docData(docRef, { idField: 'id' }) as Observable<DidacticResource>).subscribe(resource => {
      const downloads = resource.downloads + 1;
      updateDoc(docRef, { downloads: downloads }).then(() => {
        sus.unsubscribe();
      });
    });
  }

  bookmarkResource(resourceId: string) {
    const docRef = doc(this.firestore, 'didactic-resources/' + resourceId);
    const sus = (docData(docRef, { idField: 'id' }) as Observable<DidacticResource>).subscribe(resource => {
      sus.unsubscribe();
      const res: number = this.updateUserSettings('bookmarks', resource.id);
      const bookmarks = resource.bookmarks + res;
      updateDoc(docRef, { bookmarks: bookmarks }).then(() => {
      });
    });
  }
}
