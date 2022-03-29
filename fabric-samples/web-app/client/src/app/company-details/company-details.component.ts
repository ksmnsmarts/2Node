import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyService } from '../services/company/company.service';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-company-details',
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<CompanyDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private companyService: CompanyService,
    ) { }

    ngOnInit(): void {

        console.log(this.data);
    }


    // https://stackoverflow.com/questions/50039015/how-to-download-a-pdf-file-from-an-url-in-angular-5
    fileDownload(element) {

        const data = {
            key : element.key
        }

        // saveAs("/uploads/upload_file/" + fileData.filename, fileData.originalname, { type: fileData.fileType });
        this.companyService.fileDownload(data).subscribe(res => {
        //     console.log(res)
        //     const blob = res;
        //     saveAs(blob, data.originalname);
        });
        // console.log(fileData)
        //this.dialogService.openDialogPositive('succeed file download!');
    }

}
