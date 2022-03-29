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


    // 회사 추가
    addCompany(data) {
        return this.http.post('/api/v1/company/addCompany', data);
    }

    // 파일 업로드
    uploadFiles(data) {
        return this.http.post('/api/v1/company/uploadFiles', data);
    }

}
