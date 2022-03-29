import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { CompanyService } from 'src/app/services/company/company.service'
import { CompanyDetailsComponent } from '../company-details/company-details.component';
import { SpinnerDialogComponent } from '../dialog/dialog.component';



// view table
export interface PeriodicElement {
    key: string;
    company_name: string;
    my_name: string;
    your_name: string;
}


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    // view table
    displayedColumns: string[] = ['key', 'company_name', 'my_name', 'your_name', 'upload_file_name'];


    uploadForm: FormGroup;
    /*******************************************************
    * formControlName 을 사용할 때는 
    * html에 
    * [formGroup]="addCompanyForm"
    * formControlName="company_name" 이런 식으로 사용하나
    * 
    * 현재 파일에 대한 값을 같이 넘겨야하기 때문에 
    * #f="ngForm"    
    * name="company_name"   이런 식으로 사용한다 
    ********************************************************/
    addCompanyForm = new FormGroup({
        company_name: new FormControl(''),
        my_name: new FormControl(''),
        your_name: new FormControl(''),
    });


    public dataSource: any;
    public fileData: File;
    

    constructor(
        private companyService: CompanyService,
        public dialog: MatDialog,
        private formBuilder: FormBuilder
    ) { 
        this.uploadForm = this.formBuilder.group({
            upload_file: ['']
        });
    }

    ngOnInit(): void {

        // 회사 가져오기
        this.getCompany();
    }


    onSubmit(data) {
        // 회사 추가
        this.addCompany(data);
    }

    // 회사 추가
    addCompany(data) {

        // 이렇게 보내면 file 값이 읽히지 않음
        // const companyData = {
        //     company_name: this.addCompanyForm.value.company_name,
        //     my_name: this.addCompanyForm.value.my_name,
        //     your_name: this.addCompanyForm.value.your_name,
        //     upload_file: this.addCompanyForm.value.upload_file,
        // }


        // FromData()를 사용해줘야 append 사용 가능하다
        const formData = new FormData();
        formData.append('company_name', data.company_name);
        formData.append('my_name', data.my_name);
        formData.append('your_name', data.your_name);
        formData.append('upload_file',this.uploadForm.get('upload_file').value);
        

        // spinner
        const dialogRef = this.dialog.open(SpinnerDialogComponent, {
            data: {
                content: 'create'
            }
        });

        // Add company and store file buffer in blockchain
        this.companyService.addCompany(formData).subscribe(async () => {
            await this.getCompany();
    
            dialogRef.close();
        })
    }


    // 파일 업로드
    onFileChange(fileData: any) {
    if (fileData.target.files.length > 0) {
      this.fileData = fileData.target.files[0];
      console.log(this.fileData);

      this.uploadForm.get('upload_file').setValue(this.fileData);
    }
  }




    getCompany() {
        this.companyService.queryAllCompany().subscribe((data:any) => {
            console.log(data)
            this.dataSource = new MatTableDataSource<PeriodicElement>(data);
            this.dataSource.paginator = this.paginator;
        });
    }


    detailKey(data) {
        // console.log(data)

        const dialogRef = this.dialog.open(CompanyDetailsComponent, {
            data: {
                key: data.Key,
                company_name: data.Record.company_name,
                my_name: data.Record.my_name,
                your_name: data.Record.your_name,
                upload_file_name: data.Record.upload_file_name
            }
        });
        
        dialogRef.afterClosed().subscribe(async(result) => {
        })
    }



}
