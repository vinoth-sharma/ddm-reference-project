import {ShareReportService} from './share-report.service';
import { environment } from 'src/environments/environment';
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

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                this.dataService.uploadFile(file).subscribe((response: any) => {
                    if (!response || 'error' in response) {
                        reject(response && response.error);
                    }
                    console.log('Response', response);
                    resolve( {
                        default: environment.baseUrl + response.data.file_path
                    } );
                }, error => {
                    reject(error);
                });
            } ) );
    }

    // Aborts the upload process.
    abort() {
        if ( this.dataService ) {
            // this.xhr.abort();
            // this.dataService.uploadFile().unsubscribe()
        }
    }

    
}