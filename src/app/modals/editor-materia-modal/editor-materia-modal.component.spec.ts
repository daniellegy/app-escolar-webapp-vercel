import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorMateriaModalComponent } from './editor-materia-modal.component';

describe('EditorMateriaModalComponent', () => {
  let component: EditorMateriaModalComponent;
  let fixture: ComponentFixture<EditorMateriaModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorMateriaModalComponent]
    });
    fixture = TestBed.createComponent(EditorMateriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
