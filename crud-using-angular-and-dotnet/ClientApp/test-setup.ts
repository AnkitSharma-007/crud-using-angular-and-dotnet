import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { configure } from '@testing-library/dom';

setupZoneTestEnv();

//As the name implies, it will throw an error if there's a better/safer query is available
//configure({throwSuggestions: true}),

getTestBed().resetTestEnvironment();
getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
	{ teardown: { destroyAfterEach: false } },
);