import { Component, ViewChild, HostListener } from "@angular/core";
import { PublicationsService } from "./publications.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Статистика";
  activeView = "homepage";

  selectedDate = new Date();

  setView(view) {
    this.activeView = view;
  }

  constructor(private publicationsService: PublicationsService) {}

  @ViewChild("sideMenu") sideMenu: any;
  @ViewChild("dateNav") dateNav: any;
  @ViewChild("authorsView") authorsView: any;

  @HostListener("click", ["$event"]) onClick(e) {
    const isNotMenuToggler = !this.dateNav.sideToggler.nativeElement.contains(
      e.target
    );
    const isNotSideMenu = !this.sideMenu.sideMenu.nativeElement.contains(
      e.target
    );
    const isSideOpened = this.sideMenu.isSideOpened;
    if (isNotSideMenu && isNotMenuToggler && isSideOpened) {
      this.publicationsService.isSideOpenedSource.next(false);
    }

    const isPickerShown = this.dateNav.showPickers;
    const isNotDatePickCtrl = !this.dateNav.globDateCtrl.nativeElement.contains(
      e.target
    );
    const isNotDatePick = isPickerShown
      ? !this.dateNav.globDate.nativeElement.contains(e.target)
      : true;

    if (isNotDatePickCtrl && isNotDatePick && isPickerShown) {
      this.dateNav.showPickers = false;
    }

    try {
      const details = this.authorsView.averageTab.details;
      const activePicker = details.activePicker;
      const isNotYearPicker =
        activePicker == "yearPicker"
          ? !details.yearPicker.nativeElement.contains(e.target)
          : true;
      const isNotMonthPicker =
        activePicker == "monthPicker"
          ? !details.monthPicker.nativeElement.contains(e.target)
          : true;
      const isNotPeriodPicker =
        activePicker == "periodPicker"
          ? !details.periodPicker.nativeElement.contains(e.target)
          : true;
      const isNotYearPickerCtrl =
        activePicker == "yearPicker"
          ? !details.yearPickerCtrl.nativeElement.contains(e.target)
          : true;
      const isNotMonthPickerCtrl =
        activePicker == "monthPicker"
          ? !details.monthPickerCtrl.nativeElement.contains(e.target)
          : true;
      const isNotPeriodPickerCtrl =
        activePicker == "periodPicker"
          ? !details.periodPickerCtrl.nativeElement.contains(e.target)
          : true;

      const isNotYear = isNotYearPicker && isNotYearPickerCtrl;
      const isNotMonth = isNotMonthPicker && isNotMonthPickerCtrl;
      const isNotPeriod = isNotPeriodPicker && isNotPeriodPickerCtrl;

      if (isNotYear && isNotMonth && isNotPeriod && activePicker) {
        this.authorsView.averageTab.details.activePicker = "";
      }
    } catch (error) {
      console.log("Author details is not active");
      // console.log("Author details is not active", error);
    }
  }
}
