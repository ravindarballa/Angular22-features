import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Movies } from './pages/movies/movies';

export const routes: Routes = [
    {path:"", redirectTo:"dashboard", pathMatch:"full"},
    {path:"dashboard", component:Dashboard},
    {path:"movies", component:Movies},
    {path:"**", redirectTo:"dashboard"}

];
