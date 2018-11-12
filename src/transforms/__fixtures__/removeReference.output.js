/**
 * @ngInject
 * @ngdoc overview
 * @name app.addon-content
 * @description Addon module
 * @author Duane_Hinkley
 */

import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgxPaginationModule} from 'ngx-pagination';

import {AddonMainComponent} from './addon-main.component';
import {AddonControlComponent} from './addon-control.component';
import {CourseLockModule} from '../course-lock/course-lock.module';
import {TranslateModule} from '../translate/translate.module';
import {BulkCopyModalModule} from '../bulk-copy-modal/bulk-copy-modal.module';
import {ToolbarModule} from '../toolbar/toolbar.module';
import {SharedModule} from '../shared/shared.module';
import {SmartbookModule} from '../smartbook/smartbook.module';
import {ExternalToolModule} from '../external-tool/external-tool.module';
import {NgcModal2Service} from '../ngc-modal2/ngc-modal2.service';
import {OptionMenuModule} from '../container-view2/option-menu/option-menu.module';

@NgModule({
    'imports': [
        NgxPaginationModule,
        CourseLockModule,
        CommonModule,
        TranslateModule,
        BulkCopyModalModule,
        ToolbarModule,
        SharedModule,
        SmartbookModule,
        ExternalToolModule,
        OptionMenuModule,
    ],
    'declarations': [
        AddonControlComponent,
        AddonMainComponent
    ],
    'entryComponents': [
        AddonControlComponent,
        AddonMainComponent
    ],
    'exports': [
        AddonControlComponent,
        AddonMainComponent
    ],
    'providers': [
        NgcModal2Service
    ]
})

export class AddonContentModule {}