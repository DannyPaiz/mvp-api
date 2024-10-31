import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { Subscription, catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  // dependency injection: httpClient
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  // subsciption: Subscription | undefined; // fix until const subscription = this.httpClient was added, did not need this anymore

  // constructor(private httpCLient: HttpClient) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isFetching.set(true);
    // an observable that we can subscribe to trigger request. (get, ...) is valid too
    const subsciption = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places', {
        // encapulates data within HttpResponse.body
        observe: 'response',
        // event to console get req SENT
      })
      .pipe(
        // prepares data for .subscribe.next((places)=>{this.places.set(places)})
        map((response) => response.body?.places),
        catchError((error) => {
          console.log(error);
          return throwError(
            () => new Error('Something occurred while fetching places..')
          );
        })
      )
      .subscribe({
        // observer object, emitted once
        next: (places) => {
          this.places.set(places);
          // console.log(event);
          // console.log(`places: ${response.body?.places}`)
        },
        error: (error: Error) => {
          // using signal
          // console.log(error); // details of error
          this.error.set(error.message);
        },
        // guaranteed to run once, when req is done
        complete: () => {
          this.isFetching.set(false);
        },
      });

    this.destroyRef.onDestroy(() => {
      subsciption?.unsubscribe();
    });
  }


  // sets value of placeId
  onSelectPlace(selectedPlace: Place) {
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id
    })
    .subscribe({
      next: (resData) => console.log(resData),
    }); // triggers the PUT request
  }

}
