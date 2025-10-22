import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeistungComponent } from './leistung.component';

describe('LeistungComponent', () => {
    let component: LeistungComponent;
    let fixture: ComponentFixture<LeistungComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LeistungComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LeistungComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
