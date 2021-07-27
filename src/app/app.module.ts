import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { FormsModule /*, ReactiveFormsModule*/ } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";

import { MainNavComponent } from "./main-nav/main-nav.component";
import { DateNavComponent } from "./date-nav/date-nav.component";
import { SourcesComponent } from "./sources/sources.component";
import { DatepickerComponent } from "./datepicker/datepicker.component";
import { AuthorboxComponent } from "./authorbox/authorbox.component";
import { StatboxComponent } from "./statbox/statbox.component";
import { MetrixComponent } from "./metrix/metrix.component";
import { MainboxComponent } from "./mainbox/mainbox.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { PreloaderComponent } from "./preloader/preloader.component";
import { AuthorAverageComponent } from "./author-average/author-average.component";
import { AuthorDetailsComponent } from "./author-details/author-details.component";
import { MonitorComponent } from "./monitor/monitor.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { SearchAuthorsComponent } from "./search-authors/search-authors.component";

const material = [MatDatepickerModule, MatNativeDateModule, MatInputModule];

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    DateNavComponent,
    SourcesComponent,
    AuthorboxComponent,
    StatboxComponent,
    MetrixComponent,
    MainboxComponent,
    PaginationComponent,
    PreloaderComponent,
    AuthorAverageComponent,
    AuthorDetailsComponent,
    MonitorComponent,
    DatepickerComponent,
    SearchAuthorsComponent,
  ],
  exports: [material],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    // ReactiveFormsModule,
    material,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
