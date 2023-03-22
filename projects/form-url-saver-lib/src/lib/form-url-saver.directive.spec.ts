import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormUrlSaverDirective } from './form-url-saver.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, map, shareReplay, skip, startWith, takeUntil, tap } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { ArticleType } from '../../tests/enums/article-type';
import { Article } from '../../tests/models/article';
import { ArticleInRoute } from '../../tests/models/article-in-route';
import { ArticleBuilder } from '../../tests/models/article-builder';

const initQueryParams = {
  id: '10',
  authorId: '10',
  title: 'title 10',
  description: 'description 10',
  type: 'Science',
} as ArticleInRoute;

const mockQueryParams = new BehaviorSubject<Partial<ArticleInRoute>>(initQueryParams);

class ActivatedRouteMock {

  public readonly queryParams = mockQueryParams.asObservable();

  public readonly snapshot = {

    queryParams: {
      id: '10',
      authorId: '10',
      title: 'title 10',
      description: 'description 10',
      type: 'Science',
    }

  };
}

@Component({
  selector: 'ngx-test-component',
  template: `
  <div>
    <section>
      <div *ngFor="let article of articles">
        <p>id: {{article?.id}}</p>
        <p>authorId: {{article?.authorId}}</p>
        <p>title: {{article?.title}}</p>
        <p>description: {{article?.description}}</p>
        <p>type: {{article?.type}}</p>
      </div>
      <form ngxFormUrlSaver [formGroup]="form">
        <input
          type="text"
          formControlName="id"
        >

          <input
          type="text"
          formControlName="authorId"
        >

          <input
          type="text"
          formControlName="title"
        >

          <input
          type="text"
          formControlName="description"
        >

        <input
          type="text"
          formControlName="type"
        >
        <button
          type="button"
          (click)="filterArticles()"
        >
          Filter
        </button>
      </form>
    </section>
  </div>`,
})
class TestComponent implements OnDestroy, OnInit {

  public readonly defaultFormValue = {
    id: undefined,
    authorId: undefined,
    title: undefined,
    description: undefined,
    type: undefined,
  };

  public readonly form = this.fb.group<Article>(this.defaultFormValue);

  public readonly articles = [
    new ArticleBuilder()
      .withId(1)
      .withAuthorId(1)
      .withTitle('title 1')
      .withDescription('description 1')
      .withType(ArticleType.Discovery).build(),
    new ArticleBuilder()
      .withId(2)
      .withAuthorId(1)
      .withTitle('title 2')
      .withDescription('description 2')
      .withType(ArticleType.Discovery).build(),
    new ArticleBuilder()
      .withId(3)
      .withAuthorId(2)
      .withTitle('title 3')
      .withDescription('description 3')
      .withType(ArticleType.Science).build(),
    new ArticleBuilder()
      .withId(4)
      .withAuthorId(2)
      .withTitle('title 4')
      .withDescription('description 4')
      .withType(ArticleType.Science).build(),
    new ArticleBuilder()
      .withId(5)
      .withAuthorId(3)
      .withTitle('title 5')
      .withDescription('description 5')
      .withType(ArticleType.Science).build(),
  ] as Article[];

  public readonly destroy$ = new BehaviorSubject<Boolean>(false);

  public readonly valueChanges = this.form.valueChanges.pipe(
    startWith(this.defaultFormValue),
  );

  public queryParamsFromRoute: Partial<Article> = {};

  public readonly queryParamsObservable = this.route.queryParams;

  public readonly parsedParamsObservable = this.queryParamsObservable.pipe(
    map((params: ArticleInRoute) => this.parseArticleFromRoute(params)),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
    tap((params) => {
      this.queryParamsFromRoute = params;

      this.form.patchValue(this.queryParamsFromRoute);
    }),
  );

  public readonly queryParamsSub = this.parsedParamsObservable.pipe(
    takeUntil(this.destroy$),
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  public ngOnInit() {
    this.queryParamsSub.subscribe();
  }

  public filterArticles() {
    //  this.articles.filter();
  }

  public parseArticleFromRoute(params: ArticleInRoute) {
    const queryParamsFromRoute = {
      id: params.id ? parseInt(params.id, 10) : undefined,
      authorId: params.authorId ? parseInt(String(params.authorId), 10) : undefined,
      title: params.title ? params.title : undefined,
      description: params.description ? params.description : undefined,
      type: params.type ? params.type as ArticleType : undefined,
    };

    return queryParamsFromRoute;
  }

  public paramsToString(formParams: Article): Partial<ArticleInRoute> {
    const paramsStr = {
      id: formParams?.id ? String(formParams?.id) : undefined,
      authorId: formParams?.authorId ? String(formParams?.authorId) : undefined,
      type: formParams?.type ?? String(formParams?.type),
      title: formParams?.title ?? String(formParams?.title),
      description: formParams?.description ?? String(formParams?.description),
    } as Partial<ArticleInRoute>;

    return paramsStr;
  }

  public ngOnDestroy = () => (this.destroy$.next(true));
}

describe('FormUrlSaverDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let fb: FormBuilder;
  let router: Router;
  let route: ActivatedRoute;
  let directive: FormUrlSaverDirective;
  let testScheduler: TestScheduler;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        FormUrlSaverDirective
      ],
      imports: [
        RouterModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fb = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });


  describe('Initialization tests', () => {

    it('should create TestComponent', () => {
      expect(component).toBeTruthy();
    });

    it(`the initial article length should be equal to 5`, () => {
      expect(component.articles.length).toEqual(5);
    });

  });

  describe('ngxFormUrlSaver directive tests', () => {
    it('The first form value should be equal value from route', () => {

      const paramsSub = component.parsedParamsObservable.subscribe((params) => {
        const queryParamsFromRoute = params;

        const isEqual = _.isEqual(component.form.value, queryParamsFromRoute);

        expect(isEqual).toEqual(true);

      });

      paramsSub.unsubscribe();
    });

    it('After changing form id value, valueChanges should emit', () => {

      const id = 20;

      const formParamsSub = component.valueChanges.pipe(skip(1)).subscribe((params) => {

        const isEqual = params.id === id;

        expect(isEqual).toEqual(true);

      });

      component.form.patchValue({
        id,
      });

      const param = component.paramsToString(component.form.value as Article);

      mockQueryParams.next(param);

      formParamsSub.unsubscribe();
    });

    it('After changing form id value, value from route is changed', () => {

      const id = 20;

      const formParamsSub = component.parsedParamsObservable.pipe(skip(1)).subscribe((params) => {

        const isEqual = params.id === +(mockQueryParams.value.id as string);

        expect(isEqual).toEqual(true);
      });

      component.form.patchValue({
        id,
      });

      const param = component.paramsToString(component.form.value as Article);

      mockQueryParams.next(param);

      formParamsSub.unsubscribe();
    });

    afterAll(() => {
      component.ngOnDestroy();
    });
  });

});
