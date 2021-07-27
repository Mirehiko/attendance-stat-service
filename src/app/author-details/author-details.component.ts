import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  // SimpleChange,
} from "@angular/core";
import { PublicationsService } from "../publications.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-author-details",
  templateUrl: "./author-details.component.html",
  styleUrls: ["./author-details.component.scss"],
})
export class AuthorDetailsComponent implements OnInit, OnChanges {
  @Input() author: any;
  @ViewChild("yearPicker") yearPicker;
  @ViewChild("yearPickerCtrl") yearPickerCtrl;
  @ViewChild("monthPicker") monthPicker;
  @ViewChild("monthPickerCtrl") monthPickerCtrl;
  @ViewChild("periodPicker") periodPicker;
  @ViewChild("periodPickerCtrl") periodPickerCtrl;

  authorData;
  periodsForCompare = [];
  private interval;

  //Вынести в глобальную область
  dateRestrictions = {
    minDate: new Date(2017, 1, 3),
    maxDate: new Date(),
  };

  activePicker = "";
  yearPickerParams = {
    minDate: this.dateRestrictions.minDate,
    maxDate: this.dateRestrictions.maxDate,
    view: "year",
    inputShown: false,
    placeholder: "Год (03-02-2017)",
  };
  monthPickerParams = {
    minDate: this.dateRestrictions.minDate,
    maxDate: this.dateRestrictions.maxDate,
    view: "month",
    inputShown: false,
    placeholder: "Месяц",
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

  ngOnChanges(changes: SimpleChanges) {
    this.resetDetails();
    // const currentAuthor: SimpleChange = changes.author;
    if (this.author) {
      // Данные за текущий день
      let today = new Date();
      this.setAveragePeriod("start", today);
      this.setPeriod("averagePeriod", "newValue");

      // Данные за текущий месяц
      this.changePeriod("month", today);
      this.setPeriod("averageMonth", "newValue");

      // Данные за текущий год
      this.changePeriod("year", today);
      this.setPeriod("averageYear", "newValue");

      // autoload data
      this.interval = setInterval(() => {
        if (this.author) {
          this.setPeriod("averagePeriod");
          this.setPeriod("averageMonth");
          this.setPeriod("averageYear");
        }
      }, this.publicationsService.timer);
    } else {
      clearInterval(this.interval);
      this.resetDetails();
    }
  }

  resetDetails(): void {
    this.authorData = {
      averageYear: {
        value: 0,
        text: "",
        textForCompare: "",
        period: {
          start: "",
          end: "",
        },
        periodText: {
          start: "",
          end: "",
        },
      },
      averageMonth: {
        value: 0,
        text: "",
        textForCompare: "",
        period: {
          start: "",
          end: "",
        },
        periodText: {
          start: "",
          end: "",
        },
      },
      averagePeriod: {
        value: 0,
        text: "",
        textForCompare: "",
        period: {
          start: "",
          end: "",
        },
        periodText: {
          start: "",
          end: "",
        },
      },
    };
    this.periodsForCompare = [];
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscriptions.unsubscribe();
  }

  changePickerView(picker): void {
    if (this.author) {
      this.activePicker = this.activePicker !== picker ? picker : "";
      console.log(`[${picker}] ${this.activePicker}`);
    }
  }

  getData(params) {
    this.subscriptions.add(
      this.publicationsService.getAuthors(params.data).subscribe((data) => {
        let dataExist = false;
        try {
          if (data.results.length) {
            dataExist = true;
          }
        } catch (error) {
          console.log(error);
        }

        if (dataExist) {
          data = data.results[0];
          this.authorData[params.type].value = data;

          const days = this.publicationsService.getDaysBetweenDates(
            this.authorData[params.type].period.start,
            this.authorData[params.type].period.end
          );

          this.authorData[params.type].value.total = (
            this.authorData[params.type].value.total / days
          ).toFixed();
        } else {
          this.authorData[params.type].value = 0;
          //show error message
        }

        // this.authorData[params.type].period.start = undefined;
        // this.authorData[params.type].period.end = undefined;

        this[params.type];
        // console.log(
        //   `[AUTHOR_DETAILS] ${params.type}`,
        //   this.authorData[params.type]
        // );
      })
    );
  }

  setAveragePeriod(type, date) {
    if (type === "start") {
      this.authorData.averagePeriod.period.start = date;
      if (!this.authorData.averagePeriod.period.end) {
        this.authorData.averagePeriod.period.end = date;
      }
    } else {
      this.authorData.averagePeriod.period.end = date;
      if (!this.authorData.averagePeriod.period.start) {
        this.authorData.averagePeriod.period.start = date;
      }
    }
    console.log(type, date, this.authorData.averagePeriod.period);
  }

  changePeriod(type, date): void {
    const today = new Date();
    const thisYear = date.getFullYear() === today.getFullYear();
    const thisMonth = date.getMonth() === today.getMonth();

    if (type === "year") {
      this.authorData.averageYear.period.start = new Date(
        date.getFullYear(),
        0,
        1
      );
      if (thisYear) {
        // Данные за текущий год
        this.authorData.averageYear.period.end = today;
      } else {
        // Данные за выбранный год
        this.authorData.averageYear.period.end = new Date(
          date.getFullYear(),
          11,
          31
        );
      }
    } else if (type == "month") {
      this.authorData.averageMonth.period.start = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      );
      if (thisYear && thisMonth) {
        // Данные за текущий месяц
        this.authorData.averageMonth.period.end = today;
      } else {
        // Данные за выбранный месяц
        const lastDay = this.publicationsService.getLastDayOfMonth(
          date.getFullYear(),
          date.getMonth()
        );
        this.authorData.averageMonth.period.end = new Date(
          date.getFullYear(),
          date.getMonth(),
          lastDay
        );
      }
    }
  }

