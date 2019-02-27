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
    public newTags = [];
    public inputTag: string = null;
    @Input() reportTags: any;
    @Output() public emitTags = new EventEmitter<{}>();

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
        if (!this.reportTags || this.reportTags[0] == null || this.reportTags.length == 0) {
            this.exportTags = [];
        } else {
            this.exportTags = this.reportTags;
        }
    }

    public addTags() {
        if (this.inputTag.trim() == '') {
            this.toasterService.info("Cannot save empty tags");
        } else {
            this.newTags.push(this.inputTag);
            this.inputTag = '';
            if (!this.reportTags || this.reportTags == null || this.reportTags[0] == null || this.reportTags.length == 0) {
                this.exportTags = this.newTags
            } else {
                this.exportTags = this.reportTags.concat(this.newTags)
            }
        }
    }

    public removeTags(tags) {
        let index = this.newTags.indexOf(tags);
        this.newTags.splice(index, 1);
        if (this.reportTags[0] == null || this.reportTags.length == 0) {
            this.exportTags = this.newTags
        } else {
            this.exportTags = this.reportTags.concat(this.newTags)
        }
    }

    public removeAll() {
        this.exportTags = [];
        this.inputTag = '';
        this.newTags = [];
    }

    public submitTags() {
        let data = {
            tag_name: this.exportTags
        };
        this.emitTags.emit(data);
    }

    public getTagsFromList(key) {
        if (key) {
            this.exportTags = this.exportTags.filter(item => {
                return item.toLowerCase().match(key.toLowerCase());
            });
        } else {
            this.exportTags = this.reportTags;
        }
    }

}
