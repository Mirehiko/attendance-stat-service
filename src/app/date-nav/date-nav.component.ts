import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { PublicationsService } from "../publications.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-date-nav",
  templateUrl: "./date-nav.component.html",
  styleUrls: ["./date-nav.component.scss"],
})
export class DateNavComponent implements OnInit {
  @ViewChild("sideToggler") sideToggler: ElementRef;
  @ViewChild("globDate") globDate: ElementRef;
  @ViewChild("globDateCtrl") globDateCtrl: ElementRef;

  activeView: any;
  views = {
    homepage: "Итоги",
    authorspage: "Авторы",
    common: "Общая статистика",
    metrix: "Сравнение данных",
  };
  isSideOpened = false;

  pickerPeriod = {
    start: null,
    end: null,
  };

  activeTab;
  periodText;
  showPickers = false;

  //Вынести в глобальную область
  dateRestrictions = {
    minDate: new Date(2017, 1, 3),
    maxDate: new Date(),
  };

  periodStartPickerParams = {
    minDate: this.dateRestrictions.minDate,
    maxDate: this.dateRestrictions.maxDate,
    view: "day",
    inputShown: false,
    placeholder: "Начало периода (03-02-2017)",
  };
  periodEndPickerParams = {
    minDate: this.dateRestrictions.minDate,
    maxDate: this.dateRestrictions.maxDate,
    view: "day",
    inputShown: false,
    placeholder: "Конец периода (03-02-2017)",
  };

  private subscriptions: Subscription = new Subscription();

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    this.setPeriod("today");

    // On view change
    this.subscriptions.add(
      this.publicationsService.activeViewOb.subscribe((activeView) => {
        this.activeView = this.views[activeView];
      })
    );

    // On side state change
    this.subscriptions.add(
      this.publicationsService.isSideOpenedOb.subscribe((isSideOpened) => {
        console.log("isSideOpened", isSideOpened);
        this.isSideOpened = isSideOpened;
      })
    );
  }

  setPeriod(date) {
    let period;

    switch (date) {
      case "yeasterday": {
        let yeasterday = this.publicationsService.getDateAgo(new Date(), 1);
        this.activeTab = "yeasterday";
        this.periodText = "Вчера";

        period = {
          start: yeasterday,
          end: yeasterday,
        };
        this.pickerPeriod = period;
        break;
      }
      case "period": {
        if (this.pickerPeriod.start && !this.pickerPeriod.end) {
          this.pickerPeriod.end = this.pickerPeriod.start;
        }

        if (this.pickerPeriod.end && !this.pickerPeriod.start) {
          this.pickerPeriod.start = this.pickerPeriod.end;
        }

        if (!this.pickerPeriod.end && !this.pickerPeriod.start) {
          // console.log("was null!!");
          this.setPeriod("today");
          this.showPickers = false;
          break;
        }

        period = {
          start: this.pickerPeriod.start,
          end: this.pickerPeriod.end,
        };

        this.periodText = this.getDateText(period.start, period.end);
        this.activeTab = "period";
        this.showPickers = false;
        break;
      }
      default: {
        //today
        let today = new Date();
        this.activeTab = "today";
        this.periodText = "Сегодня";

        period = {
          start: today,
          end: today,
        };
        this.pickerPeriod = period;

        break;
      }
    }

    // console.log("[date-nav]", period);
    this.publicationsService.setPeriod(period);
  }

  changePickerView(): void {
    this.showPickers = !this.showPickers;
    // console.log(`[showPickers] ${this.showPickers}`);
  }

  changePeriod(type, data): void {
    this.pickerPeriod[type] = data;
    console.log(this.pickerPeriod);
  }

  // Преобразование даты к тексту сегодня/вчера
  getDateText(start, end) {
    const today = new Date();
    const yeasterday = this.publicationsService.getDateAgo(today, 1);

    const todayText = this.publicationsService.getCorrectDate(
      today,
      "dd-mm-yyyy"
    );
    const yeasterdayText = this.publicationsService.getCorrectDate(
      yeasterday,
      "dd-mm-yyyy"
    );

    const startText = this.publicationsService.getCorrectDate(
      start,
      "dd-mm-yyyy"
    );
    const endText = this.publicationsService.getCorrectDate(end, "dd-mm-yyyy");

    const isOneDay = startText === endText;
    const isToday = startText === endText && startText === todayText;
    const isYesterday = startText === endText && startText === yeasterdayText;
    const isOnlyEndToday = startText !== endText && endText === todayText;
    const isOnlyEndYesterday =
      startText !== endText && endText === yeasterdayText;

    if (isToday) {
      return "Сегодня";
    } else if (isYesterday) {
      return "Вчера";
    } else if (isOnlyEndToday) {
      return `${startText} — Сегодня`;
    } else if (isOnlyEndYesterday) {
      return `${startText} — Вчера`;
    } else if (isOneDay) {
      return startText;
    } else {
      return `${startText} — ${endText}`;
    }
  }

  toggleSideMenu() {
    this.isSideOpened = !this.isSideOpened;
    this.publicationsService.isSideOpenedSource.next(this.isSideOpened);
  }
}
