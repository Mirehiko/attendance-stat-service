import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter /*,
  OnChanges,
  SimpleChanges,*/,
} from "@angular/core";

@Component({
  selector: "app-search-authors",
  templateUrl: "./search-authors.component.html",
  styleUrls: ["./search-authors.component.scss"],
})
export class SearchAuthorsComponent implements OnInit /*, OnChanges*/ {
  @Input() authorList;
  // @Input() authorList: any[];
  @Output() searchData: EventEmitter<any> = new EventEmitter<any>();
  searchResults = [];
  searchString = "";

  constructor() {}

  // ngOnChanges(changes: SimpleChanges) {
  //   for (let propName in changes) {
  //     // only run when property "data" changed
  //     if (propName === "authorStorage") {
  //       //  this line will update posts values
  //       this.authorList = changes[propName].currentValue;

  //       console.log(this.authorList);
  //     }
  //   }
  // }

  ngOnInit(): void {}

  chooseAuthor(authorID) {
    this.searchString = "";
    this.searchData.emit(authorID);
  }

  search() {
    this.searchResults = this.authorList.filter(
      (author) => author.name.indexOf(this.searchString) !== -1
    );
    // console.log("[SEARCH] ", this.searchString);
    // console.log("[SEARCH] ", this.searchResults);
    // console.log("[SEARCH] ", this.authorList);
  }
}
