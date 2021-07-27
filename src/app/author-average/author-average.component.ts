import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { PublicationsService } from "../publications.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-author-average",
  templateUrl: "./author-average.component.html",
  styleUrls: ["./author-average.component.scss"],
})
export class AuthorAverageComponent implements OnInit {
  @ViewChild("details") details: ElementRef;

  loadingAuthor = false;
  activeAuthorID;
  selectedAuthor = null;
  private subscriptions: Subscription = new Subscription();

  /**
   * Список авторов [0,1,2, .., n]
   * @prop {Object} [n]  - Данные по автору, где n - выделенный автор
   * @prop {string} [n].name - Имя автора
   * @prop {number} [n].id - aid автора
   */
  authors = [];
  /**
   * Список авторов [0,1,2, .., n] отфильтрованный по строке поиска.
   * @prop {Object} [n]  - Данные по автору, где n - выделенный автор
   * @prop {string} [n].name - Имя автора
   * @prop {number} [n].id - aid автора
   */
  authorStorage = []; // удалить в будущем
  foundedAuthors = []; // удалить в будущем
  paginatedAuthors = {}; // удалить в будущем

  /**
   * @prop {Object} pagination - Data for pagination
   * @prop {number} pagination.page - Current page
   * @prop {?number} pagination.prev - Previous page if exist
   * @prop {?number} pagination.next - Next page if exist
   * @prop {number} pagination.pageCount - Всего страниц
   * @prop {number} pagination.resCount - Всего результатов
   * @prop {number} pagination.resultsPerPage- Результатов на страницу
   */
  pagination = {
    prev: null,
    next: null,
    page: 1,
    pageCount: 1,
    resCount: 0,
    isPaginated: true,
    resultsPerPage: 20,
  };

  constructor(private publicationsService: PublicationsService) {}

  ngOnInit(): void {
    this.getAuthors({ offset: 0, limit: 1000 });
    // this.getAuthors({
    //   page: this.pagination.page,
    //   resultsPerPage: this.pagination.resultsPerPage,
    // });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getAuthors(settings): void {
    this.loadingAuthor = true;
    //Корявая пагинация с корявыми данными
    // this.publicationsService.getAuthors(this.authorParams).subscribe(data => {
    //   this.loadingAuthor = false;
    //   if (data) {
    //     this.publicationsService.setAuthorParams(data.results);
    //   }
    //   this.authors = data;
    //   console.log("[averagePage] getAuth:", this.authors);
    // });

    //  Нормальная пагинация с корвыми данными
    //  из-за этого лишняя нагрузка на клиента
    this.subscriptions.add(
      this.publicationsService.getAuthors(settings).subscribe((data) => {
        this.loadingAuthor = false;
        if (data) {
          // console.log("[averagePage] getAuth:", data);
          this.publicationsService.setAuthorParams(data.results); // to lower case
          this.prepareData(data); // Генерим весь список авторов сразу

          this.getDataCallback(this.authorStorage.slice());
        } else {
          //error
        }
      })
    );
  }

  /**
   * @param {Object} settings - Данные, посылаемые на сервер {page, resultsPerPage}
   * @param {number} settings.page - Page what you want to get
   * @param {number} settings.resultsPerPage - Results per page
   *
   * @namespace Data from server
   * @prop {Object} res - Object from server
   * @prop {number} res.page - Current page
   * @prop {?number} res.prev - Previous page if exist
   * @prop {?number} res.next - Next page if exist
   * @prop {number} res.pageCount - Всего страниц
   * @prop {number} res.resCount - Всего результатов
   * @prop {array} res.data - Array of authors
   * @prop {string} res.data.name - Author name in lower case
   * @prop {number} res.data.id - Author aid
   */
  getLocalAuthors(settings = undefined): void {
    if (settings) {
      this.setPrevNextPage(settings.page);
    } else {
      this.setPrevNextPage(1);
    }
    this.authors = this.paginatedAuthors[this.pagination.page];
    // console.log("pagination", this.pagination);
    // console.log("page", this.authors);
  }

  getDataCallback(data) {
    this.paginateAuthors(data);
    this.getLocalAuthors();
  }

  searchCallback(authorID) {
    loop1: for (const page in this.paginatedAuthors) {
      for (const author of this.paginatedAuthors[page]) {
        if (authorID == author.id) {
          this.getLocalAuthors({ page: page });
          break loop1;
        }
      }
    }
    this.setAuthor(authorID);
    // if (!params.query) {
    //   this.getDataCallback(this.authorStorage);
    // } else {
    //   this.getDataCallback(params.results);
    // }
  }

  setPrevNextPage(page) {
    this.pagination.page = +page;
    this.pagination.prev = +page - 1;
    this.pagination.next = +page + 1;
    if (page === 1) {
      this.pagination.prev = null;
    }
    if (page === this.pagination.pageCount) {
      this.pagination.next = null;
    }
  }

  /**
   * Преобразует корявые данные, полученные с сервера к оптимальному варианту
   * и заполняет массив дл поиска по авторам (временно, пока не сделают нормальный бек)
   * @param {Object} data - Данные с сервера
   */
  prepareData(data): void {
    for (const author of data.results) {
      this.authorStorage.push({
        name: author.author,
        id: author.aid,
      });
    }
    // console.log("[NORMAL]", this.authorStorage);
  }

  /**
   * Пока нет нормального бека собираем пагинацию следующим образом. Из объекта data:
   * @param {Array} data - Array of authors in format [{name, id}, {}]
   * @param {string} data.name - Имя автора
   * @param {number} data.id - aid автора
   *
   * На выходе получаем объект paginatedAuthors c параметрами:
   * @prop {Object} this.paginatedAuthors - Постраничный список всех авторов в формате { page: [{ name, id }, ...], page: [...], ... }
   *
   */
  paginateAuthors(data): void {
    this.authors;

    const pages = Math.ceil(data.length / this.pagination.resultsPerPage);
    for (let p = 1; p <= pages; p++) {
      this.paginatedAuthors[p] = data.splice(0, this.pagination.resultsPerPage);
    }
    this.pagination.pageCount = pages;
    // console.log("[PAGINATED]", this.paginatedAuthors);
  }

  /**
   * Выбираем активного автора, для отображения средних значений по нему
   * @param authorID
   */
  setAuthor(authorID): void {
    for (const author of this.authors) {
      if (author.id === authorID) {
        if (this.activeAuthorID !== author.id) {
          this.activeAuthorID = authorID;
          this.getAuthor(authorID);
          // console.log("[AVERAGE] need to activate", author.id, authorID);
        } else {
          this.activeAuthorID = undefined;
          this.selectedAuthor = undefined;
        }
        break;
      }
    }
  }

  /**
   * Получаем данные по автору
   * @param authorAID - Идентификатор автора
   */
  getAuthor(authorAID) {
    this.subscriptions.add(
      this.publicationsService
        .getAuthors({ authorAID: authorAID })
        .subscribe((data) => {
          if (data) {
            data = data.results[0];
            this.selectedAuthor = data;
          } else {
            //error
          }
        })
    );
  }

  setAuthorPage(page) {
    this.getLocalAuthors({ page: +page });
    // this.getAuthors({ page: page, results: this.pagination.resultsPerPage });
    // this.authorParams = Object.assign(this.authorParams, page);
    // this.getAuthors({ offset: 0, limit: 1000 });
  }
}
