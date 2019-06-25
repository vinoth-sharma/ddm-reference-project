import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from "ngx-toastr";


@Component({
    selector: 'app-tagmodal',
    templateUrl: './tagmodal.component.html',
    styleUrls: ['./tagmodal.component.css']
})
export class TagmodalComponent {
    public tags;
    public exportTags;
    public statusCheck = false;
    public newTags = [];
    public saveTags = [];
    public inputTag: string;
    @Input() reportTags: any;
    @Output() public emitTags = new EventEmitter<{}>();

    public searchTags:any;
    
    constructor(private toasterService: ToastrService) {}

    ngOnInit() {
        this.reset();
    }

    ngOnChanges() {
        this.reset();
    }

    public reset() {
        this.inputTag = '';
        this.exportTags = this.reportTags;
        this.newTags = [];
        this.searchTags = '';
        this.saveTags = [];

    }

    public addTags() {
        if (this.inputTag.trim() == '') {
            this.toasterService.info("Cannot save empty tags");
        } else {
            this.newTags.push(this.inputTag);
            this.inputTag = '';
        }
    }

    public removeTags(index) {
        this.statusCheck = true;
        this.exportTags.splice(index, 1);
    }

    public removeNewTags(index) {
        this.newTags.splice(index, 1);
    }

    public removeAll() {
        this.exportTags = [];
        this.inputTag = '';
        this.newTags = [];
    }

    public submitTags() {
        this.exportTags = this.reportTags.concat(this.newTags);
        let data = {
            tag_name: this.exportTags
        };
        this.emitTags.emit(data);
    }

    public getTagsFromList(key) {
        this.saveTags = this.newTags;
        // this.exportTags = this.reportTags.concat(this.newTags);
        if (key) {
            this.exportTags = this.exportTags.filter(item => {
                return item.toLowerCase().match(key.toLowerCase());
            });
            this.newTags = this.newTags.filter(item => {
                return item.toLowerCase().match(key.toLowerCase());
            });
        } else {
        this.exportTags = this.reportTags;
        this.newTags = this.saveTags;

        }
    }

}
