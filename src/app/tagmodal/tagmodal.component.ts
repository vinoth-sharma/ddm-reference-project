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
        if(this.exportTags.includes(this.inputTag) || this.newTags.includes(this.inputTag) ) {
            this.toasterService.info("This tag already exists");
        } else {
            if (this.inputTag.trim() == '') {
            this.toasterService.info("Cannot save empty tags");
            } else {
            this.newTags.push(this.inputTag);
            this.inputTag = '';
            this.saveTags = this.newTags;
            }
        }
    }

    public removeTags(index) {
        this.exportTags.splice(index, 1); 
        this.statusCheck = true;
    }

    public removeNewTags(index) {
        this.newTags.splice(index, 1);
        this.statusCheck = true;
    }

    public removeAll() {
        this.statusCheck = true;
        this.exportTags = [];
        this.inputTag = '';
        this.newTags = [];
        this.reportTags = [];

    }

    public submitTags() {
        this.exportTags = this.reportTags.concat(this.newTags);
        let data = {
            tag_name: this.exportTags
        };
        this.emitTags.emit(data);
    }

    public getTagsFromList(key) {
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
