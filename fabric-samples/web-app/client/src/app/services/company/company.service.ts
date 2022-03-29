import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(
        private http: HttpClient,
    ) { }


    queryAllCompany() {
        return this.http.get('/api/v1/company/queryAllCompany');
    }


    // 회사 추가 및 파일 업로드
    addCompany(data) {
        return this.http.post('/api/v1/company/addCompany', data);
    }

    // 업로드 된 파일 다운로드
    fileDownload(data) {
        return this.http.get('/api/v1/company/fileDownload', { params:data });
    }

}
