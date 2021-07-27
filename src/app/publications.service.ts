import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { HttpParams } from "@angular/common/http";
import { catchError, skipUntil /*map, tap*/ } from "rxjs/operators";
import { Subject, BehaviorSubject } from "rxjs";
import { Subscription, interval } from "rxjs";
import { exhaustMap } from "rxjs/operators";

import { PUBLICATIONS } from "./mock-publ";
import { AUTHORS } from "./mock-authors";
import { RUBRICS } from "./mock-rubrics";
import { TOTALS } from "./mock-totals";
import { METRIX } from "./mock-metrix";

import { COUNTRY } from "./mock-country";
import { CITIES } from "./mock-cities";
import { PEOPLES } from "./mock-peoples";
import { SOURCES } from "./mock-sources";

@Injectable({
  providedIn: "root",
})
export class PublicationsService {
  private urls = {
    tnews: "/todaynews/?",
    tauthors: "/todayauthors/?",

    //new params
    publications: "/news/?",
    author: "/authors/?",
    metrix: "/todaytotals/?",
    totals: "/totals/?",

    depth: "/depth/?",
    countries: "/country/?",
    cities: "/city/?",
    peoples: "/text/?",
    sources: "/traffic/?",
  };

  private pubTypes = {
    news: "is_news",
    releases: "is_pr",
  };

  private isProduction = false;
  interval;
  timer = 1000 * 30;
  subscriptions: Subscription = new Subscription();

  // Active View
  activeViewSource = new BehaviorSubject<any>({});
  activeViewOb = this.activeViewSource.asObservable();
  activeView: string;

  // Period
  periodChange = new BehaviorSubject<any>({});
  periodOb = this.periodChange.asObservable();
  period = null;

  // Expert mode
  expertModeSource = new BehaviorSubject<any>({});
  expertModeOb = this.expertModeSource.asObservable();
  expertMode: boolean;

