/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/**
 * SalesAgility REST API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 8.1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */ /* tslint:disable:no-unused-variable member-ordering */

import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';

import { Configuration } from '../configuration';
import { CORE_SERVICE_API_CLIENT_SUITECRM7_BASE_PATH } from '../variables';

@Injectable()
export class RelationshipService {
  protected basePath = 'http://localhost/forkedSuite/Api/V8';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional()
    @Inject(CORE_SERVICE_API_CLIENT_SUITECRM7_BASE_PATH)
    basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   *
   * @param moduleName Name of the module
   * @param id ID of the module
   * @param body Add relationship to a module. The type is the name of the relationship
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public moduleModuleNameIdRelationshipsPost(
    moduleName: string,
    id: string,
    body?: any,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public moduleModuleNameIdRelationshipsPost(
    moduleName: string,
    id: string,
    body?: any,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public moduleModuleNameIdRelationshipsPost(
    moduleName: string,
    id: string,
    body?: any,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public moduleModuleNameIdRelationshipsPost(
    moduleName: string,
    id: string,
    body?: any,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (moduleName === null || moduleName === undefined) {
      throw new Error(
        'Required parameter moduleName was null or undefined when calling moduleModuleNameIdRelationshipsPost.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling moduleModuleNameIdRelationshipsPost.'
      );
    }

    let headers = this.defaultHeaders;

    // authentication (oauth2) required
    if (this.configuration.accessToken) {
      const accessToken =
        typeof this.configuration.accessToken === 'function'
          ? this.configuration.accessToken()
          : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.api+json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<any>(
      'post',
      `${this.basePath}/module/${encodeURIComponent(
        String(moduleName)
      )}/${encodeURIComponent(String(id))}/relationships`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   * Get relationship of a bean
   * @param moduleName Name of the module
   * @param id ID of the module
   * @param relationship The name of the relationship related to the module
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public moduleModuleNameIdRelationshipsRelationshipGet(
    moduleName: string,
    id: string,
    relationship: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public moduleModuleNameIdRelationshipsRelationshipGet(
    moduleName: string,
    id: string,
    relationship: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public moduleModuleNameIdRelationshipsRelationshipGet(
    moduleName: string,
    id: string,
    relationship: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public moduleModuleNameIdRelationshipsRelationshipGet(
    moduleName: string,
    id: string,
    relationship: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (moduleName === null || moduleName === undefined) {
      throw new Error(
        'Required parameter moduleName was null or undefined when calling moduleModuleNameIdRelationshipsRelationshipGet.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling moduleModuleNameIdRelationshipsRelationshipGet.'
      );
    }

    if (relationship === null || relationship === undefined) {
      throw new Error(
        'Required parameter relationship was null or undefined when calling moduleModuleNameIdRelationshipsRelationshipGet.'
      );
    }

    let headers = this.defaultHeaders;

    // authentication (oauth2) required
    if (this.configuration.accessToken) {
      const accessToken =
        typeof this.configuration.accessToken === 'function'
          ? this.configuration.accessToken()
          : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'get',
      `${this.basePath}/module/${encodeURIComponent(
        String(moduleName)
      )}/${encodeURIComponent(String(id))}/relationships/${encodeURIComponent(
        String(relationship)
      )}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   * Delete relationship between 2 modules
   * @param moduleName Name of the module
   * @param id ID of the module
   * @param relationship The name of the relationship related to the module
   * @param relatedBeanId ID of the related module
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public moduleModuleNameIdRelationshipsRelationshipRelatedBeanIdDelete(
    moduleName: string,
    id: string,
    relationship: string,
    relatedBeanId: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public moduleModuleNameIdRelationshipsRelationshipRelatedBeanIdDelete(
    moduleName: string,
    id: string,
    relationship: string,
    relatedBeanId: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public moduleModuleNameIdRelationshipsRelationshipRelatedBeanIdDelete(
    moduleName: string,
    id: string,
    relationship: string,
    relatedBeanId: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public moduleModuleNameIdRelationshipsRelationshipRelatedBeanIdDelete(
    moduleName: string,
    id: string,
    relationship: string,
    relatedBeanId: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (moduleName === null || moduleName === undefined) {
      throw new Error(
        'Required parameter moduleName was null or undefined when calling moduleModuleNameIdRelationshipsRelationshipRelatedBeanIdDelete.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling moduleModuleNameIdRelationshipsRelationshipRelatedBeanIdDelete.'
      );
    }

    if (relationship === null || relationship === undefined) {
      throw new Error(
        'Required parameter relationship was null or undefined when calling moduleModuleNameIdRelationshipsRelationshipRelatedBeanIdDelete.'
      );
    }

    if (relatedBeanId === null || relatedBeanId === undefined) {
      throw new Error(
        'Required parameter relatedBeanId was null or undefined when calling moduleModuleNameIdRelationshipsRelationshipRelatedBeanIdDelete.'
      );
    }

    let headers = this.defaultHeaders;

    // authentication (oauth2) required
    if (this.configuration.accessToken) {
      const accessToken =
        typeof this.configuration.accessToken === 'function'
          ? this.configuration.accessToken()
          : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'delete',
      `${this.basePath}/module/${encodeURIComponent(
        String(moduleName)
      )}/${encodeURIComponent(String(id))}/relationships/${encodeURIComponent(
        String(relationship)
      )}/${encodeURIComponent(String(relatedBeanId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }
}
