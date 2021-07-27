import { Component, OnInit } from "@angular/core";
import { PublicationsService } from "../publications.service";
import Chart from "chart.js";
import { Subscription } from "rxjs";

@Component({
  selector: "app-sources",
  templateUrl: "./sources.component.html",
  styleUrls: ["./sources.component.scss"],
})
export class SourcesComponent implements OnInit {
  constructor(private publicationsService: PublicationsService) {}

  private interval;
  private subscriptions: Subscription = new Subscription();

  preloader = {
    countries: true,
    cities: true,
    peoples: true,
    sources: true,
  };

  countries;
  cities;
  peoples;
  sources;

  Graphics = {
    countries: null,
    cities: null,
    peoples: null,
    sources: null,
  };

  ngOnInit(): void {
    Chart.defaults.global.defaultFontFamily = "NeoSansCyr-Regular";
    Chart.defaults.global.defaultFontColor = "#70a7bb";

    // autoload data
    this.interval = setInterval(() => {
      if (this.publicationsService.expertMode) {
        this.callGetData();
      }
    }, this.publicationsService.timer);

    // On period change
    this.subscriptions.add(
      this.publicationsService.periodChange.subscribe((period) => {
        this.callGetData();
      })
    );

    // On expert mode change
    this.subscriptions.add(
      this.publicationsService.expertModeOb.subscribe((isActive) => {
        if (isActive) {
          this.callGetData();
        }
      })
    );
  }

  callGetData() {
    this.getData("countries");
    this.getData("cities");
    this.getData("peoples");
    this.getData("sources");
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscriptions.unsubscribe();
  }

  getData(type, pageParams = null) {
    this.preloader[type] = true;
    let params = {
      type: type,
    };

    if (pageParams) {
      Object.assign(params, pageParams);
    }

    if (type === "cities" || type === "countries") {
      params["limit"] = 10;
    }

    // console.log(`query send params for ${type}`, params);

    this.subscriptions.add(
      this.publicationsService.getExpertData(params).subscribe((data) => {
        this.preloader[type] = false;
        if (data) {
          this[type] = data;
          this[`${type}Render`](data);
        } else {
          this[type] = null;
          //error message
        }
        // console.log(`[sources] get ${type}:`, this[type]);
      })
    );
  }

  setDataPage(type, pageParams) {
    // console.log("pageParams", pageParams);
    this.getData(type, pageParams);
  }

