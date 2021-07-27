import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { PublicationsService } from "../publications.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent implements OnInit {
  @Input() activeView: any;
  @Output() viewChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("sideMenu") sideMenu: ElementRef;

  isSideOpened: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    // On side state change
    this.subscriptions.add(
      this.publicationsService.isSideOpenedOb.subscribe((isSideOpened) => {
        console.log("isSideOpened", isSideOpened);
        this.isSideOpened = isSideOpened;
      })
    );
  }

  setView(view) {
    console.log("[INFO] activeViewOb changed to", view);

    this.activeView = view;
    this.publicationsService.activeViewSource.next(view);
    this.viewChange.emit(view);

    this.closeSideMenu();
  }

  closeSideMenu() {
    this.publicationsService.isSideOpenedSource.next(false);
  }
}
