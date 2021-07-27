import { Component, OnInit, Input } from "@angular/core";
import { PublicationsService } from "../publications.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-mainbox",
  templateUrl: "./mainbox.component.html",
  styleUrls: ["./mainbox.component.scss"],
})
export class MainboxComponent implements OnInit {
  @Input() isActive: boolean;

  publications;
  authors;
  rubrics;

  publParams = {};

  activeTab = "all";
  activeRubric = "Все рубрики";
  isRubricsOpened = false;
  loadingPub = false;
  loadingAuthors = false;

  private subscriptions: Subscription = new Subscription();

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    this.getRubrics();
    this.getAuthors();
    this.getPublications();

    // On period change
    this.subscriptions.add(
      this.publicationsService.periodChange.subscribe((period) => {
        if (this.publicationsService.activeView === "homepage") {
          this.getAuthors();
          this.getPublications();
        }
      })
    );

    // On view change
    this.subscriptions.add(
      this.publicationsService.activeViewOb.subscribe((activeView) => {
        if (activeView === "homepage") {
          this.getAuthors();
          this.getPublications();

          // autoload data
          clearInterval(this.publicationsService.interval);
          this.publicationsService.interval = setInterval(() => {
            this.getAuthors();
            this.getPublications();
          }, this.publicationsService.timer);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setPublPage(pageParams) {
    Object.assign(this.publParams, pageParams);
    // console.log("pageParams", pageParams);
    this.getPublications();
  }

  setType(type = "all") {
    this.activeTab = type;
    this.publParams["type"] = type;
    this.clearPageProgress();
    this.getPublications();
  }

  getPublications() {
    this.loadingPub = true;

    this.publParams["period"] = this.publicationsService.period;
    // console.log("this.publParams", this.publParams);

    this.subscriptions.add(
      this.publicationsService
        .getPublications(this.publParams)
        .subscribe((data) => {
          this.loadingPub = false;
          if (data) {
            this.publicationsService.convertData(data.results);
          } else {
            //error message
          }
          this.publications = data;
          // console.log("[main] getPub:", this.publications);
        })
    );
  }

  getRubrics() {
    this.rubrics = this.publicationsService.getRubrics();
    console.log("[main] getRubrics:", this.rubrics);
  }

  setRubric(rubricKey = "") {
    let activeRubric = "";

    for (const rubric of this.rubrics) {
      if (rubric.key === rubricKey && !rubric.isActive) {
        rubric.isActive = true;
        activeRubric = rubric.value;
      } else {
        rubric.isActive = false;
      }
    }

    if (activeRubric) {
      this.publParams["rubric"] = activeRubric;
      this.activeRubric = activeRubric;
    } else {
      this.activeRubric = "Все рубрики";
      delete this.publParams["rubric"];
    }

    this.clearPageProgress();
    this.getPublications();
  }

  getAuthors() {
    this.loadingAuthors = true;

    this.subscriptions.add(
      this.publicationsService
        .getAuthors({
          limit: 15,
          offset: 0,
          period: this.publicationsService.period,
        })
        .subscribe((data) => {
          this.loadingAuthors = false;
          if (data) {
            this.publicationsService.setAuthorParams(data.results);
          }
          this.authors = data;
          // console.log("[MAIN] getAuth:", this.authors);
        })
    );
  }

  setAuthor(authorAid) {
    let activeAuthor = "";

    for (const author of this.authors.results) {
      if (author.aid === authorAid && !author.isActive) {
        author.isActive = true;
        activeAuthor = author.author;
      } else {
        author.isActive = false;
      }
    }

    if (activeAuthor) {
      this.publParams["author"] = activeAuthor;
    } else {
      delete this.publParams["author"];
    }

    this.clearPageProgress();
    this.getPublications();
  }

  clearPageProgress() {
    delete this.publParams["limit"];
    delete this.publParams["offset"];
  }

  toggleValue(value) {
    this[value] = !this[value];
  }
}