  // График по странам
  countriesRender(data) {
    var ctx = document.getElementById("countryGraphic");

    let countries = [],
      views = [];
    for (let i = 0; i < data.results.length; i++) {
      countries.push(data.results[i].country);
      views.push(data.results[i].u);
    }

    if (!this.Graphics.countries) {
      var myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: countries,
          datasets: [
            {
              data: views,
              borderWidth: 1,
              backgroundColor: [
                "#14b8aa",
                "#384648",
                "#fd615e",
                "#f2c80f",
                "#5f6b6d",
                "#8ad5eb",
                "#fe9666",
                "#a66798",
                "#3699b8",
                "#dfbebe",
              ],
              borderColor: "#35f3bf",
            },
          ],
        },
        options: {
          pieceLabel: {
            render: "value",
            fontColor: "#fff",
            fontStyle: "bold",
          },
          responsive: true,
          scales: {
            axes: false,
          },
          legend: {
            position: "top",
            labels: {
              // This more specific font property overrides the global property
              fontColor: "#fff",
              defaultFontColor: "#fff",
              defaultFontFamily: "NeoSansCyr-Regular",
            },
          },
        },
      });
      // $(ctx.canvas).on('click', function (evt) {
      //   var activePoints = myChart.getElementsAtEvent(evt);

      //   let isBackgroundClick = (activePoints[0] == undefined);
      //   let country = '';
      //   if (!isBackgroundClick) { country = activePoints[0]._model.label; }
      //   let lastCountry = Paginators['people'].lastCountry;
      //   let isSameCountry = (country == lastCountry) && lastCountry != '';

      //   if (isSameCountry || isBackgroundClick) {
      //     Paginators['city'].country = '';
      //     Paginators['city'].lastCountry = '';
      //     Paginators['people'].country = '';
      //     Paginators['people'].lastCountry = '';
      //     Paginators['people'].city = '';
      //     Paginators['people'].lastCity = '';

      //   } else {
      //     Paginators['city'].country = country;
      //     Paginators['city'].lastCountry = country;
      //     Paginators['people'].country = country;
      //     Paginators['people'].lastCountry = country;
      //     Paginators['people'].city = '';
      //     Paginators['people'].lastCity = '';
      //   }

      //   pannelState['city'].update();
      //   pannelState['people'].update();
      // });

      this.Graphics.countries = myChart;
    } else {
      var datasets = [
        {
          data: views,
          borderWidth: 1,
          backgroundColor: [
            "#14b8aa",
            "#384648",
            "#fd615e",
            "#f2c80f",
            "#5f6b6d",
            "#8ad5eb",
            "#fe9666",
            "#a66798",
            "#3699b8",
            "#dfbebe",
          ],
          borderColor: "#35f3bf",
        },
      ];
      this.updateChartData(
        this.Graphics.countries,
        "Страны",
        countries,
        datasets
      );
    }
  }

  // График по странам
  citiesRender(data) {
    var ctx = document.getElementById("cityGraphic");

    let towns = [],
      views = [];
    for (let i = 0; i < data.results.length; i++) {
      towns.push(data.results[i].city);
      views.push(data.results[i].u);
    }

    if (!this.Graphics.cities) {
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: towns,
          datasets: [
            {
              label: "Города",
              data: views,
              borderWidth: 1,
              backgroundColor: "#2ae4d2",
              hoverBackgroundColor: "#2effec",
              borderColor: "#35f3bf",
            },
          ],
        },
        options: {
          responsive: true,

          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                gridLines: {
                  color: "#4a636d",
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  color: "#4a636d",
                },
              },
            ],
          },
          legend: {
            labels: {
              // This more specific font property overrides the global property
              fontColor: "#fff",
              defaultFontColor: "#fff",
              defaultFontFamily: "NeoSansCyr-Regular",
            },
          },
        },
      });
      // $(ctx.canvas).on('click', function (evt) {
      //   var activePoints = myChart.getElementsAtEvent(evt);

      //   let isBackgroundClick = (activePoints[0] == undefined);
      //   let city = '';
      //   if (!isBackgroundClick) { city = activePoints[0]._model.label; }
      //   let lastCity = Paginators['people'].lastCity;
      //   let isSameCity = (city == lastCity) && lastCity != '';

      //   if (isSameCity || isBackgroundClick) {
      //     Paginators['people'].city = '';
      //     Paginators['people'].lastCity = '';
      //   } else {
      //     Paginators['people'].city = city;
      //     Paginators['people'].lastCity = city;
      //   }

      //   pannelState['people'].update();
      // });

      this.Graphics.cities = myChart;
    } else {
      var datasets = [
        {
          label: "Города",
          data: views,
          borderWidth: 1,
          backgroundColor: "#2ae4d2",
          hoverBackgroundColor: "#2effec",
          borderColor: "#35f3bf",
        },
      ];
      this.updateChartData(this.Graphics.cities, "Города", towns, datasets);
    }
  }

  //
  peoplesPrepareData(data) {
    let mans = [],
      womans = [],
      unknown = [],
      labels = [];

    for (let i = 0; i < data.results.length; i++) {
      if (data.results[i].gender == "мужской") {
        mans.push(data.results[i]);
      } else if (data.results[i].gender == "женский") {
        womans.push(data.results[i]);
      } else {
        unknown.push(data.results[i]);
      }
      labels.push(data.results[i].age);
    }

    labels = this.unique(labels);

    let res = {};
    for (let i = 0; i < labels.length; i++) {
      res[labels[i]] = {
        mans: [],
        womans: [],
        unknown: [],
      };
    }

    mans.filter(function (val) {
      for (let i = 0; i < labels.length; i++) {
        if (val.age == labels[i]) {
          res[labels[i]].mans.push(val.u);
        }
      }
    });

    womans.filter(function (val) {
      for (let i = 0; i < labels.length; i++) {
        if (val.age == labels[i]) {
          res[labels[i]].womans.push(val.u);
        }
      }
    });

    unknown.filter(function (val) {
      for (let i = 0; i < labels.length; i++) {
        if (val.age == labels[i]) {
          res[labels[i]].unknown.push(val.u);
        }
      }
    });

    (mans = []), (womans = []), (unknown = []);
    for (const index in res) {
      mans.push(this.arraySum(res[index].mans));
      womans.push(this.arraySum(res[index].womans));
      unknown.push(this.arraySum(res[index].unknown));
    }

    return {
      mans: mans,
      womans: womans,
      unknown: unknown,
      labels: labels,
    };
  }

  // График по возрастам
  peoplesRender(data) {
    const preparedData = this.peoplesPrepareData(data);
    var ctx = document.getElementById("peopleGraphic");
    // console.log("[preparedData]", preparedData);
    if (!this.Graphics.peoples) {
      var myChart = new Chart(ctx, {
        type: "horizontalBar",
        data: {
          labels: preparedData.labels,
          datasets: [
            {
              label: "Мужчины",
              data: preparedData.mans,
              backgroundColor: "#1ab7e6",
              hoverBackgroundColor: "#39d1ff",
            },
            {
              label: "Женщины",
              data: preparedData.womans,
              backgroundColor: "#e61aa7",
              hoverBackgroundColor: "#ff50c9",
            },
            {
              label: "Не определено",
              data: preparedData.unknown,
              backgroundColor: "#e6c31a",
              hoverBackgroundColor: "#ffdf44",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                gridLines: {
                  color: "#4a636d",
                },
                categoryPercentage: 0.7,
                barPercentage: 0.9,
              },
            ],
            xAxes: [
              {
                gridLines: {
                  color: "#4a636d",
                },
              },
            ],
          },
          legend: {
            labels: {
              // This more specific font property overrides the global property
              fontColor: "#fff",
              defaultFontColor: "#fff",
              defaultFontFamily: "NeoSansCyr-Regular",
            },
          },
        },
      });

      this.Graphics.peoples = myChart;
    } else {
      var datasets = [
        {
          label: "Мужчины",
          data: preparedData.mans,
          backgroundColor: "#1ab7e6",
          hoverBackgroundColor: "#39d1ff",
        },
        {
          label: "Женщины",
          data: preparedData.womans,
          backgroundColor: "#e61aa7",
          hoverBackgroundColor: "#ff50c9",
        },
        {
          label: "Не определено",
          data: preparedData.unknown,
          backgroundColor: "#e6c31a",
          hoverBackgroundColor: "#ffdf44",
        },
      ];
      this.updateChartData(
        this.Graphics.peoples,
        "Посетители",
        preparedData.labels,
        datasets
      );
    }
    // console.log("this.Graphics.peoples", this.Graphics.peoples);
  }

  // График по источникам
  sourcesRender(data) {
    var ctx = document.getElementById("sourcesGraphic");

    let towns = [],
      views = [];
    for (let i = 0; i < data.results.length; i++) {
      towns.push(data.results[i].ts1);
      views.push(data.results[i].v);
    }

    if (!this.Graphics.sources) {
      var myChart = new Chart(ctx, {
        type: "horizontalBar",
        data: {
          labels: towns,
          datasets: [
            {
              label: "Источники",
              data: views,
              backgroundColor: "#2ae4d2",
              hoverBackgroundColor: "#2effec",
              borderColor: "#35f3bf",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                gridLines: {
                  color: "#4a636d",
                },
                categoryPercentage: 0.8,
                barPercentage: 0.8,
              },
            ],
            xAxes: [
              {
                gridLines: {
                  color: "#4a636d",
                },
              },
            ],
          },
          legend: {
            labels: {
              // This more specific font property overrides the global property
              fontColor: "#fff",
              defaultFontColor: "#fff",
              defaultFontFamily: "NeoSansCyr-Regular",
            },
          },
        },
      });

      this.Graphics.sources = myChart;
    } else {
      var datasets = [
        {
          label: "Источники",
          data: views,
          borderWidth: 1,
          backgroundColor: "#2ae4d2",
          hoverBackgroundColor: "#2effec",
          borderColor: "#35f3bf",
        },
      ];
      this.updateChartData(this.Graphics.sources, "Источники", towns, datasets);
    }
  }

  // Работа с графиками - добавление данных
  updateChartData(chart, label, labels, data) {
    chart.data.labels = labels;
    for (let i = 0; i < data.length; i++) {
      chart.data.datasets[i] = data[i];
    }
    chart.options.animation = false;
    chart.update();
  }

  // Работа с графиками - удаление данных
  removeChartData(chart) {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
  }

  // Поиск уникальных значений в массиве
  unique(arr) {
    var obj = {};

    for (var i = 0; i < arr.length; i++) {
      var str = arr[i];
      obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj);
  }

  // Сложить значения в массиве
  arraySum(array): number {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      sum += +array[i];
    }
    return sum;
  }
}
