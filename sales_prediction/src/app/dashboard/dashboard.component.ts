import { HttpClient} from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('fileSelect') myInputVariable?: ElementRef;
  
  filename: any;
  format: any;
  formfile: any;
  formfile1:any;
  file:any;
  showLoader: boolean = false;
  period:string="";
  Time:any;
  pass:any;

  hidden = false;
  hidden1=false;
  url = "assets/images/predact.png"
  url1 = "assets/images/forecast.png"

  
  constructor(private _snackBar:MatSnackBar, private http:HttpClient) { }

  ngOnInit(): void {
  }

  onFileSelect(event: any) {
    try {
      if(this.period=="weeks"){
        this.pass=(this.Time/4);
      }
      if(this.period=="months"){
        this.pass=(this.Time);
      }
      if(this.period=="year"){
        this.pass=this.Time*12;
      }
      
      this.file = event.target.files[0];
      if (this.file) {
        this.filename = this.file.name;
        this.format = this.file.name.split('.');
        if (this.format[1] != 'png') {
          this._snackBar.open("Please select only CSV file", "Close", { duration: 3000 });
          this.deleteFile();
        } else {
          this.formfile = new FormData();
          this.formfile.append('file', this.file);
          this.formfile.append('startdate',this.pass)
          
        }
      }
    } catch (error) {
      this.deleteFile();
      console.log('no file was selected...');
    }
  }
  fileUpload() {  
    if(this.Time){
      if (this.file) {
        this.showLoader = true;
        let url = "http://localhost:5000/api/uploader"
          this.http.post(url,this.formfile).subscribe((res) => {
          this.showLoader = false;
          this._snackBar.open("File successfully uploaded", "Ok", { duration: 5000 });
        },
          (error) => {
            this.showLoader = false;
            this._snackBar.open(error.message, "Close", { duration: 5000 });
          });
          
      }
      else{
        this._snackBar.open("Please select the file", "Ok", { duration: 3000 });
      }
  }
  else{
    this._snackBar.open("Please enter period", "Ok", { duration: 3000 });
  }
  }

  imageSource(){
    this.hidden = !this.hidden;
}

imageSource1(){
  this.hidden1 = !this.hidden1;
}
  

  deleteFile(){
    this.file = null;
    this.format = null;
    this.filename = null;
    this.formfile.delete('file');
  
  }

}
