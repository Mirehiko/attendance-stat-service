import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { PublicationsService } from "../publications.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-authorbox",
  templateUrl: "./authorbox.component.html",
  styleUrls: ["./authorbox.component.scss"],
})
export class AuthorboxComponent implements OnInit {
  @Input() isActive: boolean;
  @ViewChild("averageTab") averageTab: ElementRef;

  activeTab = "common";
  authors;
  loadingAuthors = false;
  authorParams = {};
  private subscriptions: Subscription = new Subscription();

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    this.getAuthors();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  chooseTab(tab) {
    this.activeTab = tab;
  }

  getAuthors() {
    this.loadingAuthors = true;

    this.subscriptions.add(
      this.publicationsService
        .getAuthors(this.authorParams)
        .subscribe((data) => {
          this.loadingAuthors = false;
          if (data) {
            this.publicationsService.setAuthorParams(data.results);
          }
          this.authors = data;
          // console.log("[ALL_AUTHORS] getAuth2:", this.authors);
        })
    );
  }

  setAuthorPage(authorParams) {
    this.authorParams = Object.assign(this.authorParams, authorParams);
    this.getAuthors();
  }
}
