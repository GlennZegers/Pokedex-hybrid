import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatchPokemonPage } from './catch-pokemon.page';

describe('CatchPokemonPage', () => {
  let component: CatchPokemonPage;
  let fixture: ComponentFixture<CatchPokemonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchPokemonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatchPokemonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
