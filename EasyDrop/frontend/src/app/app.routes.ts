import { Routes } from '@angular/router';
import { PostsComponent } from './posts/posts.component';
import { TeamComponent } from './team/team.component';
import { KontaktComponent } from './kontakt/kontakt.component';
import { UeberUnsComponent } from './ueber-uns/ueber-uns.component';
import { LeistungComponent } from './leistung/leistung.component';
import { ArtikelComponent } from './artikel/artikel.component';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';

export const routes: Routes = [
    { path: '', component: PostsComponent },
    { path: 'posts', component: PostsComponent },
    { path: 'team', component: TeamComponent },
    { path: 'kontakt', component: KontaktComponent },
    { path: 'ueber-uns', component: UeberUnsComponent },
    { path: 'leistung', component: LeistungComponent },
    { path: 'artikel', component: ArtikelComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];
