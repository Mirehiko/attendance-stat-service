// declare module 'datepicker' {
//   export interface Host {
//     protocol?: string;
//     hostname?: string;
//     pathname?: string;
//   }
//   export function parse(url: string, queryString?: string): Host;
// }
declare var datepicker: any;
interface JQuery {
  datepicker(options?: any): any;
}
