import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = "";
    private isAuthenticated$ = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true })
            .pipe(tap(() => {
                this.isAuthenticated$.next(true);
            }));
    }

    logout() {
        return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
            .subscribe(() => {
                this.isAuthenticated$.next(false);
            });
    }

    refreshToken(): Observable<any> {
        return this.http.post(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
            .pipe(tap(() => this.isAuthenticated$.next(true)));
    }

    isLoggedIn() {
        return this.isAuthenticated$.asObservable();
    }
}