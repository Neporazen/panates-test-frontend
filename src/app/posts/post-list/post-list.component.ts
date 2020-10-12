import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent{
  results = []
  records = []

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  constructor(private http: HttpClient, calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  searchResults(){
    const startDate = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
    const endDate = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day;
    this.http.post<any>('http://localhost:3000/list', {"startDate": startDate, "endDate": endDate}).subscribe(data => {

      //"startDate": "2019-03-11", "endDate": "2019-03-12"

      this.results = data["records"];
    })
  }
  clickRent(_id: string){
    this.http.post<any>('http://localhost:3000/content', {"_id": _id}).subscribe(data => {

      this.records = data["records"];
      this.records[0].bathrooms.$numberDecimal = parseInt(this.records[0].bathrooms.$numberDecimal);
    })
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

}
