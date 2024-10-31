import { bootstrapApplication } from '@angular/platform-browser';
// application wide HTTP client provider
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';


bootstrapApplication(AppComponent, {
    providers: [provideHttpClient()]
}).catch((err) => console.error(err));
