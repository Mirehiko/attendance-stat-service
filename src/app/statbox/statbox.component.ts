import { Component, OnInit, Input } from "@angular/core";
import { PublicationsService } from "../publications.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-statbox",
  templateUrl: "./statbox.component.html",
  styleUrls: ["./statbox.component.scss"],
})
export class StatboxComponent implements OnInit {
  @Input() isActive: boolean;
  publications;
  loadingPub = false;
  publParams = {};

  subscriptions: Subscription = new Subscription();

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    this.getPublications();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setPublPage(pageParams) {
    this.publParams = Object.assign(this.publParams, pageParams);
    this.getPublications();
  }

  getPublications() {
    this.loadingPub = true;

    this.subscriptions.add(
      this.publicationsService
        .getPublications(this.publParams)
        .subscribe((data) => {
          this.loadingPub = false;
          if (data) {
            this.publicationsService.convertData(data.results);
          }
          this.publications = data;
          // console.log("[common] getPub:", this.publications);
        })
    );
  }
}
