import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit {
  @Input() pageInfo: any;
  @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  setPage(page) {
    if (this.pageInfo.isPaginated) {
      // Нормальная пагинация
      this.pageInfo.page = page;
      this.pageChange.emit(this.pageInfo.page);
    } else {
      // Старая пагинация
      const p = page.split("?")[1];
      const params = p.split("&");
      const paramsObj = {};
      for (const param of params) {
        const keyVal = param.split("=");
        if (keyVal[0] === "limit" || keyVal[0] === "offset") {
          paramsObj[keyVal[0]] = keyVal[1];
        }
      }

      if (!paramsObj.hasOwnProperty("offset")) {
        paramsObj["offset"] = 0;
      }

      this.pageChange.emit(paramsObj);
    }
  }
}
