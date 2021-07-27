import { Component, OnInit, Input } from "@angular/core";
import { PublicationsService } from "../publications.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-metrix",
  templateUrl: "./metrix.component.html",
  styleUrls: ["./metrix.component.scss"],
})
export class MetrixComponent implements OnInit {
  @Input() isActive: boolean;
  totals;
  loadingData = false;
  interval;
  private subscriptions: Subscription = new Subscription();

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    this.getMetrix();

    // On period change
    this.subscriptions.add(
      this.publicationsService.periodChange.subscribe((period) => {
        if (this.publicationsService.activeView === "metrix") {
          this.getMetrix();
        }
      })
    );

    // On view change
    this.subscriptions.add(
      this.publicationsService.activeViewOb.subscribe((activeView) => {
        if (activeView === "metrix") {
          this.getMetrix();
          // autoload data
          clearInterval(this.publicationsService.interval);
          this.publicationsService.interval = setInterval(() => {
            this.getMetrix();
          }, this.publicationsService.timer);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getMetrix() {
    this.loadingData = true;

    this.subscriptions.add(
      this.publicationsService.getMetrix().subscribe((data) => {
        this.loadingData = false;

        if (data) {
          data = data.results[0];

          this.totals = [
            {
              isDesc: true,
              title: "",
              views: "Просмотры",
              visits: "Посетители",
            },
            {
              isDesc: false,
              title: "GoogleAnalitics",
              views: data.gaview,
              visits: data.gavisit,
            },
            {
              isDesc: false,
              title: "LiveInternet",
              views: data.liview,
              visits: data.liview,
            },
            {
              isDesc: false,
              title: "YandexMetrica",
              views: data.view,
              visits: data.visit,
            },
          ];
        } else {
          //error message
        }

        // console.log("[METRIX] getMetrix:", this.totals);
      })
    );
  }
}
