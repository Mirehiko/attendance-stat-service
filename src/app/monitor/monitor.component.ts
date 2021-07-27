import { Component, OnInit, Input } from "@angular/core";
import { PublicationsService } from "../publications.service";
// import { Subscription } from "rxjs";
import { Subscription, interval } from "rxjs";
import { exhaustMap } from "rxjs/operators";

@Component({
  selector: "app-monitor",
  templateUrl: "./monitor.component.html",
  styleUrls: ["./monitor.component.scss"],
})
export class MonitorComponent implements OnInit {
  @Input() commonStat: boolean;
  @Input() globPeriod: any; //remove?

  expertMode = false;
  todaytotals: any = null;
  totals: any = null;
  depth: number = 0;
  interval;

  private subscriptions: Subscription = new Subscription();

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    this.getTotals({ period: this.publicationsService.period });

    // autoload data
    this.interval = setInterval(() => {
      this.getTotals({ period: this.publicationsService.period });

      if (this.publicationsService.activeView === "common") {
        this.getTotals();
      }
      if (this.publicationsService.expertMode) {
        this.getDepth();
      }
    }, this.publicationsService.timer);

    // On period change
    this.subscriptions.add(
      this.publicationsService.periodChange.subscribe((period) => {
        this.getDepth();
        this.getTotals({ period: period });
      })
    );

    // On view change
    this.subscriptions.add(
      this.publicationsService.activeViewOb.subscribe((activeView) => {
        if (activeView === "common") {
          this.getTotals();
        }
      })
    );

    // On expert mode change
    this.subscriptions.add(
      this.publicationsService.expertModeOb.subscribe((isActive) => {
        if (isActive) {
          this.getDepth();
        }
      })
    );
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscriptions.unsubscribe();
  }

  changeMode() {
    this.expertMode = !this.expertMode;
    this.publicationsService.expertMode = this.expertMode;
    this.publicationsService.expertModeSource.next(this.expertMode);
    console.log("[INFO] expertMode changed to", this.expertMode);
  }

  getTotals(period = undefined) {
    this.subscriptions.add(
      this.publicationsService.getTotals(period).subscribe((data) => {
        if (period) {
          this.getTotalsCallback(data, "todaytotals");
        } else {
          this.getTotalsCallback(data);
        }
      })
    );
  }

  getTotalsCallback(data, period = "totals") {
    if (data.hasOwnProperty("results")) {
      this[period] = data.results[0];
    } else if (Array.isArray(data)) {
      this[period] = data;
    } else {
      //error message
    }
    // console.log(`[MONITOR] ${period}`, data);
    // console.log(`[MONITOR] ${period}`, this[period]);
  }

  getDepth() {
    this.subscriptions.add(
      this.publicationsService.getDepth().subscribe((data) => {
        this.getDepthCallback(data);
      })
    );
  }

  getDepthCallback(data, type = "MONITOR") {
    if (data.hasOwnProperty("results")) {
      data = data.results[0];
      this.depth = data.depth.toFixed(2);
      // console.log(`[${type}]`, data);
      // console.log(`[${type}]`, this.depth);
    } else {
      //error message
    }
  }
}
