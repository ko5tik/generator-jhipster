import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import { getGenerator } from '../support/index.mjs';

import AngularGenerator from '../../generators/angular/index.mjs';
import { CLIENT_MAIN_SRC_DIR } from '../../generators/generator-constants.mjs';

import BaseApplicationGenerator from '../../generators/base-application/index.mjs';

const mockAngularBlueprintSubGen = class extends AngularGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);
    this.sbsBlueprint = true;
  }

  get [BaseApplicationGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      addToMenuStep() {
        this.addElementToAdminMenu('routerName2', 'iconName2', true);
      },
      addToModuleStep({ application, source }) {
        source.addEntitiesToClient({
          application,
          entities: [
            {
              name: 'entityName',
              entityInstance: 'entityInstance',
              entityClass: 'entityClass',
              entityFolderName: 'entityFolderName',
              entityFileName: 'entityFileName',
              entityUrl: 'entityUrl',
              i18nKeyPrefix: 'entity',
              entityPage: 'entityPage',
              entityTranslationKeyMenu: 'entityTranslationKeyMenu',
              entityClassHumanized: 'entityClassHumanized',
            } as any,
          ],
        });
      },
    });
  }
};

describe('needle API Angular angular generator : JHipster with blueprint', () => {
  let runContext;
  let runResult;

  before(async () => {
    runContext = helpers.create(getGenerator('angular'));
    runResult = await runContext
      .withOptions({
        defaults: true,
        blueprint: 'myblueprint2',
        skipServer: true,
      })
      .withGenerators([[mockAngularBlueprintSubGen, 'jhipster-myblueprint2:angular']])
      .run();
  });

  it('entity menu contains the entity added by needle api', () => {
    assert.fileContent(
      `${CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`,
      `
            <li>
              <a
                class="dropdown-item"
                routerLink="entityPage"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="collapseNavbar()"
              >
                <fa-icon icon="asterisk" [fixedWidth]="true"></fa-icon>
                <span jhiTranslate="global.menu.entities.entityTranslationKeyMenu">entityClassHumanized</span>
              </a>
            </li>
`
    );
  });

  it('should bail on any file change adding same needles again', async () => {
    await runResult
      .create('jhipster-myblueprint2:angular')
      .withGenerators([[mockAngularBlueprintSubGen, 'jhipster-myblueprint2:angular']])
      .withOptions({ force: false })
      .run();
  });
  it('admin menu contains the admin element added by needle api', () => {
    assert.fileContent(
      `${CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`,
      `
            <li>
              <a class="dropdown-item" routerLink="routerName2" routerLinkActive="active" (click)="collapseNavbar()">
                <fa-icon icon="iconName2" [fixedWidth]="true"></fa-icon>
                <span jhiTranslate="global.menu.admin.routerName2">Router Name 2</span>
              </a>
            </li>
`
    );
  });

  it('icon imports contains a new icon added by a new admin menu method of needle api ', () => {
    assert.fileContent(`${CLIENT_MAIN_SRC_DIR}app/config/font-awesome-icons.ts`, '  faIconName2');
  });

  it('entity module contains the microservice object added by needle api', () => {
    assert.fileContent(
      `${CLIENT_MAIN_SRC_DIR}app/entities/entity-routing.module.ts`,
      '      {\n' +
        "        path: 'entityUrl',\n" +
        "        data: { pageTitle: 'entity.home.title' },\n" +
        "        loadChildren: () => import('./entityFolderName/entityFileName.routes'),\n" +
        '      }'
    );
  });
});