  // Side opened
  isSideOpenedSource = new BehaviorSubject<any>({});
  isSideOpenedOb = this.isSideOpenedSource.asObservable();
  isSideOpened: boolean;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) {
    this.setPeriod({
      start: new Date(),
      end: new Date(),
    });
    this.expertModeSource.next(false); // initial value
    this.isSideOpenedSource.next(false); // initial value
    this.activeViewSource.next("homepage"); // initial value

    this.subscriptions.add(
      this.activeViewOb.subscribe((view) => {
        this.activeView = view;
      })
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // console.error(error); // log to console instead
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  //Metrix
  getMetrix(): Observable<any> {
    // Период за который необходимо получить данные
    const options = {
      params: this.period,
    };

    if (this.isProduction) {
      return this.http
        .get<any>(this.urls.metrix, options)
        .pipe(catchError(this.handleError<any>("getMetrix", null)));
    }

    return this.http
      .get<any>(this.urls.metrix, options)
      .pipe(catchError(this.handleError<any>("getMetrix", METRIX)));
  }

  //Totals
  getTotals(params = undefined): Observable<any> {
    const queryParams = {};
    let queryType = "getTotals";

    if (params) {
      // Период, за который необходимо получить данные
      queryParams["start"] = params.period.start;
      queryParams["end"] = params.period.end;
      queryType = "getTodayTotals";
    }

    const isCommon = queryType === "getTotals" && this.activeView === "common";

    if (isCommon || queryType === "getTodayTotals") {
      if (this.isProduction) {
        return this.http
          .get<any>(this.urls.totals, {
            params: queryParams,
          })
          .pipe(catchError(this.handleError<any>(queryType, null)));
      }

      return this.http
        .get<any>(this.urls.totals, {
          params: queryParams,
        })
        .pipe(catchError(this.handleError<any>(queryType, TOTALS)));
    } else {
      const empty = new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
      console.log(`[SERVICE] ${queryType} data is not needed.`);
      return empty;
    }
  }

  //Publications
  getPublications(params = null): Observable<any> {
    const queryParams = {};

    // Выборка публикаций по типу
    if (params.type === "news" || params.type === "releases") {
      queryParams[this.pubTypes[params.type]] = "1";
    } else if (params.type === "articles") {
      queryParams[this.pubTypes.news] = "0";
      queryParams[this.pubTypes.releases] = "0";
    }

    // Страница и число результатов на страницу
    if (params.offset) {
      queryParams["offset"] = params.offset;
    }

    if (params.limit) {
      queryParams["limit"] = params.limit;
    }

    // Период за который необходимо получить данные
    if (params.period) {
      queryParams["start"] = params.period.start;
      queryParams["end"] = params.period.end;
    }

    // Выборка данных по автору
    if (params.author) {
      queryParams["author"] = `{'${params.author.toUpperCase()}'}`;
    }

    // Выборка данных по автору
    if (params.rubric) {
      queryParams["rubric"] = params.rubric;
    }

    console.log("publicationOptions", queryParams);

    if (this.isProduction) {
      return this.http
        .get<any>(this.urls.publications, {
          params: queryParams,
        })
        .pipe(catchError(this.handleError<any>("getPublications", null)));
    }

    return this.http
      .get<any>(this.urls.publications, {
        params: queryParams,
      })
      .pipe(catchError(this.handleError<any>("getPublications", PUBLICATIONS)));
  }

  // Depth
  getDepth() {
    if (this.expertMode) {
      const options = {
        params: this.period,
      };

      if (this.isProduction) {
        return this.http
          .get<any>(this.urls.depth, options)
          .pipe(catchError(this.handleError<any>("getDepth", [])));
      }

      return this.http.get<any>(this.urls.depth, options).pipe(
        catchError(
          this.handleError<any>("getDepth", {
            results: [{ index: 12345, depth: 1.52997148 }],
          })
        )
      );
    } else {
      const empty = new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
      console.log("[SERVICE] Depth data is not needed.");
      return empty;
    }
  }

  //Rubrics
  getRubrics() {
    return RUBRICS;
  }

  //Authors
  setAuthorParams(data): void {
    for (const author of data) {
      author.isActive = false;
      author.author = author.author.toLowerCase();
    }
  }

  getAuthors(params = null): Observable<any> {
    const queryParams = {};
    let queryType = "getAuthors[]";

    // Страница и число результатов на страницу
    if (params.offset) {
      queryParams["offset"] = params.offset;
    }

    if (params.limit) {
      queryParams["limit"] = params.limit;
    }

    // Только 1 автор
    if (params.authorAID) {
      queryParams["aid"] = params.authorAID;
      queryType = "getAuthor";
    }

    // Период за который необходимо получить данные
    if (params.period) {
      queryParams["start"] = params.period.start;
      queryParams["end"] = params.period.end;
    }

    // console.log("authorOptions", queryParams);

    if (this.isProduction) {
      return this.http
        .get<any>(this.urls.author, {
          params: queryParams,
        })
        .pipe(catchError(this.handleError<any>(queryType, null)));
    }

    return this.http
      .get<any>(this.urls.author, {
        params: queryParams,
      })
      .pipe(catchError(this.handleError<any>(queryType, AUTHORS)));
  }

  //Expert data
  getExpertData(params): Observable<any> {
    let queryType = params.type;
    const queryParams = {};

    // Страница и число результатов на страницу
    if (params.offset) {
      queryParams["offset"] = params.offset;
    }

    if (params.limit) {
      queryParams["limit"] = params.limit;
    }

    // Период за который необходимо получить данные
    if (params.period) {
      queryParams["start"] = this.period.start;
      queryParams["end"] = this.period.end;
    }

    // console.log(`getExpertData ${queryType}`, queryParams);

    if (this.isProduction) {
      return this.http
        .get<any>(this.urls[params.type], { params: queryParams })
        .pipe(catchError(this.handleError<any>(queryType, null)));
    }

    let mockResults = {
      countries: COUNTRY,
      cities: CITIES,
      peoples: PEOPLES,
      sources: SOURCES,
    };

    return this.http
      .get<any>(this.urls[params.type], { params: queryParams })
      .pipe(
        catchError(this.handleError<any>(queryType, mockResults[params.type]))
      );
  }

  setPeriod(params): void {
    this.period = {
      start: params.start
        ? this.getCorrectDate(params.start, "yyyy-mm-dd")
        : this.period["start"],
      end: params.end
        ? this.getCorrectDate(params.end, "yyyy-mm-dd")
        : this.period["end"],
    };
    console.log(`[GLOBAL] `, this.period);
    this.periodChange.next(this.period);
  }

  // Преобразование даты к тексту сегодня/вчера
  dateToText(date): string {
    let today = this.getCorrectDate(new Date(), "dd-mm-yyyy");
    let yesterday = this.getCorrectDate(
      this.getDateAgo(new Date(), 1),
      "dd-mm-yyyy"
    );

    switch (date) {
      case today: {
        return "За сегодня";
      }
      case yesterday: {
        return "За вчера";
      }
      default: {
        return date;
      }
    }
  }

  // Получить n дней назад
  getDateAgo(date, days) {
    let dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() - days);
    return dateCopy;
  }

  // Последний день месяца(число дней в месяце)
  getLastDayOfMonth(year, month): number {
    let date = new Date(year, month + 1, 0);
    return date.getDate();
  }

  // Число дней между указанными датами
  getDaysBetweenDates(start, end): number {
    let oneDay = 1000 * 60 * 60 * 24;
    let days = Math.abs(Math.round(start.getTime() - end.getTime()) / oneDay);
    return +days.toFixed(0) || 1;
  }

  // Преобразование данных из прописных в строчные символы
  convertData(data): void {
    for (const pub of data) {
      pub.author = this.removeQutes(pub.author);
      pub.author = pub.author.toLowerCase();
    }
  }

  // Удалить кавычки из строки
  removeQutes(instr): string {
    instr = instr.replace(/[^A-Za-zА-Яа-яЁё]/g, (str, offset, s) => {
      if (str !== " " && str !== ",") {
        str = str.replace(/[^A-Za-zА-Яа-яЁё]/g, "");
      }
      if (str === ",") {
        str = str.replace(/[^A-Za-zА-Яа-яЁё]/g, ", ");
      }
      return str;
    });
    return instr;
  }

  // Преобразование объекта даты к строке указанного формата
  getCorrectDate(date, format): string {
    let parsed_date = this.parseDate(date);

    switch (format) {
      case "yyyy-mm-dd": {
        return `${parsed_date.year}-${parsed_date.month}-${parsed_date.day}`;
      }
      case "dd-mm-yyyy": {
        return `${parsed_date.day}-${parsed_date.month}-${parsed_date.year}`;
      }
      case "dd txt-s yyyy": {
        return `${parsed_date.day}"&nbsp;${this.toTextFormatDate(date)}"&nbsp;${
          parsed_date.year
        }`;
      }
      default: {
        return "Фомат не задан";
      }
    }
  }

  parseDate(date): any {
    const yyyy = date.getFullYear();

    let mm = `${date.getMonth() + 1}`;
    if (date.getMonth() < 9) {
      mm = `0${mm}`;
    }

    let dd = `${date.getDate()}`;
    if (date.getDate() < 10) {
      dd = `0${dd}`;
    }

    return {
      year: yyyy,
      month: mm,
      day: dd,
    };
  }

  // Месяц к тестовому формату
  toTextFormat(date): string {
    let monthList = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    return monthList[date.getMonth()];
  }

  // Месяц к тестовому формату
  toTextFormatDate(date): string {
    let monthList = [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря",
    ];

    return monthList[date.getMonth()];
  }
}
