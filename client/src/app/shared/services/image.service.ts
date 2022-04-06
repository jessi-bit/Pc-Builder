import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Image } from "../models/image.model";
import { MessageService } from "./message.service";

/**
 * @author Filippo Casarosa
 * @author Andrei Blindu
 */
@Injectable({providedIn:'root'})
export class ImageService {
  imagesChanged = new Subject<Image[]>();
  error = new Subject<string>();
  private uploadUrl: string = 'http://localhost:8080/uploadFile';
  private downloadUrl: string = 'http://localhost:8080/downloadFile';

  constructor(private http: HttpClient,
              private messageService: MessageService) {}

  addImage(image: any): Observable<string> {
    let formData = new FormData();
    formData.append('file', image);
    return this.http.post<Image>(this.uploadUrl, formData).pipe(
      tap((uploadFileResponse) => this.log(`added image w/ url Name=${uploadFileResponse.fileDownloadUri}`)),
      map((uploadFileResponse) => uploadFileResponse.fileDownloadUri),
      catchError(this.handleError<string>('addImage'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a PrebuiltService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PrebuiltService: ${message}`);
  }
}
