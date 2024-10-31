import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  // dependency injection: httpClient
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  subsciption: Subscription | undefined;

  // constructor(private httpCLient: HttpClient) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // an observable that we can subscribe to trigger request. (get, ...) is valid too
    this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places', {
        // encapulates data within HttpResponse.body
        observe: 'response',
        // event to console get req SENT
      })
      .pipe(
        // prepares data for .subscribe.next((places)=>{this.places.set(places)})
        map((response)=>response.body?.places)
      )
      .subscribe({
        // observer object, emitted once
        next: (places) => {
          this.places.set(places);
          // console.log(event);
          // console.log(`places: ${response.body?.places}`)
        },
      });

    this.destroyRef.onDestroy(() => {
      this.subsciption?.unsubscribe();
    });
  }
}
