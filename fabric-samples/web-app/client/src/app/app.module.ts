import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialUIModule } from './ng-material-ui/ng-material-ui.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from './dialog/dialog.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CompanyDetailsComponent } from './company-details/company-details.component';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        CompanyDetailsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,

        MatToolbarModule,
        MatIconModule,
        NgMaterialUIModule,
        FormsModule,
        ReactiveFormsModule,

        DialogModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
