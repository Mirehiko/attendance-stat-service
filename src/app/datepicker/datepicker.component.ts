import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PublicationsService } from "../publications.service";

import { FormControl } from "@angular/forms";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";

export const MY_FORMATS = {
  parse: {
    dateInput: "DD-MM-YYYY",
  },
  display: {
    dateInput: "DD-MM-YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

// import * as _moment from "moment";
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from "moment";
// import { default as _rollupMoment, Moment } from "moment";

// const moment = _rollupMoment || _moment;

@Component({
  selector: "app-datepicker",
  templateUrl: "./datepicker.component.html",
  styleUrls: ["./datepicker.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatepickerComponent implements OnInit {
  @Input() params: any;
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();
  maxDate: Date;
  minDate: Date;

  events: string[] = [];

  onDateChange($event) {
    const formatted = $event.value.format("YYYY-MM-DD");
    $event.target.value = formatted;
    // console.log(`[datepicker]: `, $event.value);
    // console.log(`[datepicker]: `, $event.value._d);
    this.dateChange.emit($event.value._d);
  }

  // chosenMonthHandler($event, datepicker: MatDatepicker<Moment>) {
  //   const formatted = $event.value.format("YYYY-MM-DD");
  //   $event.target.value = formatted;
  //   console.log(`[datepicker]: `, $event.value);
  //   console.log(`[datepicker]: `, $event.value._d);
  //   this.dateChange.emit($event.value._d);
  //   datepicker.close();
  // }

  // chosenYearHandler($event, datepicker: MatDatepicker<Moment>) {
  //   const formatted = $event.value.format("YYYY-MM-DD");
  //   $event.target.value = formatted;
  //   this.dateChange.emit($event.value._d);
  //   datepicker.close();
  // }

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    if (this.params.minDate) {
      this.minDate = this.params.minDate;
    }
    if (this.params.maxDate) {
      this.maxDate = this.params.maxDate;
    }
  }

  // // Разделить строку с датами
  // splitDates(text, format) {
  //   let dates = text.split(",");

  //   for (let i = 0; i < dates.length; i++) {
  //     dates[i] = this.dateReplace(dates[i], format);
  //   }
  //   return dates;
  // }

  // // Перестановка компонентов даты и замена разделителей
  // dateReplace(text, format) {
  //   //dd.mm.yyyy => yyyy-mm-dd
  //   switch (format) {
  //     case "yyyy-mm-dd": {
  //       return text.replace(/(\d+)[.](\d+)[.](\d+)/, "$3-$2-$1");
  //     }
  //     case "dd-mm-yyyy": {
  //       return text.replace(/(\d+)[.](\d+)[.](\d+)/, "$1-$2-$3");
  //     }
  //   }
  // }
}