  // type - куда, params = {start, end}
  setPeriod(type, action = "reload"): void {
    if (action !== "reload") {
      let pickerName;
      switch (type) {
        case "averageYear":
          pickerName = "yearPickerParams";
          this.authorData[
            type
          ].text = this.authorData.averageYear.period.start.getFullYear();
          this.authorData[
            type
          ].textForCompare = `${this.authorData[type].text} Год`;
          break;
        case "averageMonth":
          pickerName = "monthPickerParams";
          this.authorData[type].text = this.publicationsService.toTextFormat(
            this.authorData.averageMonth.period.start
          );
          this.authorData[type].textForCompare = `${
            this.authorData[type].text
          } ${this.authorData.averageMonth.period.start.getFullYear()}`;
          break;
        default: {
          pickerName = "periodStartPickerParams";
          const isOneDate =
            this.authorData.averagePeriod.period.start.getDate() ===
            this.authorData.averagePeriod.period.end.getDate();
          const isOneMonth =
            this.authorData.averagePeriod.period.start.getMonth() ===
            this.authorData.averagePeriod.period.end.getMonth();
          const isOneYear =
            this.authorData.averagePeriod.period.start.getFullYear() ===
            this.authorData.averagePeriod.period.end.getFullYear();

          if (isOneDate && isOneMonth && isOneYear) {
            this.authorData[
              type
            ].text = this.publicationsService.getCorrectDate(
              this.authorData.averagePeriod.period.start,
              "dd-mm-yyyy"
            );

            this.authorData[
              type
            ].textForCompare = `${this.authorData.averagePeriod.period.start.getDate()} ${this.publicationsService.toTextFormatDate(
              this.authorData.averagePeriod.period.start
            )} ${this.authorData.averagePeriod.period.start.getFullYear()}`;
          } else {
            const firstDate = this.publicationsService.getCorrectDate(
              this.authorData.averagePeriod.period.start,
              "dd-mm-yyyy"
            );
            const lastDate = this.publicationsService.getCorrectDate(
              this.authorData.averagePeriod.period.end,
              "dd-mm-yyyy"
            );
            this.authorData[type].text = `${firstDate} — ${lastDate}`;

            this.authorData[
              type
            ].textForCompare = `${this.authorData.averagePeriod.period.start.getDate()} ${this.publicationsService.toTextFormatDate(
              this.authorData.averagePeriod.period.start
            )} ${this.authorData.averagePeriod.period.start.getFullYear()} — ${this.authorData.averagePeriod.period.end.getDate()} ${this.publicationsService.toTextFormatDate(
              this.authorData.averagePeriod.period.end
            )} ${this.authorData.averagePeriod.period.end.getFullYear()}`;
          }
          break;
        }
      }

      this.authorData[
        type
      ].periodText.start = this.publicationsService.getCorrectDate(
        this.authorData[type].period.start,
        "yyyy-mm-dd"
      );
      this.authorData[
        type
      ].periodText.end = this.publicationsService.getCorrectDate(
        this.authorData[type].period.end,
        "yyyy-mm-dd"
      );
      this[pickerName].opened = false;
    }

    // вызывать по кнопке применить/показать
    // console.log(type, this.authorData[type].period);
    this.getData({
      type: type,
      data: {
        authorAID: this.author.aid,
        period: this.authorData[type].periodText,
      },
    });
  }

  // Добавить период к сравнению
  addPeriod(periodName): void {
    this.periodsForCompare.push({
      period: this.authorData[periodName].textForCompare,
      total: this.authorData[periodName].value.total,
    });
  }

  // Удалить период из сравнения
  removePeriod(periodIndex): void {
    this.periodsForCompare.splice(periodIndex, 1);
  }
}
