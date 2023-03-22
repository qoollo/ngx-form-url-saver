import { AppComponent } from './components/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { BoldTextPipe } from './pipes/bold-text.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DisplayNavigationComponent } from './components/display-navigation/display-navigation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormUrlSaverLibModule } from 'projects/form-url-saver-lib/src/public-api';
import { FormUrlSettingsComponent } from './components/form-url-settings/form-url-settings.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MaterialProxyModule } from './shared/material-proxy/material-proxy.module';
import { NgModule } from '@angular/core';
import { SecondPageComponent } from './components/second-page/second-page.component';
import { ThirdPageComponent } from './components/third-page/third-page.component';


@NgModule({
    declarations: [
        AppComponent,
        DisplayNavigationComponent,
        HomePageComponent,
        SecondPageComponent,
        BoldTextPipe,
        FormUrlSettingsComponent,
        ThirdPageComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        FormUrlSaverLibModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialProxyModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
