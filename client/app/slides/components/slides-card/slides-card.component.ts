import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { select } from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import { Slides} from '../../models/slides';
import {SlidesService} from '../../services/slides.service';
import {MdDialog} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
@Component({
    selector: 'app-slides-card',
    templateUrl: './slides-card.component.html',
    styleUrls: ['./slides-card.component.scss']
})
export class SlidesCardComponent implements OnInit {
    @Input() slides: Slides;
    @Input() editable: boolean; //whether the slides can be edited;
    @Output() deletedSlides = new EventEmitter();

    isFavorite: Boolean;
    @Output() duplicateslidesOpt=new EventEmitter();



    @select(['session', 'token']) loggedIn$: Observable<string>;
    @select(['session', 'user', 'username']) username$: Observable<Object>;

    constructor(private slidesService: SlidesService, private dialog: MdDialog) {
    }

    ngOnInit() {
    }

    publish(e) {
        this.slides.slidesSetting.public = !this.slides.slidesSetting.public;
        this.slidesService.updateSlide(this.slides, this.slides._id)
            .subscribe(elm => console.log(elm.slidesSetting.public));
    }
    toggleFavorite() {
        this.slides.slidesSetting.favorite = !this.slides.slidesSetting.favorite;
        this.slidesService.updateSlide(this.slides, this.slides._id)
            .subscribe(elm => console.log(elm.slidesSetting.favorite));
    }
    /*delete the whole slides*/
    deleteSlides(id) {
        const dialog = this.dialog.open(DialogComponent);
        dialog.afterClosed().subscribe(result => {
            if (result === 'YES') {
                this.slidesService.deleteSlides(id)
                    .subscribe(res => {
                        console.log("update succesfully");
                        // this.router.navigate(['/slides']);
                        this.deletedSlides.emit(id);
                    },
                    error => console.log(error));
            }
        });

    }

    /*duplicate slides*/
    duplicateSlides(slides) {
        let newSlide: Slides = new Slides(slides);
        this.slidesService.submitSlides(newSlide)
            .subscribe(
            data => {
                console.log('created');
                this.duplicateslidesOpt.emit();
                // this.router.navigate(['/login']);
                //this.router.navigate(['/slides']);
            },
            error => {
                console.log('fail to createSlides');
            });
    }
}
