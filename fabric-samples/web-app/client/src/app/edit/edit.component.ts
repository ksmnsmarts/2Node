import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerDialogComponent } from '../dialog/dialog.component';
import { CompanyService } from '../services/company/company.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

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

    public companyData: any;
    public params: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private companyService: CompanyService,
    ) { 
        this.uploadForm = this.formBuilder.group({
            upload_file: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {

        this.route.params.subscribe(params => {
            this.params = params;
        });

        this.companyService.queryCompany(this.params).subscribe((data)=> {
            console.log(data)
            this.companyData = data
        })
    }


    onSubmit(data) {
        this.editCompany(data)

    }


    // 회사 수정
    editCompany(data) {

        // FromData()를 사용해줘야 append 사용 가능하다
        const formData = new FormData();
        formData.append('key', this.params.key);
        formData.append('company_name', data.company_name);
        formData.append('my_name', data.my_name);
        formData.append('your_name', data.your_name);
        formData.append('upload_file', this.uploadForm.get('upload_file').value);


        // spinner
        const dialogRef = this.dialog.open(SpinnerDialogComponent, {
            data: {
                content: 'Create'
            }
        });

        // Add company and store file buffer in blockchain
        this.companyService.editCompany(formData).subscribe(async () => {

            console.log(formData)

            await dialogRef.close();

            this.router.navigate(['main']);
        })
    }


    // 파일 업로드
    onFileChange(fileData: any) {
        if (fileData.target.files.length > 0) {
            this.fileData = fileData.target.files[0];
            //   console.log(this.fileData);

            this.uploadForm.get('upload_file').setValue(this.fileData);
        }
    }


    toBack() {
        this.router.navigate(['main']);
    }

}
