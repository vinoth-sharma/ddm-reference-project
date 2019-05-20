import {ShareReportService} from './share-report.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
export class CustomUploadAdapter {
    private loader;
    private dataService;
    constructor( loader,
        dataService: ShareReportService) {
        // The file loader instance to use during the upload.
        this.loader = loader;
        this.dataService = dataService;
        console.log('Data service', dataService);
    }

    private messageSource = new BehaviorSubject('default message') 
    currentMessage = this.messageSource.asObservable(); 

    // Starts the upload process.
    upload() {
        this.dataService.isUploadInProgress = true;
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                this.dataService.uploadFile(file).subscribe((response: any) => {
                    if (!response || 'error' in response) {
                        reject(response && response.error);
                    }
                    this.dataService.setImageData(response);
                    resolve( {
                        default: environment.baseUrl + response.data.file_path                         
                    } );
                }, error => {
                    reject(error);
                });
            } ) ).catch(error => {
                console.log('Error: ', error);
            }).finally(() => {
                this.dataService.isUploadInProgress = false;
            });
    }

    // Aborts the upload process.
    abort() {
        console.log('Operation aborted');
        if ( this.dataService ) {
            // this.xhr.abort();
            // this.dataService.uploadFile().unsubscribe();
            console.log('Operation aborted');
        }
    }

    
}